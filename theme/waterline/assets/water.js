/* Waterline water effect: <hp-wet-stone>.

   Your finger is the lake. A touch leaves water on the stone, the water
   shows the approved wet image in that spot only, and then it dries from
   its edges. "Dunk it" wets the whole stone and holds it wet.

   How it works: a small grid remembers how much water sits on each part of
   the stone. Each frame the grid becomes a see-through mask, and the wet
   image is drawn through that mask on one canvas over the dry image.
   Rule 1 holds by construction: the only pixels drawn are the wet image's. */

import { HPStage, token } from './core.js';

const GRID = 192;          /* cells across. The mask is this small, then scaled up. */
const LO = 0.16;           /* water depth where the stone starts to look wet */
const HI = 0.36;           /* depth where it looks fully wet */
const EDGE = 0.22;         /* how ragged the wet edge is */
const INV = 1 / (HI - LO);

function hash(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

function random(seed) {
  let a = seed || 1;
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Smooth noise from 0 to 1, fixed per stone, so each stone always dries the
   same patchy way. It only shapes where water lingers. It is never drawn. */
function makeGrain(w, h, seed) {
  const rnd = random(seed);
  const layer = (cell) => {
    const cw = Math.ceil(w / cell) + 2, ch = Math.ceil(h / cell) + 2;
    const v = new Float32Array(cw * ch);
    for (let i = 0; i < v.length; i++) v[i] = rnd();
    return (x, y) => {
      const fx = x / cell, fy = y / cell;
      const x0 = fx | 0, y0 = fy | 0;
      let tx = fx - x0, ty = fy - y0;
      tx = tx * tx * (3 - 2 * tx);
      ty = ty * ty * (3 - 2 * ty);
      const i = y0 * cw + x0;
      const top = v[i] + (v[i + 1] - v[i]) * tx;
      const bottom = v[i + cw] + (v[i + cw + 1] - v[i + cw]) * tx;
      return top + (bottom - top) * ty;
    };
  };
  const big = layer(24), small = layer(7);
  const g = new Float32Array(w * h);
  let lo = 1, hi = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const v = g[y * w + x] = 0.62 * big(x, y) + 0.38 * small(x, y);
      if (v < lo) lo = v;
      if (v > hi) hi = v;
    }
  }
  for (let i = 0; i < g.length; i++) g[i] = (g[i] - lo) / (hi - lo);   /* stretch to the full 0 to 1 range */
  return g;
}

class Water {
  setup(stage) {
    this.stage = stage;
    this.dryImg = stage.querySelector('[data-wl-dry]');
    this.wetImg = stage.querySelector('[data-wl-wet]');
    this.t = {
      rise: token(stage, '--wl-rise', 0.7),
      rest: token(stage, '--wl-rest', 2.5),
      dry: token(stage, '--wl-dry', 9),
      wipe: token(stage, '--wl-wipe', 2),
      finger: token(stage, '--wl-finger', 34),
      brush: token(stage, '--wl-brush', 24),
    };
    this.on = false;       /* any water on the stone? */
    this.held = false;     /* dunked: stays wet until dried off */
    this.fast = false;     /* "Dry it off" is running */
    this.rise = -1;        /* 0 to 1 while the waterline climbs, else -1 */
    this.wait = 0;         /* seconds before touch water starts to dry */
    this.acc = 0;
    this.wet = 0;          /* share of the picture that looks wet, 0 to 1 */
    this.dirty = false;
    this.loaded = false;
    this.failed = false;
    this.stroke = false;
    this.said = stage.getAttribute('data-state');
    this.tell = 0;         /* seconds until the status line catches up with a first touch */
    stage.ready(this.wetImg).then(
      () => { this.loaded = true; this.predecode(); if (this.on) { this.dirty = true; stage.wake(); } },
      () => { this.failed = true; });
    /* The baseline may have wet the stone before this file arrived. Keep it wet. */
    if (stage.getAttribute('data-state') === 'wet') {
      this.alloc();
      this.held = true;
      this.on = true;
      this.flood(1);
      this.dirty = true;
      stage.wake();
    }
  }

  /* Get ready while the page is idle, so the first touch has no hitch: build
     the water grid, make the canvas, and decode the wet image. Only stones
     near the screen do this, and sleep() gives it all back. */
  warm() {
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 60));
    const ok = () => this.stage.hasAttribute('live') && this.stage.visible && !this.failed;
    /* two short idle jobs, not one longer one */
    idle(() => {
      if (!ok()) return;
      this.alloc();
      idle(() => {
        if (!ok()) return;
        this.stage.layer('water');
        this.predecode();
      });
    });
  }

  /* Decode the wet image ahead of time, in the background, at the exact size
     it will be drawn. Every frame is then a straight copy with the same
     high-quality scaling the browser gives the dry image. The file is read
     again from the browser's cache as raw bytes, because that is the route
     browsers decode off the main thread. If any step fails, the plain image
     is drawn instead and everything still works. */
  predecode() {
    if (!this.loaded || this.decoding || !window.createImageBitmap || !window.fetch || !this.stage.hasLayer('water')) return;
    const c = this.stage.layer('water');
    const w = c.width, h = c.height;
    const size = w + 'x' + h;
    if (this.bitmapSize === size) return;
    const job = this.decoding = fetch(this.wetImg.currentSrc || this.wetImg.src)
      .then((res) => { if (!res.ok) throw new Error('wet image'); return res.blob(); })
      .then((blob) => createImageBitmap(blob, { resizeWidth: w, resizeHeight: h, resizeQuality: 'high' }).catch(() => createImageBitmap(blob)))
      .then((bitmap) => {
        if (this.decoding !== job || !this.depth) { bitmap.close(); return; }
        this.decoding = null;
        if (this.bitmap) this.bitmap.close();
        this.bitmap = bitmap;
        this.bitmapSize = size;
        if (this.on) {
          this.dirty = true;
          this.stage.wake();
        } else if (this.stage.hasLayer('water')) {
          /* Draw once and wipe, so the graphics card already holds the picture. */
          const now = this.stage.layer('water');
          const ctx = now.getContext('2d');
          ctx.globalCompositeOperation = 'source-over';
          ctx.drawImage(bitmap, 0, 0, now.width, now.height);
          ctx.clearRect(0, 0, now.width, now.height);
        }
        this.predecode();   /* the stage may have changed size while this was decoding */
      }, () => { if (this.decoding === job) this.decoding = null; });
  }

  alloc() {
    if (this.depth) return;
    const ratio = (this.dryImg && this.dryImg.height / this.dryImg.width) || 0.8;
    const w = this.w = GRID, h = this.h = Math.round(GRID * ratio);
    this.depth = new Float32Array(w * h);
    this.grain = makeGrain(w, h, hash(this.dryImg ? this.dryImg.getAttribute('src') || '' : ''));
    /* A dunked stone holds a little more water in the middle, so it dries from the outside in. */
    this.deep = new Float32Array(w * h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const dx = (x / w - 0.5) * 2, dy = (y / h - 0.5) * 2;
        this.deep[y * w + x] = 1.25 - 0.35 * Math.min(1, dx * dx + dy * dy);
      }
    }
    this.mask = document.createElement('canvas');
    this.mask.width = w;
    this.mask.height = h;
    this.mctx = this.mask.getContext('2d');
    this.pixels = this.mctx.createImageData(w, h);
  }

  free() {
    this.stage.release('water');
    if (this.bitmap) this.bitmap.close();
    this.depth = this.grain = this.deep = this.mask = this.mctx = this.pixels = this.bitmap = this.decoding = this.bitmapSize = null;
  }

  say(state) {
    this.said = state;
    const W = window.Waterline;
    if (W && W.setState) W.setState(this.stage, state);
    else this.stage.setAttribute('data-state', state);
  }

  /* One soft, round dab of water. */
  dab(cx, cy, r, amount) {
    const { w, h, depth } = this;
    const x0 = Math.max(0, Math.floor(cx - r)), x1 = Math.min(w - 1, Math.ceil(cx + r));
    const y0 = Math.max(0, Math.floor(cy - r)), y1 = Math.min(h - 1, Math.ceil(cy + r));
    const rr = r * r;
    for (let y = y0; y <= y1; y++) {
      const dy = y - cy;
      for (let x = x0; x <= x1; x++) {
        const dx = x - cx;
        const q = (dx * dx + dy * dy) / rr;
        if (q >= 1) continue;
        const v = amount * (1 - q) * (1 - q);
        const i = y * w + x;
        depth[i] = v > depth[i] ? v : Math.min(1.25, depth[i] + v * 0.05);
      }
    }
  }

  input(s) {
    if (this.failed || this.held) return;
    this.alloc();
    const x = s.x * this.w, y = s.y * this.h;
    const t = this.t;
    const px = s.type === 'touch' ? t.finger
      : s.type === 'pen' ? t.brush * (0.5 + s.pressure)
      : s.down ? t.brush * 1.3 : t.brush;
    const r = Math.max(3, px / s.w * this.w);
    const amount = s.down ? 1 : 0.8;
    if (s.first || !this.stroke) {
      this.dab(x, y, s.type === 'touch' ? r * 1.15 : r, amount);   /* a tap leaves a fingerprint */
    } else {
      const dx = x - this.lx, dy = y - this.ly;
      const n = Math.min(80, Math.max(1, Math.ceil(Math.hypot(dx, dy) / (r * 0.3))));
      for (let i = 1; i <= n; i++) this.dab(this.lx + dx * i / n, this.ly + dy * i / n, r, amount);
    }
    this.lx = x;
    this.ly = y;
    this.stroke = true;
    this.wait = t.rest;
    this.on = true;
    this.dirty = true;
    /* The water answers the touch in this frame. The words and the hint catch
       up a moment later, so they never slow the first frame down. */
    if (!this.fast && this.said !== 'damp' && this.tell <= 0) this.tell = 0.15;
    this.stage.wake();
  }

  end() { this.stroke = false; }

  /* Dunk: the waterline climbs from the bottom and the stone stays wet. */
  dunk() {
    if (this.failed) return;
    this.alloc();
    this.held = true;
    this.fast = false;
    this.on = true;
    this.rise = 0;
    this.say('wet');
    this.stage.setAttribute('data-touched', '');
    this.stage.wake();
  }

  dryOff() {
    this.held = false;
    this.rise = -1;
    this.fast = true;
    this.acc = 0;
    /* Thin the water first, so drying shows at once: the rim goes first, the middle last. */
    const { depth, deep } = this;
    for (let i = 0, n = depth.length; i < n; i++) {
      const cap = HI + (deep[i] - 0.9);
      if (depth[i] > cap) depth[i] = cap;
    }
    this.say('drying');
    this.stage.wake();
  }

  /* Fill from the bottom up to a slightly wavy line. p runs from 0 to 1. */
  flood(p) {
    const { w, h, depth, deep, grain } = this;
    const line = h * (1 - p * 1.2);
    for (let x = 0; x < w; x++) {
      const top = line + 4 * Math.sin(x * 0.085 + 1.7) + 6 * (grain[x + w * 9] - 0.5);
      for (let y = Math.max(0, Math.ceil(top)); y < h; y++) {
        const i = y * w + x;
        const v = deep[i] * Math.min(1, (y - top) / 3);
        if (v > depth[i]) depth[i] = v;
      }
    }
  }

  step(dt) {
    if (!this.on) return false;
    if (this.tell > 0) {
      this.tell -= dt;
      if (this.tell <= 0 && !this.held && !this.fast) {
        this.say('damp');
        this.stage.setAttribute('data-touched', '');
      }
    }
    if (this.rise >= 0) {
      this.rise = Math.min(1, this.rise + dt / this.t.rise);
      const p = this.rise;
      this.flood(1 - (1 - p) * (1 - p));   /* quick at first, settling at the top */
      this.dirty = true;
      if (p === 1) this.rise = -1;
      return true;
    }
    if (this.held) return false;            /* held wet: nothing to do, so the clock stops */
    if (!this.fast && this.wait > 0) { this.wait -= dt; return true; }
    /* Drying is slow, so 20 updates a second is plenty. Drying off runs every frame. */
    this.acc += dt;
    if (!this.fast && this.acc < 0.05) return true;
    const k = this.acc / (this.fast ? this.t.wipe : this.t.dry);
    this.acc = 0;
    const { depth, grain } = this;
    let top = 0;
    for (let i = 0, n = depth.length; i < n; i++) {
      const v = depth[i];
      if (v > 0) {
        const left = v - k * (0.5 + grain[i]);   /* some spots dry three times faster than others */
        depth[i] = left > 0 ? left : 0;
        if (left > top) top = left;
      }
    }
    this.dirty = true;
    if (top < LO - EDGE / 2) {              /* nothing visible is left */
      depth.fill(0);
      this.on = false;
      this.fast = false;
      this.say('dry');
      return false;
    }
    return true;
  }

  draw() {
    if (!this.dirty || !this.loaded || !this.depth) return;
    this.dirty = false;
    if (!this.on && !this.stage.hasLayer('water')) return;   /* dry and never drawn: stay empty */
    const { depth, grain, pixels } = this;
    const px = pixels.data;
    let wet = 0, any = 0;
    for (let i = 0, j = 3, n = depth.length; i < n; i++, j += 4) {
      const v = depth[i];
      let a = 0;
      if (v > 0) {
        const t = (v + (grain[i] - 0.5) * EDGE - LO) * INV;
        a = t <= 0 ? 0 : t >= 1 ? 255 : (t * t * (3 - 2 * t) * 255) | 0;
        if (a > 127) wet++;
        any |= a;
      }
      px[j] = a;
    }
    this.wet = wet / depth.length;
    const c = this.stage.layer('water');
    const ctx = c.getContext('2d');
    if (!any) { ctx.clearRect(0, 0, c.width, c.height); return; }
    this.mctx.putImageData(pixels, 0, 0);
    ctx.globalCompositeOperation = 'copy';        /* the mask, scaled up smooth */
    ctx.imageSmoothingQuality = 'low';
    ctx.drawImage(this.mask, 0, 0, c.width, c.height);
    ctx.globalCompositeOperation = 'source-in';   /* the approved wet image, only where the mask is */
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(this.bitmap || this.wetImg, 0, 0, c.width, c.height);
  }

  resize() { this.dirty = true; this.predecode(); }

  /* Off screen and dry: give the memory back. */
  sleep() { if (!this.on) this.free(); }

  /* Still version: no partial water. Wet all over if it was held, else dry. */
  still() { this.say(this.held ? 'wet' : 'dry'); }

  teardown() {
    this.free();
    this.on = this.held = this.fast = false;
    this.rise = -1;
  }
}

class HPWetStone extends HPStage {
  constructor() {
    super();
    this.water = new Water();
    this.effects.push(this.water);
    this.addEventListener('click', (e) => {
      if (!this.hasAttribute('live') || !e.target.closest('[data-wl-dunk]')) return;
      if (this.water.held) this.water.dryOff(); else this.water.dunk();
    });
  }

  /* Share of the picture that looks wet right now, from 0 to 1. */
  coverage() { return this.water.on ? this.water.wet : 0; }
}

if (!customElements.get('hp-wet-stone')) customElements.define('hp-wet-stone', HPWetStone);
