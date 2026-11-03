// Coming-soon page: the Day/Night switch and the first dibs signup.
(() => {
  // day and night switch: the choice is remembered on this device
  const themeBtn = document.querySelector('[data-theme-toggle]'), root = document.documentElement;
  const isDark = () => root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  const label = () => { const d = isDark(); themeBtn.setAttribute('aria-label', d ? 'Switch to day mode' : 'Switch to night mode'); themeBtn.querySelector('.theme-lbl').textContent = d ? 'Day' : 'Night'; };
  label();
  themeBtn.addEventListener('click', () => { root.dataset.theme = isDark() ? 'light' : 'dark'; try { localStorage.setItem('hp-theme', root.dataset.theme); } catch (e) {} label(); });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', label);

  // first dibs: sends the email to /api/dibs (the Cloudflare Worker saves it)
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
      const r = await fetch(form.action, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ email, website: form.website.value }) });
      const out = await r.json().catch(() => ({}));
      if (r.ok && out.ok) { status.dataset.state = 'ok'; status.textContent = "You're on the list. We'll email you when the store opens."; form.email.value = ''; }
      else status.textContent = out.error || 'Something went wrong on our end. Try again in a minute, or email hello@heavypocketsco.com.';
    } catch (err) {
      status.textContent = "Couldn't reach the list just now. Check your connection and try again.";
    }
    sending = false; form.removeAttribute('aria-busy'); go.textContent = 'Get first dibs';
  });
})();
