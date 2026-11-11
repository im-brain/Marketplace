# Living Shoreline: plan and handoff

Written Nov 11, 2026 (planning session). Status: **plan only, nothing built, waiting on Brian's answers to the open decisions below.**

Read this file first, then `CLAUDE.md`. Each numbered step below is sized for one work session. Update the "Progress log" at the bottom at the end of every session.

## How to work (rules for every session)

1. **Ask before acting.** Brian wants approval requests on this project. The brief's line "do not request routine implementation approval" does **not** apply. Stop at every gate marked **ASK BRIAN** and wait for a yes.
2. One step per session. Finish it, test it, show Brian the result, update the progress log, commit, and push. Do not start the next step without his go-ahead.
3. Branch: `claude/brave-darwin-dgpltb` (started from `main`). Never push to `main`. No pull request until Brian asks. No merge, no deploy.
4. All new files go in `theme/shoreline/`. **Do not edit** `theme/v3/` (approved preview), `brand/v2/hero-assets/` (approved art), `site/coming-soon/` (live page), or anything on Cloudflare, Printify, or Shopify.
5. Brian's writing rules apply to everything a shopper or Brian reads: no em dashes, Oxford comma, plain language, readable in dark mode.
6. If an effect looks fake, simplify or drop it and say so. A calm scene with less motion beats a busy one.

## What the brief asks for, in one paragraph

Turn the static homepage hero into a quiet, living Great Lakes shoreline: water moves, clouds drift almost invisibly, a bird passes now and then, and the lighthouse may glow softly. Three stones (Petoskey, Lake Superior agate, and Leland Blue) can be tapped, inspected with a wet and dry reveal, and kept in a small pocket that the browser remembers. It is not a game: no score, levels, sparkles, or arrows. The homepage stays a store first, with the Shop button always visible. Phones come first. The full brief is in the Nov 11, 2026 chat; its success criteria are copied at the end of this file.

## What the inspection found (Nov 11, 2026)

**There is no Shopify theme.** Shopify opens at Step 12 of `PLAN.md`. The "storefront" today is the approved static preview in `theme/v3/` (built by `node theme/v3/build.js`, tested by `theme/v3/qa/run_qa.js`). So the prototype is a static preview page, and Shopify integration is a written note for later, not work for now.

**Hero art** (approved, do not change):

| File | Size | Notes |
|---|---|---|
| `brand/v2/hero-assets/hero-clean-desktop.png` | 1774 x 887 | Clean, no logo. Lossless source for all cutting. |
| `brand/v2/hero-assets/hero-clean-mobile.png` | 1086 x 1448 | Clean. Top third is plain navy sky. |
| `theme/v3/img/hero/shore-wide.*` | 1334 x 887 | v3 crop of desktop (x from 440). |
| `theme/v3/img/hero/shore-tall.*` | 1086 x 760 | v3 crop of mobile (y 492 to 1252). |

Things about the art that shape the build:

1. **It is two styles in one picture.** Sky, clouds, sun, lighthouse, house, pines, and the point are pixel art. The water, foam, and stones are painted realistically. Motion must match each zone: stepped, low frame rate motion in the pixel zone; smooth, soft motion in the water.
2. **It is one flat image.** Nothing is on its own layer. Clouds, foam, and water must be cut out by code from the approved PNGs (no AI regeneration, no new scenery).
3. **Clouds:** the upper clouds sit on nearly flat navy, so 2 to 3 of them can be cut out and the hole filled with the sky color by code. The lower clouds sit in the orange glow bands and cannot be separated cleanly. Leave those still.
4. **Stones already in the art:** a large Petoskey, a large agate, and a puddingstone are painted into the foreground. They are **not** the same stones as the specimen pairs. **There is no Leland Blue in the art.**
5. Rough positions in the desktop file (measure exactly in Step 1): horizon y about 305; sun centered near x 895; lighthouse lamp near (1475, 160); foam line runs from about (0, 570) up to (1500, 410); stones fill everything below it.

**Stone specimen pairs** (`theme/v3/img/stones/`, 1280 x 1024, transparent, dry and wet share one outline):
`petoskey-dry/wet`, `agate-hero-dry/wet`, `leland-dry/wet` (and `jasper-dry/wet`, not needed). All three required stones exist. **They are AI samples, not Brian's finds** (`theme/v2/img/CREDITS.md`). v3 already shows them with a label. Nothing is missing, so no stones need to be generated.

**Reusable code in v3:** `assets/site.js` has a safe storage helper (`makeStore`, survives blocked storage), the wet reveal, and reduced-motion handling (`wet-fx` class on `<html>`). `assets/site.css` and `brand-tokens.css` hold the brand colors and fonts. Hero markup is in `theme/v3/build.js` around line 234.

**Tools available:** Playwright with Chromium (phone emulation only, **not real Safari**), ffmpeg (for a short preview video), Pillow (for cutting layers). The Impeccable skill is installed (`/impeccable`); its helper download may fail, but the guides in `.claude/skills/impeccable/reference/` work.

**Conflicts with earlier records, for Brian to know:**
- `CLAUDE.md` website to-do 10 lists "the game, the collection keepsake" as deferred. The pocket is a small version of the keepsake. Building this prototype pulls that forward. It stays a prototype until Brian approves it.
- v3 on phones was approved with a short hero (art on top, headline and button below). The brief asks for a tall hero (75 to 85 percent of the screen). That changes an approved layout, so it is a decision below.

## Open decisions (ASK BRIAN before Step 1)

Each has a recommendation. The plan below assumes the recommendation; adjust the steps if he picks otherwise.

| # | Decision | Recommended | Alternative |
|---|---|---|---|
| D1 | Where to build | New folder `theme/shoreline/`, reusing v3 styles and products. Approved v3 preview and its link stay untouched for side-by-side comparison. | Edit `theme/v3/` directly on the branch. |
| D2 | Which stones are collectible | Three **small added stones** made by shrinking the specimen images, tinted for dusk, and set among the pebbles near the waterline. What you tap is what you inspect. The big painted Petoskey and agate are not collectible; tapping them gives a brief wet shine only, so the tap is acknowledged. | Make the big painted stones the tap targets (easy to find, but the stone that opens will not match the one tapped). |
| D3 | Phone hero height | Tall hero using the full tall art, headline and Shop button in the empty navy sky. Test 75, 80, and 85 percent and show screenshots. | Keep the approved short hero (scene only about 270 px tall, stones too small to tap comfortably). |
| D4 | AI sample stones | Use them with a small "sample image" label; built so Brian's own photo pairs drop in by replacing files. | Wait for Brian's real dry and wet photo pairs. |
| D5 | Stone descriptions | Claude drafts three short descriptions from `content/Field_Guide_Draft.md`; **Brian confirms each one** before it counts as final (accuracy guardrail). Leland Blue must say it is slag from iron smelting, not a natural stone. | Brian writes them. |
| D6 | How Brian reviews | Private claude.ai artifact link (same as earlier previews), plus screenshots and a short video in the repo. Publishing needs his yes at Step 8. | Screenshots and video only. |

## Architecture (the design the steps build toward)

**Folder**
```
theme/shoreline/
  HANDOFF.md        this file
  build.js          makes index.html; reads theme/v3 sources read-only
  index.html        generated homepage (hero replaced, rest same as v3)
  assets/shore.css  scene, inspection, and pocket styles
  assets/shore.js   scene logic (one small file, no libraries)
  img/layers/       layers cut from the approved art (generated)
  img/stones/       small shoreline stones + copies of specimen pairs
  tools/cut_layers.py   makes img/layers from brand/v2/hero-assets (repeatable)
  qa/run_qa.js      browser checks; qa/screens/ screenshots; qa/preview.mp4
```

**Layers, back to front** (six, the fewest that work)

| # | Layer | Made from | Motion | Technique |
|---|---|---|---|---|
| 1 | Base plate | The approved hero, unchanged except the 2 to 3 cut clouds filled with sky navy | None. This is also the complete static fallback. | `<picture>`, loads first, `fetchpriority="high"` |
| 2 | Drifting clouds | 2 to 3 upper clouds cut by code | A few pixels per minute, moved in whole art-pixel steps | CSS `transform`, `steps()` |
| 3 | Atmosphere | Bird: tiny 2-frame pixel sprite drawn in code (new asset). Beacon: soft glow over the lamp pixels | Bird: one pass every 40 to 120 seconds at random, never during another event. Beacon: slow fade about every 8 seconds, low strength | CSS animation, started by a JS timer |
| 4 | Water and reflection | The water band of the approved art | Gentle horizontal row shifts from 2 to 3 overlapping sine waves with unrelated periods, so it never visibly loops; the sun reflection shimmers with the same motion | See "Water" below |
| 5 | Wave wash | Foam line cut by brightness from the art, plus a soft dark "wet sand" band | Slides a short way up the stones and back; 2 overlapping cycles of different lengths; once in a while a longer retreat | CSS `transform` and `opacity` |
| 6 | Stones and tap targets | Small stones from specimen pairs | None at rest. One stone sits where the long retreat uncovers it; the other two are always visible | `<button>` elements, 48 px minimum target around a smaller image |

**Water (the one hard part).** Step 3 builds two versions and keeps the better one:
- **A, CSS only:** two or three semi-transparent strips cut from the water, drifting sideways at different speeds, with a shimmer mask on the reflection. Lightest. May look like sliding glass.
- **B, small canvas:** one 2D canvas over the water band only, redrawn about 12 times a second at low resolution, shifting rows of the original image by a pixel or two. This is the look of classic pixel water and suits the art. No WebGL, no library, roughly 60 lines.
Pick A if it convinces; B only if A looks artificial (the brief allows canvas when the need is shown). Record the reason.

**Inspection view.** A `<dialog>` (native focus trap, Escape to close). Tap gives instant pressed feedback; the small stone scales up into the dialog (View Transitions where supported, plain fade elsewhere). Inside: the specimen dry image with the wet image on top, revealed by a soft circle that follows the finger and stays where it has been (a mask on the wet layer). A "Wet it" and "Dry it" button does the same for keyboard and screen reader users, and is the fallback if the mask is unsupported. Then the name, 2 to 3 sentences, **Keep in pocket**, and **Back to shore**. No rotation.

**Pocket.** A small pocket icon in a corner of the hero with a count dot only after the first stone. Opens a small panel listing kept stones; tapping one reopens its inspection. Saved in `localStorage` under one key through the v3 storage helper; if storage is blocked or cleared, the pocket simply works for the current page view and shows nothing broken. A kept stone leaves the shore; "Put it back" in the inspection view returns it. No counts like "1 of 3," no rewards.

**Layout.** Desktop: keep the approved v3 split (copy left, scene right). Phone portrait: tall hero (D3), art `object-fit: cover` anchored so the sun and lighthouse both stay in frame, headline and Shop button in the navy sky, pocket icon bottom corner inside the safe area. Stone positions are stored as percentages of the art and separately for the wide and tall art (the tall art is its own composition, not a crop). Vertical swipes on the scene must scroll the page (`touch-action: pan-y`; only the inspection reveal area captures drags).

**Performance and safety rules**
- The base image is plain HTML and paints with no JavaScript. If the script fails, the page is exactly the approved static hero with a working Shop button.
- Layers and script load after first paint (`defer`, lazy images). Target: under 150 KB added in total, script under 15 KB.
- Animate only `transform` and `opacity` (plus the one canvas if chosen).
- Pause everything when the hero is off screen (`IntersectionObserver`) or the tab is hidden (`visibilitychange`).
- `prefers-reduced-motion`: no water, cloud, bird, beacon, or wash motion. Stones, inspection, and pocket still work, with instant changes instead of transitions.
- No libraries, no external services, no cookies, no network calls.

**Shopify, later (Step 13 of PLAN.md, not now).** The scene becomes one theme section (`sections/living-shoreline.liquid`) plus two assets and the layer images, with the hero text and button as section settings. Nothing in cart or checkout is touched. Write this up in Step 9; do not build it.

## Steps

**Step 0. Decisions.** ASK BRIAN D1 to D6 above. Record answers in the progress log. *Done when:* all six are answered.

**Step 1. Scaffold and measure.** Create `theme/shoreline/build.js` that produces a homepage identical to v3 (reads v3 sources, writes only inside `theme/shoreline/`). Measure the art: horizon, water band, foam line, sun, lamp, and the upper clouds, for both wide and tall files; save as `tools/regions.json`. *Test:* page matches the v3 homepage in screenshots at 390, 768, and 1440 px wide; `git status` shows no changes outside `theme/shoreline/`. **ASK BRIAN** to confirm the starting point.

**Step 2. Cut the layers.** Write `tools/cut_layers.py` (Pillow) to produce the base plates, cloud sprites, foam strip, and water band for both compositions from the lossless PNGs. Check originals by SHA-256 before and after: unchanged. *Test:* stacking all layers with no motion matches the approved art closely (report the average pixel difference); file sizes listed. Show Brian a still comparison. **ASK BRIAN** if any cut looks wrong before moving on.

**Step 3. Water and wash.** Build water versions A and B and the wave wash. Record a 15 second clip of each on phone and desktop sizes (Playwright video, ffmpeg). Recommend one. **ASK BRIAN** to pick A, B, or "neither, keep it still." This is the make-or-break step; if neither convinces, say so plainly and recommend stopping at a still hero with the stone interaction only.

**Step 4. Clouds, bird, and beacon.** Add them with the pause rules and the reduced-motion switch. Each one has an off flag at the top of `shore.js` so Brian can veto any single effect. No ship. *Test:* nothing moves with reduced motion on; nothing runs when scrolled away (check with a counter in the QA script). **ASK BRIAN** which effects stay.

**Step 5. Phone layout.** Build the tall hero (per D3) at 75, 80, and 85 percent; screenshots at 375x667, 390x844, 430x932, and landscape. Check: Shop button visible and readable without scrolling, sun and lighthouse in frame, no sideways scroll, page scrolls when swiping on the scene. **ASK BRIAN** to pick the height.

**Step 6. Stones on the shore.** Make the small stones from the specimen pairs (per D2), place them for both compositions, add tap targets and the pressed response. Use `/impeccable` critique on placement and visibility. *Test:* targets at least 48 px, reachable by keyboard with clear names ("Petoskey stone on the shore, pick up"), at least two visible immediately. **ASK BRIAN:** can he find them without being told, and do they look like they belong? (Best tested by handing the phone to someone else.)

**Step 7. Inspection and pocket.** Build the dialog, the finger-following wet reveal with its button fallback, descriptions (per D5, marked draft until Brian confirms), Keep in pocket, Back to shore, the pocket panel, and saved state. *Test:* full flow by touch, mouse, and keyboard; storage blocked; storage cleared mid-visit; reload keeps the pocket; reduced motion. **ASK BRIAN** to approve the three descriptions word for word.

**Step 8. Polish, audit, and preview.** Run `/impeccable` audit and polish. Complete `qa/run_qa.js` (layout, accessibility scan if axe-core can be loaded, reduced motion, script-blocked fallback, performance numbers: added bytes, time to first hero paint versus v3, frame rate while animating on a slowed CPU). Take final screenshots and a 20 second video. **ASK BRIAN** for permission to publish a private artifact preview (D6), then ask him to test on his real iPhone in Safari, because this environment cannot run Safari.

**Step 9. Report.** Write `theme/shoreline/REVIEW.md` with the brief's ten deliverables: prototype location, branch, screenshots, video, layer summary, reused and new assets, performance, accessibility and reduced-motion results, known limits, and an honest recommendation on replacing the static hero (including "no" or "only the stones, not the water" if that is what the evidence says). Add the Shopify section notes. Update `CLAUDE.md`. **ASK BRIAN** whether he wants a draft pull request. Never merge or deploy.

## Known limits to state up front

- No real Safari here. Chromium phone emulation only; Brian's iPhone is the real test.
- The stones are AI samples until Brian supplies photos.
- Only the upper clouds can drift. The lower ones are part of the glow and stay still.
- The water is animated from one painted frame, so motion must stay small. Large waves are not possible without new art, and new art is out of scope.
- No Shopify theme exists, so "Shopify integration" is a plan on paper until Step 12 of `PLAN.md`.

## Success criteria (from the brief)

The shoreline is beautiful when untouched. Motion is calm and natural. The lighthouse and landscape stay recognizable. Stones can be found without instructions or waiting. Inspection and pocket are intuitive. The shopping purpose stays clear. The phone experience is excellent. The build is light and maintainable. The approved art is untouched. Nothing changes in production.

## Progress log

- **2026-11-11:** Planning session. Inspected the repo, hero art, and stone pairs. Wrote this plan. Nothing built. Next: Step 0, Brian answers D1 to D6.
