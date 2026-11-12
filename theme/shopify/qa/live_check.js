#!/usr/bin/env node
/* Checks the uploaded (unpublished) theme on the real Shopify store.
   Usage: node theme/shopify/qa/live_check.js <storefront-password> [theme-id]
   Needs the store host allowed in the network settings. It adds one item to a
   cart in this test browser only, then empties that cart. It never checks out.
   Screenshots go to qa/screens/live-*.png. */
'use strict';
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const [PW, THEME = '131897917498'] = process.argv.slice(2);
if (!PW) { console.error('usage: live_check.js <storefront-password> [theme-id]'); process.exit(2); }
const S = 'https://rjrxi5-ji.myshopify.com', T = 'preview_theme_id=' + THEME;
const OUT = path.join(__dirname, 'screens');
fs.mkdirSync(OUT, { recursive: true });
const SRC = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../v3/src/products.json'), 'utf8'));
const H = SRC.products.map((p) => p.slug);
let pass = 0, fail = 0; const out = [];
const check = (n, ok, info) => { out.push((ok ? 'PASS ' : 'FAIL ') + n + (ok ? '' : ' -> ' + JSON.stringify(info))); ok ? pass++ : fail++; };

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage(); const errs = [], failed = [];
  // only errors thrown by our theme.js; Shopify's own trackers fail here because this test machine blocks them
  p.on('pageerror', (e) => { if (/theme\.js/.test(e.stack || '')) errs.push(e.message); });
  p.on('requestfailed', (r) => failed.push(r.url().slice(0, 100)));
  await p.goto(S + '/password');
  await Promise.all([p.waitForNavigation(), p.evaluate((pw) => { const i = document.querySelector('input[name=password]'); i.value = pw; i.form.submit(); }, PW)]);

  await p.goto(S + '/?' + T, { waitUntil: 'networkidle' });
  check('home: the Heavy Pockets theme is showing', !!(await p.$('.card[data-product]')));
  const cards = await p.$$eval('.card[data-product]', (c) => c.map((x) => x.dataset.product));
  check('home: six cards in the approved order', JSON.stringify(cards) === JSON.stringify(H), cards);
  for (const el of await p.$$('.card')) await el.scrollIntoViewIfNeeded();
  await p.waitForTimeout(800);
  const loaded = await p.$$eval('.card .wet__base img', (i) => i.filter((x) => x.naturalWidth > 0).length);
  check('home: card photos load', loaded === 6, loaded);
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.screenshot({ path: path.join(OUT, 'live-home.png') });

  for (const h of H) {
    const j = await p.evaluate(async (h) => (await fetch('/products/' + h + '.js')).json(), h);
    const ci = j.options.findIndex((o) => /colou?r/i.test(o.name));
    await p.goto(S + '/products/' + h + '?' + T, { waitUntil: 'networkidle' });
    const d = await p.$eval('[data-product-json]', (s) => JSON.parse(s.textContent));
    const counts = d.colors.map((c) => c.images.length);
    check(h + ': four photos per color', counts.every((n) => n === 4), counts);
    const file = (u) => u.split('?')[0].split('/').pop().replace(/\.\w+$/, '');
    const bad = d.colors.filter((c) => {
      const v = j.variants.find((x) => x.options[ci] === c.name);
      return !(v && v.featured_image && c.images[0] && file(c.images[0]) === file(v.featured_image.src));
    }).map((c) => c.name);
    check(h + ': each color starts with its own front photo', bad.length === 0, bad);
    const all = d.colors.flatMap((c) => c.images.map(file));
    check(h + ': no photo is shared by two colors', new Set(all).size === all.length);
    await p.waitForTimeout(500);
    const thumbsOk = await p.$$eval('.thumb img', (i) => i.every((x) => x.complete && x.naturalWidth > 0));
    check(h + ': thumbnails load', thumbsOk);
    await p.screenshot({ path: path.join(OUT, 'live-' + h + '.png') });
  }

  const h = H[1];
  await p.goto(S + '/products/' + h + '?' + T, { waitUntil: 'networkidle' });
  await p.click('.opt--color:nth-of-type(2)');
  await p.click('label.opt:has(input[value="2XL"])');
  const price = await p.$eval('[data-price]', (e) => e.textContent);
  check('product: 2XL price is $32', price === '$32.00', price);
  await p.click('[data-buy] button[type=submit]');
  await p.waitForTimeout(2500);
  const msg = await p.$eval('[data-buy-msg]', (e) => e.textContent);
  check('product: add to cart works on the real store', /^Added to your cart/.test(msg), msg);
  await p.goto(S + '/cart?' + T, { waitUntil: 'networkidle' });
  const line = await p.$eval('.line', (e) => e.innerText).catch(() => '');
  check('cart: shows the item with color, size, and price', /Great Lakes Rock Crew Tee/.test(line) && /Blue Jean/.test(line) && /2XL/.test(line) && /\$32\.00/.test(line), line);
  await p.screenshot({ path: path.join(OUT, 'live-cart.png') });
  await p.evaluate(() => fetch('/cart/clear.js', { method: 'POST' }));
  const left = await p.evaluate(async () => (await (await fetch('/cart.js')).json()).item_count);
  check('cart: emptied after the test', left === 0, left);

  await p.goto(S + '/pages/field-notes?view=field-notes&' + T, { waitUntil: 'networkidle' });
  check('Field Notes page exists in Shopify', !!(await p.$('[data-stone]')), p.url());
  check('no script errors from theme.js', errs.length === 0, errs);
  const report = out.join('\n') + `\n\n${pass} passed, ${fail} failed\nFailed network requests (often Shopify's own trackers): ${JSON.stringify([...new Set(failed)].slice(0, 8))}\n`;
  fs.writeFileSync(path.join(__dirname, 'live-last-run.txt'), report);
  console.log(report);
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
