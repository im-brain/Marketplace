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

## Creative director decision — November 4, 2026: palette and typography finalized for implementation
- Owner delegated the next brand palette/font decisions to ChatGPT as creative lead.
- **Core palette:** Lake Navy #102849, Warm Cream #F3E8D2, Rust #A7472D, Sandstone #D9B98B.
- **Supporting palette:** Ink #101D2C, Deep Teal #164745, Lake Blue #376C9B; rare Gold #E8B954.
- **Display:** Press Start 2P, short retro headings and window accents only.
- **Primary text/UI:** Atkinson Hyperlegible Next for all shopping, nav, content and forms.
- **Metadata:** platform monospace, no third downloaded font.
- Color roles, accessibility pairings, and usage rules are defined in `BRAND_SYSTEM_LOCK.md`, `DESIGN_TOKENS.json`, and `brand-tokens.css`.
- **Status:** creative direction locked for a reviewable storefront preview; not permission to alter live website, merge to main, or deploy. Final logo vector and mascot remain open separately.

## Implementation, November 5, 2026 (Claude Code): full storefront preview v2
- Branch `storefront/v2-retro-integration` (from `step4-overnight-build` plus PR #2). Page: `theme/v2/index.html`.
- Uses the locked tokens (`brand-tokens.css`) and the approved hero files unchanged. No logo or tagline overlaid; real nav and CTA outside the art.
- New retro button system (raised, 3px press, 70ms stepped), applied to CTAs, size and color options, tabs, and small actions. Details in `theme/v2/README.md`.
- Sections: header, hero, launch five, product viewer, wet test (same-specimen filter change), field notes, about, footer, preview cart.
- Code-drawn Petoskey cells redrawn as irregular, flush cells to follow IMAGE_STANDARDS.md. Stones remain labeled stand-ins.
- Tested with Playwright at 320 to 1440 px, landscape, 200% zoom, touch, keyboard, and reduced motion; text contrast measured. Results in `theme/v2/qa/`.
- **Still needs owner approval** before merge or any deployment. `theme/preview/` left unchanged.

## Owner approval, November 5, 2026: storefront preview v2
- **Approved:** the storefront preview in `theme/v2/` (retro shop window, ChatGPT stone pairs in the wet test, sock concept).
- **Merged:** PR #3 into `step4-overnight-build`. Not merged to `main`, not deployed to heavypocketsco.com.
- **Still open:** real photos of Brian's own finds to replace the AI sample stones; final art for the three stand-in tees; final sock design.

## Owner decisions, November 7, 2026 (storefront brief)
- **Assortment:** six products replace the old launch 5 and socks: Midnight Rock Hunt Tee, Great Lakes Rock Crew Tee, Field Notebook Tee, Pocket Full of Treasures Tee, Shoreline Hoodie, and Floral Butterfly Embroidered Hoodie. Indigo Blue embroidery removed; do not restore.
- **Wordmark:** option A ("Warm & human") from the wordmark comparison: lowercase "heavy pockets," single color (cream on dark, deep teal on light), optional teal and rust secondary. No "Co.," tagline, or scenery with it. Garment artwork unchanged.
- **Homepage:** header, shorter sunset hero, all six products, short story, small signup, footer. Navigation: Shop, Field Notes, About, Cart.
- **Wet reveal** on homepage clothing images only (hover, focus, touch while scrolling, "Wet it" button), remembered for the visit. Product pages show full color immediately. The standalone wet-stone lab leaves the homepage.
- **Photography:** clean consistent images for browsing; lifestyle and detail shots on product pages. Supplier mockups now, sample photos later.
- **Story:** shared feeling of finding things first, then a short intro to Brian. Field Notes gets its own page.
- **Custom loading icon** added to the website to-do list.
- **Not authorized:** merging, public deployment, replacing the live coming-soon site, Shopify, subscriptions, purchases, or real emails.

## Implementation, November 7, 2026 (Claude Code): storefront preview v3
- `theme/v3/`, branch `claude/clever-curie-pxflzz`. Handoff: `theme/v3/HANDOFF.md`.
- Wordmark: provisional trace of option A in `brand/v3/wordmark/` (designer cleanup still needed for production).
- Hero: review crops of the approved masters that exclude the baked-in old logo and tagline; masters unchanged; clean logo-free art requested.
- Loading icon: provisional (three pebbles wetting in turn). Not an approved illustration.
- Prices provisional in `theme/v3/src/pricing.json`.
- **Still needs owner approval** before merge or any deployment.

## Owner feedback, November 7, 2026 (iPad review of the v3 preview)
- Wordmark: separate the "v" and "y" (they touched in option A's source art).
- Resting "dry" state 15% drier, so the reveal reads clearly.
- Remove the "Wet it" and "Wet" buttons; use a small see-through "Show" in the image corner. This replaces the brief's "Wet it" button. The shop intro text explains the effect.
- Phone hero must show the rocks.
- Pages must open at the top.
- Remove the size-range text and the color counts.
- Shoppers should never see "supplier" or "Printify."
- Implemented the same day on branch `claude/clever-curie-pxflzz`; 358 browser checks pass.

## Owner approval, November 7, 2026: wordmark v and y
- **Approved:** the separated "v" and "y" in the option A wordmark, rebuilt from the font's own tops with the "y" and "pockets" moved 6.75 px right (`brand/v3/wordmark/`).
- **Still open:** production vector cleanup by a designer before garments, embroidery, or print. The rest of the storefront preview is still under review.

## Owner approval, November 7, 2026: storefront preview v3 and prices
- **Approved:** the whole v3 storefront preview (`theme/v3/`), including the pebble loading icon and the hero review crops as the current treatment.
- **Prices approved:** 30 dollars front-print tees, 40 Midnight Rock Hunt Tee, 60 hoodies, standard U.S. shipping included. Larger sizes on every product: 2XL plus 2, 3XL plus 4, 4XL and 5XL plus 6 (Brian picked even steps over exact cost matching).
- **Still open:** sample approval, sample and lifestyle photos, production wordmark vector, story and policy copy, live stock check, email service, and Field Notes fact checks.
- **Merged:** PR #5 into `main` at Brian's request (Nov 7, 2026). **Not authorized yet:** deployment or Shopify (Step 12 waits for sample approval).


## Owner approval, November 7, 2026: live coming-soon page in the v3 brand
- **Choices:** keep the rockhound mascot and the day and night switch; teaser only (no product images or prices); collect the email only (no design picks); keep speech bubble option A ("Something magnifico is in the tumbler. It'll rock.").
- **Approved and deployed:** Brian said "Deploy" after reviewing the private preview. Deployed Nov 7, 2026, to the Worker `heavypockets-coming-soon` with the same `DIBS` signup list. Existing signups were not touched.
- **Source:** `site/coming-soon/` (rollback copy in `live-2026-11-04/`).
- **Follow-up, same day (Brian's OK):** `www.heavypocketsco.com` now redirects to heavypocketsco.com, and the Cloudflare visitor counter (no cookies) is turned on. The footer says so.
