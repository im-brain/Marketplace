# Waterline: the Heavy Pockets interaction system

**Shelved by Brian on Nov 10, 2026. Kept for reference.**

Proof of concept 01: the water reveal. Built Nov 9 to 10, 2026 on branch `claude/great-newton-wtguk0`.

**Status:** private proof of concept. Not deployed, not merged, and not approved. Nothing in the storefront preview (`theme/v3/`), the live coming-soon page, or `main` was changed. "Waterline" is a working name.

## What it is

Waterline is a small set of rules and files for touch interactions on the store. The idea: **your finger is the lake.**

- A tap leaves a wet fingerprint on the stone. A rub leaves a wet streak.
- Water shows the approved wet image in that spot only. Then it dries from its edges, and the stone goes dull again. "Dry rocks lie" is something you watch happen.
- "Dunk it" wets the whole stone (the waterline climbs from the bottom) and holds it wet until you press "Dry it off."

Only the water reveal is built. The shoreline and Stone-to-Story are designed below, not built.

## Open it

- **Private link:** https://claude.ai/artifact/19WcBfqYfXhb1Z78c5XWsg (a private claude.ai artifact, the same workflow as the v3 preview).
- **On a computer:** `cd theme/waterline && python3 -m http.server 8790`, then open `http://localhost:8790/`.
- **Captures:** `qa/screens/` (phone and desktop: dry, tap, rub, drying, waterline rising, dunked, reduced motion, and no JavaScript).

## Please try this on your iPhone

I could only test in Chromium with phone emulation. These are the things only your phone can confirm:

1. Tap the stone once. Do you get a wet fingerprint right away?
2. Rub side to side. Does the streak follow your finger smoothly?
3. Swipe up and down across the stone. Does the page scroll normally?
4. Wait about 15 seconds. Does it dry in a way that looks right?
5. Press "Dunk it," then "Dry it off."
6. Press "Show the speed readout" at the bottom of the page, rub the stone, and send me a screenshot of the numbers.
7. Turn the phone sideways and try again.

## The five rules

Every Waterline interaction, now and later, follows these.

1. **Never invent pixels.** You only see the approved dry image, the approved wet image, or a blend of the two. No added shine, glow, or droplets. This is `brand/v2/IMAGE_STANDARDS.md`, enforced by a test.
2. **Water arrives fast and leaves slow.**
3. **Two worlds, two ways of moving.** Pixel things (buttons, the lake art) move in steps. Real things (stones, water, and paper) move smoothly.
4. **The shopper causes it.** Nothing loops to grab attention. Only the lake will move by itself, and it will have a pause control.
5. **Every effect has a designed still version** for people who turn motion off.

## How it is built

No libraries and no build step. Seven small files in `assets/`:

| File | Job |
|---|---|
| `waterline.css` | Timing tokens (one place to tune speeds) and the stone stage styles. Uses the locked brand tokens and adds no colors. |
| `waterline.js` | The starter, and the only Waterline script that runs at page load. It gives every stone a simple tap or button swap, and fetches the effect only when a stone is near the screen or touched. |
| `core.js` | The shared engine: one frame clock that stops when nothing is wet, one visibility watcher, one reader that turns mouse, finger, and pen into the same samples, and the base stage element. |
| `water.js` | The water effect, as the `<hp-wet-stone>` element. |
| `debug.js` | The speed readout. A testing aid, fetched only when asked for. |
| `poc.css` | Styles for this demo page only. |
| `brand-tokens.css` | Byte copy of the approved tokens from `theme/v3/assets/`. |

**How the water works.** A small grid (192 by 154 cells) remembers how much water sits on each part of the stone. A touch adds water along its path. Water rests for 2.5 seconds, then evaporates, faster in some spots than others, so it dries in patches from the edges in. Each frame the grid becomes a see-through mask, and the approved wet image is drawn through that mask on one canvas that sits over the dry image. The two images share one outline, so they line up exactly.

**Fallback ladder.**

1. No JavaScript: the dry and wet stills side by side, captioned.
2. JavaScript but no effect (old browser, the effect file fails, or reduced motion): a tap or the button swaps the whole stone at once. This is the approved Field Notes behavior.
3. Full effect: local water that dries.

**Touch rules.**

- Up and down swipes always scroll the page (`touch-action: pan-y pinch-zoom`, and every listener is passive, so the code cannot block scrolling).
- A tap leaves a fingerprint. A sideways rub leaves a streak. Scrolling past leaves a print where your finger landed.
- Mouse: moving across leaves a thin trail, and pressing leaves more. Pen: pressure sets the width.
- Keyboard, switch, and screen reader: the "Dunk it" button, with the state read out ("Dry," "Wet where you touched it," "Wet all over," and "Drying off").

**Staying light.**

- Nothing is fetched for a stone that is hidden or far from the screen.
- The stone on screen gets ready while the page is idle (canvas, water grid, and the wet image decoded in the background, about 3.4 MB), so the first touch is instant. A dry stone that leaves the screen gives that memory back.
- The frame clock runs only while water is moving. Dry, or held wet, the page does zero work.
- Slow drying updates 20 times a second, not 60, to save battery.
- Canvas detail is capped at 2x, even on a 3x phone screen.

## The rest of the system (designed, not built)

**Adding an effect later** means adding one file that fills in the same six hooks (`setup`, `input`, `step`, `draw`, `still`, and `teardown`) and plugs into the same stage. Planned: `light.js` (hold a stone to the light), `loupe.js` (magnify), `paper.js` (field-note card), and `atmosphere.js` (time of day).

**Shoreline.** A small overlay on the water area of the hero only: sun glitter and foam that move in steps, about 6 frames a second, in the art's own colors, written in CSS so it costs no JavaScript at load. It pauses off screen, has a visible pause control, and is still under reduced motion.

**Stone-to-Story.** Shore stone, then inspection, then Field Note, as real page links, so Back, sharing, and Shopify navigation keep working. The stone image travels between pages with the browser's built-in View Transitions (Safari 18.2 and newer, and Chrome). Older browsers simply open the page. The inspection stage is the top of the Field Note page.

**Moving to Shopify (Step 13).**

| Here | In the theme |
|---|---|
| `assets/*.js` and `*.css` | theme `assets/`, loaded only on pages that use them. Minify them, and bundle `core.js` with each effect. |
| `<hp-wet-stone>` markup | `snippets/hp-wet-stone.liquid` |
| Stone data (name, image pair, dry and wet text, credit, and links) | a "Specimen" metaobject |
| Shoreline hero and specimen shelf | `sections/*.liquid`, additive |

Checkout, cart, and navigation are never touched.

## Test results

Run with `node theme/waterline/qa/run_qa.mjs` from the repo root (about 4 minutes; it serves the folder itself). Full list in `qa/last-run.txt`.

**131 checks passed, 0 failed** (final run, Nov 10, 2026). Highlights:

- The eight stone files match the approved originals byte for byte.
- The reveal is local: wet on the stroke, and untouched away from it. A tap alone leaves water.
- Rule 1: every solid pixel the effect draws equals the approved wet image, and water never spills past the stone outline. Fully dunked, the stone differs from the approved wet still by 0.46 of 255 levels on average. After drying, it matches the dry still again, with no residue.
- A pressed streak takes 15.5 seconds to dry. "Dry it off" takes 2.4 seconds.
- An up and down swipe that starts on the stone scrolls the page, and no listener ever blocked scrolling.
- Keyboard only: the first Tab stop is the button, Enter dunks, and Space dries.
- Every fallback works: no JavaScript, reduced motion, the effect file blocked, the wet image missing, motion switched off mid-visit, and a button press before the effect arrives.
- No sideways scrolling at 320, 375, 390, sideways phone, 768, 1024, 1440, and 200% zoom. The same readable dark page in light and dark system settings, with text contrast at least 4.5 to 1.

## Speed evaluation

Measured on an emulated iPhone 13 with the CPU slowed 4 times, to stand in for a slow phone. Full numbers in `qa/perf.json`.

| Measure | Target | Result | Met? |
|---|---|---|---|
| Work per frame while rubbing | under 4 ms | 0.66 ms average, 6.3 ms worst single frame | Yes on average |
| Work per frame while drying | under 4 ms | 0.20 ms average | Yes |
| Work per frame during a dunk | under 4 ms | 2.46 ms average | Yes |
| Work per frame while drying off | under 4 ms | 1.65 ms average | Yes |
| Tasks over 50 ms | none | none in the final run, and none in four repeat runs | Yes |
| Work while dry, or held wet | zero | zero frames | Yes |
| Layout shift | zero | zero | Yes |
| Script at page load | under 1.5 KB compressed | 1.04 KB minified, 1.66 KB as written | Only when minified |
| Effect code, loaded on demand | under 6 KB compressed | 4.60 KB minified, 8.14 KB as written | Only when minified |
| Wet image | not fetched until the stone is near the screen | fetched after load, and never for hidden stones | Yes |
| Outside libraries | none | none | Yes |

A frame has about 16.7 ms to spend at 60 frames a second, so even the slowed phone uses a small share of it.

Three things the tests caught, now fixed:

- Hidden stones were fetching their wet images. They now fetch nothing until shown.
- The first touch stalled for 50 to 160 ms on the slowed phone while the browser decoded the wet image. It is now decoded in the background ahead of time, and the status words update a moment after the water.
- The status line moved the page by a hair when its length changed. Two lines are now always reserved.

The minified sizes were measured once with terser 5.51.2. The test prints them again if terser is installed, and skips that line if not.

## Limits

1. **No real iPhone or Safari test.** Only Chromium is installed here. Emulation checks the logic and the layout. It does not prove Safari's touch handling, drawing speed, or memory behavior.
2. **Speed numbers come from a headless test browser on a server.** They show the code is light. They are not what your phone will report, which is why the readout exists.
3. **No automated accessibility scan.** The axe tool is not installed here. Contrast, keyboard use, focus, and screen reader labels were checked by the test script instead.
4. **The stones are AI samples**, and the stone notes are drafts (fact-checked once on Nov 4, 2026). Nothing here is customer-ready copy. The hint and button words are placeholders for you to rewrite.
5. **Sizes are met only when minified.** As written, with comments, the scripts are over the targets.

## Changes from the approved plan

1. The button changes its words ("Dunk it" and "Dry it off") and a status line is read out. The plan said a pressed toggle, but a changing label and a pressed state together read confusingly.
2. The stone on screen gets ready while the page is idle, not on the first touch. The first test showed a stall on the first touch, and this removed it.
3. The speed readout opens with a button or `#debug`. Private links drop the `?debug=1` form.
4. A streak dries in about 15 seconds, not about 20. It is one number (`--wl-dry` in `waterline.css`).
5. The stone picker sits below the stone, so the whole stone and its button are in the first view on a phone.
6. One extra file, `debug.js`. The copied `brand-tokens.css` keeps one em dash in a comment, because it is a byte copy of the approved file.

## Decisions for you

1. Does the water feel right on your phone? Too fast, too slow, too wide, or too narrow are all one-number changes.
2. Should touch water dry by itself (as built), or stay until you dry it?
3. Wording: "Dunk it," "Dry it off," "Rub to wet," and the status lines.
4. Is "Waterline" the name?
5. Which comes next: the shoreline or Stone-to-Story? My pick is Stone-to-Story, because the shoreline overlay has to sit on art whose pixels are not on a true grid, and it changes approved art.
