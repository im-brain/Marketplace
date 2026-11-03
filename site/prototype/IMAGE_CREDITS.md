# Prototype image credits

Every image in the prototype is listed here with its source and license, so all of them can be found and replaced.

## Current images (Nov 2, 2026)

| Where | What | Source | License | Replace with |
|---|---|---|---|---|
| All stones (homepage, Field Guide strip, menu, chart concept) | SAMPLE stones drawn in code by `stone.js`. The "dry" state is a simulated matte filter, not a photo. | Original code in this repo | Ours | Brian's own dry and wet photo pairs of real stones |
| Product art (chart tee, I lick rocks, Agate Expectations, Will brake for agates, Petoskey socks) | Concept art drawn in code. Not product photos and not final designs. | Original code in this repo | Ours | Real photos of approved Printify samples (accurate color) |

No stock photos are used yet.

## Why there's no stock yet

Unsplash's and Pexels' websites block automated scripts with a bot check, and getting around a bot check isn't allowed. Unsplash's free official API (`api.unsplash.com`, with a free developer access key) is the legitimate route. Its guidelines require crediting the photographer and loading images from Unsplash's servers, which the prototype can do.

## Rules for later images

- Stock photos are for mood and layout only. Never present one as a Heavy Pockets product or as a verified specimen.
- Field Guide stone photos must be accurate to the stone named, and Brian approves each one.
- Wet Stone pairs: same spot, same framing, shade, a tripod or a propped-up phone. Shoot the stone dry, mist it with water, and shoot again.
- Product photos show the real garment and print color. Never apply Wet Stone to them.

## Loaded letters logo assets (Nov 2, 2026)

| File | Tool and source | Date | Prompt or drawing summary | Replace with |
|---|---|---|---|---|
| `assets/logo/options/loaded-letters-concept.png` | ChatGPT image generation | 2026-11-02 | Loaded letters concept sheet: rounded white lettering and an HP monogram on cobalt; no orange, products, or specimens. Reference only. | Keep as process reference; do not use as the logo. |
| `assets/logo/hp-wordmark.svg`, plus its `src/` master | Original vector work in code, starting from Bagel Fat One under SIL OFL 1.1 | 2026-11-02 | Redrawn H and P, weighted lower curves, fitted spacing, smaller Co., and a rounded-square period. All lettering is outlined. | Approved final master, after Brian and Claude review. |
| `assets/logo/hp-stacked.svg`, plus its `src/` master | Original vector work in code, with the same licensed starting shapes | 2026-11-02 | Stacked Loaded letters identity for square uses. | Approved final master, after review. |
| `assets/logo/hp-wordmark-1c.svg`, plus its `src/` master | Original vector work in code, with bolder filled outlines | 2026-11-02 | One-color stacked version for small production use. No gradients or live type. Supplier stitch proof required. | Supplier-approved production master. |
| `assets/logo/hp-mark.svg`, plus its `src/` master | Original custom SVG drawing | 2026-11-02 | Shared-stem HP mark with open counters; no stone icon. | Approved final master, after review. |
| `assets/logo/favicon.svg`, its `src/` master, `favicon-32.png`, and `apple-touch-icon.png` | Original SVG drawing and browser raster export | 2026-11-02 | White HP on cobalt, with a rounded square background. | Keep with the approved identity. |
| `assets/logo/src/tray-background.png` | ChatGPT image generation | 2026-11-02 | Empty cobalt sorting tray with uneven wells and upper-left light. No stones, products, text, or orange. | Optional photograph of a real empty tray. |
| `assets/logo/og-card.png` and `assets/logo/src/og-card.svg` | Original SVG composition and browser raster export over the generated tray | 2026-11-02 | Exact outlined wordmark, HP mark, and tagline on the empty tray. No invented finds or garment imagery. | Approved social card, after review. |

## Hero agate AI SAMPLE pair (Nov 2, 2026)

| File | Tool and source | Date | Prompt summary | Replace with |
|---|---|---|---|---|
| `assets/stones/agate-hero-dry.webp` and `assets/stones/src/agate-hero-dry.png` | ChatGPT image generation, with a shared crop and WebP export | 2026-11-02 | Prompt 1a adapted for a transparent landscape cutout: rough pitted rind, one exposed banded face, muted dry color, and upper-left light. Exported at 1280 x 1024, quality 82, with the solid stone made fully opaque. | Brian's approved matched dry photograph of a real find. AI SAMPLE pending his review. |
| `assets/stones/agate-hero-wet.webp` and `assets/stones/src/agate-hero-wet.png` | ChatGPT image edit of the dry source, followed by mechanical registration and the original shared cutout/shadow | 2026-11-02 | Prompt 1b with strict geometry constraints: deeper wet color, a thin film, restrained glints, and two beads inside the outline. The first wet attempt was rejected for scale drift. The accepted redo was registered before the identical crop/export. | Brian's approved matched wet photograph of that same real find. AI SAMPLE pending his review. |
| `assets/stones/src/generated/agate-hero-dry.png` | Original ChatGPT image-generation output | 2026-11-02 | Unmodified 1536 x 1024 dry source for the hero pair. Kept for provenance, not loaded by the page. | Keep as the raw generation record. |
| `assets/stones/src/generated/agate-hero-wet.png` | Original ChatGPT image-edit output | 2026-11-02 | Unmodified 1536 x 1024 wet redo. Its returned alpha did not preserve transparency, so the final export restores the original dry cutout. Kept for provenance, not loaded by the page. | Keep as the raw edit record. |

The exported alpha channels are identical, with zero differing pixels. Internal generated features still have small residual drift: median 0.505px and 95th percentile 1.219px at export size. This is not a claim of exact alignment for every internal feature. The proof page is for review, and the full stone set is not made yet.

## Hero agate revision 2 (Nov 2, 2026)

This revision replaces the first hero draft, which Brian rejected as too neatly cut. The earlier images remain in Git history at commit `a8a9f4b11c2f53d5ad03c7b06acdf8d2f2ec2ccf`; the current files at the same paths are the new rounded specimen. Brian's three reference photos informed appearance only. They are not copied, traced, or published in this repo.

| File | Tool and source | Date | Prompt summary | Replace with |
|---|---|---|---|---|
| `assets/stones/agate-hero-dry.webp` and `assets/stones/src/agate-hero-dry.png` | ChatGPT image generation using Brian's reference photos for visual guidance, followed by mechanical crop/export | 2026-11-02 | A distinct rounded, uneven, dry beach pebble with cloudy material, patchy rind, natural hollows, and interrupted fine bands across a convex surface. No planar slice, neat display window, or polished face. | Brian's approved matched dry photograph. AI SAMPLE pending his review. |
| `assets/stones/agate-hero-wet.webp` and `assets/stones/src/agate-hero-wet.png` | ChatGPT image edit of the new dry source, followed by mechanical registration and a shared original cutout/shadow | 2026-11-02 | Same continuous rounded surface, with slightly deeper color, clearer existing bands, restrained glints, and two tiny beads. No new cut plane or broad polish. | Brian's approved matched wet photograph of that same find. AI SAMPLE pending his review. |
| `assets/stones/src/generated/agate-hero-dry.png` | Original ChatGPT generation for revision 2 | 2026-11-02 | Unmodified 1536 x 1024 source. Uses reference 1 for band structure, and references 2 and 3 for rounded form and uneven exposure. | Keep as provenance; not loaded by the page. |
| `assets/stones/src/generated/agate-hero-wet.png` | Original ChatGPT surface edit for revision 2 | 2026-11-02 | Unmodified 1536 x 1024 wet source. The export retains the dry outline, shadow, and framing. | Keep as provenance; not loaded by the page. |

Both WebPs are 1280 x 1024 at quality 82: dry 121,596 bytes, wet 108,180 bytes. Their alpha channels are identical. Measured internal feature residual is median 0.492px and p95 1.278px at export size, so every internal detail is not guaranteed to match pixel for pixel. This is still an AI SAMPLE review draft. The upper-left hollow and flaky lower patches need Brian's eye before approval.

## Hero agate revision 3 (Nov 2, 2026)

This revision uses Brian's latest two dry references to calibrate visible color, fine bands, and varied wear. It replaces the overly frosted, hollowed revision 2 at the same file paths. Revision 2 remains in Git history at `8fbdbbaa11c8d25bbe87e01756a10ed9dfb78939`. Reference photos are used for visual guidance only and are not copied, traced, or published.

| File | Tool and source | Date | Prompt summary | Replace with |
|---|---|---|---|---|
| `assets/stones/agate-hero-dry.webp` and `assets/stones/src/agate-hero-dry.png` | ChatGPT image generation with dry-reference guidance, followed by mechanical crop/export | 2026-11-02 | Compact, naturally worn dry pebble with clear rust/red color, fine angular bands, local pale patches, sparse tiny pits, and some chipped fracture texture. No deep bowl, blanket powder, flaky crust, or polished display window. | Brian's approved matched dry photograph. AI SAMPLE pending his review. |
| `assets/stones/agate-hero-wet.webp` and `assets/stones/src/agate-hero-wet.png` | ChatGPT surface edit of the dry source, followed by mechanical registration and a shared cutout/shadow | 2026-11-02 | Existing color and bands remain in place. Wetness adds modest depth, clearer contrast, restrained glints, and two tiny beads. No dramatic recoloring or new band structure. | Brian's approved matched wet photograph of the same find. AI SAMPLE pending his review. |
| `assets/stones/src/generated/agate-hero-dry.png` | Original ChatGPT generation for revision 3 | 2026-11-02 | Unmodified 1536 x 1024 dry source informed by the two latest dry references. | Keep as provenance; not loaded by the page. |
| `assets/stones/src/generated/agate-hero-wet.png` | Original ChatGPT image edit for revision 3 | 2026-11-02 | Unmodified 1536 x 1024 wet edit of that dry source. | Keep as provenance; not loaded by the page. |

The 1280 x 1024 WebPs use quality 82: dry 119,840 bytes, wet 114,524 bytes. Alpha channels match exactly. Internal feature residual is median 0.568px and p95 1.414px; exact internal pixel identity is not guaranteed. The upper angular band path remains quite regular, and accuracy still needs Brian's review.

## Hero agate dry, matte stand-in (Nov 3, 2026)

| File | Tool and source | Date | Prompt or process summary | Replace with |
|---|---|---|---|---|
| `assets/stones/agate-hero-dry.webp` and `assets/stones/src/agate-hero-dry-matte.png` | Claude, code adjustment with `scripts/matte_dry.py` of ChatGPT's revision 3 dry master (`src/agate-hero-dry.png`, unchanged) | 2026-11-03 | Color muted to 84%, flatter contrast, softened highlights, and a 6% warm gray dusty film, on the stone only. Alpha and geometry are identical to revision 3, so the pair still lines up. | ChatGPT's Task 1b dry edit, or Brian's own photo pair. |

## Retro direction sketch pixel art (Nov 3, 2026)

| File | Tool and source | Date | Summary | Replace with |
|---|---|---|---|---|
| `directions/retro/pebbles-day.svg`, `pebbles-night.svg`, `waves.svg`, `rockhound.svg`, `wordmark.svg`, and `pebble-glyph.svg` | Claude, original pixel art placed pixel by pixel in code by `scripts/retro_pixels.py` | 2026-11-03 | Beach pebble wallpaper (day and night), Lake Superior waves, a two-frame rockhound, a hand-drawn pixel "Heavy Pockets Co." wordmark, and a pebble separator. Inspired by 1990s home pages in general; nothing traced, copied, or taken from GeoCities, Windows, Netscape, or Twitter. | Keep, or redraw if Brian picks this direction. |
