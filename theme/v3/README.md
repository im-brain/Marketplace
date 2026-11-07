# Storefront preview v3

Built Nov 7, 2026 from the storefront brief (Brian's approved decisions). It is a complete private shopping preview of the six current products. Nothing is for sale: no Shopify, no checkout, no email service, and no Printify changes. Review notes, test results, missing assets, and next steps are in `HANDOFF.md`.

`theme/v2/` (the earlier approved preview) and `theme/preview/` are unchanged.

## Pages

| File | What it is |
|---|---|
| `index.html` | Home: header, short shoreline hero, all six products, brand story, email signup (preview only), and footer. |
| `<product-slug>.html` (6) | Product pages: gallery, color and size, quantity, add to preview cart, and info sections. Direct links keep `?color=` and `?size=`. |
| `cart.html` | Preview cart: quantities, remove, subtotal, and a disabled checkout. |
| `field-notes.html` | Field Notes: a small dry and wet stone demo plus draft notes with sources. |
| `preview-notes.html` | Notes for Brian: wordmark, loader, hero treatment, prices, availability, and test switches. Linked from the footer only. |

## How to change things

All pages are generated. Edit the sources, then run `node theme/v3/build.js` (no dependencies).

- **Prices:** `src/pricing.json` is the only place a price lives. All are provisional.
- **Product copy, colors, and decoration:** `src/products.json`. The build fails if the approved colors stop matching Printify's enabled colors, or if Indigo Blue reappears.
- **Variants, availability, images, and swatches:** `src/printify-snapshot.json`, made by `python3 scripts/storefront_assets.py fetch` (read-only GET) then `build`. Images come out as 900 px WebP in `img/products/<slug>/`.
- **Placeholder copy** is marked with a yellow PLACEHOLDER tag in the page, and lives in `build.js` (search for `ph(`). Swap the text and the layout stays the same.
- **Wordmark:** `brand/v3/wordmark/` (copied in at build time).

## The wet reveal (homepage cards only)

- Resting: the real supplier mockup with a gentle CSS filter (lower saturation, slightly lighter). Nothing is moved, warped, or recolored.
- Reveal: an identical full-color copy sits on top and is uncovered by a splash-shaped clip that grows from where you touched or hovered, with a faint ripple ring. About 1.1 seconds.
- Triggers: mouse hover, keyboard focus anywhere in the card, any touch on the image (including the start of a scroll), and the small "Wet it" button.
- Phones: the touch listener is passive and never calls `preventDefault`, so scrolling stays native. Links open on a real tap only; a scroll never fires a click.
- Memory: revealed products are stored by product slug in `sessionStorage` (`hp.wet`), so they stay full color for the rest of the visit, including after Back or a reload. A new visit starts muted. Changing colors keeps the reveal.
- Fallbacks: with reduced motion, no `clip-path` support, no JavaScript, or a failed image, every image is shown in full color right away.
- Product pages never use the effect: they show the true full-color mockups immediately.

## Loader (provisional)

Three small pebbles turn from sand to wet colors one at a time. It appears only in image areas and the cart, only after 350 ms of real waiting, and has status text. Reduced motion shows it still. Not an approved mascot or final illustration.

## Testing

```
cd theme/v3 && python3 -m http.server 8777 &
node theme/v3/qa/run_qa.js http://localhost:8777 /path/to/axe-core/axe.min.js
```

333 browser checks (Playwright Chromium, desktop and touch emulation), plus an axe accessibility scan when the axe path is given (`npm install axe-core` anywhere). Results go to `qa/last-run.txt`, screenshots to `qa/screens/`. Test switches: `?simulate=noimages` and `?simulate=nostorage`.

## Fonts

Atkinson Hyperlegible Next and Press Start 2P from Google Fonts, both SIL Open Font License 1.1. If they get self-hosted, include the OFL text next to the files.
