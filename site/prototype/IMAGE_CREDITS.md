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

## Hero agate AI SAMPLE pair (Nov 2, 2026)

| File | Tool and source | Date | Prompt summary | Replace with |
|---|---|---|---|---|
| `assets/stones/agate-hero-dry.webp` and `assets/stones/src/agate-hero-dry.png` | ChatGPT image generation, with a shared crop and WebP export | 2026-11-02 | Prompt 1a adapted for a transparent landscape cutout: rough pitted rind, one exposed banded face, muted dry color, and upper-left light. Exported at 1280 x 1024, quality 82, with the solid stone made fully opaque. | Brian's approved matched dry photograph of a real find. AI SAMPLE pending his review. |
| `assets/stones/agate-hero-wet.webp` and `assets/stones/src/agate-hero-wet.png` | ChatGPT image edit of the dry source, followed by mechanical registration and the original shared cutout/shadow | 2026-11-02 | Prompt 1b with strict geometry constraints: deeper wet color, a thin film, restrained glints, and two beads inside the outline. The first wet attempt was rejected for scale drift. The accepted redo was registered before the identical crop/export. | Brian's approved matched wet photograph of that same real find. AI SAMPLE pending his review. |
| `assets/stones/src/generated/agate-hero-dry.png` | Original ChatGPT image-generation output | 2026-11-02 | Unmodified 1536 x 1024 dry source for the hero pair. Kept for provenance, not loaded by the page. | Keep as the raw generation record. |
| `assets/stones/src/generated/agate-hero-wet.png` | Original ChatGPT image-edit output | 2026-11-02 | Unmodified 1536 x 1024 wet redo. Its returned alpha did not preserve transparency, so the final export restores the original dry cutout. Kept for provenance, not loaded by the page. | Keep as the raw edit record. |

The exported alpha channels are identical, with zero differing pixels. Internal generated features still have small residual drift: median 0.505px and 95th percentile 1.219px at export size. This is not a claim of exact alignment for every internal feature. The proof page is for review, and the full stone set is not made yet.
