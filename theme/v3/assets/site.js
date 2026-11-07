/* Heavy Pockets storefront preview v3. No dependencies.
   Preview only: the cart lives in this browser, checkout is off, and the
   signup form sends nothing. */
(function () {
  'use strict';
  var C = window.HP_CATALOG;
  if (!C) return;
  var SIM = window.HP_SIMULATE || '';
  var html = document.documentElement;
  var bySlug = {};
  C.products.forEach(function (p) { bySlug[p.slug] = p; });
  var LARGE = C.largeSizes;
  var MAXQ = 10;

  function money(c) { return '$' + (c / 100).toFixed(2); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]; }); }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function colorOf(p, name) { for (var i = 0; i < p.colors.length; i++) if (p.colors[i].name === name) return p.colors[i]; return null; }
  function colorBySlug(p, slug) { for (var i = 0; i < p.colors.length; i++) if (p.colors[i].slug === slug) return p.colors[i]; return null; }
  function sizeOf(c, size) { for (var i = 0; i < c.sizes.length; i++) if (c.sizes[i].size === size) return c.sizes[i]; return null; }
  function param(name) { var m = new RegExp('[?&]' + name + '=([^&#]*)').exec(location.search); return m ? decodeURIComponent(m[1]) : null; }

  /* ---------- storage with an in-memory fallback ---------- */
  function makeStore(kind) {
    var mem = {}, s = null, ok = false;
    try {
      if (SIM.indexOf('nostorage') > -1) throw new Error('simulated');
      s = window[kind + 'Storage'];
      s.setItem('hp.__t', '1'); s.removeItem('hp.__t'); ok = true;
    } catch (e) { ok = false; }
    return {
      ok: ok,
      get: function (k) { if (ok) { try { return s.getItem(k); } catch (e) { /* fall through */ } } return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null; },
      set: function (k, v) { if (ok) { try { s.setItem(k, v); return; } catch (e) { /* fall through */ } } mem[k] = v; },
    };
  }
  var local = makeStore('local');     // cart: kept across pages and visits
  var session = makeStore('session'); // wet reveal: kept for this visit only

  /* ---------- cart ---------- */
  var CART_KEY = 'hp.cart.v1';
  function validLine(l) {
    var p = l && bySlug[l.slug]; if (!p) return false;
    var c = colorOf(p, l.color); if (!c) return false;
    var s = sizeOf(c, l.size); return !!(s && s.ok);
  }
  function readCart() {
    var a;
    try { a = JSON.parse(local.get(CART_KEY) || '[]'); } catch (e) { a = []; }
    if (!Array.isArray(a)) return [];
    return a.filter(validLine).map(function (l) {
      return { slug: l.slug, color: l.color, size: l.size, qty: Math.min(MAXQ, Math.max(1, parseInt(l.qty, 10) || 1)) };
    });
  }
  function writeCart(a) { local.set(CART_KEY, JSON.stringify(a)); renderCount(true); }
  function sameLine(a, b) { return a.slug === b.slug && a.color === b.color && a.size === b.size; }
  function addToCart(item) {
    var a = readCart(), hit = null, capped = false;
    a.forEach(function (l) { if (sameLine(l, item)) hit = l; });
    if (hit) { hit.qty += item.qty; } else { hit = { slug: item.slug, color: item.color, size: item.size, qty: item.qty }; a.push(hit); }
    if (hit.qty > MAXQ) { hit.qty = MAXQ; capped = true; }
    writeCart(a);
    return { line: hit, capped: capped, merged: a.length && hit !== item };
  }
  function cartCount() { return readCart().reduce(function (n, l) { return n + l.qty; }, 0); }
  function renderCount(bump) {
    var n = cartCount();
    $$('[data-cart-count]').forEach(function (e) { e.textContent = n; });
    $$('[data-cart-sr]').forEach(function (e) { e.textContent = ', ' + n + (n === 1 ? ' item' : ' items'); });
    if (bump) $$('[data-cart-link]').forEach(function (a) { a.classList.remove('bump'); void a.offsetWidth; a.classList.add('bump'); });
  }

  /* ---------- image loading, loader, and failure ---------- */
  var MISSING = 'img/__simulated-missing__.webp';
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
  function rememberWet(slug) {
    var a = wetList();
    if (a.indexOf(slug) < 0) { a.push(slug); session.set(WET_KEY, JSON.stringify(a)); }
  }
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
  function setWetUI(card) {
    var b = $('[data-wet-btn]', card); if (b) b.setAttribute('data-state', 'wet');
  }
  function reveal(card, x, y) {
    var slug = card.getAttribute('data-product');
    var media = $('.card__media', card);
    if (card.classList.contains('is-wet') || card.classList.contains('is-splashing')) return false;
    rememberWet(slug);
    setWetUI(card);
    if (!FX || card.classList.contains('img-failed')) { card.classList.add('is-wet'); return true; }
    var top = $('.wet__top', card);
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
    return true;
  }
  function pointPct(media, cx, cy) {
    var r = media.getBoundingClientRect();
    return [Math.min(100, Math.max(0, (cx - r.left) / r.width * 100)), Math.min(100, Math.max(0, (cy - r.top) / r.height * 100))];
  }

  function initCards() {
    var cards = $$('.card[data-product]');
    if (!cards.length) return;
    var already = wetList();
    cards.forEach(function (card) {
      var slug = card.getAttribute('data-product');
      var p = bySlug[slug];
      var media = $('.card__media', card);
      var imgs = $$('[data-card-img]', card);
      var btn = $('[data-wet-btn]', card);
      if (already.indexOf(slug) > -1) { card.classList.add('is-wet'); setWetUI(card); }

      function fail() { card.classList.add('img-failed'); $('.img-fail', card).hidden = false; }
      function setColor(name) {
        var c = colorOf(p, name); if (!c) return;
        card.classList.remove('img-failed'); $('.img-fail', card).hidden = true;
        imgs.forEach(function (im) { im.src = SIM.indexOf('noimages') > -1 ? MISSING : c.images[p.cardView]; });
        watchImg(imgs[0], media, fail);
        $$('[data-card-link]', card).forEach(function (a) { a.href = slug + '.html?color=' + c.slug; });
        $('[data-color-name]', card).textContent = c.name;
      }
      // the browser may restore a different checked swatch after Back: honor it
      var checked = $('input[type=radio]:checked', card);
      setColor(checked ? checked.value : p.colors[0].name);
      $$('input[type=radio]', card).forEach(function (r) {
        r.addEventListener('change', function () { if (r.checked) setColor(r.value); });
      });

      // desktop: mouse or pen hover
      media.addEventListener('pointerenter', function (e) {
        if (e.pointerType === 'touch') return;
        var pt = pointPct(media, e.clientX, e.clientY); reveal(card, pt[0], pt[1]);
      });
      // keyboard (and any focus) anywhere in the card
      card.addEventListener('focusin', function () { reveal(card, 18, 12); });
      // phones: any contact with the image, including the start of a scroll.
      // Passive, never calls preventDefault, so native scrolling is untouched.
      // A scroll never fires click, so the link only opens on a real tap.
      media.addEventListener('touchstart', function (e) {
        var t = e.touches[0]; if (!t) return;
        var pt = pointPct(media, t.clientX, t.clientY); reveal(card, pt[0], pt[1]);
      }, { passive: true });
      btn.addEventListener('click', function () {
        reveal(card, 50, 50);
      });
    });
  }

  /* ---------- product page ---------- */
  function initProduct() {
    var root = $('.pdp[data-product]'); if (!root) return;
    var p = bySlug[root.getAttribute('data-product')];
    var form = $('[data-buy]', root);
    var well = $('[data-g-well]', root), main = $('[data-g-img]', root), cap = $('[data-g-cap]', root), ph = $('[data-g-ph]', root);
    var msg = $('[data-buy-msg]', root), help = $('[data-size-help]', root), note = $('[data-size-note]', root);
    var qty = $('#qty', root);
    var arts = [];
    $$('.thumb[data-art]', root).forEach(function (b) { arts[+b.getAttribute('data-art')] = { src: $('img', b).getAttribute('src'), label: b.getAttribute('aria-label').replace(/^Show /, ''), light: b.classList.contains('thumb--light') }; });
    var LABEL = { front: 'Front', 'front-close': 'Front close-up', back: 'Back', 'back-hood': 'Back with hood up', folded: 'Folded', flatlay: 'Styled flat lay' };
    var state = { color: null, size: null, item: { type: 'view', view: $('.thumb[data-view]', root).getAttribute('data-view') } };

    function failMain() { $('.img-fail', well).hidden = false; }
    function showItem(item) {
      state.item = item;
      var c = colorOf(p, state.color);
      $('.img-fail', well).hidden = true;
      well.classList.remove('is-art', 'is-light');
      ph.hidden = item.type !== 'ph';
      main.hidden = item.type === 'ph';
      if (item.type === 'view') {
        main.src = SIM.indexOf('noimages') > -1 ? MISSING : c.images[item.view];
        main.alt = p.name + ' in ' + c.name + ', ' + LABEL[item.view].toLowerCase() + ' view';
        cap.textContent = LABEL[item.view] + ', ' + c.name + '.';
        watchImg(main, well, failMain);
      } else if (item.type === 'art') {
        var a = arts[item.i];
        well.classList.add('is-art'); if (a.light) well.classList.add('is-light');
        main.src = SIM.indexOf('noimages') > -1 ? MISSING : a.src;
        main.alt = p.name + ': ' + a.label + ', shown as the design file';
        cap.textContent = a.label.charAt(0).toUpperCase() + a.label.slice(1) + '. Design file preview, not a photo of a printed garment.';
        watchImg(main, well, failMain);
      } else {
        well.classList.add('is-loaded');
        cap.textContent = 'Sample and lifestyle photos are coming after the samples are approved.';
      }
      $$('.thumb', root).forEach(function (b) {
        var on = (item.type === 'view' && b.getAttribute('data-view') === item.view) ||
          (item.type === 'art' && b.getAttribute('data-art') === String(item.i)) || (item.type === 'ph' && b.hasAttribute('data-ph'));
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }
    function syncUrl() {
      var c = colorOf(p, state.color);
      var q = '?color=' + c.slug + (state.size ? '&size=' + encodeURIComponent(state.size) : '');
      try { history.replaceState(history.state, '', location.pathname + q + location.hash); } catch (e) { /* file:// or sandbox */ }
    }
    function sizeNote() { note.hidden = !(state.size && LARGE.indexOf(state.size) > -1); }
    function applyColor(name) {
      var c = colorOf(p, name); if (!c) return;
      state.color = c.name;
      $$('input[name=color]', form).forEach(function (r) { r.checked = r.value === c.name; });
      $('[data-color-name]', root).textContent = c.name;
      var lost = null, unavailable = [];
      $$('input[name=size]', form).forEach(function (r) {
        var s = sizeOf(c, r.value), ok = !!(s && s.ok);
        if (s && !s.ok) unavailable.push(r.value);
        r.disabled = !ok;
        var lab = r.parentNode; lab.classList.toggle('is-off', !ok);
        var why = $('.why', lab);
        if (!ok) { if (!why) { why = document.createElement('span'); why.className = 'visually-hidden why'; lab.appendChild(why); } why.textContent = ', not available in ' + c.name; }
        else if (why) why.remove();
        if (!ok && r.checked) { r.checked = false; lost = r.value; }
      });
      if (lost) state.size = null;
      // the size keys show what is available; text appears only to explain a change
      help.classList.toggle('err', !!lost);
      help.textContent = lost ? lost + ' is not available in ' + c.name + '. Please pick another size.' : '';
      $$('.thumb[data-view]', root).forEach(function (b) { var v = b.getAttribute('data-view'); $('img', b).src = SIM.indexOf('noimages') > -1 ? MISSING : c.images[v]; });
      if (state.item.type === 'view') showItem(state.item);
      sizeNote(); syncUrl();
    }
    function applySize(size) {
      var c = colorOf(p, state.color), s = sizeOf(c, size);
      if (!s || !s.ok) return;
      state.size = size;
      $$('input[name=size]', form).forEach(function (r) { r.checked = r.value === size; });
      help.classList.remove('err');
      help.textContent = '';
      msg.textContent = ''; msg.className = 'form-msg';
      sizeNote(); syncUrl();
    }

    // starting color and size: URL first (direct links and reloads), then any restored form state
    // read both before applyColor rewrites the URL
    var wantColor = param('color'), wantSize = param('size') || (($('input[name=size]:checked', form) || {}).value);
    var start = colorBySlug(p, wantColor || '') || colorOf(p, (($('input[name=color]:checked', form) || {}).value) || '') || p.colors[0];
    applyColor(start.name);
    if (wantSize) applySize(wantSize);

    form.addEventListener('change', function (e) {
      if (e.target.name === 'color') applyColor(e.target.value);
      if (e.target.name === 'size') applySize(e.target.value);
    });
    $$('.thumb', root).forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.hasAttribute('data-view')) showItem({ type: 'view', view: b.getAttribute('data-view') });
        else if (b.hasAttribute('data-art')) showItem({ type: 'art', i: +b.getAttribute('data-art') });
        else showItem({ type: 'ph' });
      });
    });
    function clampQty() { var n = parseInt(qty.value, 10); if (!(n >= 1)) n = 1; if (n > MAXQ) n = MAXQ; qty.value = n; return n; }
    qty.addEventListener('change', clampQty);
    $$('[data-step]', form).forEach(function (b) {
      b.addEventListener('click', function () { qty.value = clampQty() + +b.getAttribute('data-step'); clampQty(); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var c = colorOf(p, state.color);
      if (!state.size) {
        msg.className = 'form-msg err'; msg.textContent = 'Pick a size first.';
        help.classList.add('err');
        var first = $('input[name=size]:not(:disabled)', form); if (first) first.focus();
        return;
      }
      var s = sizeOf(c, state.size);
      if (!s || !s.ok) { msg.className = 'form-msg err'; msg.textContent = 'That size is not available in ' + c.name + '.'; return; }
      var n = clampQty();
      var r = addToCart({ slug: p.slug, color: c.name, size: state.size, qty: n });
      msg.className = 'form-msg ok';
      msg.innerHTML = 'Added to your preview cart: ' + esc(p.name) + ', ' + esc(c.name) + ', ' + esc(state.size) +
        '. You have ' + r.line.qty + ' of this one' + (r.capped ? ' (10 is the most per item)' : '') + '. ' +
        (local.ok ? '<a href="cart.html">View cart</a>' : 'Your browser is blocking storage, so this cart empties when you leave this page.');
    });
  }

  /* ---------- cart page ---------- */
  function initCartPage() {
    var root = $('[data-cart-root]'); if (!root) return;
    var live = $('[data-cart-live]');
    if (!local.ok) $('[data-storage-warn]').hidden = false;
    function key(l) { return [l.slug, l.color, l.size].join('|'); }
    function render(focusKey, focusAct) {
      var lines = readCart();
      if (!lines.length) {
        root.innerHTML = '<div class="empty"><p>Your cart is as empty as a beach after a big storm. (Okay, emptier.)</p><a class="btn" href="index.html#shop">Shop the collection</a></div>';
        return;
      }
      var total = 0, count = 0;
      var items = lines.map(function (l) {
        var p = bySlug[l.slug], c = colorOf(p, l.color);
        var lineTotal = p.priceCents * l.qty; total += lineTotal; count += l.qty;
        var label = esc(p.name + ', ' + l.color + ', ' + l.size);
        var big = LARGE.indexOf(l.size) > -1 ? '<p class="line__note">Larger-size price not set yet. Base price shown.</p>' : '';
        return '<li class="line" data-key="' + esc(key(l)) + '">' +
          '<a class="line__img" href="' + p.slug + '.html?color=' + c.slug + '&amp;size=' + encodeURIComponent(l.size) + '" tabindex="-1" aria-hidden="true"><img src="' + c.images[p.cardView] + '" alt="" width="900" height="900"></a>' +
          '<div><h2><a href="' + p.slug + '.html?color=' + c.slug + '&amp;size=' + encodeURIComponent(l.size) + '">' + esc(p.name) + '</a></h2>' +
          '<p class="line__meta">Color: ' + esc(l.color) + '. Size: ' + esc(l.size) + '.</p>' + big + '</div>' +
          '<p class="line__price">' + money(lineTotal) + (l.qty > 1 ? '<br><span class="small">' + money(p.priceCents) + ' each</span>' : '') + '</p>' +
          '<div class="line__ctrls"><div class="qty">' +
          '<button type="button" class="icon-btn" data-act="dec" aria-label="Decrease quantity of ' + label + '"' + (l.qty <= 1 ? ' aria-disabled="true"' : '') + '>−</button>' +
          '<input type="number" inputmode="numeric" min="1" max="' + MAXQ + '" value="' + l.qty + '" data-act="set" aria-label="Quantity of ' + label + '">' +
          '<button type="button" class="icon-btn" data-act="inc" aria-label="Increase quantity of ' + label + '"' + (l.qty >= MAXQ ? ' aria-disabled="true"' : '') + '>+</button></div>' +
          '<button type="button" class="link-btn" data-act="remove">Remove<span class="visually-hidden"> ' + label + '</span></button></div></li>';
      }).join('');
      root.innerHTML = '<ul class="lines">' + items + '</ul>' +
        '<div class="summary"><div class="summary__row"><span>Subtotal (<span data-count>' + count + (count === 1 ? ' item' : ' items') + '</span>)</span><span data-subtotal>' + money(total) + '</span></div>' +
        '<p>Provisional preview prices. ' + esc(C.shippingNote) + ' Taxes are not calculated in the preview.</p>' +
        '<button class="btn btn--block" type="button" aria-disabled="true" aria-describedby="checkout-why" data-checkout>Checkout is off in this preview</button>' +
        '<p id="checkout-why">Nothing is charged and no order is made. Checkout opens only after the samples are approved and the real store is set up.</p>' +
        '<a class="text-link text-link--dark" href="index.html#shop">Keep shopping</a></div>';
      if (focusKey) {
        var li = root.querySelector('.line[data-key="' + focusKey.replace(/"/g, '\\"') + '"]');
        var el = li && li.querySelector('[data-act="' + focusAct + '"]');
        if (el) el.focus();
      }
    }
    function refresh() {
      var total = 0, count = 0;
      readCart().forEach(function (l) {
        var p = bySlug[l.slug], li = root.querySelector('.line[data-key="' + key(l).replace(/"/g, '\\"') + '"]');
        total += p.priceCents * l.qty; count += l.qty;
        if (!li) return;
        var inp = li.querySelector('input[data-act=set]');
        if (inp && String(inp.value) !== String(l.qty)) inp.value = l.qty;
        li.querySelector('[data-act=dec]').setAttribute('aria-disabled', l.qty <= 1 ? 'true' : 'false');
        li.querySelector('[data-act=inc]').setAttribute('aria-disabled', l.qty >= MAXQ ? 'true' : 'false');
        li.querySelector('.line__price').innerHTML = money(p.priceCents * l.qty) + (l.qty > 1 ? '<br><span class="small">' + money(p.priceCents) + ' each</span>' : '');
      });
      var sub = root.querySelector('[data-subtotal]'); if (sub) sub.textContent = money(total);
      var cnt = root.querySelector('[data-count]'); if (cnt) cnt.textContent = count + (count === 1 ? ' item' : ' items');
    }
    function update(k, fn, act) {
      var lines = readCart(), out = [], said = '';
      lines.forEach(function (l) {
        if (key(l) !== k) { out.push(l); return; }
        var r = fn(l);
        if (r === null) { said = 'Removed ' + bySlug[l.slug].name + ', ' + l.color + ', ' + l.size + '.'; return; }
        said = 'Quantity ' + r.qty + '.';
        out.push(r);
      });
      writeCart(out);
      if (act === 'remove') {
        render();
        var next = root.querySelector('[data-act="remove"]') || root.querySelector('.empty .btn');
        if (next) next.focus();
      } else refresh();
      live.textContent = said;
    }
    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]'); if (!b || b.tagName === 'INPUT') return;
      var li = b.closest('.line'); if (!li) return;
      var k = li.getAttribute('data-key'), act = b.getAttribute('data-act');
      if (b.getAttribute('aria-disabled') === 'true') return;
      if (act === 'remove') update(k, function () { return null; }, act);
      if (act === 'inc') update(k, function (l) { l.qty = Math.min(MAXQ, l.qty + 1); return l; }, act);
      if (act === 'dec') update(k, function (l) { l.qty = Math.max(1, l.qty - 1); return l; }, act);
    });
    root.addEventListener('change', function (e) {
      var inp = e.target; if (inp.getAttribute('data-act') !== 'set') return;
      var k = inp.closest('.line').getAttribute('data-key');
      var n = parseInt(inp.value, 10); if (!(n >= 1)) n = 1; if (n > MAXQ) n = MAXQ;
      update(k, function (l) { l.qty = n; return l; }, 'set');
    });
    root.addEventListener('click', function (e) {
      if (e.target.closest('[data-checkout]')) live.textContent = 'Checkout is off in this preview. Nothing is charged and no order is made.';
    });
    render();
    window.addEventListener('pageshow', function (e) { if (e.persisted) render(); });
  }

  /* ---------- signup (preview only: sends and saves nothing) ---------- */
  function initSignup() {
    var form = $('[data-signup]'); if (!form) return;
    var input = $('input[type=email]', form), msg = $('#email-msg', form);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = input.value.trim();
      var bad = !v ? 'Please enter your email address.' :
        (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? 'That email looks incomplete. It needs an @ and a dot, like name@example.com.' : '');
      input.setAttribute('aria-invalid', bad ? 'true' : 'false');
      msg.className = 'form-msg ' + (bad ? 'err' : 'ok');
      msg.textContent = bad || 'That address looks right. This is only a preview, so nothing was sent and you were not added to any list.';
      if (bad) input.focus();
    });
    input.addEventListener('input', function () { if (input.getAttribute('aria-invalid') === 'true') { input.removeAttribute('aria-invalid'); msg.textContent = ''; } });
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

  if (SIM.indexOf('noimages') > -1) {
    $$('.hero img, .thumb img, .art-fig img, .chart img, .line__img img').forEach(function (im) { im.src = MISSING; });
    $$('.hero source').forEach(function (s) { s.remove(); });
  }
  function scrollToStart() {
    var nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
    if (nav && nav.type === 'back_forward') return; // Back keeps its place
    var id = location.hash.slice(1);
    var target = (id && document.getElementById(id)) || document.body;
    try { target.scrollIntoView({ block: 'start', behavior: 'instant' }); } catch (e) { target.scrollIntoView(true); }
    if (target === document.body) { try { window.scrollTo({ top: 0, behavior: 'instant' }); } catch (e) { window.scrollTo(0, 0); } }
  }
  // same-page links (#shop, #story) scroll with scrollIntoView too, for the same reason
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var url = new URL(a.getAttribute('href'), location.href);
    if (url.pathname === location.pathname && url.search === location.search && url.hash) {
      var el = document.getElementById(url.hash.slice(1));
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ block: 'start', behavior: html.classList.contains('wet-fx') ? 'smooth' : 'auto' });
      try { history.pushState(null, '', url.hash); } catch (err) { location.hash = url.hash; }
    }
  });

  renderCount(false);
  initCards();
  initProduct();
  initCartPage();
  initSignup();
  initStones();
  if (document.readyState === 'complete') scrollToStart(); else window.addEventListener('load', scrollToStart, { once: true });
  window.addEventListener('pageshow', function (e) { if (e.persisted) renderCount(false); });
  window.HP_DEBUG = { readCart: readCart, storageOk: { local: local.ok, session: session.ok } };
})();
