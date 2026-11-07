# Storefront preview v3: handoff for Brian

Built Nov 7, 2026 from the storefront brief. Status: **ready for Brian's review. Not merged, not deployed.** The live coming-soon site is untouched. No Shopify, no subscriptions, no purchases, no emails, and no Printify changes (Printify was only read).

## What you can open

- **Private preview link:** see the PR description and `CLAUDE.md` (published as a private claude.ai artifact, the same workflow as earlier previews). It opens on a phone. Private by default: only you can see it unless you choose to share it.
- **Locally:** `cd theme/v3 && python3 -m http.server 8777`, then open `http://localhost:8777/`.
- Screenshots: `qa/screens/` (desktop, tablet, phone, landscape, 200% zoom, mid-reveal, loading, and failure states).

## The six products (current register)

| Design | Printify product ID | Colors | Decoration | Preview price |
|---|---|---|---|---|
| Midnight Rock Hunt Tee | 6aed148a25c13f11c005d795 | Graphite, Black, Navy | Left chest and back DTG | $40 |
| Great Lakes Rock Crew Tee | 6aed15a703c89fadbb06417b | Bay, Blue Jean, Moss, Yam, Watermelon | Front DTG | $30 |
| Field Notebook Tee | 6aed16a023aa5c82ac0ec3fa | Pepper, Graphite, Navy | Front DTG | $30 |
| Pocket Full of Treasures Tee | 6aed172ca1cc08ceee0d84e8 | Blue Jean, Light Green, Blue Spruce, Flo Blue, Violet | Printed left chest | $30 |
| Shoreline Hoodie | 6aed5b31258438e5f0070465 | Dark Heather, Heather Navy, Charcoal, Black, Navy, Purple | Left chest and back DTG | $60 |
| Floral Butterfly Embroidered Hoodie | 6aed59eda33f458524013eb9 | Light Blue, Sand, Light Pink | Center-chest embroidery, plain back | $60 |

These are Printify product IDs, not Shopify variant IDs. Printify's enabled colors matched the brief exactly on Nov 7, 2026 (the build checks this). Indigo Blue is not offered, and the build fails if it comes back. Prices are **provisional** (see `src/PRICING_REVIEW.md`).

## What was tested (Nov 7, 2026)

Automated: `qa/run_qa.js`, 333 checks, all passing, plus an axe accessibility scan (including color contrast) on five pages with no violations. Full list in `qa/last-run.txt`. Highlights:

- All six cards, in order, with only the approved colors and labeled preview prices. Each links to its own page.
- Every page, image, and internal link returns 200. No requests leave the site except Google Fonts.
- Direct links, reload, browser Back, and "Back to the collection." `?color=` and `?size=` survive reloads. Invalid sizes in a link are ignored.
- Gallery images match the chosen color for every color of every product. Front and back views and artwork close-ups present.
- Size rules: Shoreline Heather Navy stops at 3XL; Embroidered Sand stops at 3XL; Light Pink has 5XL but no 4XL; Yam / 4XL and Violet / 4XL disabled (Printify marked them unavailable). Switching to a color that lacks your size clears it and says why.
- Wet reveal: hover, keyboard focus, the "Wet it" button, and touch. A touch swipe across a product image scrolls the page natively, reveals the card, and does not open the product. A deliberate tap opens it. Touch cancel leaves nothing stuck. The touch listener never blocks scrolling. Reveal lasts for the visit (Back and reload), color changes keep it, and a new visit starts muted.
- Product pages show the true full-color image immediately.
- Cart: no add without a size, add, merge of the same variant, separate lines for different variants, quantity up, typed quantity capped at 10, remove, subtotal, empty state, persistence across pages, and cleanup of bad stored data. Checkout is disabled and explains why.
- Signup: empty and invalid errors; a valid address gets an honest preview message. No network request and nothing saved.
- Failure states: images failing, storage blocked, reduced motion (full color, no animation, still loader), slow images (loader appears after 350 ms and goes away).
- Layouts: 320, 375, 390, landscape phone (844 x 390), tablet 768 and 1024, desktop 1440, and 200% zoom of 1280. No sideways scrolling. The hero shows the whole sunset and the lighthouse at every size.
- Keyboard only: skip link, reaching a card, opening it, choosing a size, and adding to the cart. Visible gold focus outline.

**Limits of this testing:** Chromium only, with phone and touch *emulation*. Not tested on a real iPhone, iPad, or Safari. Please try the link on your phone and iPad, upright and sideways.

## Provisional items (need your review)

1. **Wordmark:** a faithful trace of option A (98% pixel overlap with the source) in `brand/v3/wordmark/`. Good for the web preview. Needs a designer's cleanup before garments, embroidery, or print. Details in that folder's README.
2. **Hero:** the approved hero images have the old logo and tagline baked in. The preview uses **review crops** that leave out the old branding and keep the sunset, lighthouse, and featured stones. Masters are unchanged. This is a stand-in, not a final edit.
3. **Loading icon:** three pebbles that get wet one at a time. Provisional, not an approved mascot or illustration. Shown only during real waits.
4. **Prices:** $30, $40, and $60 proposals, with larger-size adjustments not set.
5. **Placeholder copy:** brand story, Brian's intro, shipping and returns, and the future Field Notes entry, each tagged PLACEHOLDER.
6. **Field Notes:** draft entries from the Nov 4 fact-checked field guide, labeled Draft, with sources.

## Missing assets and decisions (most important first)

1. **Approve or change preview prices**, and decide larger-size adjustments (2XL and up). Printify costs by size are in `src/PRICING_REVIEW.md`.
2. **Sample approval.** Samples are ordered but not physically approved. After they arrive: confirm print color and placement, embroidery quality, fit, and care labels.
3. **Real sample photos** (each product, both sides where printed, close-ups of print and embroidery) and **lifestyle photos**. Each gallery has a "Photos soon" tile where they go.
4. **Clean, logo-free hero art** (desktop 1774 x 887 and mobile 1086 x 1448) from the original art source, so the crops can be retired.
5. **Production wordmark vector** from a designer, based on option A.
6. **Brand story and founder intro** in your own words (2 to 4 sentences each), plus a photo of you if you want one.
7. **Shipping and returns policies.**
8. **Live stock check** before launch. The preview uses Printify data from Nov 7, 2026. Earlier Shoreline Hoodie stock exceptions did not show in that data, so Shoreline availability is unverified.
9. **Choose a loading icon direction** (keep the pebbles, or ask for something else).
10. **Email service** for the signup form, when you want one. The form stays preview-only until then.
11. **Field Notes:** clear the remaining [VERIFY] items in `content/Field_Guide_Draft.md` before the drafts go final, and add your own finds.
12. **Optional:** self-host the two fonts with their OFL license files before launch.

## Next steps

1. Open the preview on your phone and desktop. Note anything that feels off.
2. Decide prices and size adjustments; edit `src/pricing.json` (or tell Claude), then rebuild.
3. When samples arrive and pass, swap supplier mockups for sample photos (`img/products/`, or add gallery items in `build.js`).
4. Replace placeholder copy in `build.js` (search for `ph(`). Layouts stay the same.
5. Get clean hero art and the production wordmark, then retire the review crops.
6. Only after samples are approved and this preview is signed off: Step 12 (open Shopify, connect Printify and the domain), then move these pages into a Shopify theme with real checkout. Not before.

The game, the collection keepsake, and receipt integration remain deferred.
