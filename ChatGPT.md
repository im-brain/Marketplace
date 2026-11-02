# ChatGPT.md: Team brief for ChatGPT

Hi ChatGPT. You're joining Claude on Heavy Pockets Co. Brian, the owner, wants us working as a team. Claude has been building the plan, the prototype, the code, and the checks. You're here for three things Claude can't do well: **images, the logo, and animation design.** You'll also give us an honest outside review.

Written by Claude on Nov 2, 2026. Read the whole file before you change anything.

---

## 1. Who you're working for

**Brian** is a rockhound in Grand Rapids, Michigan. Heavy Pockets Co. is his side project: print-on-demand tees and socks for Great Lakes rockhounds. He is new to coding, so explain things in plain language, in small steps.

**His rules apply to everything you write, including code comments and commit messages:**
- Never use em dashes. Always use the Oxford comma.
- Every web page must be readable in dark mode.
- Be concise, precise, and defensible. Push back on weak ideas, including Claude's. Brian wants something beautiful and new, not agreement.
- Flag accuracy concerns in anything customer-facing. Rockhounds catch mislabeled stones instantly.

## 2. Read these first, in this order

1. `CLAUDE.md`: the project handoff, with status, decisions, and guardrails.
2. `PRODUCT.md`: the audience, voice, constraints, and product principles.
3. `.impeccable/surfaces/site-prototype-index-html.md`: the homepage "direction contract" (the Sorting tray world) and its revisions.
4. `.impeccable/critique/2026-11-02T04-25-08Z__site-prototype-index-html.md`: the design critique (24/32). Its P1 and P2 issues have been fixed; its minor items have not.
5. `site/prototype/index.html`, `tokens.css`, and `stone.js`: the prototype itself.
6. `site/prototype/IMAGE_CREDITS.md` and `site/prototype/Image_Prompts.md`: image rules and stone photo prompts.
7. `PLAN.md`, Steps 4 to 13, for where this is headed. It becomes a custom Shopify Liquid theme at Step 13, so keep code plain and portable: no frameworks, no build step, and no libraries.

Ignore the old "Heavy Pockets Brand Kit" artifact from Nov 1 if you come across it. It used a different palette (fog, slate, and agate red) from a direction that was replaced.

## 3. The world you're designing in (don't drift from it)

**Thesis:** the homepage is the tackle box you empty your pockets into after a beach day, with one find per compartment.

| Element | Rule |
|---|---|
| Ground | Molded **cobalt** plastic. Light mode `--tray #2443c9`. Dark mode `--tray #14256e`. |
| Wells | Recessed compartments (`--well #1a33a3`, dark `#0c1748`) with a soft inner shadow and a lit lip. Uneven sizes, like a real molded tray. |
| Latch orange | `--latch #ff6a1a`, with `--on-latch #1b0d00` text. **Reserved** for the primary action ("Get first dibs") and the Pocket counter. Nothing else is orange. |
| Lid | The editorial section is the underside of a smoked clear lid: `--lid #e3e8ff` in light mode, `#2a3366` in dark mode. The menu is the smoked lid closing over the tray. |
| Type | Display: **Bagel Fat One**, a fat, rounded, molded face. Body: **Hanken Grotesk**. Both are Google Fonts under the SIL Open Font License, so logo and commercial use are allowed. |
| Signature moment | **Wet Stone.** A dull, dry stone turns rich and glossy when you tap or hover it, because rockhounds wet a stone to see its true color. "Dry rocks lie." |
| Voice | Confident, casual, and authentic. Clever about 80% of the time, weird and funny about 20%. No pun overload. |
| Never | A stock Shopify look, an Etsy novelty shop, a geology museum, a vintage field journal, a beige-and-sage outdoor template, a generic AI site, pickaxe or pebble clip art, faces or people, or protected IP. |

All tokens live in `site/prototype/tokens.css`. They are provisional until Brian approves the prototype, and then they become the Step 4 brand kit.

## 4. Hard rules (these protect the business)

1. **Show the real product.** Never make product or garment images, and never apply Wet Stone to garments. Real product photos come from Printify samples at Step 10.
2. **Be right about stones.** Any stone image must look like the real stone it's labeled as. AI stones stay labeled **SAMPLE** on the site until Brian approves each one. The only geology fact Brian has confirmed is that Leland Blue is slag from a 19th-century iron smelter in Leland, Michigan. Write no other stone facts.
3. **Log every image** in `site/prototype/IMAGE_CREDITS.md`: the file, the tool (for example "ChatGPT image generation"), the date, the prompt summary, and what it should be replaced with.
4. **No secrets** in the repo or in chat. Ever.
5. **Accessibility:** WCAG 2.2 AA. Respect `prefers-reduced-motion` (motion becomes an instant change), keep keyboard and screen reader behavior working, and keep touch targets at least 44px.
6. **No new claims.** Don't invent prices, reviews, shipping promises, dates, or "limited" urgency.

## 5. How we share the repo

- **Branches:** start from `claude/compassionate-fermi-lndrfd`. Create your own branch for each task, named `gpt/stones`, `gpt/logo`, `gpt/motion`, or `gpt/review`. Never push to `main`. Claude reviews and merges.
- **What you own:**
  - `site/prototype/assets/**`
  - `site/prototype/motion.css` and `site/prototype/motion.js` (new)
  - `ChatGPT_Review.md` (new)
  - The **Handoff log** at the bottom of this file
- **Shared files, edit carefully:**
  - `index.html`: only the exact changes each task below describes, plus the `<link>` or `<script>` tags for your files.
  - `IMAGE_CREDITS.md`: add rows, don't rewrite.
- **Leave alone:** `tokens.css` (propose changes in your review instead), `CLAUDE.md`, `PRODUCT.md`, `PLAN.md`, and anything under `.impeccable/` or `.claude/`.
- **After any change to `index.html` or its CSS, JS, or assets,** rebuild the phone preview with `python3 scripts/build_preview.py`. It inlines local CSS, JS, and `assets/` images into `site/prototype/preview-single-file.html`.
- **Check your work before you commit:**
  - Phone (390 wide) and desktop (1440 wide).
  - Light and dark mode.
  - Reduced motion.
  - No sideways scrolling.
  - No console errors.
  - No em dashes.
- **Commit messages:** plain English, saying what changed and why.
- **When you finish a task,** add an entry to the Handoff log (section 9): what you did, what's left, and anything Claude should check.

### If you can't push to the repo (fallback deliverable)

If you can read the repo but can't create a branch or push, don't stop and don't paste half-finished code into chat. Give Brian **one downloadable zip per task**, named `gpt-<task>-<YYYY-MM-DD>.zip` (for example `gpt-logo-2026-11-03.zip`), that Claude can unpack straight into the repo:

1. **Repo paths:** every file goes in the folder it lives in inside the repo, starting at the repo root. For example, `site/prototype/assets/logo/hp-wordmark.svg`, `site/prototype/motion.css`, and `ChatGPT_Review.md`.
2. **New files:** included whole and finished.
3. **Changes to existing files** (`index.html` and `IMAGE_CREDITS.md`): include a **unified diff** in `patches/<file>.diff`, made against the latest `claude/compassionate-fermi-lndrfd`. If you can't make a clean diff, include the **whole updated file** at its repo path and say so in the manifest. Never send fragments like "add this somewhere near the header."
4. **`HANDOFF.md` at the top of the zip,** with:
   - A table of every file: its repo path, whether it's new, changed, or a patch, and a one-line purpose.
   - The commit hash or date of the repo version you worked from.
   - The `IMAGE_CREDITS.md` rows you're adding (also in the patch).
   - Your Handoff log entry text, ready for Claude to paste into section 9.
   - What you checked (sizes, light and dark mode, and reduced motion), and anything you couldn't check.
   - Open questions for Brian.
5. **Image masters:** for images, include both the web file (WebP or SVG) and the master (PNG or SVG) in `assets/.../src/`, as the task specs say.
6. **Not included:** `preview-single-file.html`. Claude rebuilds it.

If you can't make a zip either, give each file as its own download with the repo path in the file name (for example `site__prototype__motion.css`), plus `HANDOFF.md`. Brian brings everything to Claude, who unpacks it, applies the patches on a `gpt/<task>` branch, runs the checks in section 7, and merges what passes.

---

## 6. Your tasks, in priority order

### Task 0: The honest review (do this first, and keep it short)

Write `ChatGPT_Review.md` at the repo root:
- **The three biggest ways this could be even better.** Think brand, conversion, or delight. Be specific: name the element, say why it matters, give the fix, and estimate the effort (S, M, or L).
- **Disagreements with Claude.** Anything in the prototype or the plan you think is wrong.
- **Ideas for your own tasks below,** before you start them, so Brian can pick a direction.

Brian reads this, so plain language and no hype. Under 600 words.

### Task 1: Stone images (dry and wet pairs)

**Why:** the stones are code-drawn placeholders (`stone.js`). The critique's biggest complaint was that they don't look enough like real stones, and Wet Stone is the moment that proves a real rockhound made this. Brian may also shoot his own pairs; if he does, his photos win, and your job becomes cleaning them up.

**Slots on the page:**

| Slot | Where in `index.html` | Stone | Needs |
|---|---|---|---|
| Hero Wet Stone | `.well.big .wet-stone` (seed 11) | Lake Superior agate | dry and wet pair |
| Field Guide 1 | first `.stone-card` | Lake Superior agate (a different stone from the hero) | dry and wet pair |
| Field Guide 2 | second `.stone-card` | Petoskey stone | dry and wet pair |
| Field Guide 3 | third `.stone-card` | Leland Blue (slag) | dry and wet pair |
| Pocket compartment | `.well.s1` (6 small stones) | agate, Petoskey, Leland Blue, jasper, basalt, and chert | dry only |
| Menu tray | `.menu-tray .well` (4) | agate, Petoskey, Leland Blue, and jasper | wet only (or dry and wet if you animate them) |

**Image specs:**
- **Size:** generate at **1536 x 1024** (ChatGPT's landscape size), then crop the center to **1280 x 1024** (5:4, matching the SVG viewBox `0 0 400 320`). The prompts leave margin so the crop never cuts the stone. If you can't crop, deliver the 1536 x 1024 file and say so; Claude will crop it.
- **Background:** transparent. Deliver WebP (quality around 82) and keep the PNG master in `assets/stones/src/`.
- **Framing:** after the crop, the stone is centered and fills about 75% of the width. Top-down at a slight three-quarter angle. Soft overcast light from the **upper left**. A soft contact shadow baked in, at low opacity, so it sits in the well.
- **Matched pairs:** the dry and wet versions of each stone must line up **pixel for pixel**: same outline, position, and lighting. Only the surface changes. The site fades and sweeps from one to the other, so any shift makes the stone jump. Generate the dry image, then edit it into the wet one; never generate the two separately.
- **Dry:** matte and chalky, with muted colors and a faint dusty bloom. No highlights.
- **Wet:** deeper and more saturated, never brighter or neon. A thin film of water, a few sharp specular glints from the upper left, and two or three small beads.
- **Accuracy:**
  - **Lake Superior agate:** a pitted, wave-worn rind, with fortification banding showing on one broken or worn face, in rust, oxblood, orange, cream, and white. Not a geode, polished slab, or dyed agate.
  - **Petoskey:** a gray-tan pebble. When wet, it shows packed, slightly uneven hexagon cells, each with a dark eye and radiating lines. Not a honeycomb.
  - **Leland Blue:** wave-worn glassy blue to blue-green slag, with gas bubbles, flow lines, and gray streaks. Not a gem or sea glass.
  - **Use the ready-made prompts** in `site/prototype/Image_Prompts.md`: Prompts 1 to 3 for the dry and wet pairs, "Prompt 1, again" for the second agate, and Prompt 4 for the six small stones. Improve them if you can, and note what you changed in the Handoff log.
- **File names:** `site/prototype/assets/stones/agate-hero-dry.webp`, `agate-hero-wet.webp`, `agate-dry.webp`, `agate-wet.webp`, `petoskey-dry.webp`, `petoskey-wet.webp`, `leland-dry.webp`, `leland-wet.webp`, and `small-<stone>-dry.webp` for the six small stones. Keep each file under 180 KB.

**Code changes (do exactly this):**
1. In each Wet Stone button, replace the two SVGs:
   ```html
   <svg class="dry" aria-hidden="true" data-seed="11" data-dry="1"></svg>
   <svg class="wet" aria-hidden="true" data-seed="11"></svg>
   ```
   with
   ```html
   <img class="dry" src="assets/stones/agate-hero-dry.webp" alt="" width="1280" height="1024" decoding="async">
   <img class="wet" src="assets/stones/agate-hero-wet.webp" alt="" width="1280" height="1024" decoding="async">
   ```
   Keep `alt=""` because the button's `aria-label` already names the stone.
2. In `motion.css`, give `.wet-stone img` the same box as `.wet-stone svg` (look at the `.wet-stone svg` and `.stone-card .wet-stone svg` rules in `index.html`), with `object-fit: contain`. The existing mask on `.wet-stone .wet` then works on the image unchanged.
3. The gloss sweep (`.gloss`) currently lives inside the wet SVG. With photos, the wet image carries its own glints, so either drop the sweep or rebuild it in Task 3.
4. The script in `index.html` only draws `svg[data-seed]`, so the images aren't touched by it. Leave SVG stones in the slots you haven't replaced.
5. Change the caption `SAMPLE stone, drawn in code` to `SAMPLE stone, AI image`. Keep the SAMPLE labels.
6. Log every file in `IMAGE_CREDITS.md`.

### Task 2: The logo

**Why:** the header wordmark is just the words "Heavy Pockets Co." set in Bagel Fat One (`.word` in `index.html`). The brand needs a real, ownable mark that works on the site, sleeve tags, sock cuffs, hats, the favicon, and in one-color embroidery.

**Direction (Brian picks; show 3 options in `ChatGPT_Review.md` or `assets/logo/options/` before you finish one).** Concept prompts for all three directions are in `site/prototype/Image_Prompts.md`, Prompt 5. Use image generation for concepts only, then draw the final mark as clean SVG paths by hand or in code, because image models garble letters.
- Molded, fat, rounded letterforms that feel pressed into the cobalt plastic. Start from Bagel Fat One (logo use is allowed), but customize the letters so the mark is ours, not just the font.
- One idea Claude explored earlier: **the lick.** A single glossy streak crosses the letters where they turn from dry to wet. It's the "I lick rocks" design shrunk into the logo. Push it, or beat it.
- Another idea: **a pocket.** The jeans-pocket shape already used as the Pocket icon (the path in the `.pill.cart` SVG in `index.html`), heavy with a stone.
- Not allowed: a pickaxe, a hammer, a magnifying glass, a generic pebble icon, a mountain, or a wave.

**Deliverables** (all SVG with outlined paths, so no font is needed; a tight viewBox; fills use `currentColor` where noted, so CSS can recolor them):

| File | Use | Notes |
|---|---|---|
| `assets/logo/hp-wordmark.svg` | Header and footer | Horizontal. Must read at 24px tall. |
| `assets/logo/hp-wordmark-1c.svg` | One color | `currentColor` only. For embroidery, stamps, and one-ink prints. No gradients or hairlines; strokes at least 1.2pt at 1 inch wide. |
| `assets/logo/hp-stacked.svg` | Square posts, hats, and profile pictures | |
| `assets/logo/hp-mark.svg` | Sleeve tag, sock cuff, and favicon source | Must read at 16px. |
| `assets/logo/favicon.svg`, `favicon-32.png`, `apple-touch-icon.png` (180x180) | Browser tab and home screen | Cobalt background with a white or orange mark. |
| `assets/logo/og-card.png` (1200x630) | Link previews on social | The logo on the tray, plus "Head down. Pockets full." No product shots. Prompt 6 in `Image_Prompts.md`. Composite the real SVG logo on top so the letters are exact. |

**Colors:** two-color versions use white (`#ffffff`) and latch orange (`#ff6a1a`) on cobalt. Check that each version works on cobalt, on light lid (`#e3e8ff`), and on black and charcoal tees.

**Code changes:**
1. Replace the text in `<a class="word" ...>Heavy Pockets Co.</a>` (the header) and `<span class="word">` (the menu) with the inline SVG of `hp-wordmark.svg`. Add `role="img"` and keep the link's `aria-label="Heavy Pockets Co. home"`. Keep the 44px-tall tap area. The header must still fit at 320px wide with Menu and Pocket. Measure it.
2. Add `<link rel="icon" href="assets/logo/favicon.svg" type="image/svg+xml">`, the PNG fallbacks, and `<meta property="og:image" content="assets/logo/og-card.png">` in `<head>`.

**Trademark note:** our own name as a wordmark is fine. Don't borrow elements from other brands' marks. A custom-drawn mark is easier for Brian to protect later than plain font text.

### Task 3: Animation design

**Why:** motion should make the brand idea physical. Keep it to **one authored hero moment** (Wet Stone) plus a few quiet supporting touches. No scattered effects, and no animation on every section.

**Code rules:**
- Plain CSS, SVG, and the Web Animations API, in `site/prototype/motion.css` and `motion.js`. **No libraries, no Lottie, and no build step**, because this ports to Shopify Liquid.
- Under 10 KB for both files together.
- Smooth on a mid-range phone: animate `transform`, `opacity`, `mask-position`, `mask-size`, and `clip-path`. Never animate a filter on a large area.
- `prefers-reduced-motion: reduce` means an instant state change with the same end result.
- Don't break what works:
  - Wet Stone is a real `<button class="wet-stone">` with `aria-pressed`.
  - Mouse hover adds the class `hover`.
  - Tap, click, Enter, and Space toggle `aria-pressed`.
  - The hint text updates.
  - Key off those states; don't replace that logic.
- Current timings: wet-in 1100ms with `--ease-out: cubic-bezier(.16,1,.3,1)`. Drying should be **slower than wetting** (around 1400 to 1800ms), like a real stone in the sun.

**3a. Wet Stone (the hero moment, the most important)**
- **Today:** a straight linear-gradient mask sweeps left to right (`.wet-stone .wet`, the custom property `--p`), plus a skewed white gloss bar.
- **Goal:** water that behaves like water.
  - **Wet:** the wet layer spreads from where you tapped or pointed, with an organic edge (not a perfect circle). A darker wetting front leads it, and a quick specular sheen follows it.
  - **Dry:** it evaporates from the thin edges inward, and the last spot to dry is where it was wettest.
- **Hooks:**
  - In `motion.js`, set `--x` and `--y` (in %) on the button from `pointerdown` or `pointerenter` coordinates. Default to 50%, 45% for the keyboard.
  - In `motion.css`, override `.wet-stone .wet` with your mask. An organic radial mask can be an SVG mask image (blobby circle) scaled with `mask-size`.
- **Work with both layer types:** the current SVG layers and the future `<img>` layers from Task 1.

**3b. "I lick rocks" card (`.p-lick .lick`)**
- **Today:** the lick-shaped wet streak (a mask on `.lick .wet`) is always visible.
- **Goal:** one subtle swipe that draws the streak in (a tongue-stroke reveal) the first time the card scrolls into view, and again on tap or hover. Once, quick (about 700ms), and a little funny.

**3c. "Pocket it" (`.pocket` buttons and `.pill.cart` in the header)**
- **Today:** the button toggles and the count changes.
- **Goal:** a small stone pops from the button, arcs up into the header Pocket pill, and the count bumps. About 600ms, using transform only (`position: fixed` clone plus WAAPI). It's playful 20% weirdness, so keep it small.
- **Reduced motion:** just the count change.

**3d. Menu lid (`.menu`, `.menu.open`)**
- **Today:** it slides down over 520ms.
- **Goal:** it feels like a hinged smoked lid closing: a slight perspective tilt that settles flat, with a tiny "latch" tick at the end. Keep the focus trap, Esc to close, and focus return working.

**Don't animate:** body text, headings on scroll, the product concept art (apart from 3b), or anything that loops forever.

### Task 4 (optional, only if Brian asks): concept art for the five design cards

The product cards use rough code-drawn concept art. Better concept art is welcome, but it must stay labeled "Concept," and it is **not** the print file. Print files come later (PLAN Steps 7 and 8), from Brian's photos, his edits, or properly licensed sources, and each must pass his accuracy and trademark checks.

---

## 7. What Claude does after your handoff

- Reviews your branch: it checks the 320, 390, and 1440 widths, light and dark, reduced motion, contrast, touch targets, console errors, and the em dash and Oxford comma rules.
- Runs the Impeccable design detector and critique on the result.
- Merges what passes, sends Brian screenshots, and logs the work in `CLAUDE.md`.
- Ports approved pieces into the Shopify theme at Step 13.

## 8. Where things stand right now

- The prototype is Direction B, "Sorting tray," at the Phase 2 approval gate.
- Until Shopify opens at Step 12, the primary action is **"Get first dibs"** (an email waitlist). Designs can be added with **"Pocket it"**, and the orange header pill counts what's pocketed.
- The signup isn't connected to an email service yet, and it says so when you try it.
- All stones are code-drawn SAMPLES, and the products are concepts with "Price TBD."
- Open minor critique items: "I lick rocks" appears twice in its card, the Concept badge overlaps the sock cuff, the Cart glow shows through the closed menu lid, the menu tray stones are always wet, and "Each shirt comes with a field note" needs Brian to confirm it's deliverable.

## 9. Handoff log (newest first; ChatGPT and Claude both add entries)

- **2026-11-02, ChatGPT, Task 3, `gpt/motion`:** Brian selected Thumb bloom. Added `motion.css` and `motion.js`, totaling 9,468 bytes, plus only the stylesheet/script hooks in index.html. Wetting spreads organically from touch or pointer position in 1100ms, with a darker leading edge and SVG sheen; drying takes 1600ms and contracts toward the wet origin. Rapid reversals retain that origin until fully dry, and fresh keyboard reveals start at 50%, 45%. Supports current SVGs and future photo layers; photo sheen comes from their own glints. Added the one-time/replay lick reveal, small Pocket arc/count bump, and restrained hinged menu. Disabled compartment settling so other content stays still on scroll. Existing state, hints, keyboard controls, and menu focus logic remain. Rebuilt the one-file preview. All 12 Chromium combinations at 320, 390, and 1440px, light/dark, normal/reduced motion passed; focused checks covered rapid reversals, live reduced-motion changes, unique cloned SVG IDs, photo layers, lick replay, Pocket cleanup, and the rebuilt preview. No JavaScript exceptions. The source still requests missing /favicon.ico, causing one console 404; `gpt/logo` adds explicit icons. Source: `db0a1e13e30ab10991a3f89af2376f539d703384`. **Claude:** combine the independent logo/motion hooks and both handoff entries, rebuild the preview, and check physical iPhone Safari and mid-range phone performance. No stone assets or protected files were changed. Combined local logo/motion checks also passed all 12 Chromium cases with no overflow or console errors, including future photo layers and the rebuilt one-file preview.

- **2026-11-02, Claude:** Image_Prompts.md now has paste-ready prompts for every image slot (stone pairs, a second agate, six small stones, three logo concepts, and the social card), all at 1536 x 1024 with transparent backgrounds. Task 1 specs now crop to 1280 x 1024.
- **2026-11-02, Claude:** Added the "If you can't push" fallback (one zip per task with repo paths, patches, and HANDOFF.md) to section 5.
- **2026-11-02, Claude:** Wrote this brief and `prompt.md`. Added `scripts/build_preview.py`. The prototype includes the critique fixes Brian picked. Ready for ChatGPT, starting with Task 0.
