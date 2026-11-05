# Storefront preview v2 (retro desktop)

Built Nov 5, 2026 on the locked brand system (`brand/v2/BRAND_SYSTEM_LOCK.md`) and the owner-approved hero art (`brand/v2/hero-assets/`). Preview only: no checkout, no Shopify, no Printify calls. The Step 11 preview in `theme/preview/` is unchanged.

## Files

- `index.html`: the page. Real HTML for every product, so it reads without JavaScript.
- `storefront.css`: components built on `brand/v2/brand-tokens.css`. It adds only two derived values: `--hp-rust-hover` (#BC5436, white text 4.71:1) and `--hp-shadow-deep` (#07101D, the hard shadow from the approved hero preview).
- `storefront.js`: tee mockups and stone drawings, wet toggles, product viewer, filter, preview cart, and the wet test.
- `qa/`: screenshots plus `run_qa.js` (45 browser checks) and `contrast.js` (WCAG text contrast).

Shared assets are linked, not copied: hero art from `brand/v2/hero-assets/`, the lick art and sock images from `theme/preview/img/`.

## How to view locally

From the repo root: `python3 -m http.server 8765`, then open `http://localhost:8765/theme/v2/`.

## Retro buttons

One system covers CTAs (`.btn`), secondary buttons (`.btn--secondary`), size and color options (`.opt`, real radio inputs), tabs and filters (`.tab`), and small actions (`.icon-btn`).

- Raised: square corners, sand border, a 90s bevel (light top-left, dark bottom-right), and a 4px hard offset shadow.
- Hover (mouse only): rust lightens to #BC5436. No movement or growth.
- Pressed: moves 3px down and right, the shadow drops to 1px, and the bevel flips inward. 70ms stepped transition, so it snaps rather than slides.
- Selected tabs and options stay pressed in.
- Keyboard: Space and Enter show the same pressed look on buttons. Focus is a 3px gold outline.
- Loading: `aria-busy="true"` holds the button down and shows a stepped three-block loader. Disabled: graphite, no press.
- Reduced motion: no transitions. Touch: works on iOS Safari (needs the empty touchstart listener in the script).
- Links that look like buttons still navigate instantly; the effect never delays anything.

## Honesty rules kept

Prices are labeled planned. Three tees are labeled stand-in art and cannot be added to the cart. Stones are labeled code-drawn stand-ins. Field notes are labeled drafts with their sources. No reviews, ratings, badges, policies, or addresses.

## Fonts

Press Start 2P and Atkinson Hyperlegible Next, both SIL Open Font License 1.1, loaded from Google Fonts with system fallbacks. If they get self-hosted later, add the OFL text next to the font files.
