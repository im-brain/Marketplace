# heavy pockets wordmark (option A, "Warm & human")

Status: **PROVISIONAL web asset.** Approved direction: option A from `source/wordmark-comparison-board.png` (Brian, Nov 7, 2026). Option B and the board's labels are not used anywhere.

## Files

| File | Use |
|---|---|
| `heavy-pockets-wordmark.svg` | Master. Single color, `fill="currentColor"`, so CSS sets the color. |
| `heavy-pockets-wordmark-cream.svg` | Primary on dark surfaces: Warm Cream #F3E8D2. |
| `heavy-pockets-wordmark-teal.svg` | Primary on light surfaces: Deep Teal #164745. |
| `heavy-pockets-wordmark-teal-rust.svg` | Secondary only: "heavy" Deep Teal, "pockets" Rust #A7472D, echoing the embroidered hoodie. Not the primary logo. |
| `source/wordmark-comparison-board.png` | The approved comparison board, unchanged (SHA-256 ad129f01b9497a6fa7a995754a728d7573f6ec1b9e3bf3ee97d2664bb4d511a9). Source evidence only. Never place it on the site. |
| `qa/` | Source crop, trace mask, renders, and a pixel diff (`trace-vs-source-diff.png`: gray = both, red = source only, blue = trace only). |

Exact text: `heavy pockets`, all lowercase. No "Co.", tagline, flowers, trees, mountains, badge, or scenery. Do not set the tagline directly under it.

## How it was made

`python3 scripts/trace_wordmark.py` crops option A, upscales it 4x, separates teal ink from cream paper, smooths away the paper texture, and fits curves with potrace (`pip install potracer`). It produced 16 contours: 6 for "heavy" (the "v" and "y" touch in the source art, so they are one shape) and 10 for "pockets".

## What was checked

- Overlap with the source pixels: 98.1% (IoU 0.981 at 1236 px wide). Differences are about one pixel along the edges.
- Letter count and counters are correct. The "vy" join is in the original art, not a trace artifact.
- Readable at 28 px tall (phone header) and 160 px wide.

## What remains (needs real artwork work)

The source is a 1536 px AI-generated raster, so this trace inherits its small wobbles. It is fine for the website preview. Before use on garments, embroidery, signage, or print:

1. A designer redraws or cleans the curves: even stroke weights, consistent terminals and corner radii, and fewer nodes.
2. Decide whether the "vy" join stays.
3. Check letter spacing optically, and make a small-size version if it will appear under about 20 px tall.
4. Confirm the final teal and rust values for print (Pantone or thread colors).

This update does not change garment wordmarks, designs, or Printify artwork.
