# Heavy Pockets Co. — Locked palette & typography
**Creative-direction decision:** November 4, 2026. These decisions are made for implementation, not authorization to deploy.

## Color hierarchy
1. **Core:** Lake Navy `#102849` (brand backgrounds), Warm Cream `#F3E8D2` (content/brand text), Rust `#A7472D` (primary actions/window title bars), Sandstone `#D9B98B` (restrained framing and borders).
2. **Utility:** Ink `#101D2C` (page background and readable dark text), Deep Teal `#164745` (secondary surfaces), Lake Blue `#376C9B` (waves, subtle accents).
3. **Rare accents:** Gold `#E8B954` (focus/rare emphasis), Graphite `#272C34`, White `#FFFFFF`.

Use the navy/cream/rust/sand four as the recognizable brand. Limit bright pixels and accent colors; let shoreline art and photographs be the detailed visual elements.

## Locked fonts
- **Short pixel headings and retro UI accents:** **Press Start 2P**, 400. No text smaller than 16px by default; avoid it for navigation, prices, paragraphs, input labels, checkout, and long product titles. This is a *supporting interface typeface*, not a command to replace the raster artwork's existing wordmark.
- **Primary readable UI:** **Atkinson Hyperlegible Next**, 400 body, 600/700 key navigational elements and product titles, 700/800 CTA labels. Use 16–18px default mobile body and at least 1.45 line-height.
- **Secondary metadata:** platform monospace. No third custom font required.

Both chosen families are available under **SIL Open Font License v1.1**. Source: [Press Start 2P](https://github.com/google/fonts/tree/main/ofl/pressstart2p), [Atkinson Hyperlegible Next](https://github.com/googlefonts/atkinson-hyperlegible-next). If bundling them, retain the appropriate notices. Font files are not part of this handoff.

### Suggested loading
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:wght@400;500;600;700;800&family=Press+Start+2P&display=swap" rel="stylesheet">
```
For production, prefer self-hosted woff2 with license included when compatible with deployment. Check exact Google Fonts API family availability during implementation.

## Contrast checks (WCAG ratios; ordinary text needs 4.5:1)
| Foreground | Background | Ratio | Status |
|---|---|---:|---|
| Cream | Navy | 12.16 | Pass |
| White | Rust | 5.86 | Pass |
| Cream | Rust | 4.82 | Pass, but tighter |
| Ink | Cream | 14.00 | Pass |
| Ink | Sand | 9.13 | Pass |
| Cream | Teal | 8.55 | Pass |
| Cream | Lake Blue | 4.57 | Pass, close |
| Gold | Navy | 8.09 | Pass |
| Sand | Rust | 3.14 | **Do not use for normal text** |

These ratios are calculated from color values, **not** a substitute for browser contrast/accessibility testing.

## Interaction / design rules
- Use real HTML for nav and CTA; don't duplicate the brand logo/tagline embedded in the two approved hero images.
- Buttons: rust background + white text + sand border, >=44px target; focus visible in gold at 3px.
- Cards: cream with ink text and sandstone border; clean product photography, no pixel effect applied to merchandise.
- Main site navigation: Atkinson, not Press Start 2P. Header game chrome may use system monospace or restrained Press Start 2P where space allows.
- Mobile: preserve unobstructed sunset, avoid overlays. Test 375/390/768/1440 and 200% zoom.
- Keep the wet/dry stone experience and field notes; brand wrapper is playful, commerce is clear.
- No fabricated offers, reviews, product claims, or stone patterns.
- The palette and font selection are finalized for Claude to implement. **Wordmark vectorization, final mascot art, product visuals, checkout and deployment are separate decisions.**

## Integration boundaries
This document authorizes Claude to **implement a reviewable storefront preview** on a new feature branch based on `step4-overnight-build`, using these tokens. It does *not* authorize merging to `main`, replacing the live coming-soon site, or deploying the storefront without the owner's explicit signoff.
