// Run the coming-soon Worker on this computer, with a pretend list instead of Cloudflare's.
//
//   python3 scripts/build_coming_soon.py
//   node worker/test/local.mjs           (serves http://localhost:8787)
//   node worker/test/local.mjs --check   (runs the signup checks, then stops)
//
// Nothing is saved to Cloudflare. The pretend list disappears when this stops.
import http from 'node:http';
import worker from '../dist/index.js';

export function fakeKV() {
  const store = new Map();
  return {
    store,
    async get(key, type) { const v = store.has(key) ? store.get(key).value : null; return v && type === 'json' ? JSON.parse(v) : v; },
    async put(key, value, opts = {}) { store.set(key, { value, metadata: opts.metadata }); },
  };
}

const env = { DIBS: fakeKV() };
const call = (path, init = {}) => worker.fetch(new Request('http://localhost:8787' + path, init), env);
const post = (body, headers = {}) => call('/api/dibs', { method: 'POST', headers: { 'content-type': 'application/json', origin: 'http://localhost:8787', ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) });

async function check() {
  const results = [];
  const ok = (name, pass) => results.push([pass ? 'PASS' : 'FAIL', name]);
  let r = await call('/'); ok('home page loads', r.status === 200 && (await r.text()).includes('Get first dibs'));
  ok('page has security headers', !!r.headers.get('content-security-policy'));
  r = await call('/assets/retro/wordmark.svg'); ok('images are served', r.status === 200 && r.headers.get('content-type') === 'image/svg+xml');
  r = await call('/assets/logo/og-retro.jpg'); ok('share image is served', r.status === 200);
  r = await call('/nope'); ok('unknown page is 404', r.status === 404);
  r = await call('/api/dibs'); ok('GET on signup is refused', r.status === 405);
  r = await post({ email: 'Rock@Example.com ', picks: ['I lick rocks', 'Not a design', 'I lick rocks'] });
  ok('good email is saved', r.status === 200 && (await r.json()).ok === true);
  const saved = JSON.parse(env.DIBS.store.get('rock@example.com').value);
  ok('email is trimmed and lowercased', !!saved);
  ok('only real designs are kept, once each', JSON.stringify(saved.picks) === '["I lick rocks"]');
  r = await post({ email: 'rock@example.com', picks: [] });
  ok('signing up again keeps earlier picks', JSON.parse(env.DIBS.store.get('rock@example.com').value).picks.length === 1);
  r = await post({ email: 'not-an-email' }); ok('bad email is refused', r.status === 400);
  r = await post({ email: 'bot@example.com', website: 'http://spam' });
  ok('bot trap pretends to work and saves nothing', r.status === 200 && !env.DIBS.store.has('bot@example.com'));
  r = await post({ email: 'x@example.com' }, { origin: 'https://evil.example' }); ok('other sites are refused', r.status === 403);
  r = await post('{broken'); ok('broken data is refused', r.status === 400);
  r = await post({ email: 'a@example.com', pad: 'x'.repeat(5000) }); ok('oversized data is refused', r.status === 400);
  r = await call('/api/dibs', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded', origin: 'http://localhost:8787' }, body: 'email=noscript%40example.com&website=' });
  ok('plain form post (scripts off) works', r.status === 200 && (await r.text()).includes("on the list") && env.DIBS.store.has('noscript@example.com'));
  r = await worker.fetch(new Request('https://www.heavypocketsco.com/?a=1'), env); ok('www goes to the main address', r.status === 301 && r.headers.get('location') === 'https://heavypocketsco.com/?a=1');
  for (const [s, n] of results) console.log(s, n);
  const failed = results.filter(([s]) => s === 'FAIL').length;
  console.log(failed ? `${failed} failed` : `all ${results.length} passed`);
  process.exit(failed ? 1 : 0);
}

if (process.argv.includes('--check')) await check();
else {
  http.createServer(async (req, res) => {
    const chunks = []; for await (const c of req) chunks.push(c);
    const body = chunks.length ? Buffer.concat(chunks) : undefined;
    const r = await worker.fetch(new Request('http://localhost:8787' + req.url, { method: req.method, headers: req.headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : body }), env);
    res.writeHead(r.status, Object.fromEntries(r.headers));
    res.end(Buffer.from(await r.arrayBuffer()));
  }).listen(8787, () => console.log('coming-soon page at http://localhost:8787 (pretend list, nothing saved to Cloudflare)'));
  process.on('SIGUSR2', () => console.log(JSON.stringify([...env.DIBS.store.keys()])));
}
