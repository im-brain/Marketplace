# Storefront preview v3: handoff for Brian

Built Nov 7, 2026 from the storefront brief. Status: **approved by Brian, Nov 7, 2026** ("Everything is approved"). **Merged into `main` Nov 7, 2026. Not deployed.** The live coming-soon site is untouched. No Shopify, no subscriptions, no purchases, no emails, and no Printify changes (Printify was only read).

## What you can open

- **Private preview link:** https://claude.ai/artifact/9TVdpea8d1YBc3vfUq11hz (a private claude.ai artifact, the same workflow as earlier previews). It opens on a phone. Private by default: only you can see it unless you choose to share it.
- **Locally:** `cd theme/v3 && python3 -m http.server 8777`, then open `http://localhost:8777/`.
- Screenshots: `qa/screens/` (desktop, tablet, phone, landscape, 200% zoom, mid-reveal, loading, and failure states).

## The six products (current register)

| Design | Printify product ID | Colors | Decoration | Price (S to XL) |
|---|---|---|---|---|
| Midnight Rock Hunt Tee | 6aed148a25c13f11c005d795 | Graphite, Black, Navy | Left chest and back DTG | $40 |
| Great Lakes Rock Crew Tee | 6aed15a703c89fadbb06417b | Bay, Blue Jean, Moss, Yam, Watermelon | Front DTG | $30 |
| Field Notebook Tee | 6aed16a023aa5c82ac0ec3fa | Pepper, Graphite, Navy | Front DTG | $30 |
| Pocket Full of Treasures Tee | 6aed172ca1cc08ceee0d84e8 | Blue Jean, Light Green, Blue Spruce, Flo Blue, Violet | Printed left chest | $30 |
| Shoreline Hoodie | 6aed5b31258438e5f0070465 | Dark Heather, Heather Navy, Charcoal, Black, Navy, Purple | Left chest and back DTG | $60 |
| Floral Butterfly Embroidered Hoodie | 6aed59eda33f458524013eb9 | Light Blue, Sand, Light Pink | Center-chest embroidery, plain back | $60 |

These are Printify product IDs, not Shopify variant IDs. Printify's enabled colors matched the brief exactly on Nov 7, 2026 (the build checks this). Indigo Blue is not offered, and the build fails if it comes back. Prices are **approved** (Nov 7, 2026): 2XL +2 dollars, 3XL +4, 4XL and 5XL +6, standard U.S. shipping included. Details in `src/PRICING_REVIEW.md`.

## What was tested (Nov 7, 2026)

Automated: `qa/run_qa.js`, 359 checks, all passing, plus an axe accessibility scan (including color contrast) on five pages with no violations. Full list in `qa/last-run.txt`. Highlights:

- All six cards, in order, with only the approved colors and "From" prices. Each links to its own page.
- Every page, image, and internal link returns 200. No requests leave the site except Google Fonts.
- Direct links, reload, browser Back, and "Back to the collection." `?color=` and `?size=` survive reloads. Invalid sizes in a link are ignored.
- Gallery images match the chosen color for every color of every product. Front and back views and artwork close-ups present.
- Size rules: Shoreline Heather Navy stops at 3XL; Embroidered Sand stops at 3XL; Light Pink has 5XL but no 4XL; Yam / 4XL and Violet / 4XL disabled (Printify marked them unavailable). Switching to a color that lacks your size clears it and says why.
- Wet reveal: hover, keyboard focus, the see-through "Show" label, and touch. A touch swipe across a product image scrolls the page natively, reveals the card, and does not open the product. A deliberate tap opens it. Touch cancel leaves nothing stuck. The touch listener never blocks scrolling. Reveal lasts for the visit (Back and reload), color changes keep it, and a new visit starts muted.
- Pages open at the top, including inside a stretched frame like the iPad viewer, and "Back to the collection" lands on the card.
- Customers never see "supplier" or "Printify" on any shopper page (text or image descriptions).
- Product pages show the true full-color image immediately.
- Cart: no add without a size, add, merge of the same variant, separate lines for different variants, quantity up, typed quantity capped at 10, remove, subtotal, empty state, persistence across pages, and cleanup of bad stored data. Checkout is disabled and explains why.
- Signup: empty and invalid errors; a valid address gets an honest preview message. No network request and nothing saved.
- Failure states: images failing, storage blocked, reduced motion (full color, no animation, still loader), slow images (loader appears after 350 ms and goes away).
- Layouts: 320, 375, 390, landscape phone (844 x 390), tablet 768 and 1024, desktop 1440, and 200% zoom of 1280. No sideways scrolling. The hero shows the whole sunset and the lighthouse at every size.
- Keyboard only: skip link, reaching a card, opening it, choosing a size, and adding to the cart. Visible gold focus outline.

**Limits of this testing:** Chromium only, with phone and touch *emulation*. Not tested on a real iPhone, iPad, or Safari. Please try the link on your phone and iPad, upright and sideways.

## Changes from your iPad review (Nov 7, 2026)

1. Wordmark: the "v" and "y" no longer touch.
2. Resting state is 15 points drier (saturation 0.55 to 0.40, a little lighter and flatter), so the reveal is more obvious.
3. "Wet it" and "Wet" buttons removed. A small see-through "Show" sits in the image corner and fades away after the reveal.
4. Phone hero shows the whole scene again, rocks included.
5. Pages now open at the top instead of where the last page was scrolled.
6. Size-range text removed (the size keys show it).
7. "Supplier" and "Printify" removed from everything shoppers see.
8. Color counts removed from the product cards.

## Approved Nov 7, 2026, with what is still open

1. **Wordmark:** approved for the website (option A trace with the v and y rebuilt). Still needs a designer's cleanup before garments, embroidery, or print. Details in that folder's README.
2. **Hero:** the approved hero images have the old logo and tagline baked in. The preview uses **review crops** that leave out the old branding and keep the sunset, lighthouse, and featured stones. Masters are unchanged. Approved as the current treatment; clean logo-free art would still be better.
3. **Loading icon:** three pebbles that get wet one at a time. Approved Nov 7, 2026. Shown only during real waits.
4. **Prices:** approved, including the size steps.
5. **Placeholder copy:** layout approved; the words are still placeholders (brand story, Brian's intro, shipping and returns, and the future Field Notes entry), each tagged PLACEHOLDER.
6. **Field Notes:** draft entries from the Nov 4 fact-checked field guide, labeled Draft, with sources.

## Missing assets and decisions (most important first)

1. **Sample approval.** Samples are ordered but not physically approved. After they arrive: confirm print color and placement, embroidery quality, fit, and care labels.
2. **Real sample photos** (each product, both sides where printed, close-ups of print and embroidery) and **lifestyle photos**. Each gallery has a "Photos soon" tile where they go.
3. **Clean, logo-free hero art** (desktop 1774 x 887 and mobile 1086 x 1448) from the original art source, so the crops can be retired.
4. **Production wordmark vector** from a designer, based on option A.
5. **Brand story and founder intro** in your own words (2 to 4 sentences each), plus a photo of you if you want one.
6. **Shipping and returns policies.**
7. **Live stock check** before launch. The preview uses Printify data from Nov 7, 2026. Earlier Shoreline Hoodie stock exceptions did not show in that data, so Shoreline availability is unverified.
8. **Email service** for the signup form, when you want one. The form stays preview-only until then.
9. **Field Notes:** clear the remaining [VERIFY] items in `content/Field_Guide_Draft.md` before the drafts go final, and add your own finds.
10. **Optional:** self-host the two fonts with their OFL license files before launch.

## Next steps

1. When samples arrive and pass, swap supplier mockups for sample photos (`img/products/`, or add gallery items in `build.js`).
2. Replace placeholder copy in `build.js` (search for `ph(`). Layouts stay the same.
3. Get clean hero art and the production wordmark, then retire the review crops.
4. Only after samples are approved and this preview is signed off: Step 12 (open Shopify, connect Printify and the domain), then move these pages into a Shopify theme with real checkout. Not before.

The game, the collection keepsake, and receipt integration remain deferred.
