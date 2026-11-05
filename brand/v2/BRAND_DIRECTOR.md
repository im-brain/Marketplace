# Heavy Pockets Co. | Brand Director v2.0
Status: **PROPOSAL / AWAITING OWNER APPROVAL**. Prepared November 4, 2026.
Authority: this document is a proposed direction, not permission to change the deployed site, committed brand kit, catalog, or Shopify configuration.

## Core proposition
Great Lakes rockhounding apparel and lifestyle goods. Be specific enough for serious rockhounds and welcoming enough for Michigan and Great Lakes enthusiasts. Launch priority: original print-on-demand tees and socks; other garments may follow.

## Non-negotiable identity
- Keep the existing 1990s pixel-game / desktop-window world established on heavypocketsco.com. This is the memorable brand wrapper, not the visual treatment for every product.
- Primary name: **Heavy Pockets Co.** Primary line: **Head down. Pockets full.**
- Secondary line for contextual use: **Dry rocks lie.**
- Tone: playful, curious, a bit nerdy, approachable, confident. Avoid generic adventure clichés and fake geological expertise.
- The small rockhound character from the current coming-soon page is the mascot reference. Do not replace its appearance or invent a final turnaround sheet without approval.
- Dry-to-wet reveal is a signature site interaction, not a license to alter the specimen's structure.

## The two complementary worlds
**Brand world:** deliberately pixelated graphics, familiar 1990s application windows, flat colors, hard-edged borders, lakeshore wave bands, a few rock icons, restrained nostalgic game UI. Pixelated scenery must be designed, not merely upscaled blurry raster artwork.
**Product world:** believable apparel photography and geologically accurate, real-looking stone photographs. Clean lighting, true fabric/print texture, readable descriptions. Do NOT turn merchandise photographs into pixel art.

A third supporting world, **Field Notes**, can borrow the trustworthy specimen labels and scientific annotation ideas from Claude's earlier kit. Use it for educational stories and field-guide content inside the pixel interface, not as a competing overall brand.

## Proposed palette, not approved
The live site's navy is the anchor. Earthier rust, sandstone, and cream soften the interface. Suggested candidate tokens in DESIGN_TOKENS.json.
- Navy #102849: logo panels, key hero sections.
- Ink #101D2C: desktop chrome, outlines, body text on light surfaces.
- Deep teal #164745: frames / secondary surfaces.
- Lake blue #376C9B: wave graphics and highlights.
- Warm cream #F3E8D2: readable light text and paper panels.
- Sandstone #D9B98B: trim, specimen cards.
- Rust #A7472D: title bars / selective CTAs.
- Gold #E8B954: rare attention accents.
- Dark graphite #272C34: content panels.
A/B hybrid direction is preferred but **not final**. Do not derive permanent CSS values by visually sampling AI-generated mockup pixels.

## Type roles
- Pixel display face: logo / short headings / game chrome only. Candidate: Press Start 2P, but its large visual width demands responsive checks. Current wordmark from live page remains a reference, not a locked vector logo.
- Human-readable sans: product information, navigation, size selection, prices, forms, FAQs, policies, and accessibility-sensitive text. Candidate: Atkinson Hyperlegible or Nunito Sans (verify family and license before build). No tiny pixel-text privacy notices.
- Optional monospace: specimen identifiers and window filenames, e.g., FIELD_NOTE_007.txt.
- Avoid mixing an unrelated traditional serif into the main signup copy. Do not force pixel type into long paragraphs.
- Aim for >=16px mobile paragraph text, accessible contrast, keyboard focus states, and touch targets >=44px where possible.

## UI art direction
- Windows as visual containers, but shopping affordances must remain conventional: visible product name, real price, variant selector, add-to-cart button, and shipping/returns information.
- Prefer familiar labels for primary navigation: Shop, New, Field Notes, About. Game language can appear in secondary microcopy.
- The scenic lake hero and illustrated mascot can be playful. Do not let scenery displace the shop CTA below the fold on phones.
- Use caution stripes as a “construction / beta” accent, not the dominant permanent commerce style.
- Never use generated placeholder prices, invented reviews, unverifiable “bestseller” badges, or fabricated product photos as live claims.
- Responsive layout must be tested at narrow mobile widths and with reduced-motion settings.

## Stone and product visual accuracy
- Refer to IMAGE_STANDARDS.md before generation, editing, approval, or publishing.
- Real reference photographs can guide geology and visual realism but must not be traced or printed without appropriate rights.
- A dry/wet pair MUST be the same visible specimen, silhouette, composition, pattern, chips, and lighting direction.
- Water should primarily deepen color and reduce haze; do not add a glass shell, glowing rim, or fantasy bands.
- All product photography and garment graphics must be original or commercially licensed and reviewed by the owner.

## Known business/creative decisions to preserve
- Existing five-design launch plan is a **plan**, not proof of finalized SKUs.
- Shopify + Printify remains the current intended platform; do not trigger account charges or publish catalog items.
- Field notes and free field guide are valuable long-term differentiators.
- Keep Claude's strategic project documents and existing build untouched until approval.

## Quality gates (must pass before publication)
1. Brand recognizability at avatar, mobile hero, product card, and print-tag sizes.
2. Geological accuracy where stone species is named; no synthetic honeycombs, repeated polygon cracks, or overly saturated agates.
3. Legibility, contrast, image alt text, keyboard focus, reduced-motion behavior, and responsive review.
4. Mockup/real-photo honesty; every prototype visibly identified as conceptual when necessary.
5. Product claims, pricing, shipping, fabric composition, and trademark rights verified separately.
6. Owner review of colors, fonts, mascot, final wordmark, and storefront before deployment.

## Collaboration protocol
This branch is a proposal and Claude's branch is the implementation source. Never overwrite CLAUDE.md, PLAN.md, brand/kit/index.html, theme/preview/index.html, or live deployed assets without an explicitly approved task.
- ChatGPT: draft creative system, generate/reference imagery, inspect quality, issue change proposals.
- Claude Code: implement accepted specs, integrate Shopify/Printify, run web tests.
- Codex: repository review, focused implementation, pull request review if asked.
- Record approvals and unresolved questions in DECISIONS.md.
- Prefer feature branches / PRs to direct edits to main. Do not merge or deploy without owner authorization.
