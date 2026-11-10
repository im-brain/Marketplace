/* Waterline core. Shared by every effect. No dependencies.

   clock        one requestAnimationFrame loop for the whole page. It stops
                when nothing is busy, so a dry page does no work.
   watch        one IntersectionObserver for the whole page.
   readPointer  turns mouse, finger, and pen into the same samples.
   HPStage      base element. Owns canvas layers, sizing, lazy images, and
                cleanup. Effects plug into it.

   An effect is an object with these hooks:
     setup(stage)   called once when the stage goes live
     input(sample)  a pointer sample: x and y from 0 to 1, pressure, type, down, first
     step(dt)       advance by dt seconds. Return true while there is more to do.
     draw()         paint, only if something changed
     still()        leave the designed still state (reduced motion)
     teardown()     free everything
   Optional: end() when a stroke ends, resize(), sleep() when off screen,
   and warm() when the stage comes near the screen. */

export const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const MAX_DPR = 2;

/* ---------- clock ---------- */
const tasks = new Set();
let raf = 0;
let last = 0;

function frame(now) {
  raf = 0;
  const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
  last = now;
  clock.frames++;
  tasks.forEach((task) => { if (task(dt) === false) tasks.delete(task); });
  if (tasks.size) raf = requestAnimationFrame(frame);
}

export const clock = {
  frames: 0,
  get running() { return raf !== 0; },
  add(task) {
    tasks.add(task);
    if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
  },
  remove(task) { tasks.delete(task); },
};

/* ---------- visibility ---------- */
const seen = new WeakMap();
const watcher = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    const cb = seen.get(entry.target);
    if (cb) cb(entry.isIntersecting);
  }
}, { rootMargin: '100px 0px' });

export function watch(el, cb) {
  seen.set(el, cb);
  watcher.observe(el);
  return () => { watcher.unobserve(el); seen.delete(el); };
}

/* ---------- pointer ---------- */
/* One stroke at a time. A second finger is a pinch, not water.
   Every listener is passive: this code can never block scrolling. */
export function readPointer(el, onSample, onEnd) {
  const s = { x: 0, y: 0, w: 1, h: 1, pressure: 0, type: 'mouse', down: false, first: false };
  let id = null;
  const send = (e, first) => {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    s.x = (e.clientX - r.left) / r.width;
    s.y = (e.clientY - r.top) / r.height;
    s.w = r.width;
    s.h = r.height;
    s.type = e.pointerType || 'mouse';
    s.down = s.type === 'touch' || e.buttons > 0;
    s.pressure = e.pressure > 0 ? e.pressure : (s.down ? 0.5 : 0);
    s.first = first;
    onSample(s);
  };
  const down = (e) => {
    if (id !== null && e.pointerId !== id) return;
    const first = id === null;
    id = e.pointerId;
    send(e, first);
  };
  const move = (e) => {
    if (id === null) {
      if (e.pointerType === 'touch') return;   /* a finger only counts between down and up */
      id = e.pointerId;
      send(e, true);
    } else if (e.pointerId === id) {
      send(e, false);
    }
  };
  const end = (e) => { if (e.pointerId === id) { id = null; onEnd(); } };
  const up = (e) => { if (e.pointerType === 'touch') end(e); };  /* a mouse keeps hovering */
  const opts = { passive: true };
  const on = [['pointerdown', down], ['pointermove', move], ['pointerup', up], ['pointercancel', end], ['pointerleave', end]];
  on.forEach(([type, fn]) => el.addEventListener(type, fn, opts));
  return () => on.forEach(([type, fn]) => el.removeEventListener(type, fn, opts));
}

/* Read a timing or size token from CSS. "700ms" and "0.7s" both give 0.7. */
export function token(el, name, fallback) {
  const raw = getComputedStyle(el).getPropertyValue(name).trim();
  const n = parseFloat(raw);
  if (!raw || isNaN(n)) return fallback;
  return /ms$/.test(raw) ? n / 1000 : n;
}

/* ---------- stage ---------- */
export class HPStage extends HTMLElement {
  constructor() {
    super();
    this.effects = [];
    this.visible = false;
    this.stats = { work: 0, peak: 0, total: 0, frames: 0 };
    this._layers = {};
    this._tick = this._tick.bind(this);
    this._motion = () => {
      if (reduced.matches) {
        if (this._on) this.effects.forEach((e) => e.still());
        this._stop();
      } else {
        this._start();
      }
    };
  }

  connectedCallback() {
    reduced.addEventListener('change', this._motion);
    /* A stage goes live only once it is near the screen. A hidden stone
       stays asleep: no listeners, no images, no memory. */
    this._unwatch = watch(this, (visible) => {
      this.visible = visible;
      if (!visible) { this.effects.forEach((e) => this._on && e.sleep && e.sleep()); return; }
      this._start();
      this.effects.forEach((e) => this._on && e.warm && e.warm());
      if (this._paused) { this._paused = false; this.wake(); }   /* pick up where it stopped */
    });
  }

  disconnectedCallback() {
    reduced.removeEventListener('change', this._motion);
    if (this._unwatch) this._unwatch();
    this._stop();
  }

  _start() {
    if (this._on || !this.visible || !this.isConnected || reduced.matches) return;
    this.stage = this.querySelector('[data-wl-stage]');
    if (!this.stage) return;
    this._on = true;
    this.setAttribute('live', '');
    this._unread = readPointer(this.stage,
      (s) => this.effects.forEach((e) => e.input(s)),
      () => this.effects.forEach((e) => e.end && e.end()));
    this._sizer = new ResizeObserver(() => {
      let any = false;
      for (const name in this._layers) { this._fit(this._layers[name]); any = true; }
      if (!any) return;                       /* nothing drawn yet, so nothing to redraw */
      this.effects.forEach((e) => e.resize && e.resize());
      this.wake();
    });
    this._sizer.observe(this.stage);
    this.effects.forEach((e) => e.setup(this));
  }

  _stop() {
    if (!this._on) return;
    this._on = false;
    clock.remove(this._tick);
    this._unread();
    this._sizer.disconnect();
    this.effects.forEach((e) => e.teardown());
    for (const name in this._layers) this.release(name);
    this.removeAttribute('live');
  }

  /* Effects call this when they have work. The clock stops by itself. */
  wake() { if (this._on && this.visible) clock.add(this._tick); }

  _tick(dt) {
    if (!this._on) return false;
    if (!this.visible) { this._paused = true; return false; }   /* off screen: wait, do no work */
    const t0 = performance.now();
    let busy = false;
    for (const e of this.effects) busy = e.step(dt) || busy;
    for (const e of this.effects) e.draw();
    const work = performance.now() - t0;
    const st = this.stats;
    st.frames++;
    st.total += work;
    st.work += (work - st.work) * 0.1;
    if (work > st.peak) st.peak = work;
    return busy;
  }

  hasLayer(name) { return !!this._layers[name]; }

  /* A canvas layer over the stage, made the first time an effect asks for it. */
  layer(name) {
    let c = this._layers[name];
    if (!c) {
      c = document.createElement('canvas');
      c.className = 'wl-layer';
      c.setAttribute('aria-hidden', 'true');
      c.dataset.layer = name;
      this.stage.appendChild(c);
      this._layers[name] = c;
      this._fit(c);
    }
    return c;
  }

  release(name) {
    const c = this._layers[name];
    if (!c) return;
    c.width = c.height = 0;   /* hand the memory back right away */
    c.remove();
    delete this._layers[name];
  }

  _fit(c) {
    const r = this.stage.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const w = Math.max(1, Math.round(r.width * dpr));
    const h = Math.max(1, Math.round(r.height * dpr));
    if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
  }

  /* Load and decode an image that waits on data-src. Rejects if it cannot load. */
  ready(img) {
    if (!img.getAttribute('src') && img.dataset.src) img.src = img.dataset.src;
    if (img.decode) return img.decode().then(() => img);
    return new Promise((resolve, reject) => {
      if (img.complete && img.naturalWidth) resolve(img);
      else { img.addEventListener('load', () => resolve(img), { once: true }); img.addEventListener('error', reject, { once: true }); }
    });
  }
}

window.Waterline = window.Waterline || {};
window.Waterline.clock = clock;
