# Heavy Pockets Co. | Approved homepage hero handoff
Updated November 4, 2026. Status: visual designs approved; **not deployed**.

## Approved artwork
- **Desktop:** Previously approved wide pixel sunset / realistic shoreline composition. Use `hero-approved-desktop.webp` (1774 × 887) with `hero-approved-desktop.jpg` fallback.
- **Mobile:** Owner-approved standalone vertical composition, **1086 × 1448**, exported as `hero-approved-mobile.webp` and `hero-approved-mobile.jpg`. It contains the complete logo and tagline above a fully visible pixel sunset, lighthouse, lake, and rocky shoreline.
- **REJECTED previous mobile crop:** The older 900 × 1200 stacked-crop mobile art obscured the sunset and must never be shipped. Do not reintroduce it.

The complete image binaries are in the downloadable ChatGPT handoff ZIP. They are **not stored in this GitHub repository yet**. Transfer those exact bytes to `brand/v2/hero-assets/` prior to browser preview or deployment. No rights to reuse the users' third-party geological reference photos are assumed. The approved generated compositions are not literal reference-photo copies.

## Responsive HTML
```html
<picture class="hero-art">
  <source media="(max-width: 680px)" type="image/webp" srcset="/brand/v2/hero-assets/hero-approved-mobile.webp">
  <source media="(max-width: 680px)" srcset="/brand/v2/hero-assets/hero-approved-mobile.jpg">
  <source type="image/webp" srcset="/brand/v2/hero-assets/hero-approved-desktop.webp">
  <img src="/brand/v2/hero-assets/hero-approved-desktop.jpg"
       alt="Heavy Pockets Co. pixel-art sunset over a Great Lakes shoreline with realistic stones."
       width="1774" height="887" decoding="async" fetchpriority="high">
</picture>
```
The original logo/tagline are baked into both files. Do not overlay duplicate branding on top of them. Include an actual visually-hidden HTML h1 for accessibility. The image is not a checkout button: place a real accessible shopping CTA immediately below.

## Responsive guardrails
- Preserve the full artwork. On desktop and mobile use `width:100%;height:auto;display:block`, not `object-fit:cover` cropping.
- Do not cover the mobile sunset with a fixed navbar, overlapping card, clipping container, or floating action button.
- Reserve appropriate aspect ratio per media choice to avoid layout shift. Desktop ~2:1; mobile 3:4. Test 375px, 390px, 768px, 1440px, and 200% zoom.
- Test iOS Safari, touch targets, contrast, logo legibility, and load performance. Decorative animation must respect reduced motion.
- Prices, product images, bestseller badges, and geological claims in earlier concept art are illustrative only.
- Don't merge, deploy, or push to Claude's working branch until the owner approves the actual implementation.

## Coordination with Claude
Claude Code can transfer the ZIP image files, integrate the responsive picture into a separate feature branch, test screenshot layouts, and submit a PR. Preserve `step4-overnight-build`, the live page, and project strategy documents until changes are reviewed.
