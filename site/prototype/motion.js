/* Keep the existing buttons, state, hints, and menu focus behavior. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const active = new Set();
  const play = (node, frames, timing) => {
    if (reduced.matches || !node.animate) return null;
    const animation = node.animate(frames, timing);
    active.add(animation);
    const done = () => { active.delete(animation); animation.cancel(); };
    animation.addEventListener('finish', done, { once: true });
    animation.addEventListener('cancel', () => active.delete(animation), { once: true });
    return animation;
  };
  reduced.addEventListener('change', () => {
    if (reduced.matches) [...active].forEach(a => { try { a.finish(); } catch { a.cancel(); } });
  });
  const supportsMask = CSS.supports('mask-size', '10px 10px') || CSS.supports('-webkit-mask-size', '10px 10px');
  const mask = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='white' d='M51 7C63 3 65 15 77 16S85 29 91 38 88 53 91 63 77 74 72 84 57 87 47 92 31 83 22 80 17 65 10 57 15 42 11 31 27 25 32 16 42 11 51 7Z'/%3E%3C/svg%3E")`;
  const cloneLayer = (layer, suffix) => {
    const clone = layer.cloneNode(true);
    if (clone.tagName.toLowerCase() === 'svg') {
      clone.innerHTML = clone.innerHTML.replace(/(id="|url\(#)([^"\)]+)/g, (_, before, id) => before + id + suffix);
    }
    clone.classList.remove('wet');
    clone.classList.add('wet-front');
    clone.setAttribute('aria-hidden', 'true');
    if (clone.tagName.toLowerCase() === 'img') clone.alt = '';
    return clone;
  };
  document.querySelectorAll('.wet-stone').forEach((button, index) => {
    const layer = button.querySelector('.wet');
    if (!layer || !supportsMask) return;
    const front = cloneLayer(layer, '-front' + index);
    layer.before(front);
    let point = { x: 50, y: 45 }, wet = false, sheen;
    const place = () => {
      const box = button.getBoundingClientRect(), face = layer.getBoundingClientRect();
      const x = box.width * point.x / 100 + box.left - face.left;
      const y = box.height * point.y / 100 + box.top - face.top;
      const far = Math.hypot(Math.max(x, face.width - x), Math.max(y, face.height - y));
      button.classList.add('motion-positioning');
      button.style.setProperty('--x', point.x + '%');
      button.style.setProperty('--y', point.y + '%');
      button.style.setProperty('--mx', x + 'px');
      button.style.setProperty('--my', y + 'px');
      button.style.setProperty('--cover', (far * 2.9) + 'px');
      button.style.setProperty('--bloom-mask', mask);
      const style = getComputedStyle(layer);
      style.maskPosition || style.webkitMaskPosition;
      button.classList.remove('motion-positioning');
    };
    const origin = event => {
      // Keep a partly wet patch anchored when someone changes their mind quickly.
      const style = getComputedStyle(layer);
      if (wet || parseFloat(style.maskSize || style.webkitMaskSize) > .5) return;
      if (event.type === 'keydown') point = { x: 50, y: 45 };
      else {
        const box = button.getBoundingClientRect();
        point = { x: (event.clientX - box.left) / box.width * 100, y: (event.clientY - box.top) / box.height * 100 };
      }
      place();
    };
    place();
    button.classList.add('motion-ready');
    button.addEventListener('pointerenter', origin, true);
    button.addEventListener('pointerdown', origin, true);
    button.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') origin(event); }, true);
    window.addEventListener('resize', place);
    const sync = () => {
      const on = button.getAttribute('aria-pressed') === 'true' || button.classList.contains('hover');
      if (on === wet) return;
      wet = on;
      if (sheen) sheen.cancel();
      const gloss = layer.querySelector('.gloss');
      if (on && gloss) sheen = play(gloss, [
        { transform: 'translateX(0) skewX(-18deg)', opacity: 0 },
        { opacity: .35, offset: .32 },
        { transform: 'translateX(820px) skewX(-18deg)', opacity: 0 }
      ], { duration: 850, delay: 130, easing: 'cubic-bezier(.16,1,.3,1)' });
    };
    new MutationObserver(sync).observe(button, { attributes: true, attributeFilter: ['aria-pressed', 'class'] });
    sync();
  });

  const lickCard = document.querySelector('.p-lick');
  const lick = lickCard && lickCard.querySelector('.lick .wet');
  if (lick) {
    let swipe;
    const reveal = () => {
      if (swipe) swipe.cancel();
      lickCard.classList.add('lick-drawn');
      swipe = play(lick, [{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: 700, easing: 'cubic-bezier(.16,1,.3,1)' });
    };
    lickCard.classList.add('lick-ready');
    lickCard.addEventListener('pointerenter', reveal);
    lickCard.addEventListener('pointerdown', reveal);
    lickCard.addEventListener('focusin', reveal);
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) { reveal(); observer.disconnect(); }
      }, { threshold: .2 });
      observer.observe(lickCard);
    } else reveal();
  }

  const pill = document.querySelector('[data-pocket-pill]');
  const count = document.querySelector('[data-pocket-count]');
  if (pill && count) document.querySelectorAll('.pocket').forEach(button => button.addEventListener('click', () => {
    if (button.getAttribute('aria-pressed') !== 'true' || reduced.matches || !button.animate) return;
    const from = button.getBoundingClientRect(), to = pill.getBoundingClientRect();
    const x = from.left + from.width / 2 - 8, y = from.top + from.height / 2 - 7;
    const dx = to.left + to.width / 2 - 8, dy = to.top + to.height / 2 - 7;
    const stone = document.createElement('span');
    stone.className = 'pocket-flight';
    stone.setAttribute('aria-hidden', 'true');
    document.body.append(stone);
    const high = Math.max(6, Math.min(y, dy) - 70);
    const flight = play(stone, [0, .25, .5, .75, 1].map(t => ({
      transform: `translate(${x + (dx - x) * t}px,${(1-t)*(1-t)*y + 2*(1-t)*t*high + t*t*dy}px) rotate(${14 - 14*t}deg) scale(${1 - .8*t})`
    })), { duration: 600, easing: 'cubic-bezier(.22,.61,.36,1)' });
    const remove = () => stone.remove();
    flight.addEventListener('cancel', remove, { once: true });
    flight.addEventListener('finish', () => {
      remove();
      if (button.getAttribute('aria-pressed') === 'true') play(count, [{ transform: 'scale(1)' }, { transform: 'scale(1.18)', offset: .4 }, { transform: 'scale(1)' }], { duration: 180 });
    }, { once: true });
  }));
})();
