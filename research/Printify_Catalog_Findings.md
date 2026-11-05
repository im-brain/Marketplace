# Printify Catalog Findings (Nov 4, 2026)

US print providers only, for unisex tees and crew socks. Nothing was created, published, or ordered.

## Where the numbers come from

- **Printify catalog API** (`api.printify.com/v1/catalog/...`, Nov 4, 2026): providers, locations, sizes, colors, print area pixel sizes, and US shipping.
- **Printify's public catalog pages** (printify.com, Nov 4, 2026): base cost per provider. The catalog API does not return product cost. These are Free plan "from" prices, which means the cheapest variant (usually S to XL). 2XL and up cost more. Exact per-size cost shows only after a product is made in the Printify editor.
- **Shipping:** the API lists two US rates for most tee providers but doesn't name them. The lower one ($4.49 first item) matches the "standard" shipping shown on the catalog page, so that's the one used. A $7.99 rate on core colors only is probably express.

## Recommendations

| Product | Pick | Why |
|---|---|---|
| Bella+Canvas 3001 tee | **Monster Digital** (Columbus, OH) | Ties for the lowest landed cost ($16.26, 2 cents behind SwiftPOD). Ohio is the closest ship-from point to Great Lakes buyers. Has 53 colors. It's also the cheapest named Comfort Colors 1717 provider, so one printer handles both tees. |
| Comfort Colors 1717 tee | **Monster Digital** | $13.04, which is $2.61 under the next named provider. |
| Gildan 5000 (budget tee) | **Printful via Printify** (Charlotte, NC) | $8.55, the cheapest US option. |
| Crew socks | **SPOKE Custom Products** (Norcross, GA), blueprint 376 | Cheapest sock ($7.39), the only one sold in real sizes (S, M, L), and the sharpest template (twice the pixels of the backup). |

Backup tee printer: **SwiftPOD** (San Jose, CA), with 121 colors, XS to 5XL, and the same landed cost, but it ships from California.

Printify Choice is cheaper ($11.29 for the 3001), but Printify picks a different printer for each order. That means print quality and the ship-from state can change from one order to the next, which is a poor fit for color-critical "wet stone" art. Skip it for now.

## Tees (front print only)

| Tee | Provider | Location | Base (from) | Ship 1st | Ship add'l | Landed | Colors | Sizes |
|---|---|---|---|---|---|---|---|---|
| B+C 3001 | **Monster Digital** | Columbus, OH | $11.77 | $4.49 | $2.09 | $16.26 | 53 | S to 3XL |
| B+C 3001 | SwiftPOD | San Jose, CA | $11.75 | $4.49 | $2.09 | $16.24 | 121 | XS to 5XL |
| B+C 3001 | Stakes Manufacturing | Eastlake, OH | $11.43 | $5.39 | $2.19 | $16.82 | 96 | XS to 5XL |
| B+C 3001 | Dimona Tee | Dania Beach, FL | $13.38 | $4.49 | $2.09 | $17.87 | 39 | XS to 3XL |
| B+C 3001 | Printful | Charlotte, NC | $14.54 | $4.49 | $2.09 | $19.03 | 72 | XS to 5XL |
| CC 1717 | **Monster Digital** | Columbus, OH | $13.04 | $4.49 | $2.09 | $17.53 | 33 | S to 4XL |
| CC 1717 | SwiftPOD | San Jose, CA | $15.65 | $4.49 | $2.09 | $20.14 | 51 | S to 4XL |
| Gildan 5000 | **Printful** | Charlotte, NC | $8.55 | $4.49 | $2.09 | $13.04 | 35 | S to 5XL |
| Gildan 5000 | SwiftPOD | San Jose, CA | $9.98 | $4.49 | $2.09 | $14.47 | 39 | S to 5XL |
| Gildan 5000 | Monster Digital | Columbus, OH | $10.05 | $4.49 | $2.09 | $14.54 | 32 | S to 5XL |

Gildan 64000 (blueprint 145) is sold by 11 US providers, but its catalog page wouldn't load prices, so it has no cost here.

### Tee front print area (pixels)

- **Monster Digital B+C 3001: 4500 x 5100 px** for L to 3XL (15 x 17 in at 300 DPI). M is 3909 x 4431, and S is 3319 x 3761. **Design at 4500 x 5100**, and Printify scales it down for S and M.
- Monster Digital CC 1717: 4200 x 4800 (L to 4XL), M 3839 x 4387, and S 3461 x 3955.
- SwiftPOD B+C 3001: 3692 x 4800 (L to 5XL), which is a narrower shape. If we ever switch to SwiftPOD, re-check how the art fits.

## Crew socks (all-over print)

| Sock | Provider | Location | Base | Ship 1st | Ship add'l | Landed | Sizes | Method |
|---|---|---|---|---|---|---|---|---|
| Sublimation Socks (376) | **SPOKE Custom Products** | Norcross, GA | $7.39 | $4.59 | $0.99 | $11.98 | S, M, L | Sublimation |
| Sublimation Crew Socks (1433) | Pic The Gift | Saint Louis, MO | $7.47 | $5.29 | $0.75 | $12.76 | One size | Sublimation |
| Cushioned Crew Socks (574) | ThreadStudio | Atlanta, GA | $11.40 | $4.99 | $1.90 | $16.39 | One size | DTG |
| Recycled Poly Socks (452) | Tribe Socks | San Francisco, CA | $11.49 | $5.29 | $0.75 | $16.78 | One size | DTG |

The SPOKE sock is 95% polyester and 5% spandex, with a ribbed tube and a cushioned bottom. Printify warns that side seams show more on dark designs. That matters for a dark Petoskey pattern, so check the sample. The Pic The Gift sock has black heels and toes, which aren't printable.

### Sock print template (exact, SPOKE, blueprint 376)

Each sock has **4 panels**: `front_left_leg`, `back_left_leg`, `front_right_leg`, and `back_right_leg`. Every panel has the same width, but the height changes with the size:

| Size | Panel size (px) |
|---|---|
| S | 1348 x 5610 |
| **M** | **1348 x 5657** |
| L | 1348 x 5595 |

**Draw the Petoskey pattern at 1348 x 5657 px** (the tallest panel). S and L differ by less than 1%, so one file covers all three sizes. A pattern that repeats seamlessly side to side will hide the seam between the front and back panels. Printify doesn't publish a DPI for this template, so confirm the fit in the upload preview (PLAN Step 7).

The backup sock (Pic The Gift) uses 4 panels of 670 x 2851 px, about half the resolution.

## Effect on the profit model (Printify column, free shipping, no ads)

| Product | Old profit | New profit | Change |
|---|---|---|---|
| Tee at $27.99 | $12.43 | **$9.78** | -$2.65 |
| Socks at $18.99 | $5.02 | **$5.59** | +$0.57 |
| Bundle at $39.99 | $11.17 | **$9.09** | -$2.08 |

The tee guess ($9.11) was too low. The real 3001 cost is $11.77. Orders needed to cover the AI bill stay at about 3 for tees, 4 for socks, and 3 for bundles.

## Still uncertain

1. 2XL and up upcharges, and any price differences by color. Check these in the Printify editor when building the launch products (Step 9).
2. Which shipping method the unlabeled second US rate ($4.95 first, $2.40 additional) is.
3. The bundle ships as two packages from two printers (Ohio and Georgia), so both first-item rates apply. Running tees and socks through one printer isn't possible: no US printer on Printify makes both.
4. Prices change. Re-check before setting final retail prices.
