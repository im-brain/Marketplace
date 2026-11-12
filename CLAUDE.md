# CLAUDE.md: Project Handoff

Read this first in every new conversation. Update the "Current status" and "Session log" sections at the end of every work session.

## What this project is

A print-on-demand store for Great Lakes rockhounds (Michigan, Wisconsin, and Minnesota collectors), beachcombers, and lake lovers. The launch assortment is now six products: four tees and two hoodies (Nov 7, 2026). Socks are no longer in the launch set. Owner: Brian, a rockhound in Grand Rapids, Michigan. It is a personal side project with no connection to his day job. The goal is profit greater than his monthly AI bill (about $20).

The full step-by-step plan is in `PLAN.md`.

## Current status

- **Step 13 theme built (Nov 12, 2026, newest):** the approved v3 preview rebuilt as a custom Shopify theme in `theme/shopify/` (custom instead of Dawn, because v3 is already a full design system; see `theme/shopify/README.md`). Products, prices, photos, cart, and checkout come from Shopify; the approved product copy comes from `theme/v3/src/products.json` through `node theme/shopify/build.js`. Mailing list saves to Shopify customers (tags `newsletter`, `dibs`). Local mock render plus 293 browser checks pass; Theme Check 0 errors. **Uploaded Nov 12, 2026 as an UNPUBLISHED theme "Heavy Pockets" (id 131897917498); the live theme is still Shopify's default, Horizon.** Upload command (from `theme/shopify/`): `NODE_USE_ENV_PROXY=1 npx shopify theme push --store rjrxi5-ji.myshopify.com --password shptka_proxyinjected00000000000000 --theme 131897917498` (the password value is a dummy; the proxy injects the real Theme Access password, saved as a network secret for `theme-kit-access.shopifyapps.com`). Node's fetch ignores the proxy without `NODE_USE_ENV_PROXY=1`. Checked on the real store Nov 12 (`node theme/shopify/qa/live_check.js <store password>`): 32 of 33 pass; the miss is the Field Notes page, not created yet. The real store showed Printify publishes one front photo per color first, then each color's other views; `hp-color-urls.liquid` was fixed for that. The storefront password is not stored in the repo; ask Brian. Next: Brian previews the theme, creates the Field Notes page (template `field-notes`), and renames the store from "My Store" to Heavy Pockets Co. (Settings, General). Publishing the theme is Brian's call.
- **Shopify opened (Nov 12, 2026):** Brian signed up on the $1 intro offer (Basic): store **rjrxi5-ji.myshopify.com** (Shopify picked the address; customers never see it once the domain is connected). Password on. Printify is connected (shop 29566047, sales_channel "shopify"). Before publishing, Claude fixed three things in Printify: variant prices set to the approved prices (`pricing.json`), em dashes removed from titles (now just the product name), and the Midnight description's generic Comfort Colors text replaced with the approved v3 blurb, story, and print note. Then all six products were published from Printify to Shopify (still behind the password). heavypocketsco.com is not connected to Shopify; the coming-soon page stays live. The $1 price ends around Feb 15, 2027 (3 free days plus 3 months); a scheduled reminder (trig_0114SfQL895rp2aSrSc9HHZA) fires Feb 5, 2027, by push notification. Next: Step 13, rebuilding the v3 preview as a Shopify theme. That needs the myshopify host allowed and a Shopify access token saved as a network secret.
- **Storefront preview v3 (Nov 7, 2026):** complete private shopping preview of the six current products, built from Brian's storefront brief. Branch `claude/clever-curie-pxflzz`, folder `theme/v3/`, handoff in `theme/v3/HANDOFF.md` (tests, limitations, missing assets, next steps). New lowercase wordmark (option A, provisional trace) in `brand/v3/wordmark/`. Private preview link: see "Preview link" below. **Approved by Brian, Nov 7, 2026** ("Everything is approved"). Merged into `main` via PR #5 on Nov 7, 2026, at Brian's request. Not deployed: merging changes nothing live.
- **Coming-soon page (deployed Nov 7, 2026):** heavypocketsco.com now shows the v3-brand coming-soon page. Source, generator, and tests in `site/coming-soon/` (`node site/coming-soon/build.js`, `node site/coming-soon/qa/run_qa.mjs`); deploy and rollback steps in `site/coming-soon/README.md`; rollback copy in `site/coming-soon/live-2026-11-04/`. Brian's choices: rockhound and day and night switch kept, teaser only, email-only signup (existing entries never rewritten), bubble option A. Same `DIBS` list. Private preview: https://claude.ai/artifact/MUL1QQ3WVDEKmkyCFd8NEN. `www.heavypocketsco.com` is attached to the Worker as a custom domain (Nov 7, 2026) and redirects to the bare domain. Cloudflare Web Analytics (the visitor counter, no cookies) is allowed by the page's security policy since Nov 7, 2026; see counts in the Cloudflare dashboard under Analytics & Logs, Web Analytics.
- **Preview link (v3):** https://claude.ai/artifact/9TVdpea8d1YBc3vfUq11hz (private claude.ai artifact, same workflow as earlier previews; republish by running `node theme/v3/build.js` and publishing `theme/v3/index.html` with every page, asset, and image as files).
- **Current assortment (Nov 7, 2026, supersedes the old launch 5 and socks):** Midnight Rock Hunt Tee, Great Lakes Rock Crew Tee, Field Notebook Tee, Pocket Full of Treasures Tee, Shoreline Hoodie, and Floral Butterfly Embroidered Hoodie. Printify product IDs and approved colors are in `theme/v3/src/products.json` and `theme/v3/HANDOFF.md`. Indigo Blue embroidery was removed on purpose: never restore it. Samples are ordered, not yet physically approved.
- **Prices (approved by Brian, Nov 7, 2026):** $30 front-print tees, $40 Midnight, $60 hoodies, standard U.S. shipping included. Larger sizes on every product: 2XL +$2, 3XL +$4, 4XL and 5XL +$6. One file: `theme/v3/src/pricing.json`. Costs and margin notes: `theme/v3/src/PRICING_REVIEW.md` (4XL tees and the 5XL embroidered hoodie earn about $2.36 and $2.91 less than S to XL).

- **Store name (decided Nov 1, 2026): Heavy Pockets Co.** Domain heavypocketsco.com, handles @heavypocketsco, email hello@heavypocketsco.com (forwarded to a private Gmail). Tagline "Head down. Pockets full." Secondary line "Dry rocks lie." Fallback: Wet Thumb Co. (wetthumbco.com, @wetthumbco), used only if Heavy Pockets runs into trouble. Checks were a first screen, not legal clearance. Background: heavypockets.com and @heavypockets belong to an old, apparently dead streetwear brand; the 2013 HEAVY POCKETS clothing filing (serial 85912472) was abandoned in 2014. **New, found Nov 4, 2026:** two LIVE filings by one owner (Marques Zahir): HEAVY POCKETS, serial 50027960, Class 16 (financial education books, filed Aug 3, 2026), and MUN-E HEAVY POCKETS, serial 99146373, Class 41 (podcasts). Neither covers clothing (Class 25), so not blocking, but if that owner adds merch, conflict is possible. Suggested: Brian talks to a trademark attorney about filing HEAVY POCKETS CO. in Class 25.
- **Current step:** Step 4 (brand kit) round 1 is ready for Brian's pick (Nov 4, 2026). Five directions: A Field Notebook, B Lakeshore Workwear, C Wet Stone Minimal (Brian's three), D Lake Chart, and E the hybrid (Claude's additions). Claude recommends **E** (A's maker's mark with an angular agate O, narrow black Archivo for puns, Lake Chart as a named series, and the lick as its own shirt); A is the clean alternative. Page: `brand/kit/index.html`, published privately at https://claude.ai/artifact/B4dgDZnUoNUVETSLkhx4AU. After the pick: final colors matched to Printify blanks, logo files (SVG and PNG), and the one-page brand guide.
- **Waiting on Brian:** (1) pick a brand option (letter or mix); (2) check the field guide's remaining [VERIFY] items (collecting rules were confirmed against official NPS, Michigan, Minnesota, and Wisconsin DNR pages on Nov 4, 2026, except Wisconsin NR 45.04 and the bottomlands wording); (3) decide on a trademark attorney consult for Class 25 (see the store name note above). (4) Store preview (Step 11 draft, direction E): https://claude.ai/artifact/SD6rLi6iisiMKrDTuQgeQY. Open question: products load "dry" (faded) and wet on tap; decide whether the first view should be dry or wet. (5) `listing_check.py` blocks on every warning, including Oxford comma guesses that can be wrong; decide whether to add an override flag. (6) `content/Video_Content_Bank.md`: 20 product-only video ideas; ask group moderators before posting in rockhound communities.
- **Storefront preview v2 (Nov 5, 2026):** full retro-desktop storefront built on the locked brand system (ChatGPT as creative director locked colors and fonts in PR #2: navy, cream, rust, and sandstone; Press Start 2P for short headings, Atkinson Hyperlegible Next for everything shoppers read). Branch `storefront/v2-retro-integration`, page `theme/v2/index.html`, notes in `theme/v2/README.md`, draft PR #3 (into `step4-overnight-build`), published privately at https://claude.ai/artifact/RH4GTe1qE3NzeQUymJyPm6. Brian approved it; merged into `step4-overnight-build` and then `main` (Nov 5, 2026). Not deployed. The brand kit pick (A to E) above is superseded by the v2 brand system.
- **Overnight build (Nov 3 to 4, 2026), built on branch `step4-overnight-build`, merged into `main` Nov 5, 2026:** brand kit page; real Printify costs in the profit model; design tracker with a trademark re-check; Petoskey sock pattern generator plus print panels; "I lick rocks" print art; field guide draft (fact-checked once); listing checker and Printify publish script (live-tested by creating and deleting one draft product); store preview page (Step 11 draft); 20-video content bank. Reviewed by separate agents: a design finish reviewer, an apparel brand strategist, a geology fact-checker, and a code reviewer (who fixed an unsafe delete and a sock seam bug; 43 tests pass).
- **Branch:** `step4-overnight-build` (overnight build, v2 brand system, approved hero, and storefront preview v2) was merged into `main` on Nov 5, 2026, at Brian's request. Start new work from `main`. Merging into `main` deploys nothing: the live coming-soon page is a Cloudflare Worker published separately.
- **USPTO rate limit:** the search API returns 403 or 429 after many quick queries. Space searches out, and don't loop retries.
- **Network access:** blocked as of Nov 4, 2026: impeccable.style (the design skill's direction roll ran without its catalog), nps.gov, and michigan.gov (fact-checks used search excerpts). Allowed as of Nov 1, 2026: rdap.verisign.com, api.printify.com, images-api.printify.com, tmsearch.uspto.gov, tsdr.uspto.gov, api.cloudflare.com, fonts.googleapis.com, fonts.gstatic.com, accounts.google.com, and pypi.org. Shopify's `rjrxi5-ji.myshopify.com` allowed since Nov 12, 2026 (Step 13). Added Nov 7, 2026: heavypocketsco.com and www.heavypocketsco.com (to check the live page).
- **Impeccable skill:** its setup step runs `scripts/impeccable`, which downloads a helper program from GitHub releases (checksum-verified). GitHub release downloads aren't on the allowed host list yet, so that step may fail. The design guides in `reference/` work without it. To enable the helper, allow github.com and its release download host. Brian plans to use it mainly once the website gets built.
- **Tools Claude can run:** .com availability via `https://rdap.verisign.com/com/v1/domain/<name>.com` (200 means taken, 404 means open). Trademark knockout search via `python3 scripts/tm_search.py '"phrase"'` (POSTs to `tmsearch.uspto.gov/prod-stage-v1-0-0/tmsearch`; classes look like "IC 025"). Filing history via `tmsearch.uspto.gov/tsdr-api-v1-0-0/tsdr-api?serialNumber=<n>`. Social and Etsy conflicts via web search limited to those domains. Handle availability can't be confirmed automatically; Brian checks by hand.
- **Accounts (all created Nov 1, 2026):**
  - Store Gmail: **heavypocketsco@gmail.com**, with 2-step verification on. It owns every store account.
  - Domain: **heavypocketsco.com** on Cloudflare Registrar (registered Nov 1, 2026, expires Nov 1, 2027, auto-renew on, Cloudflare nameservers, transfer lock on). heavypockets.rocks was considered and skipped.
  - Email: **hello@heavypocketsco.com** forwards to the Gmail through Cloudflare Email Routing. Gmail "Send mail as" hello@ is the default (smtp.gmail.com:587 with an app password; replies come from the address the mail was sent to). SPF TXT record: `v=spf1 include:_spf.mx.cloudflare.net include:_spf.google.com ~all` (there must be only one SPF record).
  - Social: **@heavypocketsco** on Instagram and TikTok. @wetthumbco placeholders on both (no wetthumbco.com domain).
  - Printify: free account, shop id **29566047** ("My new store," sales_channel "shopify" since Nov 12, 2026). Optional: rename it to Heavy Pockets Co.
  - Shopify: **rjrxi5-ji.myshopify.com**, Basic plan on the $1 intro offer, opened Nov 12, 2026, with the store Gmail. Password protection on. $1 price ends around Feb 15, 2027 (confirm in Settings, Plan).
- **Secrets:** Shopify Theme Access password (themes only, created Nov 12, 2026) is a network secret for `theme-kit-access.shopifyapps.com`, header `X-Shopify-Access-Token`. The Printify token is a **network secret**, not an environment variable. The proxy adds it automatically to requests to api.printify.com, so scripts call the API **without** their own Authorization header (`curl https://api.printify.com/v1/shops.json` returns 200). Rule: all tokens live in the environment settings, never in the repo or chat. Printify personal access tokens expire after 1 year, so regenerate it around Oct 2027 (or sooner if calls start returning 401). A scheduled reminder (trig_01Tqk91XWiYUnSFWtoVVR3z3) fires Oct 1, 2027, tests the token, and sends Brian renewal steps by push notification. Brian keeps a backup copy in his password manager. If automation ever moves to GitHub Actions, the token goes in that repo's Actions secrets.

## Decisions made

1. Business model: tees and socks, print on demand, no inventory.
2. Platform: **Shopify Basic + Printify** (decided Nov 1, 2026). Etsy may come later (Step 20). **Changed Nov 11, 2026: Shopify opens now (Step 12 moved up), not after samples.** The approved v3 preview has to be rebuilt as a Shopify theme (Liquid templates fed by Shopify's products, prices, and cart), so that work starts now. Shopify's intro offer (3 days free, then $1/mo for 3 months, only on the plan picked at signup) makes this cost about $3. The store stays password-protected, and heavypocketsco.com keeps the coming-soon page until launch. Sample approval now gates launch (Step 19). Brian chose this over a free Partner development store (fewer steps, no one-way transfer). Buy the domain from a regular registrar, not Shopify.
3. Sourcing: **domestic only for now** (US print on demand). Overseas was modeled and rejected for launch, and that spreadsheet is not in this repo. Future option: bulk-order steady sock sellers from Pakistan or India.
4. Niche: Great Lakes rockhounding.
5. Marketing: organic TikTok and Instagram only, **product-only video** (no face). Suggested upgrade: film the real stone next to the shirt drawn from it.
6. Budget: AI bill about $20/month; tools under $75/month (planned total about $45).
7. Art sources: Brian's own photos, his edits of AI art, code-generated patterns, and images whose license explicitly allows commercial use. Public photos are only for checking accuracy and are never printed or traced.
8. Brand: **Heavy Pockets Co.** (name decided Nov 1, 2026). Concept underneath: **"Wet Stone."** Rockhounds wet a stone to see its true color; "Dry rocks lie" is the secondary line.
9. Signature site features: the "wet" hover and tap effect, a field note on each design, a free field guide that links to the chart shirts, and code-drawn sock patterns.
10. **(Superseded Nov 7, 2026 by the six-product assortment above; kept for history.)** Launch with 5 designs: the Great Lakes beach stone chart, "Agate Expectations," "Will brake for agates," Petoskey hexagon socks, and **"I lick rocks"** (or "Will lick rocks"), Brian's idea from Nov 1, 2026. The phrase alone is common on Etsy, so the art carries it: a dull, dry stone with one glossy lick-shaped streak where the true color shows through. It's the brand idea in one picture. Nov 1, 2026: no USPTO filings for "I lick rocks," "Will lick rocks," or "lick rocks." Re-check before printing.
11. Accounts: a dedicated **store Gmail** (created first in Step 3) owns every store account (domain, Printify, Shopify, TikTok, and Instagram). Customers see `hello@` the domain, forwarded free to the Gmail by Cloudflare Email Routing. The name is picked first so the Gmail can match it.

## Website to-do

Keep this list current. Items marked provisional are built for review, not approved.

1. **Create a custom loading icon** (Brian's request). Status: **done, approved Nov 7, 2026** as part of "Everything is approved" (three pebbles that get wet one at a time, `theme/v3/assets/site.css`, shown on `theme/v3/preview-notes.html`).
2. ~~Approve prices and larger-size adjustments.~~ Done Nov 7, 2026 (see Current status).
3. Sample approval, then real sample photos and lifestyle photos for every product page.
4. ~~Clean, logo-free hero art (desktop and mobile) to replace the review crops.~~ Art done Nov 7, 2026 (Brian's ChatGPT edit, `brand/v2/hero-assets/hero-clean-*`). In both previews, and live on heavypocketsco.com since Nov 7, 2026.
5. Production wordmark vector from a designer, based on option A (current file is a provisional trace).
6. Brand story, founder intro, and photo in Brian's words; shipping and returns policies.
7. Live stock check before launch (Shoreline availability unverified).
8. Email service for the signup form (preview-only until then).
9. Field Notes: clear remaining [VERIFY] items, add Brian's own finds.
10. Deferred: the game, the collection keepsake, and receipt integration.

## Future product ideas

- **Rockhounding pants** with a reinforced, wipe-clean, possibly removable rock pocket. This needs cut-and-sew manufacturing, not print on demand. Test demand first by selling the removable pocket liner alone. Revisit after Step 20. Details are in PLAN.md under "Future products."

## Unit economics (US POD, from models/POD_Profit_Model.xlsx)

| Profit per order, middle price | Printify (real quotes, Nov 4, 2026) | Old guess |
|---|---|---|
| Tee at $27.99 | $9.78 | $12.43 |
| Socks at $18.99 | $5.59 | $5.02 |
| Bundle at $39.99 | $9.09 | $11.17 |

- Recommended providers: tees, Bella+Canvas 3001 from Monster Digital (Columbus, OH), $11.77 base, $4.49 shipping first item; socks, SPOKE Custom Products (Norcross, GA), blueprint 376, $7.39 base, $4.59 shipping. Bundles ship as two packages from two printers. Details: `research/Printify_Catalog_Findings.md`.
- Print sizes: tee front 4500 x 5100 px (L to 3XL); sock panels 1348 x 5657 px (size M), 4 panels per pair.

- Free shipping is built into the price. Shopify Payments is 2.9% + $0.30, with a 3% returns reserve and no ads.
- Tees drive profit. Socks are add-ons and go in bundles.
- Fixed costs are about $60/month in the old model (Shopify $39, domain, and a $20 AI placeholder). The AI bill is confirmed at about $20 (yellow fill removed from Inputs!B26).
- About 3 tees, 4 socks, or 3 bundles a month cover the AI bill.
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
- When using the Impeccable skill, Brian's rules here take priority: no em dashes, Oxford comma, HTML readable in dark mode, and brand colors and fonts from the Step 4 brand kit once it exists.

## Repo layout (grows over time)

- `PLAN.md`: the plan.
- `CLAUDE.md`: this handoff.
- `models/POD_Profit_Model.xlsx`: the profit model.
- `brand/Store_Name_Shortlist.xlsx`: candidate names with checks (Heavy Pockets Co. marked CHOSEN).
- `brand/Step3_Accounts_Checklist.md`: Step 3 account setup checklist.
- `brand/Step12_Shopify_Checklist.md`: Shopify sign-up checklist ($1 offer, password on, Printify connect).
- `scripts/tm_search.py`: USPTO trademark knockout search.
- `brand/Naming_Brainstorm_Prompt.md`: the prompt for the separate naming session.
- `.claude/skills/impeccable/`: the Impeccable design skill (v4.8.0, Apache 2.0, from github.com/pbakaus/impeccable), installed Nov 1, 2026. It loads in every session (`/impeccable`). License in `.claude/skills/LICENSE-impeccable`.
- `PRODUCT.md`: product record for the Impeccable design skill (some lines marked [inferred] for Brian to confirm). `.impeccable/`: its surface briefs and review screenshots.
- `brand/kit/index.html`: Step 4 brand kit comparison page.
- `tracker/Design_Tracker.xlsx` and `tracker/TM_Recheck_2026-11-04.md`: all 13 designs, trademark log.
- `research/Printify_Catalog_Findings.md`: real costs, providers, and print sizes.
- `content/Field_Guide_Draft.md`: field guide draft with a fact-check log and [VERIFY] tags.
- `designs/lick/`: "I lick rocks" art (HTML source and print PNGs). `designs/socks/`: Petoskey previews and `print/` panels.
- `scripts/`: `stone_pairs.py` (prepares dry/wet stone image pairs), `tm_search.py`, `listing_check.py` (no em dashes, Oxford comma, flagged claims), `publish_design.py` (creates unpublished Printify products), `sock_petoskey.py`, `render_lick.js`, tests in `scripts/tests/`, and `README.md`.
- `theme/preview/`: Step 11 store preview (draft, built in direction E).
- `brand/v2/`: v2 brand system (locked tokens, decisions, approved hero art). `theme/v2/`: storefront preview v2 with QA screenshots and test scripts.
- `content/Video_Content_Bank.md`: 20 video ideas, posting plan, and community notes.
- `theme/v3/`: storefront preview v3 (generated by `node theme/v3/build.js`; sources in `src/`; tests in `qa/run_qa.js`; `HANDOFF.md` for Brian).
- `brand/v3/wordmark/`: new lowercase wordmark (option A), provisional SVGs, source board, and trace QA. Made by `scripts/trace_wordmark.py`.
- `scripts/storefront_assets.py`: read-only Printify snapshot and web images for v3.
- `theme/shopify/`: the Shopify theme (Step 13). `build.js` refreshes copied CSS, images, and generated snippets; tests in `qa/`; notes in `README.md`; session handoff in `HANDOFF.md`.

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
- **2026-11-01 (later):** Installed the Impeccable design skill into `.claude/skills/` (Claude Code copy only; the other copies in that repo are the same skill for other tools). Its launcher downloads a helper binary; flagged. Best fit is the web pieces (brand guide page, store preview), not shirt art. Next: Step 4, brand kit.
- **2026-11-03 to 04 (overnight):** Brian asked Claude to use up the week's usage on useful work, with reviewer agents. Built everything listed under "Overnight build" above on branch `step4-overnight-build`. Found two live HEAVY POCKETS filings (Class 16 and 41). Real tee cost is higher than guessed ($9.78 profit per tee, not $12.43). Next: Brian picks a brand option; then finish the brand kit and brand guide.
- **2026-11-04 (late):** Integrated the owner-approved v2 hero (ChatGPT art) on branch `brand/heavy-pockets-v2` (draft PR #1): exact image bytes in `brand/v2/hero-assets/`, responsive page `brand/v2/hero-preview/index.html`, screenshots in `brand/v2/hero-preview/qa/`, published privately at https://claude.ai/artifact/6TLtSLo9w8ZGqoWY29VQnD. Store preview, plan, and business decisions unchanged. Landscape fix added after Brian tested on his phone.
- **2026-11-05:** Brian approved the hero and accepted the art accuracy flags as is. PR #1 merged into `step4-overnight-build` (not `main`, not deployed).
- **2026-11-05 (later):** Merged PR #2 (locked palette and fonts) into a new branch `storefront/v2-retro-integration` and built the full storefront preview in `theme/v2/` with the retro button system. 45 browser checks and a contrast check pass. Old preview untouched. Next: Brian reviews on his phone and iPad.
- **2026-11-05 (later):** Brian asked for the shop to match the retro style (products stay placeholders). Reworked it as one 90s file window: toolbar with filters, sunken pane, each product as a small window (title bar turns rust when active) with a stats box, and a live status bar. Product viewer image got the same sunken frame. 45 browser checks pass (an earlier note said 45 when it was 44; one check was added).
- **2026-11-05 (later):** Brian asked to use ChatGPT's images. Copied the ChatGPT agate dry/wet AI sample pair and the Petoskey sock concept into `theme/v2/img/` (credits in `img/CREDITS.md`). Agate in the wet test now cross-fades the pair; socks card and viewer show the concept with a CONCEPT label. Tees, Petoskey, and Leland stones stay as before (no ChatGPT images for them in the repo).
- **2026-11-05 (later):** Brian sent ChatGPT dry/wet stone images in chat. Added red jasper, Petoskey, and Leland Blue pairs to the wet test (now 4 stones: agate, jasper, Petoskey, Leland Blue). `scripts/stone_pairs.py` gives each pair one shared outline, which also removes the glow halo the generator baked in. Raw files in `theme/v2/img/src/`. A gray basalt and a pale tan stone came without wet versions, so they are unused.
- **2026-11-05 (later):** Brian approved the storefront preview v2. PR #3 merged into `step4-overnight-build`, then `step4-overnight-build` merged into `main` (Nov 5, 2026). Not deployed. Next: real photos of Brian's own finds to replace the AI sample stones, then the remaining launch art.
- **2026-11-07:** Built storefront preview v3 from Brian's storefront brief on branch `claude/clever-curie-pxflzz`: new option A wordmark (provisional trace, 98% pixel overlap), shorter hero using review crops that leave out the old baked-in logo, all six current products with mockups read from Printify (read-only), signature wet reveal on homepage cards (hover, focus, touch while scrolling, "Wet it" button; lasts for the visit), six product pages, preview cart, honest preview-only signup, Field Notes page, provisional loading icon, and preview notes. 333 browser checks and an axe scan passed then (358 after the later fixes; Chromium emulation only, not a real iPhone). Independent review pass done and fixes applied. PR opened, not merged, not deployed. Next: Brian reviews on his phone and decides prices.
- **2026-11-07 (later):** Brian reviewed v3 on his iPad. Applied his changes: wordmark "v" and "y" separated (`SPLIT_VY` in `scripts/trace_wordmark.py`), resting state 15 points drier, "Wet it" and "Wet" buttons replaced by a small see-through "Show," full hero with rocks on phones, pages open at the top in the iPad viewer (frame-stretch fix in `site.js`, tested with `qa/frame-harness.html`), size-range text and color counts removed, and no "supplier" or "Printify" anywhere shoppers can read. 358 checks pass. Preview republished at the same link.
- **2026-11-07 (later):** Brian said the straight v/y cut was too noticeable. `scripts/trace_wordmark.py` now rebuilds the two joined arms from the font's own tops (y's left arm gets the v's left-arm top; v's right arm gets the y's right-arm top) and moves "y" and "pockets" 6.75 px right so the v-to-y gap matches a-to-v. Republished; 358 checks pass.
- **2026-11-07 (later):** Brian approved the rebuilt v and y ("Looks great"). Recorded in `brand/v2/DECISIONS.md`. Production vector cleanup is still a to-do; the rest of the v3 preview is still under review.
- **2026-11-07 (later):** Brian approved the whole v3 preview ("Everything is approved"), the base prices, and that 2XL and up cost a little more; he chose even steps (2XL +2, 3XL +4, 4XL and 5XL +6 dollars). Prices now update by size on product pages and in the cart; "Provisional" labels removed; cards show "From" prices. Loading icon marked approved. 359 checks pass. Republished at the same link. PR #5 stays a draft until Brian asks to merge.
- **2026-11-07 (later):** Brian asked to merge. PR #5 merged into `main`. Nothing deployed. Start new work from `main`.
- **2026-11-07 (later):** Started the coming-soon update from `COMING_SOON_HANDOFF.md`. Backed up the live Worker (read-only) to `site/coming-soon/live-2026-11-04/`. The original generator `scripts/build_coming_soon.py` was never in the repo, so `site/coming-soon/build.js` replaces it. New page: v3 wordmark (teal by day, cream at night), tees and hoodies, rockhound and day and night switch kept, email-only signup, a privacy line that names every stored field, and a new social image (`og-v3.jpg`). 136 local checks pass (Worker run in Node with a fake list; nothing touched Cloudflare). Preview published privately. Not deployed.
- **2026-11-07 (later):** Brian picked bubble option A and said "Deploy." Re-checked that the live Worker still matched the backup, then deployed `site/coming-soon/dist/` with the same `DIBS` binding and compatibility date. Verified: deployed code matches the build byte for byte; the page, every asset, the 404 page, and the security policy work on heavypocketsco.com; `/api/dibs` checked only with requests that save nothing (bad email, bot trap, another site, and a scripts-off bad email); browser check in day and night with brand fonts loading. Found two things that were already true before today: `www.` has no DNS record or Worker domain, and the page blocks Cloudflare's analytics beacon. PR opened, not merged.
- **2026-11-07 (later):** At Brian's request: attached `www.heavypocketsco.com` to the Worker as a custom domain (now redirects with a 301), and turned on the visitor counter by allowing `static.cloudflareinsights.com` (script) and `cloudflareinsights.com` (reporting) in the page's security policy. Footer now says Cloudflare counts visits without cookies. Redeployed with the same `DIBS` binding; 136 checks pass.
- **2026-11-07 (later):** Brian asked to merge. PR #6 (coming-soon source, generator, tests, and records) merged into `main`. The page was already live; merging deploys nothing. Start new work from `main`.
- **2026-11-07 (later):** Brian made logo-free hero art in ChatGPT from Claude's prompt. Saved as `brand/v2/hero-assets/hero-clean-*`. New crops in `theme/v3/img/hero/` and `site/coming-soon/src/assets/hero/` (desktop now shows the full sky; mobile framing unchanged). Social image redrawn. Coming-soon: 136 checks pass. Storefront: 354 checks pass (the axe scan was skipped because downloading axe-core was not allowed this session). Both private previews republished. Branch `claude/new-session-e77001` restarted from `main` after PR #6. Not deployed.
- **2026-11-07 (later):** Removed the speech bubble switcher from the coming-soon preview (option A already chosen). Brian said "Deploy": checked the live Worker still matched the last deploy, redeployed with the clean hero art and the same `DIBS` binding, and verified the hero and social images on heavypocketsco.com match the build byte for byte, `www.` redirects, and `/api/dibs` (bad email and bot trap only, nothing saved). PR opened, not merged.
- **2026-11-07 (later):** Brian asked to merge. PR #7 (clean hero art, already live on the coming-soon page) merged into `main`. Start new work from `main`. Next: compare email services for the signup list (website to-do 8).
- **2026-11-11:** Brian realized the approved v3 preview must be rebuilt as a Shopify theme, so Shopify moves up. Explained what carries over (CSS, wet reveal script, images, and wording) and what gets rebuilt (Liquid templates, products and prices from Printify through Shopify, real cart and checkout). Brian chose the $1 intro offer (3 days free, then $1/mo for 3 months, Basic) over a free development store. Updated PLAN.md and wrote `brand/Step12_Shopify_Checklist.md`. Store stays password-protected; the coming-soon page stays live. Next: Brian signs up.
- **2026-11-12:** Brian opened Shopify (rjrxi5-ji.myshopify.com, $1 offer, Basic) and connected Printify. Claude set approved prices, removed em dashes from titles, replaced the Midnight boilerplate description in Printify, then published all six products to Shopify (password still on, domain not connected). Scheduled a push reminder for Feb 5, 2027, a week before the $1 months end. Next: Step 13 theme rebuild.
- **2026-11-12 (later):** Step 13 started. Built `theme/shopify/` from the v3 preview (custom theme, not Dawn). Fixed during testing: default color now follows the approved order, sizes always sort S to 5XL. 293 local browser checks and Theme Check pass. Allowed the myshopify host. Waiting on Brian for the Theme Access password, then upload as an unpublished theme.
- **2026-11-12 (later):** Brian installed Theme Access; its password is a network secret. Uploaded the theme as unpublished "Heavy Pockets" (id 131897917498). Shopify's parser caught a brace bug liquidjs missed; fixed. With the store password, checked the real store: photo grouping differed from the guess (fronts first), fixed and confirmed; add to cart and cart work (test cart emptied). 317 local checks and 32 of 33 live checks pass (Field Notes page still to create). Live theme is still Horizon.
