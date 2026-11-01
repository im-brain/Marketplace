# CLAUDE.md: Project Handoff

Read this first in every new conversation. Update the "Current status" and "Session log" sections at the end of every work session.

## What this project is

A print-on-demand store for Great Lakes rockhounds (Michigan, Wisconsin, and Minnesota collectors), selling tees and socks. Owner: Brian, a rockhound in Grand Rapids, Michigan. It is a personal side project with no connection to his day job. The goal is profit greater than his monthly AI bill (about $20).

The full step-by-step plan is in `PLAN.md` (Word copy: `PLAN.docx`).

## Current status

- **Current step:** Step 1 done. **Step 2: Printify account and API token (Shopify waits until Step 12).**
- **Waiting on Brian:**
  - Create a free Printify account.
  - Generate a Printify API token and save it as an environment secret named `PRINTIFY_API_TOKEN` (never paste it into a file in this repo).
- **Accounts:** Shopify: not created. Printify: not created. Domain: not bought.
- **Secrets:** none yet. Rule: all tokens live in the Claude Code environment's secrets, never in the repo.

## Decisions made

1. Business model: tees and socks, print on demand, no inventory.
2. Platform: **Shopify Basic + Printify** (decided Nov 1, 2026). Etsy may come later (Step 20). **Shopify opens at Step 12**, after samples are approved and the store preview is signed off, because the free trial is only 3 days. Buy the domain from a regular registrar, not Shopify.
3. Sourcing: **domestic only for now** (US print on demand). Overseas was modeled and rejected for launch, and that spreadsheet is not in this repo. Future option: bulk-order steady sock sellers from Pakistan or India.
4. Niche: Great Lakes rockhounding.
5. Marketing: organic TikTok and Instagram only, **product-only video** (no face). Suggested upgrade: film the real stone next to the shirt drawn from it.
6. Budget: AI bill about $20/month; tools under $75/month (planned total about $45).
7. Art sources: Brian's own photos, his edits of AI art, code-generated patterns, and images whose license explicitly allows commercial use. Public photos are only for checking accuracy and are never printed or traced.
8. Brand concept (working): **"Wet Stone."** Rockhounds wet a stone to see its true color. Candidate names to check: Wet Stone Supply Co., Third Coast Rockhound, and Lake Effect Rock Co.
9. Signature site features: the "wet" hover and tap effect, a field note on each design, a free field guide that links to the chart shirts, and code-drawn sock patterns.
10. Launch with 4 designs: the Great Lakes beach stone chart, "Agate Expectations," "Will brake for agates," and Petoskey hexagon socks.

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
Puns: (5) "Bands will make her dance," (6) "Agate Expectations," (7) "I lick rocks," (8) "Sorry I'm late, I saw a rock," (9) "Will brake for agates," and (10) "My other hobby is also looking down."
Socks: (11) Petoskey hexagon all-over, (12) agate bands all-over, and (13) soles: "If you can read this, I found a rock."
Fact idea: Leland Blue is slag from a 19th-century iron smelter in Leland, Michigan, not a natural stone.

## Guardrails

- **Accuracy:** Brian confirms every chart and every stone label against reliable references.
- **Original art only:** no tracing field guides, books, or Facebook group charts.
- **No protected IP:** no logos, sports teams, characters, song lyrics, or band art.
- **Trademarks:** check every slogan on tmsearch.uspto.gov before printing.
  - "YOOPERLITES" is registered (Serial 88117414). Use "UV-glowing sodalite" instead.
  - "Bands will make her dance": the only filing found was Class 41 (dance instruction). It is also close to the Juicy J song "Bandz A Make Her Dance." Brian may use a reworded version. Suggested: "Agate bands make her dance," which reads clearly as a rock joke. Re-check Classes 25, 9, and 41 before printing.
- **AI art** can't be copyrighted on its own. Brian's edits and photos help.
- **Saturated puns** (7 and 8) are filler, not the launch set.

## Brian's working preferences (always follow)

- Brian is new to coding. Explain in plain language, use small steps, and test each one.
- Challenge ideas, don't just agree. Aim for something beautiful and new.
- Be concise, precise, and defensible. Flag accuracy concerns in anything customer-facing.
- **Never use em dashes. Always use the Oxford comma.**
- He cannot open .md files on his work computer. Deliver anything he edits as **.xlsx or .docx**.
- Spreadsheets: Arial, cells middle-aligned vertically, blue text for inputs, black for formulas, and yellow fill for assumptions to verify.
- HTML must be readable in dark mode.
- When condensing his drafts, ask before removing anything.
- Keep this file and PLAN.docx in sync with PLAN.md when the plan changes.

## Repo layout (grows over time)

- `PLAN.md` and `PLAN.docx`: the plan.
- `CLAUDE.md`: this handoff.
- `models/POD_Profit_Model.xlsx`: the profit model.
- Planned: `designs/` (art files), `tracker/Design_Tracker.xlsx`, `scripts/` (Python automation), `theme/` (Shopify custom sections).

## Session log

- **2026-11-01:** Planning session. Chose Shopify + Printify, product-only content, a $20 AI bill, and tools under $75. Wrote PLAN.md, PLAN.docx, and CLAUDE.md. Next: Step 2.
- **2026-11-01 (later):** Brian accepted the pushback, chose domestic only, and uploaded the profit model (now in `models/`). Standing by for Step 2.
- **2026-11-01 (later):** Shopify's trial is only 3 days, so Shopify moved to Step 12. Steps 2 to 11 run on Printify (free) and a preview page in the repo. Next: Step 2, Printify only. Also recorded the rockhounding pants idea under Future products.
