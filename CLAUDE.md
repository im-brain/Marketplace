# CLAUDE.md: Project Handoff

Read this first in every new conversation. Update the "Current status" and "Session log" sections at the end of every work session.

## What this project is

A print-on-demand store for Great Lakes rockhounds (Michigan, Wisconsin, and Minnesota collectors), selling tees and socks. Owner: Brian, a rockhound in Grand Rapids, Michigan. It is a personal side project with no connection to his day job. The goal is profit greater than his monthly AI bill (about $20).

The full step-by-step plan is in `PLAN.md`.

## Current status

- **Store name (decided Nov 1, 2026): Heavy Pockets Co.** Domain heavypocketsco.com, handles @heavypocketsco, email hello@heavypocketsco.com (forwarded to a private Gmail). Tagline "Head down. Pockets full." Secondary line "Dry rocks lie." Fallback: Wet Thumb Co. (wetthumbco.com, @wetthumbco), used only if Heavy Pockets runs into trouble. Checks were a first screen, not legal clearance. Background: heavypockets.com and @heavypockets belong to an old, apparently dead streetwear brand; the 2013 HEAVY POCKETS clothing filing (serial 85912472) was abandoned in 2014.
- **Current step:** Steps 1, 2, and 3 done (Nov 1, 2026). **Next: Step 4, the brand kit** (colors, fonts, simple wordmark, and a one-page brand guide).
- **Waiting on Brian:** nothing. Claude starts Step 4.
- **USPTO rate limit:** the search API returns 403 or 429 after many quick queries. Space searches out, and don't loop retries.
- **Network access:** all needed hosts are allowed as of Nov 1, 2026: rdap.verisign.com, api.printify.com, images-api.printify.com, tmsearch.uspto.gov, tsdr.uspto.gov, api.cloudflare.com, fonts.googleapis.com, fonts.gstatic.com, accounts.google.com, and pypi.org. Shopify's `<store>.myshopify.com` gets added at Step 12.
- **Tools Claude can run:** .com availability via `https://rdap.verisign.com/com/v1/domain/<name>.com` (200 means taken, 404 means open). Trademark knockout search via `python3 scripts/tm_search.py '"phrase"'` (POSTs to `tmsearch.uspto.gov/prod-stage-v1-0-0/tmsearch`; classes look like "IC 025"). Filing history via `tmsearch.uspto.gov/tsdr-api-v1-0-0/tsdr-api?serialNumber=<n>`. Social and Etsy conflicts via web search limited to those domains. Handle availability can't be confirmed automatically; Brian checks by hand.
- **Accounts (all created Nov 1, 2026):**
  - Store Gmail: **heavypocketsco@gmail.com**, with 2-step verification on. It owns every store account.
  - Domain: **heavypocketsco.com** on Cloudflare Registrar (registered Nov 1, 2026, expires Nov 1, 2027, auto-renew on, Cloudflare nameservers, transfer lock on). heavypockets.rocks was considered and skipped.
  - Email: **hello@heavypocketsco.com** forwards to the Gmail through Cloudflare Email Routing. Gmail "Send mail as" hello@ is the default (smtp.gmail.com:587 with an app password; replies come from the address the mail was sent to). SPF TXT record: `v=spf1 include:_spf.mx.cloudflare.net include:_spf.google.com ~all` (there must be only one SPF record).
  - Social: **@heavypocketsco** on Instagram and TikTok. @wetthumbco placeholders on both (no wetthumbco.com domain).
  - Printify: free account, shop id **29566047** ("My new store," sales_channel "disconnected" until Shopify at Step 12). Optional: rename it to Heavy Pockets Co.
  - Shopify: not created (Step 12).
- **Secrets:** the Printify token is a **network secret**, not an environment variable. The proxy adds it automatically to requests to api.printify.com, so scripts call the API **without** their own Authorization header (`curl https://api.printify.com/v1/shops.json` returns 200). Rule: all tokens live in the environment settings, never in the repo or chat.

## Decisions made

1. Business model: tees and socks, print on demand, no inventory.
2. Platform: **Shopify Basic + Printify** (decided Nov 1, 2026). Etsy may come later (Step 20). **Shopify opens at Step 12**, after samples are approved and the store preview is signed off, because the free trial is only 3 days. Buy the domain from a regular registrar, not Shopify.
3. Sourcing: **domestic only for now** (US print on demand). Overseas was modeled and rejected for launch, and that spreadsheet is not in this repo. Future option: bulk-order steady sock sellers from Pakistan or India.
4. Niche: Great Lakes rockhounding.
5. Marketing: organic TikTok and Instagram only, **product-only video** (no face). Suggested upgrade: film the real stone next to the shirt drawn from it.
6. Budget: AI bill about $20/month; tools under $75/month (planned total about $45).
7. Art sources: Brian's own photos, his edits of AI art, code-generated patterns, and images whose license explicitly allows commercial use. Public photos are only for checking accuracy and are never printed or traced.
8. Brand: **Heavy Pockets Co.** (name decided Nov 1, 2026). Concept underneath: **"Wet Stone."** Rockhounds wet a stone to see its true color; "Dry rocks lie" is the secondary line.
9. Signature site features: the "wet" hover and tap effect, a field note on each design, a free field guide that links to the chart shirts, and code-drawn sock patterns.
10. Launch with 5 designs: the Great Lakes beach stone chart, "Agate Expectations," "Will brake for agates," Petoskey hexagon socks, and **"I lick rocks"** (or "Will lick rocks"), Brian's idea from Nov 1, 2026. The phrase alone is common on Etsy, so the art carries it: a dull, dry stone with one glossy lick-shaped streak where the true color shows through. It's the brand idea in one picture. Nov 1, 2026: no USPTO filings for "I lick rocks," "Will lick rocks," or "lick rocks." Re-check before printing.
11. Accounts: a dedicated **store Gmail** (created first in Step 3) owns every store account (domain, Printify, Shopify, TikTok, and Instagram). Customers see `hello@` the domain, forwarded free to the Gmail by Cloudflare Email Routing. The name is picked first so the Gmail can match it.

## Future product ideas

- **Rockhounding pants** with a reinforced, wipe-clean, possibly removable rock pocket. This needs cut-and-sew manufacturing, not print on demand. Test demand first by selling the removable pocket liner alone. Revisit after Step 20. Details are in PLAN.md under "Future products."

## Unit economics (US POD, from models/POD_Profit_Model.xlsx)

| Profit per order, middle price | Printify |
|---|---|
| Tee at $27.99 | $12.43 |
| Socks at $18.99 | $5.02 |
| Bundle at $39.99 | $11.17 |

- Free shipping is built into the price. Shopify Payments is 2.9% + $0.30, with a 3% returns reserve and no ads.
- Tees drive profit. Socks are add-ons and go in bundles.
- Fixed costs are about $60/month in the old model (Shopify $39, domain, and a $20 AI placeholder). The AI bill is confirmed at about $20 (yellow fill removed from Inputs!B26).
- 2 to 4 orders a month cover the AI bill, and about 6 cover all fixed costs.
- Biggest risk: paid ads at $5 to $15 per customer would wipe out sock profit.
- Yellow cells in the spreadsheets are assumptions. Replace them with real sample quotes.

## Tariffs (as of Oct 31, 2026; re-verify before relying on them)

| Origin | Tee (HTS 6109.10) | Socks (HTS 6115.95.90) |
|---|---|---|
| China | 36.5% | 33.5% |
| Vietnam | 29.0% | 26.0% |
| Pakistan or India | 26.5% | 23.5% |

## Full design list (13)

Charts: (1) Lake Superior agate ID chart, (2) Great Lakes beach stone chart, (3) anatomy of an agate, and (4) Mohs hardness scale.
Puns: (5) "Bands will make her dance," (6) "Agate Expectations," (7) "I lick rocks" (promoted to the launch set with lick-mark art), (8) "Sorry I'm late, I saw a rock," (9) "Will brake for agates," and (10) "My other hobby is also looking down."
Socks: (11) Petoskey hexagon all-over, (12) agate bands all-over, and (13) soles: "If you can read this, I found a rock."
Fact idea: Leland Blue is slag from a 19th-century iron smelter in Leland, Michigan, not a natural stone.

## Guardrails

- **Accuracy:** Brian confirms every chart and every stone label against reliable references.
- **Original art only:** no tracing field guides, books, or Facebook group charts.
- **No protected IP:** no logos, sports teams, characters, song lyrics, or band art.
- **Trademarks:** check every slogan on tmsearch.uspto.gov before printing.
  - "YOOPERLITES": registration 5750169 (serial 88117414) was **cancelled Nov 28, 2025** (no Section 8 filed), and there are no live marks as of Nov 1, 2026. The original owner still uses the name and may have unregistered rights, especially in Michigan, and could refile. Default to "UV-glowing sodalite" and re-check before using the word.
  - "Bands will make her dance": the only filing found was Class 41 (dance instruction). It is also close to the Juicy J song "Bandz A Make Her Dance." Brian may use a reworded version. Suggested: "Agate bands make her dance," which reads clearly as a rock joke. Re-check Classes 25, 9, and 41 before printing. Nov 1, 2026: "bands make her dance," "Agate Expectations," and "Will brake for agates" had no USPTO filings.
- **AI art** can't be copyrighted on its own. Brian's edits and photos help.
- **Saturated puns** (8) are filler, not the launch set. Design 7 is in the launch set only because the lick-mark art makes it original.

## Brian's working preferences (always follow)

- Brian is new to coding. Explain in plain language, use small steps, and test each one.
- Challenge ideas, don't just agree. Aim for something beautiful and new.
- Be concise, precise, and defensible. Flag accuracy concerns in anything customer-facing.
- **Never use em dashes. Always use the Oxford comma.**
- .md is fine for documents. Use .xlsx for spreadsheets.
- Spreadsheets: Arial, cells middle-aligned vertically, blue text for inputs, black for formulas, and yellow fill for assumptions to verify.
- HTML must be readable in dark mode.
- When condensing his drafts, ask before removing anything.
- Keep this file in sync with PLAN.md when the plan changes. Do not make a Word copy of the plan.

## Repo layout (grows over time)

- `PLAN.md`: the plan.
- `CLAUDE.md`: this handoff.
- `models/POD_Profit_Model.xlsx`: the profit model.
- `brand/Store_Name_Shortlist.xlsx`: candidate names with checks (Heavy Pockets Co. marked CHOSEN).
- `brand/Step3_Accounts_Checklist.md`: Step 3 account setup checklist.
- `scripts/tm_search.py`: USPTO trademark knockout search.
- `brand/Naming_Brainstorm_Prompt.md`: the prompt for the separate naming session.
- Planned: `designs/` (art files), `tracker/Design_Tracker.xlsx`, `scripts/` (Python automation), `theme/` (Shopify custom sections).

## Session log

- **2026-11-01:** Planning session. Chose Shopify + Printify, product-only content, a $20 AI bill, and tools under $75. Wrote PLAN.md, PLAN.docx, and CLAUDE.md. Next: Step 2.
- **2026-11-01 (later):** Brian accepted the pushback, chose domestic only, and uploaded the profit model (now in `models/`). Standing by for Step 2.
- **2026-11-01 (later):** Shopify's trial is only 3 days, so Shopify moved to Step 12. Steps 2 to 11 run on Printify (free) and a preview page in the repo. Next: Step 2, Printify only. Also recorded the rockhounding pants idea under Future products.
- **2026-11-01 (later):** Brian asked to stop making PLAN.docx. Removed it; PLAN.md is the only copy of the plan.
- **2026-11-01 (later):** Brian wants a store Gmail named after the store. Reordered: Step 2 is now the store name, and Step 3 is accounts (domain, Gmail, handles, Printify, and email forwarding).
- **2026-11-01 (later):** Built the name shortlist (10 names, web-searched for existing businesses). Waiting on Brian's hand checks and pick.
- **2026-11-01 (later):** Brian opened .com registry access. Confirmed all 10 shortlist .coms are open, and added a Network Access tab listing the hosts to allow.
- **2026-11-01 (later):** All requested hosts now allowed. Ran USPTO and social searches on all 10 names. New top 2: Lake Found Goods and Agate Hour. Found YOOPERLITES registration cancelled. Explained BIG WET ROCK priority (an intent-to-use filing dates back to Sep 11, 2024, nationwide). Added scripts/tm_search.py.
- **2026-11-01 (later):** Wrote the naming brainstorm prompt (acronyms allowed if they spell something, and the full domain can forward to the acronym domain). Added "I lick rocks" with lick-mark art as launch design 5. Brian confirmed .md files are fine.
- **2026-11-01 (later):** Naming session returned Heavy Pockets, Lick Test, and Wet Thumb. Checked them: both chosen names are clear with "Co." handles and domains. Added them to the top of the shortlist. Waiting on Brian's final pick.
- **2026-11-01 (later):** Brian chose **Heavy Pockets Co.** (fallback Wet Thumb Co.); both .coms re-checked open. Reordered Step 3 so the Gmail comes first (Cloudflare needs an account email). Wrote the Step 3 checklist.
- **2026-11-01 (later):** Step 3 done. Gmail heavypocketsco@gmail.com, domain heavypocketsco.com (Cloudflare), handles claimed, Printify connected (network secret, shop 29566047), and hello@ forwarding plus send-as working with SPF. Next: Step 4, brand kit.
