#!/usr/bin/env node
/* Local smoke test for the Shopify theme, before it ever reaches Shopify.
   Renders the homepage, every product page, the cart, and Field Notes with
   liquidjs and fake Shopify objects built from saved Printify product JSON
   (one file per product, from GET /v1/shops/<id>/products/<id>.json).
   This is NOT Shopify: it stubs Shopify-only tags and filters. It catches
   Liquid logic bugs and lets qa/run_qa.js click through the pages.
   Usage: node theme/shopify/qa/mock_render.js <printify-json-dir> <out-dir> [liquidjs-dir] */
'use strict';
const fs = require('fs');
const path = require('path');
const [pfDir, outDir, ljsDir] = process.argv.slice(2);
if (!pfDir || !outDir) { console.error('usage: mock_render.js <printify-json-dir> <out-dir> [node_modules dir with liquidjs]'); process.exit(2); }
const { Liquid, Tag } = require(ljsDir ? path.join(ljsDir, 'liquidjs') : 'liquidjs');
const THEME = path.resolve(__dirname, '..');
const SRC = JSON.parse(fs.readFileSync(path.resolve(THEME, '../v3/src/products.json'), 'utf8'));
const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
fs.mkdirSync(outDir, { recursive: true });

/* ---------- fake Shopify products from Printify JSON ---------- */
let nextId = 9000;
function toShopify(pf, handle) {
  const en = pf.variants.filter((v) => v.is_enabled);
  // Printify variant titles put size first for tees and color first for hoodies, like Shopify will.
  const sizeFirst = SIZES.includes(en[0].title.split(' / ')[0]);
  const names = sizeFirst ? ['Size', 'Color'] : ['Color', 'Size'];
  const vals = [[], []];
  const variants = en.map((v) => {
    const opts = v.title.split(' / ');
    opts.forEach((o, i) => { if (!vals[i].includes(o)) vals[i].push(o); });
    return { id: v.id, title: v.title, price: v.price, available: v.is_available !== false, options: opts };
  });
  const byId = Object.fromEntries(variants.map((v) => [v.id, v]));
  // The real layout (checked on the store, Nov 12, 2026): one linked front per color
  // first, then each color's other views as a group in the same color order, then
  // the size chart, which has no variant link.
  const ci = names.indexOf('Color');
  const all = pf.images.filter((im) => im.is_selected_for_publishing).map((im) => {
    const vs = im.variant_ids.map((i) => byId[i]).filter(Boolean);
    const cam = (/camera_label=([a-z0-9-]+)/.exec(im.src) || [])[1] || 'x';
    const color = cam === 'size-chart' ? null : vs[0] && vs[0].options[ci];
    return { cam, color, vs, src: `https://cdn.example/${handle}/${String(color || 'none').replace(/\W+/g, '-')}-${cam}.png`, alt: '' };
  });
  const fronts = all.filter((im) => im.cam === 'front' && im.color);
  const rest = all.filter((im) => im.cam !== 'front' && im.cam !== 'size-chart');
  const charts = all.filter((im) => im.cam === 'size-chart');
  const images = [
    ...fronts.map((im) => ({ src: im.src, alt: '', variants: im.vs })),
    ...fronts.flatMap((f) => rest.filter((im) => im.color === f.color)).map((im) => ({ src: im.src, alt: '', variants: [] })),
    ...charts.map((im) => ({ src: im.src, alt: '', variants: [] })),
  ];
  variants.forEach((v) => { v.featured_image = images.find((im) => im.variants.includes(v)) || null; });
  const prices = variants.map((v) => v.price);
  return {
    id: nextId++, handle, title: pf.title, url: '/products/' + handle, available: true,
    description: pf.description, price_min: Math.min(...prices), price_varies: Math.min(...prices) !== Math.max(...prices),
    featured_image: images[0], images, variants,
    options_with_values: names.map((n, i) => ({ name: n, position: i + 1, values: vals[i] })),
    selected_or_first_available_variant: variants[0],
  };
}
const products = {};
for (const p of SRC.products) {
  const f = path.join(pfDir, `pf_${p.slug}.json`);
  products[p.slug] = toShopify(JSON.parse(fs.readFileSync(f, 'utf8')), p.slug);
}

/* ---------- liquid engine with Shopify stubs ---------- */
const engine = new Liquid({ root: [path.join(THEME, 'snippets'), path.join(THEME, 'sections')], extname: '.liquid', jsTruthy: false, strictFilters: true });
const cents = (c) => '$' + (Number(c) / 100).toFixed(2);
engine.registerFilter('asset_url', (s) => '/assets/' + s);
engine.registerFilter('stylesheet_tag', (u) => `<link rel="stylesheet" href="${u}">`);
engine.registerFilter('image_url', (img, ...args) => {
  if (!img) return '';
  const src = typeof img === 'string' ? img : img.src;
  const w = (args.find((a) => Array.isArray(a) && a[0] === 'width') || [])[1];
  return src + (w ? '?width=' + w : '');
});
engine.registerFilter('image_tag', (u) => `<img src="${u}" alt="">`);
engine.registerFilter('money', cents);
engine.registerFilter('json', (v) => JSON.stringify(v === undefined ? null : v));
engine.registerFilter('default_pagination', () => '');
engine.registerFilter('format_code', (s) => s);
class Schema extends Tag { constructor(t, r, l) { super(t, r, l); this.tpls = []; const s = l.parser.parseStream(r); s.on('tag:endschema', () => s.stop()).on('template', () => {}).on('end', () => { throw new Error('schema not closed'); }); s.start(); } * render() { return ''; } }
engine.registerTag('schema', Schema);
class FormTag extends Tag {
  constructor(t, r, l) {
    super(t, r, l); this.args = t.args; this.tpls = [];
    const s = l.parser.parseStream(r);
    s.on('tag:endform', () => s.stop()).on('template', (x) => this.tpls.push(x)).on('end', () => { throw new Error('form not closed'); }); s.start();
  }
  * render(ctx, emitter) {
    const a = this.args;
    const kind = (/'(\w+)'/.exec(a) || [])[1];
    const attr = (k) => { const m = new RegExp(k + ":\\s*'([^']*)'").exec(a); return m ? m[1] : null; };
    const action = { product: '/cart/add', customer: '/contact#signup', storefront_password: '/password' }[kind] || '/';
    const extra = [['class', attr('class')], ['id', attr('id')], ['novalidate', attr('novalidate')], ['data-buy', attr('data-buy')], ['data-signup', attr('data-signup')]]
      .filter(([, v]) => v !== null).map(([k, v]) => v === '' ? ` ${k}` : ` ${k}="${v}"`).join('');
    emitter.write(`<form method="post" action="${action}"${extra}>`);
    ctx.push({ form: { errors: null, posted_successfully: false } });
    yield this.liquid.renderer.renderTemplates(this.tpls, ctx, emitter);
    ctx.pop();
    emitter.write('</form>');
  }
}
engine.registerTag('form', FormTag);
class Paginate extends Tag {
  constructor(t, r, l) { super(t, r, l); this.tpls = []; const s = l.parser.parseStream(r); s.on('tag:endpaginate', () => s.stop()).on('template', (x) => this.tpls.push(x)).on('end', () => { throw new Error('paginate not closed'); }); s.start(); }
  * render(ctx, emitter) { ctx.push({ paginate: { pages: 1 } }); yield this.liquid.renderer.renderTemplates(this.tpls, ctx, emitter); ctx.pop(); }
}
engine.registerTag('paginate', Paginate);

const base = {
  routes: { root_url: '/', cart_url: '/cart', search_url: '/search' },
  shop: { name: 'Heavy Pockets Co.', money_format: '${{amount}}', policies: [] },
  all_products: products,
  collections: { all: { products: Object.values(products) } },
  request: { path: '/', locale: { iso_code: 'en' }, page_type: 'index' },
  settings: {},
};

async function section(name, extra) {
  const file = path.join(THEME, 'sections', name + '.liquid');
  const src = fs.readFileSync(file, 'utf8');
  const tpl = engine.parse(src, file);
  // section.settings: the schema defaults
  const sm = /\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/.exec(src);
  const settings = {};
  if (sm) for (const s of (JSON.parse(sm[1]).settings || [])) if ('default' in s) settings[s.id] = s.default;
  return engine.render(tpl, { ...base, ...extra, section: { id: name, settings } });
}
async function page(title, template, sections, extra = {}) {
  const head = (await section('hp-header', { ...extra, template: { name: template } }));
  let body = '';
  for (const s of sections) body += await section(s, { ...extra, template: { name: template } });
  const foot = await section('hp-footer', extra);
  const theme = fs.readFileSync(path.join(THEME, 'layout/theme.liquid'), 'utf8');
  const headTags = /<head>([\s\S]*?)\{\{ content_for_header \}\}/.exec(theme)[1]
    .replace(/\{%-?\s*comment\s*-?%\}[\s\S]*?\{%-?\s*endcomment\s*-?%\}/g, '')
    .replace(/\{%-? render 'hp-meta' -?%\}/, '')
    .replace(/\{\{ '([\w.-]+)' \| asset_url \| stylesheet_tag \}\}/g, '<link rel="stylesheet" href="/assets/$1">')
    .replace(/\{\{ '([\w.-]+)' \| asset_url \}\}/g, '/assets/$1')
    .replace(/\{%-?[\s\S]*?-?%\}/g, '').replace(/\{\{[\s\S]*?\}\}/g, '');
  return `<!doctype html><html lang="en" class="no-js"><head><title>${title}</title>${headTags}</head><body data-page="${template}"><a class="skip" href="#main">Skip to content</a>${head}<main id="main" tabindex="-1">${body}</main>${foot}</body></html>`;
}

(async () => {
  const cart = { item_count: 0, items: [], total_price: 0 };
  base.cart = cart;
  const out = {};
  out['index.html'] = await page('Home', 'index', ['hp-hero', 'hp-collection', 'hp-story', 'hp-signup']);
  for (const [h, p] of Object.entries(products)) {
    out[`products/${h}.html`] = await page(p.title, 'product', ['hp-product'], { product: p, request: { ...base.request, page_type: 'product', path: p.url } });
  }
  out['pages/field-notes.html'] = await page('Field Notes', 'page', ['hp-field-notes'], { request: { ...base.request, path: '/pages/field-notes' } });
  out['cart-empty.html'] = await page('Cart', 'cart', ['hp-cart']);
  const p0 = products['midnight-rock-hunt-tee'], v0 = p0.variants[0];
  base.cart = { item_count: 2, total_price: v0.price * 2, items: [{ product: p0, variant: v0, url: p0.url + '?variant=' + v0.id, image: v0.featured_image, quantity: 2, final_price: v0.price, final_line_price: v0.price * 2, url_to_remove: '/cart/change?line=1&quantity=0', options_with_values: p0.options_with_values.map((o, i) => ({ name: o.name, value: v0.options[i] })) }] };
  out['cart.html'] = await page('Cart', 'cart', ['hp-cart']);
  for (const [f, h] of Object.entries(out)) {
    if (/\u2014/.test(h)) throw new Error(f + ' has an em dash');
    fs.mkdirSync(path.dirname(path.join(outDir, f)), { recursive: true });
    fs.writeFileSync(path.join(outDir, f), h);
  }
  fs.mkdirSync(path.join(outDir, 'assets'), { recursive: true });
  for (const a of fs.readdirSync(path.join(THEME, 'assets'))) fs.copyFileSync(path.join(THEME, 'assets', a), path.join(outDir, 'assets', a));
  console.log('rendered', Object.keys(out).length, 'pages to', outDir);
})().catch((e) => { console.error(e); process.exit(1); });
