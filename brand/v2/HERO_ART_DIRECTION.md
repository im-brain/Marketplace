# Heavy Pockets Co. | Hero Art Direction v2.1
Status: PROPOSED. November 4, 2026. Owner feedback: positive on the retro pixel-art sunset transitioning into realistic foreground stones, but current generated scenery and rocks still look like AI concept art.

## The visual idea
**A shoreline crossed between two visual worlds.** Upper two-thirds: crisp, deliberately authored pixel art of Lake Superior at sunset. Lower third: believable Great Lakes beach material, photographed with the same camera and light conventions as the rest of the store. The transition should feel like the game world opening onto a real beach, not like cutout stones pasted on a cartoon.

## Simplify the pixel layer
- Wide, low sun near horizon; calm water; 2–3 limited blue wave bands; a dark shoreline silhouette.
- Use 4–6 colors in the scenery, not hundreds of AI-generated orange/pink micro-patches.
- Favor distinct 8px/16px-style pixel clusters; forbid blurry upscaling, random noise, and tiny decorations.
- Lighthouse and trees are OPTIONAL, not automatic. The store's iconography already provides context.
- Leave adequate quiet navy space for brand title, tagline, and CTA.
- Match the existing coming-soon page's horizontal pixel waves, rather than introducing an unrelated illustration style.

## Real stone layer
- Build from **actual owned or explicitly licensed reference photographs** wherever possible.
- If creating individual isolated stones, the pieces must be species-accurate: no fake polygon grids on Petoskey fossils, no neon bands or perfect agates, and no exaggerated glossy marble shine.
- Stones do not all need to be extraordinary; use mundane basalt, gray chert, understated jasper, and other naturally weathered rocks. A single muted Petoskey stone or partially exposed agate can be the focal specimen.
- One consistent camera perspective, visible imperfect contact shadows, soft overcast light. Subtle dampness only where a wet scene is intended.
- Depth composition: a few near-field stones and many quiet ordinary pebbles. Avoid a lineup of five hero rocks, each perfectly centered, rotated, and saturated.
- Frame the composition so the stones never interfere with headline text or buy controls.

## Pixel-to-real join
- Treat the join as an environmental composition boundary (beach/water), not a translucent Photoshop gradient over stone textures.
- Pixel water can stop behind a thin natural shoreline silhouette; photographic stones occupy the lower foreground.
- Match colors and horizon direction, but keep the pixel art unmistakably pixelated and the stones unmistakably photographic.
- No illumination halo, glowing contact edges, impossible reflection directions, or stone patterns whose geometry shifts at the join.

## Recommended implementation
1. Hand-author (SVG/CSS) an intentionally simple pixel-art sunset with a constrained palette. Pixel SVG may scale using crisp edges.
2. Use a transparent foreground asset assembled from approved real/realistic stone photography. Load it separately as an image, not a generated composite background. Keep the original foreground and a licensed/source record.
3. Overlay layers inside a responsive hero container with explicit crop/focal behavior for mobile.
4. Ensure the headline and CTA remain HTML text, legible without the artwork.
5. Test at 375px mobile, 768px tablet, and 1440px desktop, and at 200% zoom.
6. Respect reduced motion if a parallax or wet-state animation is added.

## Do not treat the AI concept board as authoritative
- In the concept render, products, prices, “NEW”/“BESTSELLER” badges, and near-perfect patterned stones are placeholders, not facts.
- Do not publish or reproduce these as accurate merchandise.
- The illustrative brand board needs owner-approved replacement assets before storefront use.

## Approval checkpoints
- A. Sunset scenery composition.
- B. Foreground stone selection from authentic sources.
- C. Join / crop / perspective in desktop and mobile.
- D. Readability of text and conversion-focused controls.
Only after approval: export finished web assets, pass to Claude on the development branch via PR.
