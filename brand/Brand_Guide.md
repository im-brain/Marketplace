# Heavy Pockets Co. Brand Guide

v1, approved by Brian on Nov 1, 2026 (Step 4). To revisit during the Step 5 website build with real photos and hand-made details.
See it live: open `brand/brand_preview.html` in a browser.

## The idea

**Wet Stone.** Rockhounds wet a stone to see its true color. Every part of the brand has a dry state and a wet state.

- Tagline: **Head down. Pockets full.**
- Secondary line: **Dry rocks lie.**
- Wet is always **deeper and richer, never brighter**. That is what water really does to stone.
- On the site, things get wet fast (0.45 seconds) and dry slowly (1.4 seconds), like a real stone in the sun.

## Colors

| Color | Dry (matte) | Wet (true color) | Use it for |
|---|---|---|---|
| Superior slate | `#6B7780` | `#22394A` | Main color: headings, buttons, and the logo |
| Agate red | `#B87358` | `#9A2B1C` | Accent only: the logo streak, agate bands, and sale tags |
| Petoskey gray / brown | `#A39E94` | `#6E4F35` | Socks and charts (dry Petoskey is gray; wet, the eyes turn brown) |
| Sand | `#DCCFB6` | `#A8875A` | Panels, and the logo on dark tees |

Neutrals: Beach fog `#EEEDE8` (light background), Ink `#1C1E1F` (text), and Night `#14181B` (dark background).

Rules:
- Use about 60% slate or a neutral, 30% sand or Petoskey, and 10% agate red. Red is the spice.
- **Light tees** (white, natural, sand): use the wet colors.
- **Dark tees** (charcoal, navy, black): use sand and the dry colors. Printers lay white ink under the color on dark fabric, and the dry values hold up better there.
- Every text pairing passes the WCAG contrast check (`python3 scripts/check_contrast.py`).
- Colors on fabric will not match the screen. Judge them on the Step 11 samples.

## Fonts

All three are free Google Fonts under the SIL Open Font License: commercial use, printing on products, and use in a logo are all allowed. Copies and licenses are in `brand/fonts/`.

| Role | Font | Where |
|---|---|---|
| Display | **Fraunces** ExtraBold (800) | The logo, shirt slogans, and headlines |
| Body | **Work Sans** Regular and SemiBold | Product pages, captions, and email |
| Field notes | **IBM Plex Mono** | The field note on each design, chart labels, and prices |

Fraunces has a "soft" setting (SOFT 0 is crisp, SOFT 100 is rounded). Crisp is dry; soft is wet, like a wave-worn stone. The site can use this on hover.

## Wordmark

Type only, set in Fraunces and turned into outlines, so it never depends on an installed font. The one idea is **the lick**: a single glossy streak across "oc" where the letters change from dry to wet. It is the "I lick rocks" design shrunk into the logo.

Files are in `brand/wordmark/` (SVG) and `brand/wordmark/png/` (300 dpi PNG for Printify). To rebuild them: `python3 scripts/build_wordmark.py`.

| Version | Use it for | Smallest size |
|---|---|---|
| Primary (one line) | Site header, left chest, and packaging | 1.5 in wide |
| Stacked (two lines) | Hat fronts, square posts, and the profile picture | 1 in wide |
| HP mark | Sleeve tags, sock cuffs, the hat side, and the favicon | 0.5 in wide |

Color versions: `agate-on-light` (default), `slate-on-light`, `sand-on-dark`, `ink` (one color), and `white` (one color).

Rules:
- Leave clear space around the logo equal to the height of the "H".
- The one-color versions have **no lick**. Use them for one-ink printing, embroidery, and stamps.
- Below about 1 inch the lick gets too small to see. That is fine; the letters still carry it.
- Don't stretch, outline, add shadows, change the colors, or move the lick to another letter.
- Don't add a stone, pickaxe, or wave icon.

## Voice

A rockhound talking to another rockhound on the beach: head down, dry humor, and always accurate.

We sound like:
- "Wet it first. Dry rocks lie."
- "Found at Whitefish Point after a north wind." (real place names, real conditions)
- "Leland Blue is furnace slag. We still love it."

We never:
- Claim healing powers or magic properties for stones.
- Print a stone ID that Brian has not confirmed against a reliable reference.
- Use hype words like "epic," "insane," or "must-have."
- Use em dashes. We always use the Oxford comma.

## How the launch 5 use the kit

| Design | Kit use |
|---|---|
| Great Lakes beach stone chart | Wet slate ground, sand type, stones in their wet colors, and Plex Mono labels. Leland Blue gets a "not a stone, it's slag" note. |
| Agate Expectations | Agate red bands, Fraunces italic and ExtraBold, on a sand or natural tee. |
| Will brake for agates | Bumper-sticker layout on a dark tee, in sand and dry agate red. |
| Petoskey hexagon socks | Dry gray grout, wet brown cells, a dark eye in each cell, and the HP mark on the cuff. |
| I lick rocks | A dull, dry stone with one glossy lick showing agate red. It's the same streak as the logo. |

## Files

- `brand/brand_preview.html`: the interactive preview (light and dark mode).
- `theme/brand-tokens.css`: colors and fonts as CSS variables for the Step 5 preview and the Shopify theme.
- `scripts/build_wordmark.py`: rebuilds the logo files.
- `scripts/check_contrast.py`: checks text contrast for every color pairing.
