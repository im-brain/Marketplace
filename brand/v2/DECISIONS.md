# Heavy Pockets Co. | Decision register
Updated: November 4, 2026.

## Confirmed by owner
- Name: Heavy Pockets Co.
- Tagline: Head down. Pockets full.
- Broad niche: core rockhound audience plus wider Michigan / Great Lakes fans.
- Original garments, led by print-on-demand T-shirts, potentially socks and other garments.
- Existing live coming-soon page's 1990s pixel-game / computer-window personality is preferred over the editorial / minimal brand explorations.
- Improve small-font readability.
- Warm navy + earthy accents looks better than the original palette as a concept.
- ChatGPT guides creative visual identity and imagery; Claude is primary developer; GitHub is shared project record.
- Preserve Claude's strategic work and implement only after owner approves design.

## Open
- Final color palette and accessibility-tested pairings.
- Typography selection and exact wordmark.
- Mascot final forms and use guidelines.
- Printify product specs, sample prices, and storefront integration.
- Approval of visual concept board and first revised storefront prototype.
- Any actual website modifications, merges, or deployment.

## Safe branch
- Working branch: brand/heavy-pockets-v2 (created from step4-overnight-build).
- Source/implementation branch: step4-overnight-build.
- No permission to modify existing source HTML or publish a live update based on this proposal alone.

## Owner approval — November 4, 2026: Refined homepage hero
- **Approved:** The revised generated homepage hero image featuring a retro pixel-art sunset, shoreline water, and photographic-style Great Lakes rocks, after revising the left foreground puddingstone to include red jasper fragments with natural variation in size.
- **Asset identification:** ChatGPT generated image from the November 4 conversation, filename `same_scene_as_before_but_the_puddingstone_foregr.png` (local chat artifact). This filename is a handoff reference; the image has **not yet been checked into this repository**.
- **Scope:** Visual approval of this particular hero composition. It does not authorize deployment, checkout integration, publishing, or changes to the current live site.
- **Implementation requirement:** Preserve the exact approved composition and puddingstone variation when preparing responsive formats. Test mobile crops and logo legibility. Keep third-party reference photographs out of production unless rights have been verified. Before publication, ensure geological and image-quality QA.

## Owner approval — November 4, 2026: Final mobile hero composition
- **Approved:** A newly composed *vertical* mobile hero image with the full Heavy Pockets Co. logo and tagline at the top, the sunset fully visible below, and realistic shoreline stones at the bottom.
- **Supersedes:** The previous mobile image assembled from two stacked crops. That version obscured the sunset and must not be used.
- **Source asset:** ChatGPT generation `a_vertical_mobile_friendly_version_of_the_heavy_po.png`, 1086 × 1448 pixels. Optimized exports are `hero-approved-mobile.webp` and `hero-approved-mobile.jpg` in the accompanying handoff archive.
- **Preserve:** The approved desktop hero remains unchanged. Do not substitute a crop of the desktop artwork for the approved mobile composition.
- **Status:** Visual artwork approved, **not** approval to merge, deploy, or alter the live site. Test final real-device layout before publishing.

## Implementation, November 4, 2026 (Claude Code): approved hero integrated for review
- Exact approved WebP and JPEG bytes committed to `brand/v2/hero-assets/` (checksums in its README).
- `brand/v2/hero-preview/index.html` rebuilt as the responsive homepage hero: full art, no cropping, no overlaid branding, visually hidden h1, real nav and shop button below the art, zero layout shift.
- Tested at 375, 390, 768, 1440, and 200% zoom (screenshots in `brand/v2/hero-preview/qa/`).
- `theme/preview/index.html` (Step 11 store preview) left unchanged; nav and button link to it.
- **Still needs owner approval** before merge or any deployment.

## Owner approval, November 5, 2026: hero implementation
- **Approved:** the integrated hero (`brand/v2/hero-preview/index.html`), after checking it on a real phone in portrait and landscape.
- **Accepted as is:** the art's accuracy flags (very uniform Petoskey cells, a bright banded agate, and snow-capped peaks in the logo). The owner chose not to change them.
- **Merged** into `step4-overnight-build`. Not deployed to heavypocketsco.com.
