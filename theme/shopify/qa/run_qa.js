#!/usr/bin/env node
/* Browser checks for the Shopify theme, run against the mock render (qa/mock_render.js).
   It is a stand-in for Shopify: pages come from disk, product photos come from the
   v3 preview's local copies, and the cart API is faked. Run from the repo root:
     node theme/shopify/qa/run_qa.js <mock-dir>
   Uses the pre-installed Playwright Chromium (desktop, and Chromium phone emulation,
   not a real phone). Results go to qa/last-run.txt, screenshots to qa/screens/. */
'use strict';
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');

const MOCK = path.resolve(process.argv[2] || '');
if (!process.argv[2]) { console.error('usage: run_qa.js <mock-dir>'); process.exit(2); }
const V3IMG = path.resolve(__dirname, '../../v3/img/products');
const OUT = path.join(__dirname, 'screens');
fs.mkdirSync(OUT, { recursive: true });
const ORIGIN = 'https://hp.test';
const SRC = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../v3/src/products.json'), 'utf8'));
const PRICE = { 'midnight-rock-hunt-tee': 40 };
let pass = 0, fail = 0;
const results = [];
function check(name, ok, info) { results.push((ok ? 'PASS ' : 'FAIL ') + name + (ok || info === undefined ? '' : '  -> ' + JSON.stringify(info))); ok ? pass++ : fail++; }
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const CAM = { front: 'front', back: 'back', folded: 'folded', 'folded-2': 'flatlay', 'back-2': 'back-hood' };

async function setup(ctx, state) {
  await ctx.route(ORIGIN + '/**', async (route) => {
    const req = route.request(), u = new URL(req.url()), p = u.pathname;
    if (p === '/cart/add.js') {
      const body = JSON.parse(req.postData() || '{}');
      state.adds.push(body);
      const it = body.items[0];
      state.count += it.quantity;
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ items: [{ id: it.id, quantity: it.quantity }] }) });
    }
    if (p === '/cart.js') return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ item_count: state.count }) });
    if (p === '/cart' && req.method() === 'POST') { state.cartPosts.push(req.postData()); return route.fulfill({ status: 200, contentType: 'text/html', body: '<p>posted</p>' }); }
    let file = p === '/' ? 'index.html' : p.slice(1);
    if (!path.extname(file)) file += '.html';
    const full = path.join(MOCK, file);
    if (!fs.existsSync(full)) return route.fulfill({ status: 404, body: 'nope' });
    const type = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' }[path.extname(full)] || 'application/octet-stream';
    return route.fulfill({ status: 200, contentType: type, body: fs.readFileSync(full) });
  });
  // Fake Shopify CDN: serve the v3 preview's copy of the same mockup.
  await ctx.route('https://cdn.example/**', (route) => {
    const m = /cdn\.example\/([^/]+)\/(.+?)-(front|back-2|back|folded-2|folded|size-chart)\.png/.exec(route.request().url());
    const f = m && path.join(V3IMG, m[1], `${slug(m[2])}-${CAM[m[3]] || m[3]}.webp`);
    if (f && fs.existsSync(f)) return route.fulfill({ status: 200, contentType: 'image/webp', body: fs.readFileSync(f) });
    return route.fulfill({ status: 404, body: '' });
  });
  await ctx.route('https://fonts.googleapis.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
}

async function noOverflow(page) { return page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1); }
async function visibleText(page) { return page.evaluate(() => document.body.innerText); }

(async () => {
  const browser = await chromium.launch();
  for (const mode of ['desktop', 'phone']) {
    const state = { adds: [], count: 0, cartPosts: [] };
    const opts = mode === 'phone' ? { ...devices['iPhone 13'] } : { viewport: { width: 1440, height: 900 } };
    const ctx = await browser.newContext(opts);
    const errors = [];
    ctx.on('page', (p) => p.on('pageerror', (e) => errors.push(e.message)));
    await setup(ctx, state);
    const page = await ctx.newPage();
    page.on('pageerror', (e) => errors.push(e.message));

    /* ---------- homepage ---------- */
    await page.goto(ORIGIN + '/', { waitUntil: 'load' });
    await page.waitForTimeout(400);
    const cards = await page.$$eval('.card[data-product]', (cs) => cs.map((c) => c.getAttribute('data-product')));
    check(`${mode} home: six cards in the approved order`, JSON.stringify(cards) === JSON.stringify(SRC.products.map((p) => p.slug)), cards);
    for (const el of await page.$$('.card')) await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.evaluate(() => window.scrollTo(0, 0));
    const loaded = await page.$$eval('.card .wet__base [data-card-img]', (ims) => ims.filter((i) => i.complete && i.naturalWidth > 0).length);
    check(`${mode} home: card images load`, loaded === 6, loaded);
    check(`${mode} home: no sideways scroll`, await noOverflow(page));
    const text = await visibleText(page);
    check(`${mode} home: no Printify or supplier words`, !/printify|supplier/i.test(text));
    check(`${mode} home: no template code showing`, !/\{%|%\}|\{\{|\}\}|Runs before paint/.test(text));
    check(`${mode} home: no preview-only wording`, !/preview cart|checkout is off|nothing is for sale/i.test(text));
    for (const p of SRC.products) {
      const sw = await page.$$eval(`[data-product="${p.slug}"] .swatches input`, (is) => is.map((i) => i.value));
      check(`${mode} home ${p.slug}: swatches match approved colors`, JSON.stringify(sw) === JSON.stringify(p.colors), sw);
    }
    // swatch change swaps the card image and the link color
    const c = SRC.products[1];
    const before = await page.$eval(`[data-product="${c.slug}"] [data-card-img]`, (i) => i.src);
    await page.click(`[data-product="${c.slug}"] .sw:nth-of-type(2)`);
    await page.waitForTimeout(150);
    const after = await page.$eval(`[data-product="${c.slug}"] [data-card-img]`, (i) => i.src);
    const href = await page.$eval(`[data-product="${c.slug}"] h3 a`, (a) => a.getAttribute('href'));
    check(`${mode} home: swatch swaps the card image`, before !== after, [before, after]);
    check(`${mode} home: card link carries the color`, href.endsWith('?color=' + slug(c.colors[1])), href);
    // wet reveal
    const target = `[data-product="${SRC.products[0].slug}"]`;
    if (mode === 'desktop') await page.hover(`${target} .card__media`);
    else await page.dispatchEvent(`${target} .card__media`, 'touchstart', { touches: [{ clientX: 50, clientY: 50, identifier: 0 }] }).catch(() => page.click(`${target} [data-wet-btn]`));
    await page.waitForTimeout(1500);
    let wet = await page.$eval(target, (e) => e.classList.contains('is-wet'));
    if (!wet && mode === 'phone') { await page.click(`${target} [data-wet-btn]`, { force: true }); await page.waitForTimeout(1500); wet = await page.$eval(target, (e) => e.classList.contains('is-wet')); }
    check(`${mode} home: wet reveal runs`, wet);
    await page.screenshot({ path: path.join(OUT, `${mode}-home.png`), fullPage: false });
    await page.reload({ waitUntil: 'load' });
    check(`${mode} home: revealed card stays wet after reload`, await page.$eval(target, (e) => e.classList.contains('is-wet')));
    const missingBlurb = await page.$$eval('.card', (cs) => cs.filter((c) => !c.querySelector('.card__blurb')).length);
    check(`${mode} home: every card has its blurb`, missingBlurb === 0, missingBlurb);
    const prices = await page.$$eval('.card .price', (ps) => ps.map((p) => p.textContent.trim()));
    check(`${mode} home: From prices are the approved prices`, JSON.stringify(prices) === JSON.stringify(['From $40.00', 'From $30.00', 'From $30.00', 'From $30.00', 'From $60.00', 'From $60.00']), prices);

    /* ---------- product pages ---------- */
    for (const p of SRC.products) {
      await page.goto(ORIGIN + '/products/' + p.slug, { waitUntil: 'load' });
      await page.waitForTimeout(250);
      const base = PRICE[p.slug] || (p.tier === 'hoodie' ? 60 : 30);
      const pr = await page.$eval('[data-price]', (e) => e.textContent.trim());
      check(`${mode} ${p.slug}: starting price $${base}`, pr === `$${base}.00`, pr);
      const colors = await page.$$eval('input[name=hp-color]', (is) => is.map((i) => i.value));
      check(`${mode} ${p.slug}: color keys in approved order`, JSON.stringify(colors) === JSON.stringify(p.colors), colors);
      check(`${mode} ${p.slug}: plain variant list removed when JS runs`, (await page.$$('[data-variant-select]')).length === 0);
      const thumbs = await page.$$eval('.thumb', (t) => t.length);
      check(`${mode} ${p.slug}: 4 mockups + art + photos-soon thumbs`, thumbs === 4 + p.art.length + 1, thumbs);
      const cap = await page.$eval('[data-g-cap]', (e) => e.textContent);
      const wantFirst = p.card_view === 'back' ? 'Back' : 'Front';
      check(`${mode} ${p.slug}: gallery opens on the ${wantFirst.toLowerCase()}`, cap.startsWith(wantFirst + ', ' + p.colors[0]), cap);
      await page.waitForTimeout(300);
      const brokenThumbs = await page.$$eval('.thumb img', (ims) => ims.filter((i) => i.complete && i.naturalWidth === 0).length);
      check(`${mode} ${p.slug}: every thumbnail loads`, brokenThumbs === 0, brokenThumbs);
      const mainOk = await page.$eval('[data-g-img]', (i) => i.complete && i.naturalWidth > 0);
      check(`${mode} ${p.slug}: main photo loads`, mainOk);
      const note = await page.$eval('[data-size-note]', (e) => e.textContent);
      check(`${mode} ${p.slug}: larger-size note`, /2XL \+\$2, 3XL \+\$4, and 4XL \+\$6|2XL \+\$2, 3XL \+\$4, 4XL \+\$6, and 5XL \+\$6/.test(note), note);
      // add without a size
      await page.click('[data-buy] button[type=submit]');
      check(`${mode} ${p.slug}: asks for a size first`, (await page.$eval('[data-buy-msg]', (e) => e.textContent)) === 'Pick a size first.');
      // second color, 2XL
      await page.click('.opt--color:nth-of-type(2)');
      await page.click('label.opt:has(input[value="2XL"])');
      const pr2 = await page.$eval('[data-price]', (e) => e.textContent.trim());
      check(`${mode} ${p.slug}: 2XL costs $2 more`, pr2 === `$${base + 2}.00`, pr2);
      check(`${mode} ${p.slug}: URL keeps color and size`, page.url().includes('color=' + slug(p.colors[1])) && page.url().includes('size=2XL'), page.url());
      const cap2 = await page.$eval('[data-g-cap]', (e) => e.textContent);
      check(`${mode} ${p.slug}: gallery follows the color`, cap2.includes(p.colors[1]), cap2);
      const vid = await page.$eval('[data-buy] input[name=id]', (i) => i.value);
      const pdata = await page.$eval('[data-product-json]', (s) => JSON.parse(s.textContent));
      const v = pdata.variants.find((x) => String(x.id) === vid);
      check(`${mode} ${p.slug}: chosen variant matches color and size`, v && v.options[pdata.colorPos] === p.colors[1] && v.options[pdata.sizePos] === '2XL', v);
      await page.click('[data-buy] button[type=submit]');
      await page.waitForTimeout(300);
      const msg = await page.$eval('[data-buy-msg]', (e) => e.textContent);
      check(`${mode} ${p.slug}: add to cart works`, /^Added to your cart/.test(msg) && state.adds.length && String(state.adds[state.adds.length - 1].items[0].id) === vid, msg);
      const count = await page.$eval('[data-cart-count]', (e) => e.textContent);
      check(`${mode} ${p.slug}: cart count updates`, +count === state.count, count);
      check(`${mode} ${p.slug}: no sideways scroll`, await noOverflow(page));
      const t = await visibleText(page);
      check(`${mode} ${p.slug}: no Printify or supplier words`, !/printify|supplier/i.test(t));
      check(`${mode} ${p.slug}: no template code showing`, !/\{%|%\}|\{\{|\}\}/.test(t));
      check(`${mode} ${p.slug}: info sections present`, ['The design', 'Fit and sizing', 'Fabric', 'Decoration', 'Care', 'Shipping and returns'].every((h) => t.includes(h)));
      // direct link with a color opens on that color
      await page.goto(ORIGIN + '/products/' + p.slug + '?color=' + slug(p.colors[p.colors.length - 1]), { waitUntil: 'load' });
      const cn = await page.$eval('[data-color-name]', (e) => e.textContent);
      check(`${mode} ${p.slug}: ?color= link opens that color`, cn === p.colors[p.colors.length - 1], cn);
      if (p === SRC.products[0]) await page.screenshot({ path: path.join(OUT, `${mode}-product.png`), fullPage: false });
    }

    /* ---------- cart ---------- */
    await page.goto(ORIGIN + '/cart', { waitUntil: 'load' });
    check(`${mode} cart: shows the line`, (await page.$$('.line')).length === 1);
    check(`${mode} cart: real checkout button`, (await page.$$('button[name=checkout]')).length === 1);
    await page.click('[data-qty-step="1"]');
    await page.waitForTimeout(300);
    check(`${mode} cart: + submits the Shopify cart form`, state.cartPosts.length === 1 && /updates%5B%5D=3|updates\[\]=3/.test(state.cartPosts[0]), state.cartPosts);
    await page.goto(ORIGIN + '/cart-empty', { waitUntil: 'load' });
    check(`${mode} cart: empty state`, /as empty as a beach/.test(await visibleText(page)));

    /* ---------- field notes ---------- */
    await page.goto(ORIGIN + '/pages/field-notes', { waitUntil: 'load' });
    const stone = await page.$('[data-stone]');
    await stone.click();
    check(`${mode} field notes: stone wets`, (await stone.getAttribute('aria-pressed')) === 'true');
    const links = await page.$$eval('.note a[href^="/products/"]', (as) => as.length);
    check(`${mode} field notes: product links point at Shopify product pages`, links === 2, links);

    check(`${mode}: no script errors`, errors.length === 0, errors);
    await ctx.close();
  }

  /* ---------- JavaScript off: the plain forms still work ---------- */
  const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 900 } });
  await setup(ctx, { adds: [], count: 0, cartPosts: [] });
  const page = await ctx.newPage();
  await page.goto(ORIGIN + '/products/' + SRC.products[0].slug, { waitUntil: 'load' });
  check('no-js product: variant list is shown', await page.isVisible('[data-variant-select]'));
  check('no-js product: JS-only color keys are hidden', !(await page.isVisible('[data-keys]')));
  const opts = await page.$$eval('[data-variant-select] option', (o) => o.length);
  check('no-js product: every variant listed', opts === 21, opts);
  await ctx.close();
  await browser.close();

  const out = results.join('\n') + `\n\n${pass} passed, ${fail} failed\n`;
  fs.writeFileSync(path.join(__dirname, 'last-run.txt'), out);
  console.log(out);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
