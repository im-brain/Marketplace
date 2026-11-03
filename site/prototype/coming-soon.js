// Coming-soon page behavior: Wet Stone, Day/Night, Pocket it, and the first dibs signup.
(() => {
  const cs = getComputedStyle(document.documentElement);
  document.querySelectorAll('svg[data-seed]').forEach(s => drawStone(s, { seed: +s.dataset.seed, kind: s.dataset.kind || 'agate', dry: !!s.dataset.dry, paper: '#0c1220' }));

  // Wet Stone: hover previews on mouse; tap, click, Enter, or Space toggles and stays
  const hoverable = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const stone = document.getElementById('stone'), tool = document.querySelector('[data-wet-toggle]');
  let wets = 0; const wetOdo = document.querySelector('[data-wet-odo]').parentElement;
  const countWet = () => { wets++; String(Math.min(wets, 999)).padStart(3, '0').split('').forEach((d, i) => wetOdo.children[i].textContent = d); };
  document.querySelectorAll('.wet-stone').forEach(b => {
    const scope = b.closest('.viewer, .g-card'), hint = scope && scope.querySelector('[data-hint]');
    if (hint && hoverable) hint.dataset.off = b === stone ? 'Point at the stone' : 'Point to wet';
    const show = () => {
      const on = b.getAttribute('aria-pressed') === 'true';
      if (hint) hint.textContent = (on || b.classList.contains('hover')) ? hint.dataset.on : hint.dataset.off;
      if (b === stone) { tool.setAttribute('aria-pressed', on); tool.querySelector('span').textContent = on ? 'Dry it' : 'Wet it'; }
    };
    show();
    b.addEventListener('click', () => { const on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', on); b.classList.remove('hover'); if (on) countWet(); show(); });
    b.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse' && b.getAttribute('aria-pressed') !== 'true') { b.classList.add('hover'); show(); } });
    b.addEventListener('pointerleave', () => { b.classList.remove('hover'); show(); });
  });
  tool.addEventListener('click', () => stone.click());

  // day and night switch: the choice is remembered on this device
  const themeBtn = document.querySelector('[data-theme-toggle]'), root = document.documentElement;
  const isDark = () => root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  const label = () => { const d = isDark(); themeBtn.setAttribute('aria-label', d ? 'Switch to day mode' : 'Switch to night mode'); themeBtn.querySelector('.theme-lbl').textContent = d ? 'Day' : 'Night'; };
  label();
  themeBtn.addEventListener('click', () => { root.dataset.theme = isDark() ? 'light' : 'dark'; try { localStorage.setItem('hp-theme', root.dataset.theme); } catch (e) {} label(); });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', label);

  // pocket: a wish list, not a cart
  const pocketed = [];
  const list = n => n.length < 3 ? n.join(' and ') : n.slice(0, -1).join(', ') + ', and ' + n[n.length - 1];
  const sync = () => {
    const n = pocketed.length, pad = String(n).padStart(3, '0').split('');
    document.querySelectorAll('.odo:has([data-pocket-count]), .odo:has([data-pocket-odo])').forEach(o => o.querySelectorAll('b').forEach((b, i) => b.textContent = pad[i]));
    document.querySelector('[data-pocket-vh]').textContent = n + (n === 1 ? ' design pocketed' : ' designs pocketed');
    document.querySelector('[data-pocket-list]').textContent = n ? 'In your pocket: ' + list(pocketed) + '.' : "Nothing pocketed, so we'll tell you about all five.";
  };
  const mark = (b, on) => { b.setAttribute('aria-pressed', on); b.querySelector('span').textContent = on ? 'In your pocket' : 'Pocket it'; };
  const save = () => { try { localStorage.setItem('hp-pocket', JSON.stringify(pocketed)); } catch (e) {} };
  // your pocket survives a refresh on this device (only designs that still exist come back)
  let saved = [];
  try { saved = JSON.parse(localStorage.getItem('hp-pocket') || '[]'); } catch (e) {}
  document.querySelectorAll('.pocket').forEach(b => {
    if (Array.isArray(saved) && saved.includes(b.dataset.design)) { mark(b, true); pocketed.push(b.dataset.design); }
    b.addEventListener('click', () => {
      const on = b.getAttribute('aria-pressed') !== 'true', name = b.dataset.design;
      mark(b, on);
      if (on) pocketed.push(name); else pocketed.splice(pocketed.indexOf(name), 1);
      sync(); save();
    });
  });
  sync();

  // first dibs: sends the email and the pocket to /api/dibs (the Cloudflare Worker saves it)
  const form = document.getElementById('signup'), status = form.parentElement.querySelector('.status-line'), go = form.querySelector('.btn.go');
  let sending = false;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (sending) return;
    const email = form.email.value.trim();
    status.removeAttribute('data-state');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { status.textContent = 'That email address looks incomplete. Check it and try again.'; form.email.focus(); return; }
    sending = true; form.setAttribute('aria-busy', 'true'); go.textContent = 'Saving...'; status.textContent = '';
    try {
      const r = await fetch(form.action, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ email, picks: pocketed, website: form.website.value }) });
      const out = await r.json().catch(() => ({}));
      if (r.ok && out.ok) {
        status.dataset.state = 'ok';
        status.textContent = "You're on the list. We'll email you when the store opens" + (pocketed.length ? ', and we saved your pocket.' : '.');
        form.email.value = '';
      } else {
        status.textContent = out.error || "Something went wrong on our end. Try again in a minute, or email hello@heavypocketsco.com.";
      }
    } catch (err) {
      status.textContent = "Couldn't reach the list just now. Check your connection and try again.";
    }
    sending = false; form.removeAttribute('aria-busy'); go.textContent = 'Get first dibs';
  });
})();
