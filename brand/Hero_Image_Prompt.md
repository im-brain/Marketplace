# Hero Image Prompt (Step 5 home page)

Draft 1, Nov 1, 2026. For the "wave line" hero in `theme/preview/Home_Page_Plan.md`. Brian edits it, Claude refines it, and only then does anything get generated.

## Prompt (plain sentences; works in ChatGPT, Gemini, and most tools)

> A realistic photograph of a Lake Superior cobble beach at the water's edge, taken from a low camera crouched about a foot above the stones. A small wave has just pulled back, so every stone in the foreground is soaking wet and glossy, with thin sheets of water and a little white foam still sliding between them. The stones are the real mix found on Lake Superior beaches: dark gray basalt, pink and red granite, rusty red jasper, a few speckled and striped stones, and two or three small, natural-looking banded agates in red and orange, about the size of a thumbnail to a walnut, rough and unpolished. Low, warm, golden-hour sun from the side makes the wet stones glow and shows their true colors and bands. In the background, cold, clear, blue-green water and a soft horizon with a calm sky. The foreground stones are sharp; the far water is slightly soft. Natural colors, not oversaturated. Wide landscape image, 16:9, with the most interesting stones in the center so it can also be cropped tall for a phone.
>
> Do not include: people, hands, feet, text, logos, watermarks, buildings, boats, polished or cut gemstones, geodes, crystals, glowing or neon colors, or fantasy elements.

## Midjourney version (if Brian uses Midjourney)

> realistic photo, Lake Superior cobble beach at the waterline, low camera just above the stones, wave just receded, every stone soaking wet and glossy, thin water and foam between stones, dark basalt, red granite, rusty jasper, a few small rough banded red and orange agates, low warm golden-hour side light, cold clear blue-green water, soft horizon, sharp foreground, natural color --ar 16:9 --style raw --no people, text, logo, watermark, polished gems, geodes, crystals, neon

## Why each part is there

- **Wet and glossy:** the page makes the dry look in code, so the image has to start wet. This is the most important line.
- **The real stone mix:** rockhounds will spot a beach made only of agates right away. Real Superior beaches are mostly basalt and granite, with agates being the rare find.
- **Small, rough, unpolished agates:** AI tools tend to draw cut, glowing geodes. Nobody finds those on a beach.
- **Low camera:** it feels like hunting, and the big foreground stones show the wet effect best.
- **16:9 with the subject centered:** desktop shows the full width, and phones crop to the middle.
- **Not oversaturated:** wet stone is deeper and richer, never brighter (brand rule).

## Check before using

- Do the stones look like a real Superior beach? Brian confirms; reject anything with fake-looking agates.
- Is there any text, a watermark, or strange melted shapes in the stones? Reject or regenerate.
- Never caption it as a real place. It's a mood scene until Brian's own beach photo replaces it.
- Save the file at full size into `theme/preview/img/hero-wet.jpg` (or send it to Claude).
