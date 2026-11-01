# Product

<!-- impeccable:product-schema 1 -->

Source: CLAUDE.md and PLAN.md, confirmed by Brian through Nov 1, 2026. Visual decisions live in `brand/Brand_Guide.md`, not here.

## Platform

web

## Stack

Static HTML, CSS, and a little JavaScript for the preview in `theme/preview/` (PLAN.md Step 5). At Step 13 it moves into Shopify's free Dawn theme. Only the wet-stone hero is custom code; every other section must map to a standard Dawn section.

## Users

Great Lakes rockhounds in Michigan, Wisconsin, and Minnesota. Most arrive **on a phone**, straight from a product-only TikTok or Instagram video, having just seen one shirt. They know their stones and spot a wrong label right away.

## Product Purpose

Heavy Pockets Co. sells print-on-demand tees and socks drawn from real Great Lakes stones, made by a rockhound in Grand Rapids. Success means profit greater than Brian's monthly AI bill (about $20), which is 2 to 4 orders a month. Tees make the profit; socks are add-ons and bundles.

## Positioning

"Wet Stone": rockhounds wet a stone to see its true color. The real stone shown next to the shirt drawn from it is proof a generic rock-pun shop can't fake. Secondary line: "Dry rocks lie."

## Operating Context

- Traffic is organic social only, with no paid ads.
- Prices: tees $27.99, socks $18.99, and the bundle $39.99. Free shipping is built in.
- Launch 5: the Great Lakes beach stone chart, "Agate Expectations," "Will brake for agates," Petoskey hexagon socks, and "I lick rocks."
- Contact: hello@heavypocketsco.com and @heavypocketsco.

## Capabilities and Constraints

- Shopify opens at Step 12, so until then everything is a preview in the repo.
- Brian is new to coding: keep the code simple and the steps small.
- Undecided: the final hero image (Brian wants an "epic, beautiful rock scene," with Claude refining his image prompts).

## Brand Commitments

- Name: Heavy Pockets Co. Tagline: "Head down. Pockets full."
- Copy rules: never use em dashes, and always use the Oxford comma.
- Wordmark, palette, and fonts: see `brand/Brand_Guide.md` and `theme/brand-tokens.css`.

## Evidence on Hand

- No product photos, stone photos, samples, reviews, or press yet. **Never fabricate reviews, "as seen in" logos, or trust badges.**
- Placeholder art must be labeled as placeholder.

## Product Principles

1. Truth first: every stone name and chart label is checked by Brian against reliable sources before going live.
2. Original art only: no tracing, no protected IP, and slogans checked on USPTO before printing.
3. Real material carries the page: Brian's photos and field notes, not generic stock looks.
4. Small and portable: build only what moves cleanly to Shopify.

## Accessibility & Inclusion

Readable in light and dark mode. All text pairings pass WCAG contrast (`scripts/check_contrast.py`). The wet effect must never be the only way to see a product or reach the button.
