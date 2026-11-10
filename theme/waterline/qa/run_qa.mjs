#!/usr/bin/env node
/* Waterline proof of concept: browser checks, captures, and speed measurements.

   Run from the repo root:   node theme/waterline/qa/run_qa.mjs

   The script serves theme/waterline/ itself on a spare port, so nothing else
   needs to be running. It uses the pre-installed Playwright Chromium with
   phone and touch EMULATION. This is not a test on a real iPhone or Safari.
   Captures go to qa/screens/, results to qa/last-run.txt and qa/perf.json. */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium, devices } = require('playwright');
const DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(DIR, '..');
const REPO = path.join(ROOT, '..', '..');
const SHOTS = path.join(DIR, 'screens');
fs.mkdirSync(SHOTS, { recursive: true });

/* ---------- tiny static server ---------- */
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.webp': 'image/webp', '.png': 'image/png', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel.endsWith('/')) rel += 'index.html';
  const file = path.join(ROOT, rel);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${server.address().port}`;

/* ---------- helpers ---------- */
let pass = 0, fail = 0;
const lines = [];
function check(name, ok, info) {
  lines.push((ok ? 'PASS ' : 'FAIL ') + name + (ok || info === undefined ? '' : '  -> ' + JSON.stringify(info)));
  ok ? pass++ : fail++;
}
const note = (text) => lines.push('NOTE ' + text);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const host = (sp) => `[data-specimen="${sp}"] hp-wet-stone`;
const stageSel = (sp) => `[data-specimen="${sp}"] [data-wl-stage]`;
const dunkSel = (sp) => `[data-specimen="${sp}"] [data-wl-dunk]`;

async function open(browser, opts = {}, url = '/index.html', setup) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
  const page = await ctx.newPage();
  page.errors = [];
  page.requests = [];
  page.loaded = false;
  page.on('pageerror', (e) => page.errors.push(e.message));
  page.on('load', () => { page.loaded = true; });
  page.on('request', (r) => page.requests.push({ url: r.url().replace(BASE, ''), afterLoad: page.loaded }));
  if (setup) await setup(page, ctx);
  const res = await page.goto(BASE + url, { waitUntil: 'load' });
  page.status = res.status();
  return { ctx, page };
}

function info(page, sp = 'petoskey') {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    const W = window.Waterline || {};
    return {
      live: el.hasAttribute('live'),
      state: el.getAttribute('data-state'),
      cov: el.coverage ? el.coverage() : null,
      label: el.querySelector('[data-wl-dunk]').textContent,
      status: el.querySelector('[data-wl-status]').textContent,
      touched: el.hasAttribute('data-touched'),
      failed: el.hasAttribute('data-wet-failed'),
      canvas: !!el.querySelector('canvas'),
      grid: !!(el.water && el.water.depth),
      running: W.clock ? W.clock.running : null,
      frames: W.clock ? W.clock.frames : null,
      wetOpacity: getComputedStyle(el.querySelector('[data-wl-wet]')).opacity,
    };
  }, host(sp));
}

async function until(page, sp, test, ms = 8000) {
  const t0 = Date.now();
  let last;
  while (Date.now() - t0 < ms) {
    last = await info(page, sp);
    if (test(last)) return { ok: true, info: last, seconds: (Date.now() - t0) / 1000 };
    await wait(60);
  }
  return { ok: false, info: last, seconds: ms / 1000 };
}
const live = (page, sp = 'petoskey') => until(page, sp, (i) => i.live, 6000);

/* Rule 1: every solid pixel on the effect canvas must equal the approved wet image,
   and the water can never be more solid than the stone's own outline. */
function rule1(page, sp, probes = []) {
  return page.evaluate(async ([sel, probes]) => {
    const el = document.querySelector(sel);
    const c = el.querySelector('canvas');
    if (!c) return null;
    const wet = el.querySelector('[data-wl-wet]');
    const ref = document.createElement('canvas');
    ref.width = c.width; ref.height = c.height;
    const rctx = ref.getContext('2d');
    /* the reference: the approved wet image, scaled to the same size the same way */
    rctx.drawImage(await createImageBitmap(wet, { resizeWidth: c.width, resizeHeight: c.height, resizeQuality: 'high' }), 0, 0);
    const a = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    const b = rctx.getImageData(0, 0, c.width, c.height).data;
    let worst = 0, solid = 0, outside = 0;
    for (let i = 0; i < a.length; i += 4) {
      if (a[i + 3] > b[i + 3] + 2) outside++;
      if (a[i + 3] >= 250) {
        solid++;
        worst = Math.max(worst, Math.abs(a[i] - b[i]), Math.abs(a[i + 1] - b[i + 1]), Math.abs(a[i + 2] - b[i + 2]));
      }
    }
    const alpha = probes.map(([x, y]) => a[(Math.round(y * (c.height - 1)) * c.width + Math.round(x * (c.width - 1))) * 4 + 3]);
    return { worst, solid, outside, alpha, size: c.width + ' x ' + c.height };
  }, [host(sp), probes]);
}

async function touch(ctx, page) {
  const cdp = await ctx.newCDPSession(page);
  return {
    cdp,
    start: (x, y) => cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: Math.round(x), y: Math.round(y) }] }),
    move: (x, y) => cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: Math.round(x), y: Math.round(y) }] }),
    end: () => cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }),
  };
}
/* A sideways rub that starts level (so the page does not read it as a scroll) and then wanders. */
async function rub(t, box, { from = 0.22, to = 0.78, y = 0.45, wobble = 0.1, steps = 28, gap = 14 } = {}) {
  await t.start(box.x + box.width * from, box.y + box.height * y);
  for (let i = 1; i <= steps; i++) {
    const k = i / steps;
    const lift = i < 6 ? 0 : wobble * Math.sin((i - 6) / 4);
    await t.move(box.x + box.width * (from + (to - from) * k), box.y + box.height * (y + lift));
    await wait(gap);
  }
  await t.end();
}
async function brush(page, box, { from = 0.22, to = 0.78, y = 0.45, wobble = 0.1, steps = 36, down = false } = {}) {
  await page.mouse.move(box.x + box.width * from, box.y + box.height * y);
  if (down) await page.mouse.down();
  for (let i = 1; i <= steps; i++) {
    const k = i / steps;
    await page.mouse.move(box.x + box.width * (from + (to - from) * k), box.y + box.height * (y + wobble * Math.sin(i / 5)));
    await wait(10);
  }
  if (down) await page.mouse.up();
  await page.mouse.move(box.x + box.width + 150, box.y - 40);   /* leave the stone */
}
/* Compare two screenshots pixel by pixel (decoded in a blank browser page). */
async function compareShots(browser, a, b) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const out = await page.evaluate(async ([a, b]) => {
    const load = (src) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
    const [ia, ib] = await Promise.all([load(a), load(b)]);
    const w = Math.min(ia.width, ib.width), h = Math.min(ia.height, ib.height);
    const read = (img) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.drawImage(img, 0, 0); return x.getImageData(0, 0, w, h).data; };
    const da = read(ia), db = read(ib);
    let sum = 0, max = 0, far = 0;
    for (let i = 0; i < da.length; i += 4) {
      const d = Math.max(Math.abs(da[i] - db[i]), Math.abs(da[i + 1] - db[i + 1]), Math.abs(da[i + 2] - db[i + 2]));
      sum += d;
      if (d > max) max = d;
      if (d > 16) far++;
    }
    return { mean: +(sum / (da.length / 4)).toFixed(3), max, sharePast16: +(far / (da.length / 4)).toFixed(5), sameSize: ia.width === ib.width && ia.height === ib.height };
  }, ['data:image/png;base64,' + a.toString('base64'), 'data:image/png;base64,' + b.toString('base64')]);
  await ctx.close();
  return out;
}
const looks = {};
const shot = (page, name, opts = {}) => page.screenshot({ path: path.join(SHOTS, name + '.png'), ...opts });
const quiet = (page) => page.errors.filter((e) => !/Failed to load resource/.test(e));

/* Run every section, or only some:  WL_ONLY=0,7 node theme/waterline/qa/run_qa.mjs */
const ONLY = (process.env.WL_ONLY || '').split(',').filter(Boolean);
async function section(id, fn) { if (!ONLY.length || ONLY.includes(id)) await fn(); }

const perf = { note: 'Chromium emulation only. Not a real iPhone, and not Safari.', sizes: {}, load: {}, phases: {} };
const browser = await chromium.launch();

/* ================= 0. files ================= */
await section('0', async () => {
  const sha = (f) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
  const stones = fs.readdirSync(path.join(ROOT, 'img/stones')).filter((f) => f.endsWith('.webp')).sort();
  check('eight stone files are present', stones.length === 8, stones);
  for (const f of stones) {
    check(`stone ${f} matches the approved original byte for byte`,
      sha(path.join(ROOT, 'img/stones', f)) === sha(path.join(REPO, 'theme/v2/img', f)) &&
      sha(path.join(ROOT, 'img/stones', f)) === sha(path.join(REPO, 'theme/v3/img/stones', f)));
  }
  check('brand tokens are a byte copy of the approved file',
    sha(path.join(ROOT, 'assets/brand-tokens.css')) === sha(path.join(REPO, 'theme/v3/assets/brand-tokens.css')));
  const mine = ['index.html', 'README.md', 'assets/waterline.css', 'assets/poc.css', 'assets/waterline.js', 'assets/core.js', 'assets/water.js', 'assets/debug.js', 'qa/run_qa.mjs'];
  const dashes = mine.filter((f) => fs.existsSync(path.join(ROOT, f)) && fs.readFileSync(path.join(ROOT, f), 'utf8').includes(String.fromCharCode(0x2014)));
  check('no em dashes in any Waterline file', dashes.length === 0, dashes);
  const gz = (f) => zlib.gzipSync(fs.readFileSync(path.join(ROOT, f)), { level: 9 }).length;
  for (const f of ['assets/waterline.js', 'assets/core.js', 'assets/water.js', 'assets/waterline.css']) {
    perf.sizes[f] = { bytes: fs.statSync(path.join(ROOT, f)).size, gzip: gz(f) };
  }
  let terser = null;
  try { terser = require('terser'); } catch (e) { /* optional */ }
  if (terser) {
    for (const [f, module] of [['assets/waterline.js', false], ['assets/core.js', true], ['assets/water.js', true]]) {
      const out = await terser.minify(fs.readFileSync(path.join(ROOT, f), 'utf8'), { module, compress: true, mangle: true });
      perf.sizes[f].minifiedGzip = zlib.gzipSync(out.code, { level: 9 }).length;
    }
  } else {
    note('minified sizes not measured in this run (terser is not installed). See the README for the one-off measurement.');
  }
  const s = perf.sizes;
  const starter = s['assets/waterline.js'], fx = { gzip: s['assets/core.js'].gzip + s['assets/water.js'].gzip };
  note(`starter script as written: ${starter.bytes} bytes, ${starter.gzip} compressed` + (starter.minifiedGzip ? `, ${starter.minifiedGzip} minified and compressed` : ''));
  note(`effect code as written (core + water): ${fx.gzip} compressed` + (s['assets/core.js'].minifiedGzip ? `, ${s['assets/core.js'].minifiedGzip + s['assets/water.js'].minifiedGzip} minified and compressed` : ''));
  if (starter.gzip >= 1536 || fx.gzip >= 6144) note('as written, with comments, the scripts are over the 1.5 KB and 6 KB targets. The targets are met only when minified.');
  check('size guard: scripts have not ballooned (starter under 2.5 KB and effect under 10 KB compressed, as written)', starter.gzip < 2560 && fx.gzip < 10240, [starter.gzip, fx.gzip]);
  if (starter.minifiedGzip) {
    check('starter script meets the 1.5 KB target when minified', starter.minifiedGzip < 1536, starter.minifiedGzip);
    check('effect code meets the 6 KB target when minified', s['assets/core.js'].minifiedGzip + s['assets/water.js'].minifiedGzip < 6144);
  }
  const deps = ['assets/waterline.js', 'assets/core.js', 'assets/water.js'].filter((f) => /from\s+['"](?!\.\/)|require\(|https?:\/\//.test(fs.readFileSync(path.join(ROOT, f), 'utf8')));
  check('no outside libraries: scripts import only each other', deps.length === 0, deps);
});

/* ================= 1. load, lazy loading, and idle ================= */
await section('1', async () => {
  const { ctx, page } = await open(browser);
  check('page loads (200)', page.status === 200, page.status);
  const beforeLoad = page.requests.filter((r) => !r.afterLoad).map((r) => r.url);
  check('at page load the only script fetched is the starter',
    beforeLoad.filter((u) => /\.js$/.test(u)).join() === '/assets/waterline.js', beforeLoad.filter((u) => /\.js$/.test(u)));
  check('at page load no wet image is fetched', !beforeLoad.some((u) => /-wet\.webp/.test(u)), beforeLoad);
  check('at page load only the first stone is fetched', beforeLoad.filter((u) => /\.webp$/.test(u)).join() === '/img/stones/petoskey-dry.webp', beforeLoad.filter((u) => /\.webp$/.test(u)));
  const up = await live(page);
  check('the effect loads by itself once the page is idle', up.ok, up.info);
  const urls = page.requests.map((r) => r.url);
  check('effect code and the wet image arrive after load', ['/assets/water.js', '/assets/core.js', '/img/stones/petoskey-wet.webp'].every((u) => page.requests.some((r) => r.url === u && r.afterLoad)), urls);
  check('stones that are not shown fetch nothing', !urls.some((u) => /agate|jasper|leland/.test(u)), urls.filter((u) => /agate|jasper|leland/.test(u)));
  const outside = urls.filter((u) => /^https?:/.test(u) && !/fonts\.(googleapis|gstatic)\.com/.test(u));
  check('no outside requests except Google Fonts', outside.length === 0, outside);
  const broken = await page.$$eval('img[src]', (ims) => ims.filter((i) => i.offsetParent !== null && i.complete && !i.naturalWidth).map((i) => i.src));
  check('no broken images', broken.length === 0, broken);
  await wait(1500);
  const i = await info(page);
  check('a dry page does no work: the frame clock never started', i.frames === 0 && i.running === false, i);
  const idle = await page.evaluate(() => Array.from(document.querySelectorAll('hp-wet-stone')).map((el) => [el.closest('.specimen').dataset.specimen, el.hasAttribute('live'), !!el.querySelector('canvas'), !!(el.water && (el.water.depth || el.water.bitmap))]));
  check('only the stone on screen is made ready. Hidden stones hold no canvas and no memory', idle.every(([name, isLive, canvas, memory]) => (name === 'petoskey') === isLive && (name === 'petoskey') === canvas && (name === 'petoskey') === memory), idle);
  check('hint is shown before the first touch', await page.locator(stageSel('petoskey') + ' .wl-hint').evaluate((n) => getComputedStyle(n).opacity === '1' && getComputedStyle(n).display !== 'none'));
  check('no script errors on load', quiet(page).length === 0, page.errors);
  await ctx.close();
});
await section('1', async () => {
  /* a stone far below the screen loads nothing until it comes near */
  const { ctx, page } = await open(browser, { viewport: { width: 390, height: 100 } });
  await wait(1500);
  let urls = page.requests.map((r) => r.url);
  check('far below the screen: no effect code and no wet image', !urls.some((u) => /water\.js|core\.js|-wet\.webp/.test(u)), urls);
  await page.evaluate(() => window.scrollTo(0, 260));
  const up = await live(page);
  urls = page.requests.map((r) => r.url);
  check('scrolled near: effect code and wet image load', up.ok && urls.includes('/assets/water.js') && urls.includes('/img/stones/petoskey-wet.webp'), urls);
  await ctx.close();
});

/* ================= 2. desktop: mouse, drying, dunk, and keyboard ================= */
await section('2', async () => {
  const { ctx, page } = await open(browser, { deviceScaleFactor: 2 });
  await live(page);
  await wait(300);
  await shot(page, 'desktop-1-dry');
  const box = await page.locator(stageSel('petoskey')).boundingBox();
  await brush(page, box, { down: true });
  const t0 = Date.now();
  await wait(200);
  let i = await info(page);
  check('mouse stroke: only part of the picture is wet', i.cov > 0.01 && i.cov < 0.3, i.cov);
  check('mouse stroke: state says wet where touched', i.state === 'damp' && /touched/.test(i.status), i);
  check('mouse stroke: hint goes away after the first water', i.touched && await page.locator(stageSel('petoskey') + ' .wl-hint').evaluate((n) => getComputedStyle(n).opacity === '0'));
  let r = await rule1(page, 'petoskey', [[0.5, 0.45], [0.5, 0.85], [0.12, 0.5]]);
  check('reveal is local: wet on the stroke, untouched away from it', r.alpha[0] === 255 && r.alpha[1] === 0 && r.alpha[2] === 0, r.alpha);
  check('rule 1 (stroke): every solid pixel equals the approved wet image', r.solid > 500 && r.worst <= 3, r);
  check('rule 1 (stroke): water never spills past the stone outline', r.outside === 0, r.outside);
  await shot(page, 'desktop-2-stroke');
  await wait(Math.max(0, 9000 - (Date.now() - t0)));
  const mid = await info(page);
  check('drying: the streak is thinner after 9 seconds', mid.cov > 0 && mid.cov < i.cov, [i.cov, mid.cov]);
  await shot(page, 'desktop-3-drying');
  const dry = await until(page, 'petoskey', (x) => x.state === 'dry', 40000);
  const seconds = (Date.now() - t0) / 1000;
  perf.dryingSeconds = +seconds.toFixed(1);
  check('drying: the streak is gone within about 20 seconds (under 25)', dry.ok && seconds < 25, seconds);
  note(`a pressed mouse streak took ${seconds.toFixed(1)} seconds to dry completely`);
  await wait(400);
  const a = await info(page);
  await wait(1200);
  const b = await info(page);
  check('after drying: nothing is wet and the frame clock has stopped', b.cov === 0 && b.running === false && b.frames === a.frames, [a, b]);
  looks.liveDry = await page.locator(stageSel('petoskey')).screenshot();   /* compared with the plain dry still later */

  /* hover without pressing leaves a lighter trail */
  await brush(page, box, { y: 0.6 });
  await wait(150);
  i = await info(page);
  check('mouse hover (no button) also leaves a trail', i.cov > 0.005 && i.state === 'damp', i.cov);

  /* dunk */
  await page.click(dunkSel('petoskey'));
  const wet = await until(page, 'petoskey', (x) => x.cov >= 0.99 && x.running === false, 4000);
  check('dunk: the whole picture is wet', wet.ok, wet.info);
  check('dunk: button now says Dry it off, and the status says so', wet.info.label === 'Dry it off' && /Wet all over/.test(wet.info.status), wet.info);
  r = await rule1(page, 'petoskey');
  check('rule 1 (dunked): every solid pixel equals the approved wet image', r.solid > 5000 && r.worst <= 3 && r.outside === 0, r);
  await shot(page, 'desktop-5-dunked');
  looks.liveWet = await page.locator(stageSel('petoskey')).screenshot();
  const f0 = (await info(page)).frames;
  await wait(2500);
  i = await info(page);
  check('dunk: stays wet, with the frame clock stopped', i.cov >= 0.99 && i.frames === f0 && i.running === false, i);
  await page.click(dunkSel('petoskey'));
  await wait(120);
  i = await info(page);
  check('dry it off: state says drying, button says Dunk it again', i.state === 'drying' && i.label === 'Dunk it', i);
  const off = await until(page, 'petoskey', (x) => x.state === 'dry' && x.running === false, 8000);
  check('dry it off: dry within a few seconds', off.ok && off.info.cov === 0, off);
  note(`dry it off took ${off.seconds.toFixed(1)} seconds`);

  /* keyboard only */
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.mouse.click(4, 4);                 /* start from the top of the page, as a keyboard user would */
  await page.keyboard.press('Tab');
  const focus = await page.evaluate(() => ({ id: document.activeElement.id, outline: getComputedStyle(document.activeElement).outlineStyle + ' ' + getComputedStyle(document.activeElement).outlineWidth }));
  check('keyboard: the first Tab stop is the Dunk it button, with a visible outline', focus.id === 'dunk-petoskey' && /solid 3px/.test(focus.outline), focus);
  await page.keyboard.press('Enter');
  const kw = await until(page, 'petoskey', (x) => x.state === 'wet' && x.cov >= 0.99, 4000);
  check('keyboard: Enter dunks the stone', kw.ok, kw.info);
  await page.keyboard.press('Space');
  const kd = await until(page, 'petoskey', (x) => x.state === 'dry', 8000);
  check('keyboard: Space dries it off', kd.ok, kd.info);
  const names = await page.evaluate(() => ({
    status: document.querySelector('[data-specimen="petoskey"] [data-wl-status]').getAttribute('role'),
    alt: document.querySelector('[data-specimen="petoskey"] [data-wl-dry]').alt,
    wetHidden: document.querySelector('[data-specimen="petoskey"] [data-wl-wet]').getAttribute('aria-hidden'),
  }));
  check('screen readers: status region, described dry image, and the decorative copy is hidden', names.status === 'status' && names.alt.length > 20 && names.wetHidden === 'true', names);
  check('no script errors (desktop run)', quiet(page).length === 0, page.errors);

  /* captures of the two moving moments, slowed down so a still frame can show them */
  await page.evaluate((sel) => { document.querySelector(sel).water.t.rise = 4; }, host('petoskey'));
  await page.click(dunkSel('petoskey'));
  await wait(1100);
  await shot(page, 'desktop-4-waterline-rising');
  await until(page, 'petoskey', (x) => x.running === false, 6000);
  await page.evaluate((sel) => { document.querySelector(sel).water.t.wipe = 7; }, host('petoskey'));
  await page.click(dunkSel('petoskey'));
  await wait(2600);
  await shot(page, 'desktop-6-drying-off');
  await ctx.close();
});

/* ================= 3. stone picker ================= */
await section('3', async () => {
  const { ctx, page } = await open(browser);
  await live(page);
  const box = await page.locator(stageSel('petoskey')).boundingBox();
  await brush(page, box, { down: true });
  await page.locator('label.chip', { hasText: 'Lake Superior agate' }).click();
  const vis = await page.evaluate(() => Array.from(document.querySelectorAll('.specimen')).filter((n) => n.offsetParent !== null).map((n) => n.dataset.specimen));
  check('picker: only the picked stone is shown', vis.join() === 'agate', vis);
  const up = await live(page, 'agate');
  await page.locator('[data-specimen="agate"] [data-wl-dry]').evaluate((img) => img.decode());
  await until(page, 'agate', () => page.requests.some((r) => /agate-hero-wet/.test(r.url)), 3000);
  const urls = page.requests.map((r) => r.url);
  check('picker: the picked stone loads its pair and goes live', up.ok && urls.includes('/img/stones/agate-hero-dry.webp') && urls.includes('/img/stones/agate-hero-wet.webp'), urls);
  check('picker: unpicked stones still fetch nothing', !urls.some((u) => /jasper|leland/.test(u)));
  await page.click(dunkSel('agate'));
  const wet = await until(page, 'agate', (x) => x.cov >= 0.99, 4000);
  const r = await rule1(page, 'agate');
  check('second stone works the same (dunk, rule 1)', wet.ok && r.worst <= 3 && r.outside === 0, { wet: wet.info, r });
  const hidden = await until(page, 'petoskey', (x) => x.running !== null, 500);
  check('a hidden stone stops working (its water waits, no clock task)', hidden.info.state === 'damp', hidden.info);
  await ctx.close();
});

/* ================= 4. phone: touch, scrolling, and off screen ================= */
await section('4', async () => {
  const { ctx, page } = await open(browser, { ...devices['iPhone 13'] });
  await live(page);
  await wait(300);
  const vh = await page.evaluate(() => window.innerHeight);
  let box = await page.locator(stageSel('petoskey')).boundingBox();
  const btn = await page.locator(dunkSel('petoskey')).boundingBox();
  check('phone first view: the whole stone and its button are on screen', box.y >= 0 && btn.y + btn.height <= vh, { stageBottom: box.y + box.height, buttonBottom: btn.y + btn.height, vh });
  check('phone: button is at least 44 px tall', btn.height >= 44, btn.height);
  const ta = await page.locator(stageSel('petoskey')).evaluate((n) => getComputedStyle(n).touchAction);
  check('phone: the stone allows up and down scrolling and pinch zoom', /pan-y/.test(ta) && /pinch-zoom/.test(ta), ta);
  await page.evaluate(() => {
    window.__blocked = 0;
    ['touchstart', 'touchmove', 'pointerdown', 'pointermove'].forEach((t) => window.addEventListener(t, (e) => { if (e.defaultPrevented) window.__blocked++; }));
  });
  await shot(page, 'phone-1-dry');
  const t = await touch(ctx, page);

  /* tap */
  await t.start(box.x + box.width * 0.5, box.y + box.height * 0.5);
  await wait(40);
  await t.end();
  await wait(200);
  let i = await info(page);
  check('tap: leaves a wet fingerprint', i.cov > 0.004 && i.cov < 0.1 && i.state === 'damp', i.cov);
  const tapCov = i.cov;
  await shot(page, 'phone-2-tap');

  /* sideways rub */
  const y0 = await page.evaluate(() => window.scrollY);
  await rub(t, box);
  await wait(200);
  i = await info(page);
  const sc = await page.evaluate(() => [window.scrollX, window.scrollY]);
  check('sideways rub: leaves a streak', i.cov > tapCov * 2, [tapCov, i.cov]);
  check('sideways rub: the page does not move', sc[0] === 0 && sc[1] === y0, sc);
  let r = await rule1(page, 'petoskey', [[0.5, 0.45], [0.5, 0.9]]);
  check('rule 1 (touch): solid pixels equal the wet image, and only on the streak', r.worst <= 3 && r.outside === 0 && r.alpha[1] === 0, r);
  await shot(page, 'phone-3-rub');

  /* up and down swipe that starts on the stone */
  await t.start(box.x + box.width * 0.5, box.y + box.height * 0.7);
  for (let k = 1; k <= 10; k++) { await t.move(box.x + box.width * 0.5, box.y + box.height * 0.7 - k * 24); await wait(16); }
  await t.end();
  await wait(500);
  const y1 = await page.evaluate(() => window.scrollY);
  check('up and down swipe on the stone scrolls the page', y1 > y0 + 100, [y0, y1]);
  check('no listener ever blocked scrolling', (await page.evaluate(() => window.__blocked)) === 0);

  /* nothing stuck after the scroll took the gesture away */
  await page.evaluate(() => window.scrollTo(0, 0));
  await wait(300);
  box = await page.locator(stageSel('petoskey')).boundingBox();
  const before = (await info(page)).cov;
  await rub(t, box, { y: 0.72, wobble: 0 });
  await wait(200);
  i = await info(page);
  check('after a scroll, the next rub still works', i.cov > before, [before, i.cov]);

  /* off screen: the clock stops and the water waits */
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await wait(700);
  const o1 = await info(page);
  await wait(900);
  const o2 = await info(page);
  check('off screen: the frame clock stops and the water waits', o2.frames === o1.frames && o2.cov > 0, [o1, o2]);
  await page.evaluate(() => window.scrollTo(0, 0));
  await wait(500);
  const o3 = await info(page);
  check('back on screen: drying picks up again', o3.running === true && o3.frames > o2.frames, o3);

  /* dunk by tap */
  box = await page.locator(dunkSel('petoskey')).boundingBox();
  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
  const wet = await until(page, 'petoskey', (x) => x.cov >= 0.99 && x.running === false, 4000);
  check('phone: tapping Dunk it wets the whole stone', wet.ok, wet.info);
  await shot(page, 'phone-5-dunked');
  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
  const off = await until(page, 'petoskey', (x) => x.state === 'dry', 8000);
  check('phone: tapping Dry it off dries it', off.ok, off.info);

  /* dry and off screen: memory handed back */
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const freed = await until(page, 'petoskey', (x) => !x.canvas && !x.grid, 3000);
  check('dry and off screen: canvas and water grid are released', freed.ok, freed.info);
  check('no script errors (phone run)', quiet(page).length === 0, page.errors);

  /* captures: drying, and the two moving moments slowed for a still frame */
  await page.evaluate(() => window.scrollTo(0, 0));
  await wait(500);
  box = await page.locator(stageSel('petoskey')).boundingBox();
  await rub(t, box);
  await wait(8500);
  await shot(page, 'phone-4-drying');
  await page.evaluate((sel) => { document.querySelector(sel).water.t.rise = 4; }, host('petoskey'));
  const b2 = await page.locator(dunkSel('petoskey')).boundingBox();
  await page.touchscreen.tap(b2.x + b2.width / 2, b2.y + b2.height / 2);
  await wait(1100);
  await shot(page, 'phone-6-waterline-rising');
  await ctx.close();
});

/* ================= 5. fallbacks ================= */
await section('5', async () => {
  /* 5a. no JavaScript */
  for (const [name, opts] of [['desktop', { deviceScaleFactor: 2 }], ['phone', { ...devices['iPhone 13'] }]]) {
    const { ctx, page } = await open(browser, { ...opts, javaScriptEnabled: false });
    const stills = page.locator('[data-specimen="petoskey"] .wl-view .wl-stage');
    const n = await stills.count();
    const a = n === 2 ? await stills.nth(0).boundingBox() : null;
    const b = n === 2 ? await stills.nth(1).boundingBox() : null;
    check(`no JavaScript (${name}): dry and wet stills sit side by side`, n === 2 && a && b && b.x > a.x + a.width - 1 && Math.abs(a.y - b.y) < 2, { n, a, b });
    const caps = await page.locator('[data-specimen="petoskey"] .wl-cap').allInnerTexts();
    check(`no JavaScript (${name}): stills are captioned Dry and Wet`, caps.join() === 'Dry,Wet', caps);
    check(`no JavaScript (${name}): the button and hint are not shown`, !(await page.locator(dunkSel('petoskey')).isVisible()) && !(await page.locator(stageSel('petoskey') + ' .wl-hint').isVisible()));
    await page.waitForLoadState('networkidle');
    await shot(page, `${name}-8-no-javascript`);
    if (name === 'desktop') {
      await page.locator('label.chip', { hasText: 'Red jasper' }).click();
      check('no JavaScript: the stone picker still works', await page.locator('[data-specimen="jasper"]').isVisible() && !(await page.locator('[data-specimen="petoskey"]').isVisible()));
    }
    await ctx.close();
  }
});
await section('5', async () => {
  /* 5b. reduced motion: the still version */
  for (const [name, opts] of [['desktop', { deviceScaleFactor: 2 }], ['phone', { ...devices['iPhone 13'] }]]) {
    const { ctx, page } = await open(browser, { ...opts, reducedMotion: 'reduce' });
    await wait(1500);
    let i = await info(page);
    const urls = page.requests.map((r) => r.url);
    check(`reduced motion (${name}): effect code is never fetched`, !urls.some((u) => /water\.js|core\.js/.test(u)) && !i.live, urls);
    check(`reduced motion (${name}): no hint, since there is nothing to rub`, !(await page.locator(stageSel('petoskey') + ' .wl-hint').isVisible()));
    await page.click(dunkSel('petoskey'));
    await wait(120);
    i = await info(page);
    check(`reduced motion (${name}): the button shows the whole wet stone at once`, i.state === 'wet' && i.wetOpacity === '1' && i.label === 'Dry it off' && /Wet all over/.test(i.status), i);
    await page.locator('[data-specimen="petoskey"] [data-wl-wet]').evaluate((img) => img.decode());
    await shot(page, `${name}-7-reduced-motion-wet`);
    if (name === 'desktop' && looks.liveWet) {
      /* what the eye sees: the effect's fully wet stone against the approved wet still */
      const wetDiff = await compareShots(browser, looks.liveWet, await page.locator(stageSel('petoskey')).screenshot());
      check('dunked effect looks the same as the approved wet still (average difference under 1 of 255 levels)', wetDiff.sameSize && wetDiff.mean < 1, wetDiff);
      note(`dunked effect against the wet still: average difference ${wetDiff.mean} of 255, largest ${wetDiff.max}, share of pixels differing by more than 16 levels ${(wetDiff.sharePast16 * 100).toFixed(3)}%`);
      await page.click(stageSel('petoskey'));
      await wait(150);
      const dryDiff = await compareShots(browser, looks.liveDry, await page.locator(stageSel('petoskey')).screenshot());
      check('after drying, the stone is pixel for pixel the approved dry still again (no residue)', dryDiff.sameSize && dryDiff.max <= 2, dryDiff);
      await page.click(stageSel('petoskey'));
      await wait(150);
    }
    await page.click(stageSel('petoskey'));
    await wait(120);
    i = await info(page);
    check(`reduced motion (${name}): a tap on the stone swaps it back to dry`, i.state === 'dry' && i.wetOpacity === '0' && i.label === 'Dunk it', i);
    check(`reduced motion (${name}): no animation clock exists`, i.frames === null);
    check(`reduced motion (${name}): no script errors`, quiet(page).length === 0, page.errors);
    await ctx.close();
  }
});
await section('5', async () => {
  /* 5c. effect file cannot load: stay on the simple swap */
  const { ctx, page } = await open(browser, {}, '/index.html', (p) => p.route('**/assets/water.js', (r) => r.abort()));
  await wait(1500);
  let i = await info(page);
  check('effect file blocked: the page stays on the simple swap', !i.live && i.state === 'dry', i);
  await page.click(dunkSel('petoskey'));
  await wait(150);
  i = await info(page);
  check('effect file blocked: the button still wets the stone', i.state === 'wet' && i.wetOpacity === '1', i);
  check('effect file blocked: no script errors', quiet(page).length === 0, page.errors);
  await ctx.close();
});
await section('5', async () => {
  /* 5d. wet image missing */
  const { ctx, page } = await open(browser, {}, '/index.html', (p) => p.route('**/petoskey-wet.webp', (r) => r.abort()));
  const failed = await until(page, 'petoskey', (x) => x.failed, 5000);
  check('wet image missing: the stone is marked and says so', failed.ok && /did not load/.test(failed.info.status), failed.info);
  check('wet image missing: the button is hidden and the dry stone still shows',
    !(await page.locator(dunkSel('petoskey')).isVisible()) && await page.locator('[data-specimen="petoskey"] [data-wl-dry]').evaluate((img) => img.naturalWidth > 0 && img.offsetParent !== null));
  const box = await page.locator(stageSel('petoskey')).boundingBox();
  await brush(page, box, { down: true });
  await wait(200);
  const i = await info(page);
  check('wet image missing: rubbing does nothing and nothing breaks', !i.canvas && quiet(page).length === 0, { i, errors: page.errors });
  await ctx.close();
});
await section('5', async () => {
  /* 5e. the motion setting changes while the page is open */
  const { ctx, page } = await open(browser);
  await live(page);
  const box = await page.locator(stageSel('petoskey')).boundingBox();
  await brush(page, box, { down: true });
  await wait(150);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const off = await until(page, 'petoskey', (x) => !x.live, 3000);
  check('motion turned off mid-visit: the effect steps aside and the stone rests dry', off.ok && off.info.state === 'dry' && !off.info.canvas, off.info);
  await page.click(dunkSel('petoskey'));
  await wait(120);
  let i = await info(page);
  check('motion turned off mid-visit: the simple swap takes over', i.state === 'wet' && i.wetOpacity === '1', i);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const on = await until(page, 'petoskey', (x) => x.live && x.cov >= 0.99, 4000);
  check('motion turned back on: the effect returns and keeps the stone wet', on.ok && on.info.label === 'Dry it off', on.info);
  check('motion switch: no script errors', quiet(page).length === 0, page.errors);
  await ctx.close();
});
await section('5', async () => {
  /* 5f. someone presses the button before the effect code arrives */
  const { ctx, page } = await open(browser, {}, '/index.html', (p) => p.route('**/assets/water.js', async (r) => { await wait(1800); await r.continue(); }));
  await page.click(dunkSel('petoskey'));
  await wait(150);
  let i = await info(page);
  check('early press: the simple swap answers at once', !i.live && i.state === 'wet' && i.wetOpacity === '1', i);
  const up = await until(page, 'petoskey', (x) => x.live && x.cov >= 0.99, 6000);
  check('early press: the effect arrives later and keeps the stone wet', up.ok && up.info.state === 'wet' && up.info.label === 'Dry it off', up.info);
  await ctx.close();
});

/* ================= 6. layouts, both color settings, and contrast ================= */
await section('6', async () => {
  const sizes = [
    ['320', { viewport: { width: 320, height: 640 } }],
    ['375', { viewport: { width: 375, height: 667 } }],
    ['phone-390', { ...devices['iPhone 13'] }],
    ['phone-landscape-844', { ...devices['iPhone 13 landscape'] }],
    ['tablet-768', { viewport: { width: 768, height: 1024 } }],
    ['tablet-1024', { viewport: { width: 1024, height: 768 } }],
    ['desktop-1440', { viewport: { width: 1440, height: 900 } }],
    ['zoom-200-of-1280', { viewport: { width: 640, height: 450 }, deviceScaleFactor: 2 }],
  ];
  for (const [name, opts] of sizes) {
    const { ctx, page } = await open(browser, opts);
    await live(page);
    const m = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth,
      wide: Array.from(document.querySelectorAll('body *')).filter((n) => n.getBoundingClientRect().right > document.documentElement.clientWidth + 1 && n.offsetParent !== null).length,
      small: Array.from(document.querySelectorAll('p, li, dd, dt, span, button, legend, h1, h2, h3')).filter((n) => n.offsetParent !== null && n.textContent.trim() && parseFloat(getComputedStyle(n).fontSize) < 13).length,
    }));
    check(`layout ${name}: no sideways scrolling and nothing sticks out`, m.sw <= m.cw && m.wide === 0, m);
    check(`layout ${name}: no text under 13 px`, m.small === 0, m.small);
    if (name === 'phone-landscape-844' || name === 'tablet-768') await shot(page, `layout-${name}`);
    await ctx.close();
  }
  const seen = {};
  for (const scheme of ['light', 'dark']) {
    const { ctx, page } = await open(browser, { colorScheme: scheme, ...devices['iPhone 13'] });
    await live(page);
    seen[scheme] = await page.evaluate(() => {
      const lum = (c) => { const v = c.match(/[\d.]+/g).slice(0, 3).map((n) => { n /= 255; return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4); }); return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
      const bgOf = (n) => { while (n) { const b = getComputedStyle(n).backgroundColor; if (b && !/rgba\(0, 0, 0, 0\)|transparent/.test(b)) return b; n = n.parentElement; } return 'rgb(255, 255, 255)'; };
      const sel = ['.top p', '.top__tag', '.px', 'h1', '.lede', '.win__bar', '.wl-status', '.wl-btn', '.card h3', '.card dt', '.card dd', '.card__label', '.chip input:checked + span', '.chip input:not(:checked) + span', '.picker legend', '.note h2', '.note li', '.note p', '.plain-btn', '.foot'];
      const low = [];
      sel.forEach((s) => { const n = document.querySelector(s); if (!n) { low.push(s + ' missing'); return; } const a = lum(getComputedStyle(n).color), b = lum(bgOf(n)); const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05); if (ratio < 4.5) low.push(s + ' ' + ratio.toFixed(2)); });
      return { body: getComputedStyle(document.body).backgroundColor, text: getComputedStyle(document.body).color, low };
    });
    check(`${scheme} system setting: text contrast is at least 4.5 to 1 everywhere checked`, seen[scheme].low.length === 0, seen[scheme].low);
    await shot(page, `phone-${scheme}-setting`);
    await ctx.close();
  }
  check('light and dark system settings give the same readable dark page', seen.light.body === seen.dark.body && seen.light.text === seen.dark.text && seen.dark.body === 'rgb(16, 29, 44)', seen);
});

/* ================= 7. speed (emulated iPhone 13, with the CPU slowed 4x) ================= */
async function measure(label, opts, rate) {
  const { ctx, page } = await open(browser, opts, '/index.html', (p) => p.addInitScript(() => {
    window.__perf = { long: [], cls: 0 };
    try { new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__perf.long.push([Math.round(e.startTime), Math.round(e.duration)]))).observe({ type: 'longtask', buffered: true }); } catch (e) { /* not supported */ }
    try { new PerformanceObserver((l) => l.getEntries().forEach((e) => { window.__perf.cls += e.value;   /* count every shift, even ones a touch caused */ })).observe({ type: 'layout-shift', buffered: true }); } catch (e) { /* not supported */ }
  }));
  const t = await touch(ctx, page);
  if (rate > 1) await t.cdp.send('Emulation.setCPUThrottlingRate', { rate });
  await live(page);
  await wait(600);
  const out = { cpuSlowdown: rate, phases: {} };
  const begin = () => page.evaluate((sel) => {
    const st = document.querySelector(sel).stats;
    st.total = 0; st.frames = 0; st.peak = 0;
    window.__gaps = []; window.__sampling = true;
    let last = 0;
    const loop = (now) => { if (last) window.__gaps.push(now - last); last = now; if (window.__sampling) requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }, host('petoskey'));
  const finish = (name) => page.evaluate(([sel, name]) => {
    window.__sampling = false;
    const st = document.querySelector(sel).stats;
    const g = window.__gaps.slice().sort((a, b) => a - b);
    const at = (q) => (g.length ? +g[Math.min(g.length - 1, Math.floor(g.length * q))].toFixed(1) : 0);
    return {
      name,
      effectFrames: st.frames,
      workPerFrameMs: st.frames ? +(st.total / st.frames).toFixed(2) : 0,
      worstFrameWorkMs: +st.peak.toFixed(2),
      frameGapMedianMs: at(0.5),
      frameGap95Ms: at(0.95),
      framesOver25Ms: g.filter((x) => x > 25).length,
      framesSeen: g.length,
    };
  }, [host('petoskey'), name]);
  const box = await page.locator(stageSel('petoskey')).boundingBox();
  const marks = [];
  const mark = async (name) => marks.push([name, await page.evaluate(() => performance.now())]);
  await mark('rubbing');

  await begin();                                  /* four seconds of continuous rubbing */
  await t.start(box.x + box.width * 0.3, box.y + box.height * 0.5);
  const t0 = Date.now();
  let k = 0;
  while (Date.now() - t0 < 4000) {
    k++;
    const s = (Date.now() - t0) / 1000;
    const level = k < 8;
    await t.move(box.x + box.width * (level ? 0.3 + k * 0.012 : 0.5 + 0.3 * Math.sin(1.9 * s)), box.y + box.height * (level ? 0.5 : 0.5 + 0.24 * Math.sin(2.7 * s + 1)));
    await wait(12);
  }
  await t.end();
  out.phases.rubbing = await finish('rubbing');
  out.coverageAfterRub = (await info(page)).cov;

  await mark('drying');
  await begin();                                  /* slow drying */
  await wait(4000);
  out.phases.drying = await finish('drying');

  await mark('dunk');
  await begin();                                  /* dunk */
  await page.locator(dunkSel('petoskey')).evaluate((b) => b.click());
  await wait(1300);
  out.phases.dunk = await finish('dunk');

  await mark('heldWet');
  const f0 = (await info(page)).frames;           /* held wet */
  await wait(1500);
  out.heldWetFrames = (await info(page)).frames - f0;

  await mark('dryingOff');
  await begin();                                  /* dry it off. No polling here: the test must not add work of its own. */
  await page.locator(dunkSel('petoskey')).evaluate((b) => b.click());
  await wait(4500);
  out.phases.dryingOff = await finish('dryingOff');
  out.dryAfterDryingOff = (await info(page)).state === 'dry';

  await mark('dryAgain');
  const f1 = (await info(page)).frames;           /* dry again */
  await wait(1500);
  out.dryFrames = (await info(page)).frames - f1;

  const extra = await page.evaluate(([sel, marks]) => {
    const nav = performance.getEntriesByType('navigation')[0];
    const c = document.querySelector(sel + ' canvas');
    const long = window.__perf.long;
    const firstTouchAt = marks[0][1];
    const phaseOf = (at) => { let name = marks[0][0]; for (const [n, t] of marks) if (at >= t) name = n; return name; };
    return {
      /* tasks over 50 ms, by when they happened */
      slowTasksWhilePageLoads: long.filter(([at]) => at < nav.loadEventEnd).map(([, ms]) => ms),
      slowTasksGettingReady: long.filter(([at]) => at >= nav.loadEventEnd && at < firstTouchAt).map(([, ms]) => ms),
      slowTasksFromFirstTouch: long.filter(([at]) => at >= firstTouchAt).map(([at, ms]) => phaseOf(at) + ' ' + ms + ' ms'),
      layoutShift: +window.__perf.cls.toFixed(4),
      domReadyMs: Math.round(nav.domContentLoadedEventEnd),
      loadMs: Math.round(nav.loadEventEnd),
      canvas: c ? c.width + ' x ' + c.height : 'none',
      dpr: window.devicePixelRatio,
    };
  }, [host('petoskey'), marks]);
  Object.assign(out, extra);
  perf.phases[label] = out;
  await ctx.close();
  return out;
}
await section('7', async () => {
  const slow = await measure('iphone13-emulated-cpu-4x-slower', { ...devices['iPhone 13'] }, 4);
  const fast = await measure('iphone13-emulated-full-speed', { ...devices['iPhone 13'] }, 1);
  const desk = await measure('desktop-1440-full-speed', { viewport: { width: 1440, height: 900 }, hasTouch: true }, 1);
  for (const [label, m] of [['CPU slowed 4x', slow], ['full speed', fast], ['desktop', desk]]) {
    for (const p of Object.values(m.phases)) {
      note(`speed (${label}) ${p.name}: ${p.workPerFrameMs} ms of work per frame on average, ${p.worstFrameWorkMs} ms worst, over ${p.effectFrames} frames. Frame gap ${p.frameGapMedianMs} ms median, ${p.frameGap95Ms} ms at the 95th percentile.`);
    }
    note(`speed (${label}): tasks over 50 ms from the first touch on ${JSON.stringify(m.slowTasksFromFirstTouch)}, while getting ready at idle ${JSON.stringify(m.slowTasksGettingReady)}, while the page itself loads ${JSON.stringify(m.slowTasksWhilePageLoads)}. Layout shift ${m.layoutShift}, canvas ${m.canvas}, frames while held wet ${m.heldWetFrames}, frames while dry ${m.dryFrames}`);
  }
  check('speed: rubbing really wet the stone during the measurement, and drying off finished', slow.coverageAfterRub > 0.15 && slow.dryAfterDryingOff, [slow.coverageAfterRub, slow.dryAfterDryingOff]);
  check('speed target: average work per frame under 4 ms with the CPU slowed 4x (every phase)', Object.values(slow.phases).every((p) => p.workPerFrameMs < 4), Object.values(slow.phases).map((p) => [p.name, p.workPerFrameMs]));
  check('speed target: no task over 50 ms from the first touch on, with the CPU slowed 4x', slow.slowTasksFromFirstTouch.length === 0, slow.slowTasksFromFirstTouch);
  check('getting ready at idle never blocks for long (no task over 100 ms, CPU slowed 4x)', slow.slowTasksGettingReady.every((ms) => ms <= 100), slow.slowTasksGettingReady);
  check('speed target: zero frames of work while held wet and while dry', slow.heldWetFrames === 0 && slow.dryFrames === 0, [slow.heldWetFrames, slow.dryFrames]);
  check('speed target: no layout shift', slow.layoutShift === 0 && fast.layoutShift === 0, [slow.layoutShift, fast.layoutShift]);
  check('canvas detail is capped at 2x, even on a 3x phone screen', fast.dpr === 3 && fast.canvas !== 'none' && parseInt(fast.canvas, 10) <= 2 * 390, [fast.dpr, fast.canvas]);
});

/* ================= 8. full-page captures ================= */
await section('8', async () => {
  for (const [name, opts] of [['desktop-9-full-page', { deviceScaleFactor: 2 }], ['phone-9-full-page', { ...devices['iPhone 13'] }]]) {
    const { ctx, page } = await open(browser, opts);
    await live(page);
    const box = await page.locator(stageSel('petoskey')).boundingBox();
    if (name.startsWith('desktop')) await brush(page, box, { down: true });
    else { const t = await touch(ctx, page); await rub(t, box); }
    await wait(250);
    await shot(page, name, { fullPage: true });
    await ctx.close();
  }
});

await browser.close();
server.close();

/* ---------- report ---------- */
const head = [
  'Waterline proof of concept: automated checks',
  'Run: ' + new Date().toISOString(),
  'Browser: Playwright Chromium (headless), with phone and touch EMULATION.',
  'Not tested here: a real iPhone, a real iPad, or Safari.',
  `${pass} passed, ${fail} failed`,
  '',
];
fs.writeFileSync(path.join(DIR, 'last-run.txt'), head.concat(lines).join('\n') + '\n');
fs.writeFileSync(path.join(DIR, 'perf.json'), JSON.stringify(perf, null, 2) + '\n');
console.log(head.concat(lines.filter((l) => !l.startsWith('PASS'))).join('\n'));
process.exit(fail ? 1 : 0);
