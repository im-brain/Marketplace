/* Storefront preview v3: browser checks for the whole shopping journey.
   Run from the repo root:
     (cd theme/v3 && python3 -m http.server 8777) &
     node theme/v3/qa/run_qa.js [http://localhost:8777] [path/to/axe.min.js]
   Uses the pre-installed Playwright Chromium. Desktop emulation and Chromium's
   touch emulation only: this is NOT a test on a real iPhone or iPad.
   Screenshots go to theme/v3/qa/screens/. */
'use strict';
const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = (process.argv[2] || 'http://localhost:8777').replace(/\/$/, '');
const AXE = process.argv[3];
const OUT = path.join(__dirname, 'screens');
fs.mkdirSync(OUT, { recursive: true });
const BRIEF = {
  'midnight-rock-hunt-tee': ['Midnight Rock Hunt Tee', ['Graphite', 'Black', 'Navy'], 40],
  'great-lakes-rock-crew-tee': ['Great Lakes Rock Crew Tee', ['Bay', 'Blue Jean', 'Moss', 'Yam', 'Watermelon'], 30],
  'field-notebook-tee': ['Field Notebook Tee', ['Pepper', 'Graphite', 'Navy'], 30],
  'pocket-full-of-treasures-tee': ['Pocket Full of Treasures Tee', ['Blue Jean', 'Light Green', 'Blue Spruce', 'Flo Blue', 'Violet'], 30],
  'shoreline-hoodie': ['Shoreline Hoodie', ['Dark Heather', 'Heather Navy', 'Charcoal', 'Black', 'Navy', 'Purple'], 60],
  'floral-butterfly-embroidered-hoodie': ['Floral Butterfly Embroidered Hoodie', ['Light Blue', 'Sand', 'Light Pink'], 60],
};
const SLUGS = Object.keys(BRIEF);
let pass = 0, fail = 0;
const results = [];
function check(name, ok, info) {
  results.push((ok ? 'PASS ' : 'FAIL ') + name + (ok || info === undefined ? '' : '  -> ' + JSON.stringify(info)));
  ok ? pass++ : fail++;
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function newCtx(b, opts = {}) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
  const errors = [];
  ctx.on('page', (p) => { p.on('pageerror', (e) => errors.push(e.message)); });
  ctx.errors = errors;
  return ctx;
}
async function scrollAll(page) {
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } window.scrollTo(0, 0); });
  await page.waitForLoadState('networkidle');
}

(async () => {
  const b = await chromium.launch();
  const external = [];

  /* 1. pages, links, and images resolve */
  {
    const ctx = await newCtx(b);
    const page = await ctx.newPage();
    page.on('request', (r) => { const u = r.url(); if (!u.startsWith(BASE) && !/fonts\.(googleapis|gstatic)\.com/.test(u)) external.push(u); });
    const pages = ['index.html', 'cart.html', 'field-notes.html', 'preview-notes.html', ...SLUGS.map((s) => s + '.html')];
    const refs = new Set();
    for (const pg of pages) {
      const r = await page.goto(`${BASE}/${pg}`, { waitUntil: 'networkidle' });
      check(`page ${pg} loads (200)`, r.status() === 200, r.status());
      await scrollAll(page);
      const broken = await page.$$eval('img', (ims) => ims.filter((i) => !i.hidden && i.complete && i.naturalWidth === 0 && i.offsetParent !== null).map((i) => i.currentSrc || i.src));
      check(`page ${pg}: no broken images`, broken.length === 0, broken);
      const hrefs = await page.$$eval('a[href], img[src], link[href], script[src], source[srcset]', (els) => els.map((e) => e.getAttribute('href') || e.getAttribute('src') || e.getAttribute('srcset')));
      hrefs.forEach((h) => { if (!/^(https?:|mailto:|data:|#)/.test(h)) refs.add(h.split('#')[0].split('?')[0]); });
      const dead = await page.$$eval('a', (as) => as.filter((a) => !a.getAttribute('href')).length);
      check(`page ${pg}: every link has an href`, dead === 0, dead);
    }
    for (const ref of refs) {
      if (!ref) continue;
      const r = await page.request.get(`${BASE}/${ref}`);
      check(`resource ${ref} exists`, r.status() === 200, r.status());
    }
    check('no requests to outside hosts except Google Fonts', external.length === 0, external.slice(0, 5));
    await ctx.close();
  }

  /* 2. homepage: six cards, order, colors, prices, layout */
  {
    const ctx = await newCtx(b);
    const page = await ctx.newPage();
    await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
    const cards = await page.$$eval('.card', (cs) => cs.map((c) => ({
      slug: c.dataset.product, name: c.querySelector('h3').textContent.trim(),
      colors: [...c.querySelectorAll('.swatches input')].map((i) => i.value), price: c.querySelector('.price').textContent,
      href: c.querySelector('h3 a').getAttribute('href'),
    })));
    check('six product cards in brief order', JSON.stringify(cards.map((c) => c.slug)) === JSON.stringify(SLUGS), cards.map((c) => c.slug));
    for (const c of cards) {
      const [name, colors, price] = BRIEF[c.slug];
      check(`${c.slug}: name`, c.name === name, c.name);
      check(`${c.slug}: approved colors only, in order`, JSON.stringify(c.colors) === JSON.stringify(colors), c.colors);
      check(`${c.slug}: provisional price $${price}, labeled`, c.price.includes('$' + price) && /preview price/.test(c.price), c.price);
      check(`${c.slug}: links to its own page`, c.href.startsWith(c.slug + '.html'), c.href);
    }
    check('no Indigo Blue anywhere on the homepage', !(await page.content()).includes('Indigo'));
    const cols = await page.$eval('.cards', (u) => getComputedStyle(u).gridTemplateColumns.split(' ').length);
    check('desktop grid is 3 columns', cols === 3, cols);
    const devText = await page.evaluate(() => /STAND-IN|READY|TYPE|\.TEE|HP-0/.test(document.querySelector('#shop').innerText));
    check('no dev labels (READY, STAND-IN, file names) in the shop', !devText);
    check('tagline is never directly under the wordmark (footer)', !(await page.$eval('.foot-brand', (e) => e.textContent)).includes('Head down'));
    check('prices use one format ($40.00)', (await page.$$eval('.card .price', (ps) => ps.every((p) => /\$\d+\.\d\d/.test(p.textContent)))));
    check('standalone wet-stone lab removed from homepage', (await page.$$('.lab, .tray, [data-stone]')).length === 0);
    // swatch swaps the image and the link
    const card = page.locator('#p-great-lakes-rock-crew-tee');
    await card.locator('.sw:has(input[value="Yam"])').click();
    const src = await card.locator('.wet__base img').getAttribute('src');
    const href = await card.locator('h3 a').getAttribute('href');
    check('swatch click swaps the card image to that color', src.includes('/yam-front.webp'), src);
    check('swatch click carries the color to the product link', href.endsWith('?color=yam'), href);
    const top = await card.locator('.wet__top img').getAttribute('src');
    check('both wet layers use the same image (no altered art)', top === src);
    await ctx.close();
  }

  /* 3. wet reveal: hover, keyboard, persistence for the visit, colors keep it */
  {
    const ctx = await newCtx(b);
    const page = await ctx.newPage();
    await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
    const filt = (slug) => page.$eval(`#p-${slug} .wet__base img`, (i) => getComputedStyle(i).filter);
    check('resting card is gently muted (saturate filter)', /saturate/.test(await filt('midnight-rock-hunt-tee')), await filt('midnight-rock-hunt-tee'));
    await page.locator('#p-midnight-rock-hunt-tee .card__media').scrollIntoViewIfNeeded();
    await page.locator('#p-midnight-rock-hunt-tee .card__media').hover({ position: { x: 60, y: 60 } });
    await wait(300);
    const mid = await page.$eval('#p-midnight-rock-hunt-tee', (c) => ({ splashing: c.classList.contains('is-splashing'), clip: getComputedStyle(c.querySelector('.wet__top')).clipPath }));
    check('hover starts a moving splash (polygon clip mid-animation)', mid.splashing && mid.clip.startsWith('polygon'), mid);
    await page.screenshot({ path: path.join(OUT, 'wet-reveal-mid-splash.jpg'), clip: await page.locator('#p-midnight-rock-hunt-tee .card__media').boundingBox() });
    await wait(1200);
    const after = await page.$eval('#p-midnight-rock-hunt-tee', (c) => ({ wet: c.classList.contains('is-wet'), clip: getComputedStyle(c.querySelector('.wet__top')).clipPath, f: getComputedStyle(c.querySelector('.wet__base img')).filter, btn: c.querySelector('[data-wet-btn]').getAttribute('data-state') }));
    check('after hover: full color, clip removed, button pressed', after.wet && after.clip === 'none' && after.f === 'none' && after.btn === 'wet', after);
    // keyboard focus
    await page.locator('#p-field-notebook-tee h3 a').focus();
    await wait(1400);
    check('keyboard focus reveals the card', await page.$eval('#p-field-notebook-tee', (c) => c.classList.contains('is-wet')));
    const ring = await page.$eval('#p-field-notebook-tee h3 a', (a) => getComputedStyle(a).outlineStyle + ' ' + getComputedStyle(a).outlineColor);
    check('focused link shows a visible gold outline', /solid rgb\(232, 185, 84\)/.test(ring), ring);
    // wet it button
    await page.locator('#p-shoreline-hoodie [data-wet-btn]').click();
    await wait(1400);
    check('"Wet it" button reveals the card', await page.$eval('#p-shoreline-hoodie', (c) => c.classList.contains('is-wet')));
    // color change keeps it wet
    await page.locator('#p-midnight-rock-hunt-tee .sw:has(input[value="Navy"])').click();
    await wait(200);
    const kept = await page.$eval('#p-midnight-rock-hunt-tee', (c) => c.classList.contains('is-wet') && getComputedStyle(c.querySelector('.wet__base img')).filter === 'none');
    check('changing color on a wet card keeps it in full color', kept);
    const stored = await page.evaluate(() => sessionStorage.getItem('hp.wet'));
    check('reveal stored per product for this visit (sessionStorage)', /midnight-rock-hunt-tee/.test(stored) && /shoreline-hoodie/.test(stored), stored);
    // open product page by click, then Back
    await page.locator('#p-midnight-rock-hunt-tee .card__img').click();
    await page.waitForURL(/midnight-rock-hunt-tee\.html\?color=navy/);
    check('image click opens the product page with the chosen color', page.url().includes('midnight-rock-hunt-tee.html?color=navy'), page.url());
    const pdpFilter = await page.$eval('[data-g-img]', (i) => getComputedStyle(i).filter);
    check('product page image is true full color immediately (no filter)', pdpFilter === 'none', pdpFilter);
    check('product page opens with the chosen color', (await page.textContent('#color-now')) === 'Navy');
    await page.goBack({ waitUntil: 'networkidle' });
    const back = await page.$eval('#p-midnight-rock-hunt-tee', (c) => c.classList.contains('is-wet') && getComputedStyle(c.querySelector('.wet__base img')).filter === 'none');
    check('browser Back: revealed card is still full color', back);
    await page.reload({ waitUntil: 'domcontentloaded' });
    const pre = await page.$eval('#p-shoreline-hoodie .wet__base img', (i) => getComputedStyle(i).filter);
    check('reload: revealed card is full color before scripts run', pre === 'none', pre);
    const other = await page.$eval('#p-pocket-full-of-treasures-tee .wet__base img', (i) => getComputedStyle(i).filter);
    check('reload: untouched card is still muted', /saturate/.test(other), other);
    // new visit (new context) starts dry
    const ctx2 = await newCtx(b);
    const p2 = await ctx2.newPage();
    await p2.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
    check('a new visit starts muted again (session only)', /saturate/.test(await p2.$eval('#p-midnight-rock-hunt-tee .wet__base img', (i) => getComputedStyle(i).filter)));
    await ctx2.close();
    check('no script errors (desktop reveal)', ctx.errors.length === 0, ctx.errors);
    await ctx.close();
  }

  /* 4. phones: touch while scrolling reveals, never navigates; a tap opens */
  {
    const ctx = await newCtx(b, { ...devices['iPhone 13'] });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
    const cols = await page.$eval('.cards', (u) => getComputedStyle(u).gridTemplateColumns.split(' ').length);
    check('phone grid is 2 columns', cols === 2, cols);
    await page.evaluate(() => document.querySelector('#p-field-notebook-tee').scrollIntoView({ block: 'center', behavior: 'instant' }));
    await wait(200);
    const box = await page.locator('#p-field-notebook-tee .card__media').boundingBox();
    const cdp = await ctx.newCDPSession(page);
    const x = box.x + box.width / 2, y0 = box.y + box.height * 0.7;
    const sy = await page.evaluate(() => window.scrollY);
    const url = page.url();
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y: y0 }] });
    for (let i = 1; i <= 8; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y0 - i * 25 }] }); await wait(16); }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await wait(1400);
    const sy2 = await page.evaluate(() => window.scrollY);
    check('touch swipe across a product image scrolls the page natively', sy2 > sy + 50, { before: sy, after: sy2 });
    check('touch swipe does not open the product page', page.url() === url, page.url());
    check('touch contact during the scroll reveals the card', await page.$eval('#p-field-notebook-tee', (c) => c.classList.contains('is-wet')));
    // touch cancel: start then cancel
    await page.evaluate(() => document.querySelector('#p-pocket-full-of-treasures-tee').scrollIntoView({ block: 'center', behavior: 'instant' }));
    const b2 = await page.locator('#p-pocket-full-of-treasures-tee .card__media').boundingBox();
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: b2.x + 40, y: b2.y + 40 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
    await wait(1400);
    check('touch cancel: card revealed, no navigation, nothing stuck', page.url() === url && await page.$eval('#p-pocket-full-of-treasures-tee', (c) => c.classList.contains('is-wet') && !c.classList.contains('is-splashing')));
    await page.screenshot({ path: path.join(OUT, 'mobile-390-cards-after-touch.jpg') });
    // passive listener: a touchstart default is never prevented
    const prevented = await page.evaluate(() => { const m = document.querySelector('#p-great-lakes-rock-crew-tee .card__media'); const t = new Touch({ identifier: 1, target: m, clientX: 10, clientY: 10 }); const e = new TouchEvent('touchstart', { touches: [t], cancelable: true, bubbles: true }); m.dispatchEvent(e); return e.defaultPrevented; });
    check('touchstart is never preventDefault-ed', prevented === false);
    // deliberate tap opens
    await page.evaluate(() => document.querySelector('#p-shoreline-hoodie').scrollIntoView({ block: 'center', behavior: 'instant' }));
    await page.locator('#p-shoreline-hoodie .card__img').tap();
    await page.waitForURL(/shoreline-hoodie\.html/);
    check('a deliberate tap on the image opens the product page', page.url().includes('shoreline-hoodie.html'));
    await page.goBack({ waitUntil: 'networkidle' });
    check('phone Back: card tapped earlier is full color', await page.$eval('#p-shoreline-hoodie', (c) => c.classList.contains('is-wet')));
    check('no script errors (phone)', ctx.errors.length === 0, ctx.errors);
    await ctx.close();
  }

  /* 5. product pages: gallery mapping, valid and invalid combos */
  {
    const ctx = await newCtx(b);
    const page = await ctx.newPage();
    for (const slug of SLUGS) {
      await page.goto(`${BASE}/${slug}.html`, { waitUntil: 'networkidle' });
      check(`${slug}: h1`, (await page.textContent('h1')) === BRIEF[slug][0]);
      for (const color of BRIEF[slug][1]) {
        await page.locator(`.opt--color:has(input[value="${color}"])`).click();
        const cs = color.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const srcs = await page.$$eval('.thumb[data-view] img', (is) => is.map((i) => i.getAttribute('src')));
        const main = await page.getAttribute('[data-g-img]', 'src');
        check(`${slug}/${color}: gallery images all match the color`, srcs.every((s) => s.includes(`/${cs}-`)) && main.includes(`/${cs}-`), { main, srcs });
        check(`${slug}/${color}: URL keeps the color`, page.url().includes('color=' + cs));
      }
      const views = await page.$$eval('.thumb[data-view]', (bs) => bs.map((x) => x.dataset.view));
      check(`${slug}: front and back views present`, views.includes('front') && views.includes('back'), views);
      check(`${slug}: artwork close-up present`, (await page.$$('.thumb[data-art]')).length >= 1);
    }
    const disabled = async (slug, color) => {
      await page.goto(`${BASE}/${slug}.html`, { waitUntil: 'networkidle' });
      await page.locator(`.opt--color:has(input[value="${color}"])`).click();
      return page.$$eval('input[name=size]:disabled', (is) => is.map((i) => i.value));
    };
    check('Shoreline Heather Navy stops at 3XL', JSON.stringify(await disabled('shoreline-hoodie', 'Heather Navy')) === '["4XL","5XL"]');
    check('Shoreline Black offers S to 5XL', (await disabled('shoreline-hoodie', 'Black')).length === 0);
    check('Embroidered Sand stops at 3XL', JSON.stringify(await disabled('floral-butterfly-embroidered-hoodie', 'Sand')) === '["4XL","5XL"]');
    check('Embroidered Light Pink has 5XL but no 4XL', JSON.stringify(await disabled('floral-butterfly-embroidered-hoodie', 'Light Pink')) === '["4XL"]');
    check('Embroidered Light Blue offers S to 5XL', (await disabled('floral-butterfly-embroidered-hoodie', 'Light Blue')).length === 0);
    check('Rock Crew Yam / 4XL disabled (Printify unavailable)', JSON.stringify(await disabled('great-lakes-rock-crew-tee', 'Yam')) === '["4XL"]');
    check('Pocket Violet / 4XL disabled (Printify unavailable)', JSON.stringify(await disabled('pocket-full-of-treasures-tee', 'Violet')) === '["4XL"]');
    check('stock wording names the dated check, never "right now"', /not available in our Nov 7, 2026 supplier check/.test(await page.textContent('[data-size-help]')) && !/right now/.test(await page.content()));
    check('Tees stop at 4XL (no 5XL key)', (await page.$$('input[name=size][value="5XL"]')).length === 0);
    // switching to a color without the chosen size clears it
    await page.goto(`${BASE}/shoreline-hoodie.html?color=black&size=5XL`, { waitUntil: 'networkidle' });
    check('direct link with color and size preselects both', await page.isChecked('input[name=size][value="5XL"]') && (await page.textContent('#color-now')) === 'Black');
    check('larger size shows the "price not set" note', await page.isVisible('[data-size-note]'));
    await page.locator('.opt--color:has(input[value="Heather Navy"])').click();
    const help = await page.textContent('[data-size-help]');
    check('switching to Heather Navy clears 5XL and explains why', !(await page.isChecked('input[name=size][value="5XL"]')) && /5XL is not available in Heather Navy/.test(help), help);
    await page.goto(`${BASE}/shoreline-hoodie.html?color=heather-navy&size=5XL`, { waitUntil: 'networkidle' });
    check('invalid size in a direct link is ignored', (await page.$$eval('input[name=size]:checked', (x) => x.length)) === 0);
    // gallery placeholder and art
    await page.click('.thumb[data-ph]');
    check('photo placeholder is a clear, honest tile', await page.isVisible('[data-g-ph]'));
    await page.click('.thumb[data-art="0"]');
    check('artwork close-up opens in the main viewer', (await page.getAttribute('[data-g-img]', 'src')).includes('img/art/'));
    // back to collection link
    await page.click('.crumbs a');
    await page.waitForLoadState('networkidle');
    check('"Back to the collection" returns to that card', page.url().endsWith('index.html#p-shoreline-hoodie'), page.url());
    await ctx.close();
  }

  /* 6. cart: add, validation, merge, separate variants, update, remove, persistence */
  {
    const ctx = await newCtx(b);
    const page = await ctx.newPage();
    const count = () => page.textContent('[data-cart-count]');
    await page.goto(`${BASE}/great-lakes-rock-crew-tee.html`, { waitUntil: 'networkidle' });
    await page.click('.buy-form button[type=submit]');
    check('no add without a size: clear error', /Pick a size/.test(await page.textContent('[data-buy-msg]')) && (await count()) === '0');
    await page.locator('.opt--color:has(input[value="Moss"])').click();
    await page.locator('.opt:has(input[value="L"])').click();
    await page.click('.buy-form button[type=submit]');
    check('add: confirmation names the variant', /Moss, L/.test(await page.textContent('[data-buy-msg]')));
    check('header cart count updates to 1', (await count()) === '1');
    await page.click('[data-step="1"]');
    await page.click('.buy-form button[type=submit]');
    const lines1 = await page.evaluate(() => JSON.parse(localStorage.getItem('hp.cart.v1')));
    check('same variant merges into one line (qty 3)', lines1.length === 1 && lines1[0].qty === 3, lines1);
    await page.locator('.opt:has(input[value="XL"])').click();
    await page.click('.buy-form button[type=submit]');
    await page.goto(`${BASE}/shoreline-hoodie.html?color=navy&size=2XL`, { waitUntil: 'networkidle' });
    check('cart count persists across pages', (await count()) === '5', await count());
    await page.click('.buy-form button[type=submit]');
    await page.goto(`${BASE}/cart.html`, { waitUntil: 'networkidle' });
    const n = await page.$$eval('.line', (l) => l.length);
    check('different variants stay separate lines (3 lines)', n === 3, n);
    const sub = await page.textContent('[data-subtotal]');
    check('subtotal: 3x$30 + 2x$30 + 1x$60 = $210.00', sub === '$210.00', sub);
    check('larger size line shows the note', /Larger-size price not set/.test(await page.textContent('.lines')));
    await page.screenshot({ path: path.join(OUT, 'cart-1440.jpg'), fullPage: true });
    const first = page.locator('.line').first();
    await first.locator('[data-act=inc]').click();
    check('increase updates qty and subtotal', (await page.textContent('[data-subtotal]')) === '$240.00');
    check('focus stays on the increase button after update', await page.evaluate(() => document.activeElement.dataset.act === 'inc'));
    await page.locator('.line').first().locator('input[data-act=set]').fill('3');
    await page.keyboard.press('Tab');
    check('typing a quantity then Tab moves focus on (not stuck)', await page.evaluate(() => document.activeElement.dataset.act === 'inc'));
    check('typed quantity updates the subtotal in place', (await page.textContent('[data-subtotal]')) === '$210.00', await page.textContent('[data-subtotal]'));
    check('cart has a Keep shopping link', await page.isVisible('.summary a[href="index.html#shop"]'));
    await page.locator('.line').first().locator('input[data-act=set]').fill('25');
    await page.locator('.line').first().locator('input[data-act=set]').press('Enter');
    await page.locator('h1').click();
    await wait(100);
    check('typed quantity is capped at 10', (await page.locator('.line').first().locator('input').inputValue()) === '10');
    await page.locator('.line').nth(1).locator('[data-act=remove]').click();
    check('remove deletes that line only', (await page.$$eval('.line', (l) => l.length)) === 2);
    const co = page.locator('[data-checkout]');
    check('checkout is visibly disabled with an explanation', (await co.getAttribute('aria-disabled')) === 'true' && /no order is made/.test(await page.textContent('#checkout-why')));
    const before = page.url();
    await co.click({ force: true });
    check('clicking checkout goes nowhere', page.url() === before);
    while ((await page.$$('.line [data-act=remove]')).length) await page.locator('.line [data-act=remove]').first().click();
    check('empty state with a way back to the shop', await page.isVisible('.empty a[href="index.html#shop"]'));
    check('header count is 0 when empty', (await count()) === '0');
    // stale or tampered storage is cleaned up
    await page.evaluate(() => localStorage.setItem('hp.cart.v1', JSON.stringify([{ slug: 'great-lakes-rock-crew-tee', color: 'Yam', size: '4XL', qty: 1 }, { slug: 'nope', color: 'x', size: 'S', qty: 1 }, { slug: 'field-notebook-tee', color: 'Navy', size: 'M', qty: 99 }])));
    await page.reload({ waitUntil: 'networkidle' });
    check('invalid stored lines are dropped, qty clamped', (await page.$$eval('.line', (l) => l.length)) === 1 && (await page.locator('.line input').inputValue()) === '10');
    check('no script errors (cart)', ctx.errors.length === 0, ctx.errors);
    await ctx.close();
  }

  /* 7. signup is honest and sends nothing */
  {
    const ctx = await newCtx(b);
    const page = await ctx.newPage();
    const posts = [];
    page.on('request', (r) => { if (r.method() !== 'GET') posts.push(r.url()); });
    await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
    await page.click('[data-signup] button');
    check('signup: empty email shows an error', /enter your email/.test(await page.textContent('#email-msg')) && (await page.getAttribute('#email', 'aria-invalid')) === 'true');
    await page.fill('#email', 'rocks@beach');
    await page.click('[data-signup] button');
    check('signup: invalid email shows an error', /incomplete/.test(await page.textContent('#email-msg')));
    await page.fill('#email', 'rocks@beach.com');
    await page.click('[data-signup] button');
    const m = await page.textContent('#email-msg');
    check('signup: valid email gets an honest preview message, not "subscribed"', /nothing was sent/.test(m) && !/subscribed|welcome|discount/i.test(m), m);
    check('signup: no network request sent', posts.length === 0, posts);
    check('signup: nothing saved in storage', !(await page.evaluate(() => JSON.stringify(localStorage) + JSON.stringify(sessionStorage))).includes('rocks@beach.com'));
    await ctx.close();
  }

  /* 8. failure states: images, storage, reduced motion, slow loading */
  {
    const ctx = await newCtx(b);
    const page = await ctx.newPage();
    await page.goto(`${BASE}/index.html?simulate=noimages`, { waitUntil: 'networkidle' });
    await scrollAll(page);
    const fails = await page.$$eval('.card', (cs) => cs.filter((c) => c.classList.contains('img-failed') && !c.querySelector('.img-fail').hidden).length);
    check('image failure: every card shows a readable fallback with a link', fails === 6, fails);
    await page.screenshot({ path: path.join(OUT, 'state-images-failed.jpg') });
    await page.goto(`${BASE}/midnight-rock-hunt-tee.html?simulate=noimages`, { waitUntil: 'networkidle' });
    check('image failure on product page shows a message', await page.isVisible('[data-g-well] .img-fail'));
    await page.goto(`${BASE}/cart.html?simulate=nostorage`, { waitUntil: 'networkidle' });
    check('storage blocked: cart explains it only lasts this page', await page.isVisible('[data-storage-warn]'));
    await page.goto(`${BASE}/field-notebook-tee.html?simulate=nostorage`, { waitUntil: 'networkidle' });
    await page.locator('.opt:has(input[value="M"])').click();
    await page.click('.buy-form button[type=submit]');
    check('storage blocked: add still works in memory', (await page.textContent('[data-cart-count]')) === '1');
    check('storage blocked: add message warns the cart will not survive', /blocking storage/.test(await page.textContent('[data-buy-msg]')));
    await page.goto(`${BASE}/index.html?simulate=nostorage`, { waitUntil: 'networkidle' });
    await page.locator('#p-field-notebook-tee .card__media').hover();
    await wait(1400);
    check('storage blocked: reveal still works on the page', await page.$eval('#p-field-notebook-tee', (c) => c.classList.contains('is-wet')));
    check('no script errors (failure states)', ctx.errors.length === 0, ctx.errors);
    await ctx.close();

    const rm = await newCtx(b, { reducedMotion: 'reduce' });
    const p3 = await rm.newPage();
    await p3.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
    const f = await p3.$eval('#p-midnight-rock-hunt-tee .wet__base img', (i) => getComputedStyle(i).filter);
    check('reduced motion: products are full color immediately, no animation', f === 'none' && !(await p3.evaluate(() => document.documentElement.classList.contains('wet-fx'))));
    check('reduced motion: "Wet it" button hidden (nothing to do)', !(await p3.isVisible('[data-wet-btn]')));
    const anim = await p3.evaluate(() => { const d = document.createElement('div'); d.innerHTML = '<span class="hp-loader"><span class="hp-loader__stones"><i></i></span></span>'; document.body.appendChild(d); return getComputedStyle(d.querySelector('i')).animationName; });
    check('reduced motion: loader is static', anim === 'none', anim);
    await rm.close();

    // slow images: loader appears after the delay and goes away on load; fast loads never show it
    const sl = await newCtx(b);
    const p4 = await sl.newPage();
    await p4.route('**/img/products/**', async (route) => { await wait(1500); route.continue(); });
    await p4.goto(`${BASE}/shoreline-hoodie.html`, { waitUntil: 'domcontentloaded' });
    await wait(80);
    const early = await p4.$eval('[data-g-well] .media-loader', (l) => getComputedStyle(l).opacity);
    await wait(600);
    const mid = await p4.$eval('[data-g-well] .media-loader', (l) => getComputedStyle(l).opacity);
    await p4.screenshot({ path: path.join(OUT, 'state-loading.jpg'), clip: await p4.locator('[data-g-well]').boundingBox() });
    await p4.waitForLoadState('networkidle'); await wait(200);
    const gone = await p4.$eval('[data-g-well] .media-loader', (l) => getComputedStyle(l).display);
    check('loader hidden for the first moment (no flash on fast loads)', early === '0', early);
    check('loader visible while a slow image loads', mid === '1', mid);
    check('loader removed once the image loads', gone === 'none', gone);
    check('loader has status text for screen readers', /Loading image/.test(await p4.textContent('[data-g-well] [role=status]')));
    await sl.close();
  }

  /* 9. layouts: overflow, hero sunset, zoom, screenshots */
  {
    const sizes = [
      ['phone-320', { viewport: { width: 320, height: 640 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }],
      ['phone-375', { viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }],
      ['phone-390', { ...devices['iPhone 13'] }],
      ['phone-landscape-844', { ...devices['iPhone 13 landscape'] }],
      ['tablet-768', { viewport: { width: 768, height: 1024 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }],
      ['tablet-1024', { viewport: { width: 1024, height: 768 }, deviceScaleFactor: 1 }],
      ['desktop-1440', { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }],
      ['zoom200-of-1280', { viewport: { width: 640, height: 400 }, deviceScaleFactor: 2 }],
    ];
    // sunset and lighthouse positions inside each crop (source pixels)
    const KEEP = { wide: { w: 1174, h: 700, sun: [200, 395], light: [850, 905], sunY: [105, 205] }, tall: { w: 1086, h: 760, sun: [255, 430], light: [840, 895], sunY: [165, 270] } };
    for (const [name, opts] of sizes) {
      const ctx = await newCtx(b, opts);
      const page = await ctx.newPage();
      for (const pg of ['index.html', 'shoreline-hoodie.html', 'cart.html', 'field-notes.html']) {
        await page.goto(`${BASE}/${pg}`, { waitUntil: 'networkidle' });
        const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        check(`${name} ${pg}: no horizontal scroll`, over <= 0, over);
      }
      await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
      const hero = await page.$eval('.hero img', (i) => {
        const r = i.getBoundingClientRect(), cs = getComputedStyle(i);
        return { w: r.width, h: r.height, fit: cs.objectFit, pos: cs.objectPosition, src: i.currentSrc };
      });
      const k = hero.src.includes('shore-tall') ? 'tall' : 'wide';
      const s = KEEP[k];
      let vis = [0, s.w], visY = [0, s.h];
      if (hero.fit === 'cover') {
        const scale = Math.max(hero.w / s.w, hero.h / s.h);
        const vw = hero.w / scale, vh = hero.h / scale;
        const [px, py] = hero.pos.split(' ').map((v) => parseFloat(v) / 100);
        vis = [(s.w - vw) * px, (s.w - vw) * px + vw];
        visY = [(s.h - vh) * py, (s.h - vh) * py + vh];
      }
      const sunOk = vis[0] <= s.sun[0] && vis[1] >= s.sun[1] && visY[0] <= s.sunY[0] && visY[1] >= s.sunY[1];
      const lightOk = vis[0] <= s.light[0] && vis[1] >= s.light[1];
      check(`${name}: hero shows the whole sunset`, sunOk, { vis, visY, hero });
      check(`${name}: hero shows the lighthouse`, lightOk, { vis });
      const heroH = hero.h, vh = opts.viewport ? opts.viewport.height : 0;
      check(`${name}: hero image is shorter than before (<= 62% of screen or 460px)`, heroH <= Math.max(460, vh * 0.62) || k === 'tall', heroH);
      const shopTop = await page.$eval('#shop', (e) => e.getBoundingClientRect().top + window.scrollY);
      results.push(`INFO ${name}: collection starts at ${Math.round(shopTop)}px (screen height ${vh})`);
      await page.screenshot({ path: path.join(OUT, `${name}-home-top.jpg`) });
      if (['phone-390', 'desktop-1440', 'tablet-768'].includes(name)) {
        await scrollAll(page);
        await page.evaluate(() => document.querySelector('#shop').scrollIntoView({ behavior: 'instant' }));
        await wait(150);
        await page.screenshot({ path: path.join(OUT, `${name}-shop.jpg`) });
        await page.goto(`${BASE}/great-lakes-rock-crew-tee.html?color=yam`, { waitUntil: 'networkidle' });
        await page.screenshot({ path: path.join(OUT, `${name}-product.jpg`) });
      }
      await ctx.close();
    }
  }

  /* 10. keyboard-only path and accessibility scan */
  {
    const ctx = await newCtx(b);
    const page = await ctx.newPage();
    await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
    await page.keyboard.press('Tab');
    check('first Tab reaches "Skip to content"', await page.evaluate(() => document.activeElement.classList.contains('skip')));
    // tab to a product title link and open it with Enter
    let found = false;
    for (let i = 0; i < 30; i++) { await page.keyboard.press('Tab'); if (await page.evaluate(() => document.activeElement.matches('#p-midnight-rock-hunt-tee h3 a'))) { found = true; break; } }
    check('keyboard reaches the first product title link', found);
    check('keyboard focus on the card revealed it', await page.$eval('#p-midnight-rock-hunt-tee', (c) => c.classList.contains('is-wet') || c.classList.contains('is-splashing')));
    await page.keyboard.press('Enter');
    await page.waitForURL(/midnight-rock-hunt-tee\.html/);
    // choose size and add with keyboard only
    await page.focus('input[name=size][value="M"]');
    await page.keyboard.press('Space');
    await page.focus('.buy-form button[type=submit]');
    await page.keyboard.press('Enter');
    check('keyboard only: choose size and add to cart', (await page.textContent('[data-cart-count]')) === '1');
    if (AXE && fs.existsSync(AXE)) {
      const src = fs.readFileSync(AXE, 'utf8');
      for (const pg of ['index.html', 'midnight-rock-hunt-tee.html?color=black', 'cart.html', 'field-notes.html', 'preview-notes.html']) {
        await page.goto(`${BASE}/${pg}`, { waitUntil: 'networkidle' });
        await scrollAll(page);
        await page.addScriptTag({ content: src });
        const r = await page.evaluate(async () => (await window.axe.run(document, { resultTypes: ['violations'] })).violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} ${v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' | ')}`));
        check(`axe (incl. color contrast) ${pg}: no violations`, r.length === 0, r);
      }
    } else {
      results.push('SKIP axe scan (pass the path to axe.min.js as the 2nd argument)');
    }
    await ctx.close();
  }

  await b.close();
  const report = results.join('\n') + `\n\n${pass} passed, ${fail} failed\n`;
  fs.writeFileSync(path.join(__dirname, 'last-run.txt'), report);
  console.log(report);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
