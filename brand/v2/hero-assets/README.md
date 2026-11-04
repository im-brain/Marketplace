# Heavy Pockets Co. | Approved homepage hero handoff
Updated November 4, 2026. Status: visual designs approved; **not deployed**.

## Approved artwork
- **Desktop:** Previously approved wide pixel sunset / realistic shoreline composition. Use `hero-approved-desktop.webp` (1774 × 887) with `hero-approved-desktop.jpg` fallback.
- **Mobile:** Owner-approved standalone vertical composition, **1086 × 1448**, exported as `hero-approved-mobile.webp` and `hero-approved-mobile.jpg`. It contains the complete logo and tagline above a fully visible pixel sunset, lighthouse, lake, and rocky shoreline.
- **REJECTED previous mobile crop:** The older 900 × 1200 stacked-crop mobile art obscured the sunset and must never be shipped. Do not reintroduce it.

**Committed Nov 4, 2026** from `heavy-pockets-hero-working-preview.zip`, byte-identical to the ZIP (not re-encoded). SHA-256:
- `hero-approved-desktop.webp` 023827adca2c4fb7c71daff1240a9891c27d7e9e4f799480d0e39f53e9afd598
- `hero-approved-desktop.jpg` cc0ae3f5ea1bbb16cd9e0f8be00af1a8af64a9e9b1cc42b6ec8d8fbd348f8c32
- `hero-approved-mobile.webp` 647202cb4dbb55d9dacaa4553704f91da919387f4257d605e653bda0aab569db
- `hero-approved-mobile.jpg` 9cab983e45e4c0b64e633216fab23ab0d4f3ae251696c84aad6ba05715b8ea78

Implementation: `brand/v2/hero-preview/index.html`. Test screenshots: `brand/v2/hero-preview/qa/`. No rights to reuse the users' third-party geological reference photos are assumed. The approved generated compositions are not literal reference-photo copies.

## Responsive HTML
```html
<picture class="hero-art">
  <source media="(max-width: 680px) and (max-aspect-ratio: 1/1)" type="image/webp" srcset="/brand/v2/hero-assets/hero-approved-mobile.webp">
  <source media="(max-width: 680px) and (max-aspect-ratio: 1/1)" srcset="/brand/v2/hero-assets/hero-approved-mobile.jpg">
  <source type="image/webp" srcset="/brand/v2/hero-assets/hero-approved-desktop.webp">
  <img src="/brand/v2/hero-assets/hero-approved-desktop.jpg"
       alt="Heavy Pockets Co. pixel-art sunset over a Great Lakes shoreline with realistic stones."
       width="1774" height="887" decoding="async" fetchpriority="high">
</picture>
```
The original logo/tagline are baked into both files. Do not overlay duplicate branding on top of them. Include an actual visually-hidden HTML h1 for accessibility. The image is not a checkout button: place a real accessible shopping CTA immediately below.

Implementation note: the mobile art is chosen for narrow **portrait** viewports (`max-width: 680px` and `max-aspect-ratio: 1/1`). Narrow landscape windows, such as a laptop at 200% zoom, keep the wide art so the shop button is not pushed far below the fold. Phones in portrait always get the vertical art.

## Responsive guardrails
- Preserve the full artwork. On desktop and mobile use `width:100%;height:auto;display:block`, not `object-fit:cover` cropping.
- Do not cover the mobile sunset with a fixed navbar, overlapping card, clipping container, or floating action button.
- Reserve appropriate aspect ratio per media choice to avoid layout shift. Desktop ~2:1; mobile 3:4. Test 375px, 390px, 768px, 1440px, and 200% zoom.
- Test iOS Safari, touch targets, contrast, logo legibility, and load performance. Decorative animation must respect reduced motion.
- Prices, product images, bestseller badges, and geological claims in earlier concept art are illustrative only.
- Don't merge, deploy, or push to Claude's working branch until the owner approves the actual implementation.

## Coordination with Claude
Claude Code can transfer the ZIP image files, integrate the responsive picture into a separate feature branch, test screenshot layouts, and submit a PR. Preserve `step4-overnight-build`, the live page, and project strategy documents until changes are reviewed.
