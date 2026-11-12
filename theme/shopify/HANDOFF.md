# Handoff: Shopify setup and theme (Steps 12 and 13), Nov 12, 2026

Read `CLAUDE.md` first (project rules: no em dashes, Oxford comma, plain language for Brian). This note covers only what a new session needs to continue the Shopify work.

## Where things stand (updated Nov 12, 2026, end of session)

- **Branch:** work from Nov 12 (later) is on `claude/tender-ritchie-nl3e3p`. If it is not merged into `main` yet, start from that branch or merge it first (docs and a one-line test change only; nothing deploys).
- **Shopify store:** `rjrxi5-ji.myshopify.com`, Basic plan on the $1 intro offer. Password protection on (Brian has the storefront password; it is not in the repo, so ask him). Store name is now "Heavy Pockets Co."
- **Theme:** `theme/shopify/` is the **published** theme "Heavy Pockets" (id 131897917498). Horizon is in the library for rollback (Online Store > Themes > Publish). The Field Notes page exists and uses the `field-notes` template.
- **Policies (Step 14, done):** refund, shipping, contact information, and terms of service are in Shopify; the privacy policy is Shopify's automated one. Source text and rules Brian chose: `content/policies/Store_Policies_Draft.md` (made to order, no change-of-mind returns, claims within 7 days, one claim per order, nothing for "delivered" tracking, U.S. only). Brian fixed the stray "1. REFUND POLICY" labels.
- **Domain:** heavypocketsco.com still serves the Cloudflare coming-soon page. Do not connect it to Shopify until launch (Step 19).
- **Tests:** live store check 33 of 33 (`node theme/shopify/qa/live_check.js <store password>`). Local mock 317 of 317.

## Waiting on Brian

1. About page and founder text in his own words (homepage still has placeholders; website to-do 6). He can send a few sentences and Claude shapes them, no em dashes.
2. Samples must be physically approved before launch (Step 19). Samples are ordered.
3. Decide when to launch (connect domain, remove password, merge the Cloudflare `DIBS` list into Shopify customers).

## How to work on the theme

- **Edit, then rebuild:** approved product copy, colors, and swatches live in `theme/v3/src/products.json`. After editing it, or `theme/v3/assets/site.css`, run `node theme/shopify/build.js`. Hand-written files (layout, sections, templates, `assets/theme.js`, `assets/hp-shopify.css`) are edited directly. `theme/shopify/README.md` explains every folder.
- **Upload** (from `theme/shopify/`). The Shopify CLI is not installed in a fresh container. Install it in the scratchpad (`npm i @shopify/cli` in a scratch folder), then:
  ```
  NODE_USE_ENV_PROXY=1 SHOPIFY_CLI_NO_ANALYTICS=1 CI=1 npx shopify theme push \
    --store rjrxi5-ji.myshopify.com --password shptka_proxyinjected00000000000000 \
    --theme 131897917498 --json
  ```
  The password value is a dummy. The proxy injects the real Theme Access password (a network secret for `theme-kit-access.shopifyapps.com`, header `X-Shopify-Access-Token`). Without `NODE_USE_ENV_PROXY=1`, the CLI fails with "ENOTFOUND." `.shopifyignore` keeps `qa/`, `build.js`, and the README off Shopify.
- **Local tests:** need `liquidjs@10` installed in a scratch folder and saved Printify JSON (`pf_<slug>.json` for each product, from `GET https://api.printify.com/v1/shops/29566047/products/<id>.json`; IDs are in `products.json`). Then:
  ```
  node theme/shopify/qa/mock_render.js <pf-json-dir> <mock-out-dir> <scratch>/node_modules
  node theme/shopify/qa/run_qa.js <mock-out-dir>
  ```
- **Real store test:** `node theme/shopify/qa/live_check.js <store password>`. The store password is **not** in the repo. Ask Brian for it. The script adds one item to a test cart and empties it. It never checks out.
- **Theme Check:** `@shopify/theme-check-node` (call its `check(root)` from a small script). Last result: 0 errors, 6 warnings (all for the Google Fonts links, the same as v3).

## Things learned the hard way

- **Printify's photo order in Shopify:** one front photo per color comes first (linked to that color's variants), then each color's other views as a group in the same color order, then the size chart. `snippets/hp-color-urls.liquid` depends on this. `live_check.js` will catch it if Printify ever changes.
- **Option order differs:** tees store options as Size then Color; hoodies as Color then Size. The theme finds options by name, never by position.
- **Shopify's Liquid parser is stricter than liquidjs:** a literal `{{ '}' }}` passed locally but failed on upload. Always upload and read the `issues` list in the push result.
- **Admin API tokens are hard to get in 2026:** custom apps moved to the Dev Dashboard and their tokens expire. Theme Access covers themes only, so the theme cannot set metafields or create pages by itself. That is why per-product copy lives in the generated snippet `hp-extras.liquid`, not in metafields.
- **Horizon's password page hides its input:** to log in from Playwright, set the input's value with JavaScript and submit the form. The Node-side `page.request` ignores the proxy.

## Known gaps (not bugs, but worth deciding)

- The Shopify product description is not shown; the approved v3 copy is used. Editing a description in Shopify changes nothing on the page.
- The mailing list form saves to Shopify customers (tags `newsletter`, `dibs`). The coming-soon page's Cloudflare `DIBS` list is separate and must be merged at launch (website to-do 8).
- Two cards (Pocket Full of Treasures and Floral Butterfly) show the full front photo instead of v3's zoomed-in close-up.
- Shipping and returns policies are not written. The product page shows a yellow placeholder until policies exist in Shopify (Settings > Policies).
- The About and founder text on the homepage are still placeholders. Brian can edit them in the theme editor, including the "Show the Placeholder tag" checkboxes.
- Google Fonts load from Google, not Shopify's CDN. They could be self-hosted later (SIL Open Font License).
- New products appear after the six launch products. Their copy falls back to the Shopify description until they are added to `products.json`.

## Next steps, in order

1. About page and founder text in Brian's words, then re-upload and run `live_check.js` again.
2. Shopify's launch checklist.
3. Step 16: extend `scripts/publish_design.py` so new Printify products publish to Shopify as drafts.
4. Launch (Step 19) only after the samples are physically approved: connect the domain (keep the Cloudflare coming-soon backup for rollback), remove the password, and merge the email lists.

## Scheduled reminders already set

- `trig_0114SfQL895rp2aSrSc9HHZA`: Feb 5, 2027, a push notification that the $1 offer ends around Feb 15, 2027.
- `trig_01Tqk91XWiYUnSFWtoVVR3z3`: Oct 1, 2027, Printify token renewal.
