# Heavy Pockets Shopify theme (Step 13)

The approved v3 preview (`theme/v3/`), rebuilt as a Shopify theme. Same look, same wet reveal, same words. The difference is where the data comes from: Shopify now holds the products, sizes, prices, photos, cart, and checkout (published from Printify).

Built Nov 12, 2026. Not on Shopify yet: it uploads as an **unpublished** theme first, so Brian can preview it before anything changes.

## Why a custom theme instead of Dawn

The plan said to start from Shopify's free Dawn theme. The v3 preview already is a complete design system (its own CSS, wet reveal, and layout), so dressing Dawn up to match would mean fighting thousands of lines of Dawn styles. A small custom theme that reuses v3's CSS directly is less code and matches the approved preview exactly.

## Files

| Folder | What is in it |
|---|---|
| `layout/` | `theme.liquid` (every page) and `password.liquid` (the "store is closed" page). |
| `templates/` | Which sections each page type uses: home, product, cart, collection, Field Notes, search, 404, and password. |
| `sections/` | The pieces: header, hero, collection grid, About, mailing list, product page, cart, Field Notes, and footer. Text on the home page (hero, About, founder intro, mailing list) can be edited in Shopify's theme editor. |
| `snippets/` | Shared bits: product card, icons, loader, wordmark, and `hp-extras` (the approved copy for each product). |
| `assets/` | `site.css` and `brand-tokens.css` (copied from v3), `hp-shopify.css` (Shopify-only additions), `theme.js`, and images. |
| `qa/` | Local tests (see below). |

## Where things come from

- **From Shopify (published by Printify):** product titles, variants, prices (including the larger-size steps), availability, and mockup photos. Change prices in Printify, then publish again.
- **From `theme/v3/src/products.json`** (through `snippets/hp-extras.liquid`): each product's blurb, story, decoration, fabric, fit, care, design-file images, color order, and swatch colors. Edit `products.json`, then run `node theme/shopify/build.js`.
- The Shopify product description is not shown (the approved v3 copy is used instead), except for a new product that has no entry in `products.json`.

## What changed from the v3 preview

- Real cart and real checkout. The "Private preview" banner and "checkout is off" notes are gone (the store password keeps it private).
- The mailing list form now saves to Shopify's customer list (tagged `newsletter` and `dibs`). It is separate from the coming-soon page's list on Cloudflare.
- Two cards (Pocket Full of Treasures and Floral Butterfly) used a cropped front close-up in v3. Shopify only has the full front mockup, so those cards show the full front.
- Product photos are Printify's mockups as published, not the v3 trimmed copies.
- Without JavaScript, product pages show a plain list of every color and size, and the cart has an "Update cart" button.

## Build and test

```
node theme/shopify/build.js                      # refresh copied CSS, images, and generated snippets
```

Local tests need saved Printify product JSON (`pf_<slug>.json` for each product, from `GET /v1/shops/29566047/products/<id>.json`), plus `liquidjs` and `@shopify/theme-check-node` installed anywhere:

```
node theme/shopify/qa/mock_render.js <dir-with-pf-json> <mock-out-dir> <node_modules-dir>
node theme/shopify/qa/run_qa.js <mock-out-dir>
```

`mock_render.js` renders the pages with fake Shopify data built from the Printify JSON. It assumes the worst case for photos: Printify links only each color's first mockup to that color, and the rest follow in order. `run_qa.js` clicks through the home page, all six product pages, the cart, and Field Notes on desktop and a phone size, plus a JavaScript-off check. Last run: 293 checks passed (`qa/last-run.txt`). Shopify's own Theme Check: 0 errors (6 warnings, all for the Google Fonts links, same as v3).

This is a stand-in for Shopify, so the real test is the unpublished theme on the store.
