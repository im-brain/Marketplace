# Image prompts for the prototype (bring to ChatGPT)

Written Nov 2, 2026. Unsplash came back thin: 1 "Petoskey" result (a rock stack), and the "agate" results are marble, pebbles, and abstract art. Shoreline and pebble mood shots are fine there, so this file covers what Unsplash can't supply. Updated Nov 2 to cover every image slot:

| Prompt | What it makes | Where it goes on the site |
|---|---|---|
| 1, 2, and 3 | Dry and wet pairs: agate, Petoskey, and Leland Blue | The big Wet Stone and the Field Guide |
| 1, again | A second, different agate pair | The Field Guide (so it isn't the same stone as the hero) |
| 4 | Six small dry stones | The "pockets full" compartment near the top |
| 5a, 5b, and 5c | Three logo concepts | Pick one; ChatGPT then draws it as SVG |
| 6 | The social link card | The preview that shows when someone shares the site |

## First, the better option: your own stones

You own real agates, Petoskeys, and Leland Blue. A real dry and wet pair beats any AI image, and it's the brand promise ("a real rockhound made this"). If you have 15 minutes, do this instead of, or alongside, the prompts:

1. Put a plain gray card or a gray T-shirt on a table by a window. Indirect light, no direct sun.
2. Prop the phone up, or use a tripod, about 8 inches above the stone, pointing straight down at a slight angle. **The phone must not move between shots.**
3. Shoot the stone dry. Then mist it with a spray bottle (or wipe it with a wet thumb), and shoot again from the same spot.
4. Repeat for an agate, a Petoskey, and a Leland Blue. Send me all 6 photos.

Even if you use the AI prompts below, **take step 3 for one agate anyway** and upload it to ChatGPT as a reference. It makes the result far more believable.

## How to run these in ChatGPT

- Run each stone in its **own chat**. Do the dry prompt first. Then, in the same chat, run the wet edit prompt on that image. Editing the same image keeps the stone in the same position, so the site can fade from dry to wet without the stone jumping.
- Ask for a **landscape image (1536 x 1024)** with a **transparent background**. The prompts already say this. If it gives you a gray background instead, that's OK; Claude can cut it out. Claude also crops each image to the site's 5:4 shape, which is why the prompts leave margin around the stone.
- If the wet version moves, reshapes, or relights the stone, say: "Redo it. The stone moved. Only the surface should change." Do this until the stone lines up.
- Download each at full size and name the files like this: `agate-dry.png`, `agate-wet.png`, `petoskey-dry.png`, `petoskey-wet.png`, `leland-dry.png`, and `leland-wet.png`.

## Accuracy warning (read before you approve any of these)

AI gets these stones wrong in predictable ways. Check each one with your rockhound eye before sending it to me:

- **Agate:** AI loves geodes, crystal cavities, polished slabs, and dyed purple or blue agates. A Lake Superior agate is none of those.
- **Petoskey:** AI often draws a honeycomb or a turtle shell. Real cells are uneven, packed hexagons, each with a dark eye and fine lines radiating out.
- **Leland Blue:** AI may make it a gemstone or a smooth sea glass pebble. Real Leland Blue is slag, with gas bubbles and flow lines.

These images are **placeholders for the prototype**, labeled SAMPLE on the site. They don't go in the real Field Guide, and they are never shown as a product or a verified specimen. Every AI image gets logged in `IMAGE_CREDITS.md`.

---

## Prompt 1: Lake Superior agate (big Wet Stone and Field Guide)

**Optional reference:** upload a photo of one of your own agates and add this line to the start of the prompt: "Use the attached photo as the reference for the stone's shape, size, and banding."

### 1a. Dry

```
Photorealistic macro product photograph of a single Lake Superior agate beach pebble, completely DRY, as it looks when picked up off a Lake Superior beach.

The stone: about 1.5 inches across, an irregular rounded nodule, worn and tumbled by waves but NOT polished. One face shows fortification banding: tight, concentric, wavy bands that follow the outline of the stone like a fingerprint, in rust red, burnt orange, cream, and white, with a few thin translucent gray bands. The rest of the stone is a pitted, slightly rough husk in dull orange-brown with small pockmarks. Natural, uneven, and a little imperfect.

DRY surface: matte and chalky, with a faint dusty bloom that mutes the colors. The bands are visible but washed out and low contrast, like the stone is hiding its color. No shine, no highlights, no reflections, and no water.

Photography: top-down view at a slight three-quarter angle. Soft, even, overcast daylight from the upper left. A soft, small contact shadow under the stone. Stone centered, about 60 percent of the image width, with even empty margin on all sides. Transparent background (if transparency isn't possible, a plain, seamless, neutral mid-gray #808080 background with no texture). 100mm macro lens look, f/8, everything on the stone in sharp focus. True-to-life color, no filters.

Landscape image, 1536 x 1024. No hands, no props, no sand, no text, no watermark, and no border.

Avoid: geode, crystal cavity, druzy, polished slab, cut cabochon, dyed purple, blue, or pink agate, glossy surface, sparkles, fantasy lighting, and illustration style.
```

### 1b. Wet (edit the dry image, same chat)

```
Edit this exact image. Do NOT move, rotate, resize, or reshape the stone. Keep the camera angle, framing, lighting direction, background, and shadow exactly the same.

Change only the stone's surface: it has just been dunked in lake water and is freshly WET. The chalky bloom is gone. The colors deepen and saturate the way wet stone really does: the rust red becomes deep oxblood red, the orange becomes rich amber, and the white bands become crisp and slightly translucent. The banding is now high contrast and clearly readable. Add a thin film of water with a few small, sharp specular highlights from the upper left light, plus two or three tiny water beads near the edges. The stone gets slightly darker overall, never brighter or neon.

Same landscape format and size. No text, no watermark.
```

## Prompt 2: Petoskey stone (Field Guide and small wells)

**Optional reference:** a photo of one of your own Petoskeys, dry.

### 2a. Dry

```
Photorealistic macro product photograph of a single Petoskey stone, completely DRY, as found on a northern Lake Michigan beach.

The stone: about 2 inches long, a smooth, flattened oval beach pebble, tumbled by waves. It is a fossil colonial coral (Hexagonaria percarinata) in gray-tan limestone. When dry it looks like a plain, dull gray stone: the hexagon pattern is barely visible, just faint ghost outlines.

DRY surface: matte, pale gray to light tan, slightly dusty. No shine and no water.

Photography: top-down view at a slight three-quarter angle. Soft, even, overcast daylight from the upper left. Soft, small contact shadow. Stone centered, about 60 percent of the image width, with even empty margin on all sides. Transparent background (if transparency isn't possible, a plain, seamless, neutral mid-gray #808080 background). 100mm macro lens look, f/8, sharp focus across the stone. True-to-life color.

Landscape image, 1536 x 1024. No hands, no props, no text, no watermark.

Avoid: honeycomb, turtle shell, perfect geometric hexagons, a polished gift-shop finish, bright colors, and illustration style.
```

### 2b. Wet (edit, same chat)

```
Edit this exact image. Do NOT move, rotate, resize, or reshape the stone. Keep the camera angle, framing, lighting, background, and shadow exactly the same.

Change only the surface: the stone is freshly WET. The fossil coral pattern now shows clearly: packed, slightly uneven hexagonal cells, roughly 1/4 to 1/2 inch across, each with a dark brown center "eye" and fine lines radiating from the eye to the cell walls. The cell walls are a slightly darker gray-brown. Overall color deepens to warm gray-brown with darker brown eyes. Add a thin film of water with a few small, sharp highlights from the upper left, and two or three tiny water beads. Slightly darker overall, never brighter.

Same landscape format and size. No text, no watermark.
```

## Prompt 3: Leland Blue (Field Guide)

Remember: Leland Blue is slag from a 19th-century iron smelter in Leland, Michigan, not a natural stone. The image should look like beach-worn industrial glass slag.

### 3a. Dry

```
Photorealistic macro product photograph of a single piece of Leland Blue slag, completely DRY, as found on the Lake Michigan beach at Leland, Michigan. Leland Blue is a glassy byproduct of a 19th-century iron smelter, worn smooth by waves.

The piece: about 1.5 inches across, an irregular, wave-rounded chunk. Blue to blue-green glassy material with small round gas-bubble holes (vesicles), faint swirling flow lines, and a few dull gray or black streaks and inclusions. Not a gemstone and not sea glass.

DRY surface: frosted and dull, with the blue looking chalky and pale, like it is coated in fine dust. No shine and no water.

Photography: top-down view at a slight three-quarter angle. Soft, even, overcast daylight from the upper left. Soft, small contact shadow. Centered, about 60 percent of the image width, with even empty margin on all sides. Transparent background (if transparency isn't possible, a plain, seamless, neutral mid-gray #808080 background). 100mm macro lens look, f/8, sharp focus. True-to-life color.

Landscape image, 1536 x 1024. No hands, no props, no text, no watermark.

Avoid: faceted gem, polished cabochon, smooth sea glass, turquoise, lapis, neon or glowing color, crystals, and illustration style.
```

### 3b. Wet (edit, same chat)

```
Edit this exact image. Do NOT move, rotate, resize, or reshape the piece. Keep the camera angle, framing, lighting, background, and shadow exactly the same.

Change only the surface: it is freshly WET. The frosted dullness is gone, and the glassy blue becomes deeper and clearer, with visible swirling flow lines and the gas bubbles crisp and dark. The gray inclusions stay gray. Add a thin film of water with a few small, sharp highlights from the upper left, and two or three tiny water beads. Richer and deeper, never neon or glowing.

Same landscape format and size. No text, no watermark.
```

---

## Prompt 1, again: a second agate for the Field Guide

The hero and the Field Guide each need their own agate, so the page doesn't show the same stone twice. Run Prompt 1a and 1b again in a **new chat**, and add this line to the start of 1a:

```
This must be a different stone from any previous one: a different outline (more elongated and lumpy), with the broken face on the left side instead of the center, and more cream and white bands than red.
```

Save as `agate-dry.png` and `agate-wet.png`. The first pair becomes `agate-hero-dry.png` and `agate-hero-wet.png`.

## Prompt 4: six small dry stones (the "pockets full" compartment)

These sit small, dry, and tilted in one compartment near the top of the page, like a pocket emptied onto a tray. They only need a **dry** version. Use one chat and ask for one image per stone (6 images), so they match.

```
Photorealistic macro product photographs, one image per stone, six images total, all with identical lighting and camera setup so they match as a set. Each image is one small, DRY, wave-worn Great Lakes beach pebble, about 1 inch across, as found on a Michigan beach.

1. Lake Superior agate: pitted orange-brown rind, with a small patch of faint red and white banding on one worn spot.
2. Petoskey stone: smooth gray pebble with faint ghost outlines of hexagon cells.
3. Leland Blue slag: frosted, dull blue-green glassy chunk with small round gas-bubble holes.
4. Red jasper: smooth, opaque brick-red pebble with a few darker red mottles and one thin white quartz vein.
5. Basalt: smooth, dark charcoal-gray pebble, fine-grained, with a few tiny pale speckles.
6. Chert: smooth, pale gray-tan pebble with a slightly waxy look and faint darker gray swirls.

DRY surfaces: matte, chalky, dusty, and muted. No shine and no water.

Photography for every image: top-down at a slight three-quarter angle, soft even overcast daylight from the upper left, a soft small contact shadow, the stone centered at about 50 percent of the image width with even empty margin. Transparent background (if transparency isn't possible, a plain, seamless, neutral mid-gray #808080 background). 100mm macro lens look, f/8, sharp focus, true-to-life color. Landscape image, 1536 x 1024.

No hands, no props, no sand, no text, no watermark. Avoid: polished, tumbled-shop shine, gemstones, crystals, and illustration style.
```

Save as `small-agate-dry.png`, `small-petoskey-dry.png`, `small-leland-dry.png`, `small-jasper-dry.png`, `small-basalt-dry.png`, and `small-chert-dry.png`.

**Accuracy check:** jasper should be opaque and solid-colored, not banded like agate. Basalt should be plain dark gray, not shiny black obsidian.

## Prompt 5: logo concepts (3 directions to pick from)

Image generators are good at exploring a logo idea and bad at exact letters, so use these for **concepts only**. Once you pick one, ChatGPT redraws it as a clean SVG in code (the specs are in `ChatGPT.md`, Task 2). Run each prompt in its own chat, and ask for 2 variations of each.

**5a. The lick**

```
Logo concept sheet for a small apparel brand called "Heavy Pockets Co." for Great Lakes rockhounds (rock collectors). A bold horizontal wordmark in fat, rounded, soft-cornered letters that look molded from glossy plastic, like the lid of a tackle box. The letters are a flat, matte, dusty white. One single glossy streak, shaped like a quick tongue lick, crosses diagonally through the letters "ck" in "Pockets": everywhere the streak touches, the letters turn rich, wet, and shiny, with a small highlight. The idea: rockhounds lick a stone to see its true color.

Show the wordmark large on a solid cobalt blue background (#2443c9). Below it, show the same mark at small size, and a one-color version in plain white with the streak drawn as a simple cut line. Flat vector style, clean edges, no gradients except the small gloss in the streak. Text must read exactly "Heavy Pockets Co." No other words, no mascot, no pickaxe, no hammer, no mountains, no waves, no pebble icons.
```

**5b. The pocket**

```
Logo concept sheet for a small apparel brand called "Heavy Pockets Co." for Great Lakes rockhounds. The mark is a simple, bold jeans back-pocket shape (a shield-like pentagon with a stitched line across the top), drawn with thick rounded strokes. The pocket sags at the bottom because it's full of rocks: one round stone peeks over the top edge. Next to the pocket, the words "Heavy Pockets Co." in fat, rounded, molded-plastic letters.

Colors: white pocket and letters on solid cobalt blue (#2443c9), with the single stone in bright safety orange (#ff6a1a). Also show the pocket alone at favicon size (16 to 32 pixels) and a one-color white version. Flat vector style, no gradients, no texture. Text must read exactly "Heavy Pockets Co." No mascot, no pickaxe, no hammer, no mountains, no waves.
```

**5c. The molded stamp**

```
Logo concept sheet for a small apparel brand called "Heavy Pockets Co." for Great Lakes rockhounds. The words are stacked in two lines, "HEAVY POCKETS" large and "CO." small, in fat, rounded, molded letters that look pressed into a rounded-rectangle tackle box compartment, with a soft inner shadow and a lit top lip, like embossed plastic. The style is 1990s outdoor gear: confident and a little playful, not vintage or distressed.

Colors: white letters in a recessed darker cobalt compartment (#1a33a3) on a cobalt tray (#2443c9), with one small safety orange (#ff6a1a) latch detail on the compartment edge. Also show a flat one-color version that would embroider cleanly on a hat. Text must read exactly "HEAVY POCKETS CO." No mascot, no pickaxe, no hammer, no mountains, no waves, no pebble icons.
```

**What to check:** the spelling is exactly right, it still reads when tiny, and it works in one color. Pick one direction (or mix two), and tell ChatGPT: "Redraw this as the Task 2 SVG files in ChatGPT.md."

## Prompt 6: social link card (what shows when someone shares the site)

Make this after the logo is picked, and upload the chosen logo with the prompt.

```
A 1200 x 630 social sharing image for the website of "Heavy Pockets Co.", an apparel brand for Great Lakes rockhounds. Use the attached logo exactly as given; do not redraw or change its letters.

Layout: a top-down view of an open, molded cobalt blue plastic tackle box tray (#2443c9) with uneven compartments, soft inner shadows, and lit edges. The largest compartment on the left holds the logo and, below it, the line "Head down. Pockets full." in fat, rounded white letters. The compartments on the right hold a few real-looking, wave-worn Great Lakes beach stones: one wet Lake Superior agate with red and white banding, one gray Petoskey stone, and a few plain dry pebbles. One small safety orange (#ff6a1a) latch on the tray edge.

Photorealistic tray and stones, crisp flat logo and text. No people, no hands, no shirts or products, no prices, and no other text.
```

## What not to generate

- **Shirts and socks.** The site must show the real printed sample (PRODUCT.md principle 4). Product photos come from the Printify samples at Step 6.
- **Beach and shoreline scenes.** Unsplash has good ones (for example, Dave Hoefler's close-up of colorful pebbles and Michael Loftus's rocky beach). I'll pull those through the API with credits.
- **People or hands.** The brand is product-only.

## When you bring them back

Upload them here (or drop them in this folder). I'll check that each dry and wet pair lines up, cut out the background, set them into the stone wells, and log each in `IMAGE_CREDITS.md` as "AI-generated placeholder (ChatGPT), SAMPLE."
