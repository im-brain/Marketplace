/* Waterline starter. The only Waterline script that runs at page load.

   1. Baseline: a tap on the stone or its button swaps the whole stone
      between the approved dry and wet images. This works with no effect
      code at all, and it is the still version under reduced motion.
   2. Lazy loading: an effect file (and the wet image) is fetched only when
      its stone is near the screen or someone reaches for it.

   Plain old JavaScript on purpose, so the baseline works in old browsers. */
(function () {
  'use strict';
  var doc = document;
  var W = window.Waterline = window.Waterline || {};
  var SAY = {
    dry: 'Dry.',
    damp: 'Wet where you touched it. It will dry.',
    wet: 'Wet all over until you dry it off.',
    drying: 'Drying off.',
    failed: 'The wet picture did not load, so this stone stays dry.'
  };

  function hostOf(node) { return node && node.closest ? node.closest('[data-waterline]') : null; }
  function part(host, name) { return host.querySelector('[data-wl-' + name + ']'); }

  /* One place for the wording, used by the baseline and by every effect. */
  W.setState = function (host, state) {
    if (host.getAttribute('data-state') === state) return;
    host.setAttribute('data-state', state);
    var btn = part(host, 'dunk'), status = part(host, 'status');
    if (btn) {
      var label = state === 'wet'
        ? (host.getAttribute('data-label-dry') || 'Dry it off')
        : (host.getAttribute('data-label-dunk') || 'Dunk it');
      if (btn.textContent !== label) btn.textContent = label;   /* only touch the page when the words change */
    }
    if (status) status.textContent = host.getAttribute('data-say-' + state) || SAY[state] || '';
  };

  W.loadWet = function (host) {
    var img = part(host, 'wet');
    if (!img || img.getAttribute('src') || !img.getAttribute('data-src')) return;
    img.addEventListener('error', function () {
      host.setAttribute('data-wet-failed', '');
      W.setState(host, 'failed');
    });
    img.src = img.getAttribute('data-src');
  };

  /* ---------- 1. baseline ---------- */
  doc.addEventListener('click', function (e) {
    var host = hostOf(e.target);
    if (!host || host.hasAttribute('live') || host.hasAttribute('data-wet-failed')) return;
    if (!e.target.closest('[data-wl-dunk]') && !e.target.closest('[data-wl-stage]')) return;
    W.loadWet(host);
    W.setState(host, host.getAttribute('data-state') === 'wet' ? 'dry' : 'wet');
  });

  /* ---------- 2. lazy loading ---------- */
  var canRun = !!(window.customElements && window.PointerEvent && window.ResizeObserver &&
    window.IntersectionObserver && 'noModule' in HTMLScriptElement.prototype &&
    doc.createElement('canvas').getContext);
  var still = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var asked = {};

  function arm(host) {
    if (host.wlArmed) return;
    host.wlArmed = true;
    W.loadWet(host);
    var src = host.getAttribute('data-effect');
    if (!src || !canRun || asked[src] || (still && still.matches)) return;
    asked[src] = true;
    var s = doc.createElement('script');
    s.type = 'module';
    s.src = src;
    s.onerror = function () { asked[src] = false; };  /* stays on the baseline */
    doc.head.appendChild(s);
  }

  /* someone reaches for the stone: load now */
  ['pointerdown', 'touchstart', 'mouseover', 'focusin'].forEach(function (type) {
    doc.addEventListener(type, function (e) {
      var host = hostOf(e.target);
      if (host) arm(host);
    }, { capture: true, passive: true });
  });

  /* the stone is near the screen: load once the page has finished and is idle */
  function whenIdle(fn) {
    var run = function () { (window.requestIdleCallback || function (f) { setTimeout(f, 200); })(fn); };
    if (doc.readyState === 'complete') run(); else window.addEventListener('load', run, { once: true });
  }
  if (window.IntersectionObserver) {
    var near = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        near.unobserve(entry.target);
        whenIdle(function () { arm(entry.target); });
      });
    }, { rootMargin: '200px 0px' });
    Array.prototype.forEach.call(doc.querySelectorAll('[data-waterline]'), function (host) { near.observe(host); });
  }
})();
