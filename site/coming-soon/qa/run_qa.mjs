#!/usr/bin/env node
/* Browser checks for the coming-soon page.
   Run: node site/coming-soon/build.js && node site/coming-soon/qa/run_qa.mjs
   Runs the real generated Worker (dist/index.js) inside Node with a fake DIBS list in memory,
   so nothing touches Cloudflare or the real signups. Screenshots go to qa/screens/. */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const DIR = path.dirname(fileURLToPath(import.meta.url));
const SHOTS = path.join(DIR, 'screens');
fs.mkdirSync(SHOTS, { recursive: true });
const worker = (await import(pathToFileURL(path.join(DIR, '../dist/index.js')).href)).default;

/* ---------- fake KV list ---------- */
const store = new Map();
let writes = 0;
const env = { DIBS: {
  async get(k, t) { const v = store.get(k); return v == null ? null : t === 'json' ? JSON.parse(v.value) : v.value; },
  async put(k, value, opts) { writes++; store.set(k, { value, metadata: opts && opts.metadata }); },
} };

/* ---------- local server that hands every request to the Worker ---------- */
const server = http.createServer(async (req, res) => {
  const chunks = []; for await (const c of req) chunks.push(c);
  const body = chunks.length ? Buffer.concat(chunks) : undefined;
  const r = new Request('http://' + req.headers.host + req.url, { method: req.method, headers: req.headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : body });
  const out = await worker.fetch(r, env);
  res.writeHead(out.status, Object.fromEntries(out.headers));
  res.end(Buffer.from(await out.arrayBuffer()));
});
await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
const BASE = 'http://127.0.0.1:' + server.address().port;

let pass = 0, fail = 0;
const check = (name, ok, extra = '') => { ok ? pass++ : fail++; console.log((ok ? 'PASS ' : 'FAIL ') + name + (ok || !extra ? '' : '  -> ' + extra)); };

/* ---------- Worker checks without a browser ---------- */
{
  const r = await worker.fetch(new Request('https://www.heavypocketsco.com/abc?x=1'), env);
  check('www redirects to the bare domain', r.status === 301 && r.headers.get('location') === 'https://heavypocketsco.com/abc?x=1');
  const home = await worker.fetch(new Request('https://heavypocketsco.com/'), env);
  check('home is 200 with CSP', home.status === 200 && /default-src 'self'/.test(home.headers.get('content-security-policy')));
  const html = await home.text();
  for (const m of new Set([...html.matchAll(/(?:src|href|srcset)="(\/assets\/[^"]+)"/g)].map((m) => m[1]))) {
    const a = await worker.fetch(new Request('https://heavypocketsco.com' + m), env);
    check('asset loads ' + m, a.status === 200 && (await a.arrayBuffer()).byteLength > 100);
  }
  const og = await worker.fetch(new Request('https://heavypocketsco.com/assets/logo/og-v3.jpg'), env);
  check('social image served as jpeg', og.status === 200 && og.headers.get('content-type') === 'image/jpeg');
  check('404 page', (await worker.fetch(new Request('https://heavypocketsco.com/nope'), env)).status === 404);
  check('GET /api/dibs is 405', (await worker.fetch(new Request('https://heavypocketsco.com/api/dibs'), env)).status === 405);
  const cross = await worker.fetch(new Request('https://heavypocketsco.com/api/dibs', { method: 'POST', headers: { origin: 'https://evil.example', 'content-type': 'application/json' }, body: '{"email":"a@b.co"}' }), env);
  check('other sites are refused (403), nothing saved', cross.status === 403 && writes === 0);
  const trap = await worker.fetch(new Request('https://heavypocketsco.com/api/dibs', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{"email":"bot@b.co","website":"x"}' }), env);
  check('bot trap pretends ok and saves nothing', trap.status === 200 && writes === 0);
  const bad = await worker.fetch(new Request('https://heavypocketsco.com/api/dibs', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{"email":"nope"}' }), env);
  check('bad email is 400, nothing saved', bad.status === 400 && writes === 0);
  // An older entry with design picks must stay exactly as it was.
  const old = JSON.stringify({ email: 'old@example.com', picks: ['I lick rocks'], first: '2026-11-04T00:00:00.000Z', last: '2026-11-04T00:00:00.000Z' });
  store.set('old@example.com', { value: old, metadata: { picks: ['I lick rocks'] } });
  const again = await worker.fetch(new Request('https://heavypocketsco.com/api/dibs', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{"email":"OLD@example.com","picks":["Shoreline Hoodie"]}' }), env);
  check('existing entry is kept as is (no write, old picks kept)', again.status === 200 && writes === 0 && store.get('old@example.com').value === old);
  store.delete('old@example.com');
}

/* ---------- browser checks ---------- */
const browser = await chromium.launch();
const SIZES = [['375', 375, 812], ['390', 390, 844], ['768', 768, 1024], ['1440', 1440, 900], ['landscape', 844, 390], ['zoom200', 720, 450]];
for (const scheme of ['light', 'dark']) {
  for (const [name, w, h] of SIZES) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: scheme, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    const tag = `${scheme} ${name}`;
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    check(`${tag}: no sideways scroll`, over <= 0, 'overflow ' + over);
    check(`${tag}: no console errors (CSP ok)`, errors.length === 0, errors.join(' | '));
    const wm = await page.locator('.wordmark').boundingBox();
    check(`${tag}: wordmark visible`, wm && wm.width > 120 && wm.height >= 26);
    const wmColor = await page.locator('.wordmark').evaluate((e) => getComputedStyle(e).color);
    check(`${tag}: wordmark is ${scheme === 'dark' ? 'cream' : 'deep teal'}`, wmColor === (scheme === 'dark' ? 'rgb(243, 232, 210)' : 'rgb(22, 71, 69)'), wmColor);
    const heroImg = await page.locator('.hero__art img').evaluate((i) => i.complete && i.naturalWidth > 0);
    check(`${tag}: hero art loaded`, heroImg);
    const fontsOk = await page.evaluate(() => document.fonts.check('800 17px "Atkinson Hyperlegible Next"'));
    check(`${tag}: brand font loaded`, fontsOk);
    const small = await page.$$eval('button, input:not([tabindex="-1"]), a', (els) => els.filter((e) => e.offsetParent && !e.classList.contains('skip') && !e.closest('.fine')) /* links inside a sentence are exempt (WCAG 2.5.8) */.map((e) => [e.textContent.trim() || e.name || e.getAttribute('aria-label'), e.getBoundingClientRect().height]).filter(([, hh]) => hh < 44));
    check(`${tag}: tap targets at least 44 px tall`, small.length === 0, JSON.stringify(small));
    await page.screenshot({ path: path.join(SHOTS, `${scheme}-${name}.png`), fullPage: true });
    await ctx.close();
  }
}

/* day and night switch, keyboard, and remembered choice */
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
  const page = await ctx.newPage();
  await page.goto(BASE + '/');
  const bg = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  check('day background is cream', (await bg()) === 'rgb(243, 232, 210)');
  await page.keyboard.press('Tab');
  check('first Tab: skip link', await page.evaluate(() => document.activeElement.classList.contains('skip')));
  await page.keyboard.press('Tab');
  check('second Tab: day and night switch', await page.evaluate(() => document.activeElement.matches('[data-theme-toggle]')));
  const ring = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
  check('focus ring shows', ring === 'solid');
  await page.keyboard.press('Enter');
  check('switch turns on night', (await bg()) === 'rgb(16, 29, 44)' && (await page.getAttribute('[data-theme-toggle]', 'aria-label')) === 'Switch to day mode');
  await page.reload();
  check('night choice is remembered', (await bg()) === 'rgb(16, 29, 44)');
  await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await page.keyboard.press('Tab');
  check('third Tab: email box', await page.evaluate(() => document.activeElement.name === 'email'));
  await page.keyboard.press('Tab');
  check('fourth Tab: submit button (bot trap skipped)', await page.evaluate(() => document.activeElement.type === 'submit'));
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');

  /* signup with scripts on */
  await page.fill('input[name=email]', 'not-an-email');
  await page.click('button[type=submit]');
  check('bad email: friendly message, nothing saved', /looks incomplete/.test(await page.textContent('.status-line')) && writes === 0);
  await page.fill('input[name=email]', 'Tester@Example.com');
  await page.click('button[type=submit]');
  await page.waitForFunction(() => document.querySelector('.status-line').dataset.state === 'ok');
  const saved = JSON.parse(store.get('tester@example.com').value);
  check('signup saves one entry, email only', writes === 1 && saved.email === 'tester@example.com' && Array.isArray(saved.picks) && saved.picks.length === 0 && saved.first === saved.last);
  await page.fill('input[name=email]', 'tester@example.com');
  await page.click('button[type=submit]');
  await page.waitForFunction(() => document.querySelector('.status-line').dataset.state === 'ok');
  check('signing up again writes nothing', writes === 1);
  await ctx.close();
}

/* reduced motion: page still works, no errors */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', colorScheme: 'dark' });
  const page = await ctx.newPage();
  const errors = []; page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const t = await page.evaluate(() => getComputedStyle(document.querySelector('.btn')).transitionDuration);
  check('reduced motion: no button animation, no errors', t === '0s' && errors.length === 0, t);
  await ctx.close();
}

/* scripts off: plain form post */
{
  const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/');
  check('scripts off: switch is hidden', !(await page.isVisible('[data-theme-toggle]')));
  await page.fill('input[name=email]', 'nojs@example.com');
  await Promise.all([page.waitForNavigation(), page.click('button[type=submit]')]);
  check('scripts off: plain post saves and confirms', /You're on the list/.test(await page.textContent('h1')) && store.has('nojs@example.com') && writes === 2);
  await page.screenshot({ path: path.join(SHOTS, 'nojs-thanks.png') });
  await page.goto(BASE + '/');
  await page.fill('input[name=email]', 'oops');
  await Promise.all([page.waitForNavigation(), page.click('button[type=submit]')]);
  check('scripts off: bad email page', /Check your email address/.test(await page.textContent('h1')) && writes === 2);
  await ctx.close();
}

/* page text rules */
{
  const page = await browser.newPage();
  await page.goto(BASE + '/');
  const text = await page.evaluate(() => document.body.innerText + ' ' + document.title + ' ' + [...document.querySelectorAll('meta[content]')].map((m) => m.content).join(' '));
  check('no em dashes', !/—/.test(text));
  check('no socks, supplier, Printify, cart, checkout, or prices', !/\bsocks?\b|supplier|printify|\bcart\b|checkout|\$\d/i.test(text));
  check('mentions tees and hoodies', /tees and hoodies/i.test(text));
  check('privacy line names every stored field', /date you signed up/.test(text) && /last changed/.test(text) && /favorite designs/.test(text));
  check('og image points at the new art', (await page.getAttribute('meta[property="og:image"]', 'content')).endsWith('/og-v3.jpg'));
  await page.close();
}

/* the private preview file */
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'dark' });
  const page = await ctx.newPage();
  await page.goto(pathToFileURL(path.join(DIR, '../preview/index.html')).href, { waitUntil: 'networkidle' });
  check('preview: hero art inlined', await page.locator('.hero__art img').evaluate((i) => i.complete && i.naturalWidth > 0));
  await page.check('input[name=pv-copy][value=B]');
  check('preview: copy option B shows', /Four tees and two hoodies/.test(await page.textContent('[data-bubble]')));
  const before = writes;
  await page.fill('input[name=email]', 'x@example.com');
  await page.click('button[type=submit]');
  check('preview: signup is off and says so', /Preview only/.test(await page.textContent('.status-line')) && writes === before);
  await page.screenshot({ path: path.join(SHOTS, 'preview-390-dark.png'), fullPage: true });
  await ctx.close();
}

/* contrast of the main text pairs (WCAG AA: 4.5 for text, 3 for large text and borders) */
{
  const lum = (hex) => { const c = hex.match(/\w\w/g).map((x) => parseInt(x, 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
  const pairs = [
    ['day text on paper', '#101D2C', '#FBF6EC', 4.5], ['day soft text on paper', '#3F4A57', '#FBF6EC', 4.5], ['day teal link on paper', '#164745', '#FBF6EC', 4.5],
    ['night text on navy', '#F3E8D2', '#102849', 4.5], ['night soft text on navy', '#D8CCB4', '#102849', 4.5], ['night gold on navy', '#E8B954', '#102849', 4.5],
    ['night soft text on ink (footer)', '#D8CCB4', '#101D2C', 4.5], ['day soft text on cream (footer)', '#3F4A57', '#F3E8D2', 4.5],
    ['white on rust (button, title bar)', '#FFFFFF', '#A7472D', 4.5], ['white on rust hover', '#FFFFFF', '#BC5436', 4.5],
    ['rust punch line on white bubble', '#A7472D', '#FFFFFF', 4.5], ['ink on sand (Coming soon tag)', '#101D2C', '#D9B98B', 4.5],
    ['day teal wordmark on paper', '#164745', '#FBF6EC', 3], ['night cream wordmark on navy', '#F3E8D2', '#102849', 3],
  ];
  for (const [n, a, b, min] of pairs) { const r = ratio(a, b); check(`contrast ${n}: ${r.toFixed(2)}:1`, r >= min); }
}

await browser.close();
server.close();
const summary = `${pass} passed, ${fail} failed (${new Date().toISOString().slice(0, 10)})`;
fs.writeFileSync(path.join(DIR, 'last-run.txt'), summary + '\n');
console.log('\n' + summary);
process.exit(fail ? 1 : 0);
