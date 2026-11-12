/* Heavy Pockets Shopify theme. Ported from the approved v3 preview (theme/v3/assets/site.js).
   No dependencies. Shopify holds the cart; this script only makes it nicer:
   the wet reveal on homepage cards, color and size keys on product pages,
   add to cart without leaving the page, and cart quantity buttons.
   Every page still works with JavaScript off (plain forms and links). */
(function () {
  'use strict';
  var html = document.documentElement;
  var MAXQ = 10;
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]; }); }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function param(name) { var m = new RegExp('[?&]' + name + '=([^&#]*)').exec(location.search); return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : null; }
  function money(cents) { var c = cents % 100 ? (cents / 100).toFixed(2) : String(cents / 100); return '$' + c; }
  function moneyFull(cents) { return '$' + (cents / 100).toFixed(2); }

  /* ---------- session storage with an in-memory fallback ---------- */
  var session = (function () {
    var mem = {}, s = null, ok = false;
    try { s = window.sessionStorage; s.setItem('hp.__t', '1'); s.removeItem('hp.__t'); ok = true; } catch (e) { ok = false; }
    return {
      get: function (k) { if (ok) { try { return s.getItem(k); } catch (e) { /* fall through */ } } return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null; },
      set: function (k, v) { if (ok) { try { s.setItem(k, v); return; } catch (e) { /* fall through */ } } mem[k] = v; },
    };
  })();

  /* ---------- cart count ---------- */
  function renderCount(n, bump) {
    $$('[data-cart-count]').forEach(function (e) { e.textContent = n; });
    $$('[data-cart-sr]').forEach(function (e) { e.textContent = ', ' + n + (n === 1 ? ' item' : ' items'); });
    if (bump) $$('[data-cart-link]').forEach(function (a) { a.classList.remove('bump'); void a.offsetWidth; a.classList.add('bump'); });
  }
  function refreshCount(bump) {
    return fetch('/cart.js', { headers: { Accept: 'application/json' }, credentials: 'same-origin' })
      .then(function (r) { return r.json(); })
      .then(function (c) { renderCount(c.item_count, bump); return c; })
      .catch(function () { return null; });
  }

  /* ---------- image loading, loader, and failure ---------- */
  function watchImg(img, well, onFail) {
    function ok() { well.classList.add('is-loaded'); }
    function bad() { well.classList.add('is-loaded'); if (onFail) onFail(); }
    well.classList.remove('is-loaded');
    if (img.complete) { if (img.naturalWidth) ok(); else if (img.getAttribute('src')) bad(); }
    img.addEventListener('load', ok, { once: true });
    img.addEventListener('error', bad, { once: true });
  }

  /* ---------- wet reveal (homepage cards only) ---------- */
  var FX = html.classList.contains('wet-fx');
  var WET_KEY = 'hp.wet';
  function wetList() { try { var a = JSON.parse(session.get(WET_KEY) || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
  function rememberWet(s) { var a = wetList(); if (a.indexOf(s) < 0) { a.push(s); session.set(WET_KEY, JSON.stringify(a)); } }
  // An irregular, splash-shaped polygon in percent units (the media box is square).
  function splash(cx, cy, r, seed) {
    var pts = [], n = 32;
    for (var i = 0; i < n; i++) {
      var t = (i / n) * Math.PI * 2;
      var k = r * (1 + 0.07 * Math.sin(t * 5 + seed) + 0.04 * Math.sin(t * 9 + seed * 2.3));
      pts.push((cx + Math.cos(t) * k).toFixed(2) + '% ' + (cy + Math.sin(t) * k).toFixed(2) + '%');
    }
    return 'polygon(' + pts.join(',') + ')';
  }
  function ripple(media, x, y) {
    var r = document.createElement('span');
    r.className = 'ripple'; r.setAttribute('aria-hidden', 'true');
    r.style.left = x + '%'; r.style.top = y + '%';
    media.appendChild(r);
    setTimeout(function () { r.remove(); }, 1050);
  }
  function reveal(card, x, y) {
    if (card.classList.contains('is-wet') || card.classList.contains('is-splashing')) return;
    rememberWet(card.getAttribute('data-product'));
    var b = $('[data-wet-btn]', card); if (b) b.setAttribute('data-state', 'wet');
    if (!FX || card.classList.contains('img-failed')) { card.classList.add('is-wet'); return; }
    var top = $('.wet__top', card), media = $('.card__media', card);
    var seed = Math.random() * 6;
    var far = Math.max(Math.hypot(x, y), Math.hypot(100 - x, y), Math.hypot(x, 100 - y), Math.hypot(100 - x, 100 - y)) * 1.15;
    top.style.transition = 'none';
    top.style.clipPath = splash(x, y, 0.5, seed);
    card.classList.add('is-splashing');
    void top.offsetWidth;
    top.style.transition = 'clip-path 1.1s cubic-bezier(.45,.05,.35,1)';
    top.style.clipPath = splash(x, y, far, seed);
    ripple(media, x, y);
    var done = false;
    function finish() {
      if (done) return; done = true;
      card.classList.add('is-wet'); card.classList.remove('is-splashing');
      top.style.transition = ''; top.style.clipPath = '';
    }
    top.addEventListener('transitionend', finish, { once: true });
    setTimeout(finish, 1300);
  }
  function pointPct(media, cx, cy) {
    var r = media.getBoundingClientRect();
    return [Math.min(100, Math.max(0, (cx - r.left) / r.width * 100)), Math.min(100, Math.max(0, (cy - r.top) / r.height * 100))];
  }
  function initCards() {
    var already = wetList();
    $$('.card[data-product]').forEach(function (card) {
      var handle = card.getAttribute('data-product');
      var url = card.getAttribute('data-url') || '';
      var images = {};
      try { images = JSON.parse(card.getAttribute('data-images') || '{}'); } catch (e) { images = {}; }
      var media = $('.card__media', card);
      var imgs = $$('[data-card-img]', card);
      var btn = $('[data-wet-btn]', card);
      if (already.indexOf(handle) > -1) { card.classList.add('is-wet'); if (btn) btn.setAttribute('data-state', 'wet'); }
      function fail() { card.classList.add('img-failed'); $('.img-fail', card).hidden = false; }
      function setColor(name) {
        var src = images[name]; if (!src) return;
        card.classList.remove('img-failed'); $('.img-fail', card).hidden = true;
        imgs.forEach(function (im) { if (im.getAttribute('src') !== src) im.src = src; });
        watchImg(imgs[0], media, fail);
        $$('[data-card-link]', card).forEach(function (a) { a.href = url + '?color=' + slug(name); });
        $('[data-color-name]', card).textContent = name;
      }
      var checked = $('input[type=radio]:checked', card); // the browser may restore a different swatch after Back
      if (checked) setColor(checked.value); else watchImg(imgs[0], media, fail);
      $$('input[type=radio]', card).forEach(function (r) { r.addEventListener('change', function () { if (r.checked) setColor(r.value); }); });
      media.addEventListener('pointerenter', function (e) {
        if (e.pointerType === 'touch') return;
        var pt = pointPct(media, e.clientX, e.clientY); reveal(card, pt[0], pt[1]);
      });
      card.addEventListener('focusin', function () { reveal(card, 18, 12); });
      // Phones: any contact with the image, including the start of a scroll. Passive, never
      // calls preventDefault, so native scrolling is untouched. A scroll never fires click.
      media.addEventListener('touchstart', function (e) {
        var t = e.touches[0]; if (!t) return;
        var pt = pointPct(media, t.clientX, t.clientY); reveal(card, pt[0], pt[1]);
      }, { passive: true });
      if (btn) btn.addEventListener('click', function () { reveal(card, 50, 50); });
    });
  }

  /* ---------- product page ---------- */
  function initProduct() {
    var root = $('.pdp[data-product]'); if (!root) return;
    var dataEl = $('[data-product-json]'); if (!dataEl) return;
    var P; try { P = JSON.parse(dataEl.textContent); } catch (e) { return; }
    var form = $('[data-buy]', root); if (!form) return;
    var select = $('[data-variant-select]', form);
    var keys = $('[data-keys]', form);
    var well = $('[data-g-well]', root), main = $('[data-g-img]', root), cap = $('[data-g-cap]', root), ph = $('[data-g-ph]', root);
    var thumbsEl = $('[data-thumbs]', root);
    var msg = $('[data-buy-msg]', root), help = $('[data-size-help]', root), note = $('[data-size-note]', root);
    var priceEl = $('[data-price]', root), qty = $('#qty', root), submit = $('button[type=submit]', form);
    var hasColor = P.colorPos >= 0, hasSize = P.sizePos >= 0;

    // The JS keys replace the plain select: one hidden input carries the variant id.
    var idInput = document.createElement('input');
    idInput.type = 'hidden'; idInput.name = 'id'; idInput.value = select ? select.value : '';
    form.appendChild(idInput);
    if (select) { select.closest('.no-js-only').remove(); }

    function colorOf(name) { for (var i = 0; i < P.colors.length; i++) if (P.colors[i].name === name) return P.colors[i]; return null; }
    function colorBySlug(s) { for (var i = 0; i < P.colors.length; i++) if (slug(P.colors[i].name) === s) return P.colors[i]; return null; }
    function variantFor(color, size) {
      for (var i = 0; i < P.variants.length; i++) {
        var v = P.variants[i];
        if ((!hasColor || v.options[P.colorPos] === color) && (!hasSize || v.options[P.sizePos] === size)) return v;
      }
      return null;
    }
    var sizeInputs = $$('input[name=hp-size]', form);
    var colorInputs = $$('input[name=hp-color]', form);

    // Larger sizes cost a little more: read the steps from the real Shopify prices.
    (function sizeLine() {
      if (!hasSize || !note) return;
      var c0 = P.colors[0] ? P.colors[0].name : null, base = null, steps = [];
      sizeInputs.forEach(function (r) { var v = variantFor(c0, r.value) || variantFor(null, r.value); if (v && (base === null || v.price < base)) base = v.price; });
      sizeInputs.forEach(function (r) { var v = variantFor(c0, r.value); if (v && v.price > base) steps.push(r.value + ' +' + money(v.price - base)); });
      if (!steps.length) { note.textContent = ''; return; }
      var list = steps.length > 2 ? steps.slice(0, -1).join(', ') + ', and ' + steps[steps.length - 1] : steps.join(' and ');
      note.textContent = 'Larger sizes cost a little more: ' + list + '.';
    })();

    // Gallery: this color's mockups in Printify order, then the design files, then a photos-soon tile.
    var arts = $$('.art-fig', root).map(function (f) {
      var im = $('img', f), capEl = $('figcaption', f);
      return { src: im.getAttribute('src'), label: (capEl ? capEl.textContent.split('.')[0] : 'Artwork'), light: f.classList.contains('art-fig--light') };
    });
    var state = { color: null, size: null, item: null };
    function viewLabel(i) { return (P.views && P.views[i]) || ('View ' + (i + 1)); }
    function buildThumbs() {
      var c = colorOf(state.color), h = '';
      var order = c ? c.images.map(function (_, i) { return i; }) : [];
      // open on the view that shows the main artwork (the back, for the back-print designs)
      if (P.cardIndex > 0 && order.length > P.cardIndex) { order.splice(P.cardIndex, 1); order.unshift(P.cardIndex); }
      order.forEach(function (i) {
        h += '<li><button type="button" class="thumb" data-view="' + i + '" aria-pressed="false" aria-label="Show ' + esc(viewLabel(i).toLowerCase()) + ' view"><img src="' + esc(c.thumbs[i] || c.images[i]) + '" alt="" width="300" height="300" loading="lazy" decoding="async"></button></li>';
      });
      arts.forEach(function (a, i) {
        h += '<li><button type="button" class="thumb thumb--art thumb--' + (a.light ? 'light' : 'dark') + '" data-art="' + i + '" aria-pressed="false" aria-label="Show ' + esc(a.label.toLowerCase()) + '"><img src="' + esc(a.src) + '" alt="" loading="lazy" decoding="async"></button></li>';
      });
      h += '<li><button type="button" class="thumb thumb--ph" data-ph="1" aria-pressed="false" aria-label="Sample and lifestyle photos, coming later"><span>Photos soon</span></button></li>';
      thumbsEl.innerHTML = h;
      return order[0];
    }
    function failMain() { $('.img-fail', well).hidden = false; }
    function showItem(item) {
      state.item = item;
      var c = colorOf(state.color);
      $('.img-fail', well).hidden = true;
      well.classList.remove('is-art', 'is-light');
      ph.hidden = item.type !== 'ph';
      main.hidden = item.type === 'ph';
      if (item.type === 'view' && c && c.images[item.i]) {
        main.src = c.images[item.i];
        main.alt = P.title + ' in ' + c.name + ', ' + viewLabel(item.i).toLowerCase() + ' view';
        cap.textContent = viewLabel(item.i) + ', ' + c.name + '.';
        watchImg(main, well, failMain);
      } else if (item.type === 'art') {
        var a = arts[item.i];
        well.classList.add('is-art'); if (a.light) well.classList.add('is-light');
        main.src = a.src;
        main.alt = P.title + ': ' + a.label.toLowerCase() + ', shown as the design file';
        cap.textContent = a.label + '. Design file preview, not a photo of a printed ' + String(P.kind || 'garment').toLowerCase() + '.';
        watchImg(main, well, failMain);
      } else if (item.type === 'ph') {
        well.classList.add('is-loaded');
        cap.textContent = 'Sample and lifestyle photos are coming after the samples are approved.';
      }
      $$('.thumb', thumbsEl).forEach(function (b) {
        var on = (item.type === 'view' && b.getAttribute('data-view') === String(item.i)) ||
          (item.type === 'art' && b.getAttribute('data-art') === String(item.i)) || (item.type === 'ph' && b.hasAttribute('data-ph'));
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }
    thumbsEl.addEventListener('click', function (e) {
      var b = e.target.closest('.thumb'); if (!b) return;
      if (b.hasAttribute('data-view')) showItem({ type: 'view', i: +b.getAttribute('data-view') });
      else if (b.hasAttribute('data-art')) showItem({ type: 'art', i: +b.getAttribute('data-art') });
      else showItem({ type: 'ph' });
    });

    function syncUrl() {
      var q = [];
      if (hasColor && state.color) q.push('color=' + slug(state.color));
      if (state.size) q.push('size=' + encodeURIComponent(state.size));
      var v = variantFor(state.color, state.size);
      if (v && state.size) q.push('variant=' + v.id);
      try { history.replaceState(history.state, '', location.pathname + (q.length ? '?' + q.join('&') : '') + location.hash); } catch (e) { /* ignore */ }
    }
    function syncVariant() {
      var v = hasSize && !state.size ? null : variantFor(state.color, state.size);
      idInput.value = v ? v.id : '';
      var show = v || variantFor(state.color, (sizeInputs[0] || {}).value) || P.variants[0];
      if (show) priceEl.textContent = moneyFull(show.price);
    }
    function applyColor(name) {
      var c = hasColor ? colorOf(name) : null;
      if (hasColor && !c) return;
      state.color = c ? c.name : null;
      colorInputs.forEach(function (r) { r.checked = r.value === state.color; });
      var cn = $('[data-color-name]', root); if (cn) cn.textContent = state.color || '';
      var lost = null;
      sizeInputs.forEach(function (r) {
        var v = variantFor(state.color, r.value), ok = !!(v && v.available);
        r.disabled = !ok;
        var lab = r.parentNode; lab.classList.toggle('is-off', !ok);
        var why = $('.why', lab);
        if (!ok) { if (!why) { why = document.createElement('span'); why.className = 'visually-hidden why'; lab.appendChild(why); } why.textContent = ', not available' + (state.color ? ' in ' + state.color : ''); }
        else if (why) why.remove();
        if (!ok && r.checked) { r.checked = false; lost = r.value; }
      });
      if (lost) state.size = null;
      if (help) { help.classList.toggle('err', !!lost); help.textContent = lost ? lost + ' is not available in ' + state.color + '. Please pick another size.' : ''; }
      var first = buildThumbs();
      if (!state.item || state.item.type === 'view') showItem({ type: 'view', i: first === undefined ? 0 : first });
      else showItem(state.item);
      syncVariant(); syncUrl();
    }
    function applySize(size) {
      var v = variantFor(state.color, size);
      if (!v || !v.available) return;
      state.size = size;
      sizeInputs.forEach(function (r) { r.checked = r.value === size; });
      if (help) { help.classList.remove('err'); help.textContent = ''; }
      msg.textContent = ''; msg.className = 'form-msg';
      syncVariant(); syncUrl();
    }

    // Starting color and size: the URL first (direct links, card links, and reloads),
    // then Shopify's ?variant=, then the default.
    var start = null, startSize = param('size');
    var vparam = param('variant');
    if (vparam) {
      P.variants.forEach(function (v) { if (String(v.id) === vparam) { start = hasColor ? colorOf(v.options[P.colorPos]) : null; if (hasSize && !startSize) startSize = v.options[P.sizePos]; } });
    }
    start = colorBySlug(param('color') || '') || start || colorOf((colorInputs.filter(function (r) { return r.checked; })[0] || {}).value || '') || P.colors[0];
    applyColor(start ? start.name : null);
    if (startSize) applySize(startSize);
    if (!hasSize) applySize(null);

    form.addEventListener('change', function (e) {
      if (e.target.name === 'hp-color') applyColor(e.target.value);
      if (e.target.name === 'hp-size') applySize(e.target.value);
    });
    function clampQty() { var n = parseInt(qty.value, 10); if (!(n >= 1)) n = 1; if (n > MAXQ) n = MAXQ; qty.value = n; return n; }
    qty.addEventListener('change', clampQty);
    $$('[data-step]', form).forEach(function (b) { b.addEventListener('click', function () { qty.value = clampQty() + +b.getAttribute('data-step'); clampQty(); }); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (hasSize && !state.size) {
        msg.className = 'form-msg err'; msg.textContent = 'Pick a size first.';
        if (help) help.classList.add('err');
        var f = $('input[name=hp-size]:not(:disabled)', form); if (f) f.focus();
        return;
      }
      if (!idInput.value) { msg.className = 'form-msg err'; msg.textContent = 'That one is not available. Please pick another color or size.'; return; }
      var n = clampQty();
      submit.disabled = true;
      fetch('/cart/add.js', {
        method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ items: [{ id: +idInput.value, quantity: n }] }),
      }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          submit.disabled = false;
          if (!res.ok) { msg.className = 'form-msg err'; msg.textContent = (res.j && (res.j.description || res.j.message)) || 'That did not go into your cart. Please try again.'; return; }
          var line = res.j.items && res.j.items[0];
          var label = [P.title, state.color, state.size].filter(Boolean).join(', ');
          msg.className = 'form-msg ok';
          msg.innerHTML = 'Added to your cart: ' + esc(label) + '. You have ' + (line ? line.quantity : n) + ' of this one. <a href="/cart">View cart</a>';
          refreshCount(true);
        })
        .catch(function () { submit.disabled = false; form.submit(); }); // fall back to a normal form post
    });
  }

  /* ---------- cart page: quantity buttons submit the Shopify cart form ---------- */
  function initCart() {
    var form = $('[data-cart-form]'); if (!form) return;
    form.addEventListener('click', function (e) {
      var b = e.target.closest('[data-qty-step]'); if (!b) return;
      var inp = $('[data-qty]', b.parentNode);
      var n = Math.min(MAXQ, Math.max(0, (parseInt(inp.value, 10) || 0) + +b.getAttribute('data-qty-step')));
      inp.value = n;
      form.submit();
    });
    form.addEventListener('change', function (e) { if (e.target.matches('[data-qty]')) form.submit(); });
  }

  /* ---------- signup: friendly check before Shopify gets it ---------- */
  function initSignup() {
    $$('[data-signup]').forEach(function (form) {
      var input = $('input[type=email]', form), msg = $('.form-msg', form);
      form.addEventListener('submit', function (e) {
        var v = input.value.trim();
        var bad = !v ? 'Please enter your email address.' :
          (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? 'That email looks incomplete. It needs an @ and a dot, like name@example.com.' : '');
        if (!bad) return; // let Shopify handle it
        e.preventDefault();
        input.setAttribute('aria-invalid', 'true');
        msg.className = 'form-msg err'; msg.textContent = bad;
        input.focus();
      });
      input.addEventListener('input', function () { if (input.getAttribute('aria-invalid') === 'true') { input.removeAttribute('aria-invalid'); msg.textContent = ''; } });
    });
  }

  /* ---------- field notes stones ---------- */
  function initStones() {
    $$('[data-stone]').forEach(function (b) {
      b.addEventListener('click', function () {
        var on = b.getAttribute('aria-pressed') !== 'true';
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        $('[data-stone-state]', b).textContent = on ? 'Wet' : 'Dry';
      });
    });
  }

  // Same-page links (#shop, #story) scroll smoothly unless motion is reduced.
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var url = new URL(a.getAttribute('href'), location.href);
    if (url.pathname === location.pathname && url.hash) {
      var el = document.getElementById(url.hash.slice(1)); if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ block: 'start', behavior: FX ? 'smooth' : 'auto' });
      try { history.pushState(null, '', url.hash); } catch (err) { location.hash = url.hash; }
    }
  });

  initCards();
  initProduct();
  initCart();
  initSignup();
  initStones();
  window.addEventListener('pageshow', function (e) { if (e.persisted) refreshCount(false); });
})();
