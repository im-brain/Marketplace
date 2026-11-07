#!/usr/bin/env node
/* Makes the coming-soon images that come from code, using the pre-installed Playwright:
     src/assets/logo/og-v3.jpg           social preview, 1200 x 630
     src/assets/logo/favicon-32.png      browser tab icon
     src/assets/logo/apple-touch-icon.png  home screen icon, 180 x 180
   Run: node site/coming-soon/make_images.js   (then node site/coming-soon/build.js)
   Needs fonts.googleapis.com and fonts.gstatic.com for the brand fonts. */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const DIR = __dirname;
const ROOT = path.resolve(DIR, '../..');
const OUT = path.join(DIR, 'src/assets/logo');
const wm = fs.readFileSync(path.join(ROOT, 'brand/v3/wordmark/heavy-pockets-wordmark.svg'), 'utf8').match(/<path\b[^>]*\/>/g).join('');
const hero = 'data:image/webp;base64,' + fs.readFileSync(path.join(DIR, 'src/assets/hero/shore-wide.webp')).toString('base64');
const favicon = fs.readFileSync(path.join(OUT, 'favicon.svg'), 'utf8');

const OG = `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:wght@400;800&family=Press+Start+2P&display=block">
<style>
html,body{margin:0;width:1200px;height:630px;overflow:hidden}
body{background:#101D2C;background-image:repeating-conic-gradient(rgba(16,40,73,.55) 0 25%,transparent 0 50%);background-size:4px 4px;position:relative}
.card{position:absolute;left:36px;top:36px;right:44px;bottom:44px;display:grid;grid-template-columns:520px 1fr;background:#102849;border:4px solid #D9B98B;box-shadow:8px 8px 0 #07101D}
.copy{padding:46px 40px;display:flex;flex-direction:column;justify-content:center;border-right:4px solid #D9B98B;color:#F3E8D2}
svg{width:420px;height:auto;color:#F3E8D2}
.soon{margin:36px 0 18px;font:400 22px/1.6 "Press Start 2P";color:#E8B954}
.line{margin:0;font:800 30px/1.25 "Atkinson Hyperlegible Next";max-width:16em}
.art{background:url(${hero}) 40% 50%/cover no-repeat}
</style></head><body><div class="card"><div class="copy">
<svg viewBox="0 0 1243 204" xmlns="http://www.w3.org/2000/svg">${wm}</svg>
<p class="soon">COMING SOON</p>
<p class="line">Tees and hoodies for Great Lakes rockhounds.</p>
</div><div class="art"></div></div></body></html>`;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(OG, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const fonts = await page.evaluate(() => ['800 30px "Atkinson Hyperlegible Next"', '22px "Press Start 2P"'].map((f) => document.fonts.check(f)));
  if (fonts.includes(false)) throw new Error('brand fonts did not load; check that Google Fonts is reachable');
  await page.screenshot({ path: path.join(OUT, 'og-v3.jpg'), type: 'jpeg', quality: 88 });

  for (const [name, size] of [['favicon-32.png', 32], ['apple-touch-icon.png', 180]]) {
    // the home screen icon fills the square (iOS rounds the corners itself)
    const svg = name.startsWith('apple') ? favicon.replace('rx="6"', 'rx="0"') : favicon;
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<html><body style="margin:0;background:transparent">${svg.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`);
    await page.screenshot({ path: path.join(OUT, name), omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
  }
  await browser.close();
  console.log('wrote og-v3.jpg, favicon-32.png, apple-touch-icon.png');
})().catch((e) => { console.error(e); process.exit(1); });
