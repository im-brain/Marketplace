# CLAUDE.md: Project Handoff

Read this first in every new conversation. Update the "Current status" and "Session log" sections at the end of every work session.

## What this project is

A print-on-demand store for Great Lakes rockhounds (Michigan, Wisconsin, and Minnesota collectors), selling tees and socks. Owner: Brian, a rockhound in Grand Rapids, Michigan. It is a personal side project with no connection to his day job. The goal is profit greater than his monthly AI bill (about $20).

The full step-by-step plan is in `PLAN.md`.

## Current status

- **Store name (decided Nov 1, 2026): Heavy Pockets Co.** Domain heavypocketsco.com, handles @heavypocketsco, email hello@heavypocketsco.com (forwarded to a private Gmail). Tagline "Head down. Pockets full." Secondary line "Dry rocks lie." Fallback: Wet Thumb Co. (wetthumbco.com, @wetthumbco), used only if Heavy Pockets runs into trouble. Checks were a first screen, not legal clearance. Background: heavypockets.com and @heavypockets belong to an old, apparently dead streetwear brand; the 2013 HEAVY POCKETS clothing filing (serial 85912472) was abandoned in 2014.
- **Current step:** Step 4, merged with Brian's website creative brief. **Nov 3, 2026: Brian picked the retro direction** (a 1990s personal home page, inspired by cameronsworld.net, all art original), so `site/prototype/index.html` is now the retro homepage, and `DESIGN.md` (with `.impeccable/design.json`) is the web brand kit written from it. The old Direction B "Sorting tray" homepage is kept at `site/prototype/sorting-tray.html`; `tokens.css` belongs only to it. **Nov 3: Brian approved Step 4** (the retro homepage and DESIGN.md). **Nov 3: built the coming-soon page** (`site/prototype/coming-soon.html`, served by a Cloudflare Worker in `worker/`, signups saved in Brian's Cloudflare KV list). **Nov 4: published** as the Worker `heavypockets-coming-soon` (test address https://heavypockets-coming-soon.heavypocketsco.workers.dev, KV list attached). The Cloudflare token is now a network secret for api.cloudflare.com. This session's network can't open workers.dev, so Brian checks the page on his phone. **Nov 3 (evening): heavypocketsco.com is attached to the Worker and live**; signups confirmed working (Brian's test signups landed in the list). www.heavypocketsco.com did not attach ("No zones match"); optional, fix later. **Next:** Step 5, the design tracker.
- **Waiting on Brian:** (1) nothing on the coming-soon page (hello@ forwarding confirmed working Nov 3 after the domain change); (2) his own stone photo pairs when he has them (Field Guide stones are still code-drawn; Nov 3: Brian said leave the dry Leland Blue and Petoskey samples as they are for now); (3) a real Printify sample of the Petoskey socks at Step 10 (the concept image is glossy; the print will be matte, with printed stripes).
- **Branch:** Nov 3 work is on `claude/gifted-clarke-u7rlbp`, built from `claude/compassionate-fermi-lndrfd` plus merges of `gpt/review`, `gpt/logo`, `gpt/motion`, and `gpt/stones`. Not merged into `main` yet. A recovery ZIP of the `gpt/*` branches (Nov 3) duplicated the branches and was not needed.
- **USPTO rate limit:** the search API returns 403 or 429 after many quick queries. Space searches out, and don't loop retries.
- **Stock photos:** the Unsplash API works (network secret for api.unsplash.com, `Client-ID` header added by the proxy, demo tier 50 requests an hour, confirmed Nov 2, 2026). Its guidelines: credit the photographer, hotlink from images.unsplash.com, and hit the photo's download endpoint when used. Unsplash has almost no accurate agate or Petoskey photos, so use it for shoreline and pebble mood only. unsplash.com and www.pexels.com web pages block scripts with a bot check; don't get around it. impeccable.style and api.openai.com are blocked.
- **Network access:** all needed hosts are allowed as of Nov 1, 2026: rdap.verisign.com, api.printify.com, images-api.printify.com, tmsearch.uspto.gov, tsdr.uspto.gov, api.cloudflare.com, fonts.googleapis.com, fonts.gstatic.com, accounts.google.com, and pypi.org. Shopify's `<store>.myshopify.com` gets added at Step 12.
- **Impeccable skill:** its setup step runs `scripts/impeccable`, which downloads a helper program from GitHub releases (checksum-verified). GitHub release downloads aren't on the allowed host list yet, so that step may fail. The design guides in `reference/` work without it. To enable the helper, allow github.com and its release download host. Brian plans to use it mainly once the website gets built.
- **Tools Claude can run:** .com availability via `https://rdap.verisign.com/com/v1/domain/<name>.com` (200 means taken, 404 means open). Trademark knockout search via `python3 scripts/tm_search.py '"phrase"'` (POSTs to `tmsearch.uspto.gov/prod-stage-v1-0-0/tmsearch`; classes look like "IC 025"). Filing history via `tmsearch.uspto.gov/tsdr-api-v1-0-0/tsdr-api?serialNumber=<n>`. Social and Etsy conflicts via web search limited to those domains. Handle availability can't be confirmed automatically; Brian checks by hand.
- **Accounts (all created Nov 1, 2026):**
  - Store Gmail: **heavypocketsco@gmail.com**, with 2-step verification on. It owns every store account.
  - Domain: **heavypocketsco.com** on Cloudflare Registrar (registered Nov 1, 2026, expires Nov 1, 2027, auto-renew on, Cloudflare nameservers, transfer lock on). heavypockets.rocks was considered and skipped.
  - Email: **hello@heavypocketsco.com** forwards to the Gmail through Cloudflare Email Routing. Gmail "Send mail as" hello@ is the default (smtp.gmail.com:587 with an app password; replies come from the address the mail was sent to). SPF TXT record: `v=spf1 include:_spf.mx.cloudflare.net include:_spf.google.com ~all` (there must be only one SPF record).
  - Social: **@heavypocketsco** on Instagram and TikTok. @wetthumbco placeholders on both (no wetthumbco.com domain).
  - Printify: free account, shop id **29566047** ("My new store," sales_channel "disconnected" until Shopify at Step 12). Optional: rename it to Heavy Pockets Co.
  - Shopify: not created (Step 12).
- **First dibs list:** signups live only in the Cloudflare KV list `heavypockets-first-dibs`. `scripts/export_dibs.py` downloads it to `private/` (gitignored). Real emails never go in the repo or in chat; report counts only. The page promises one email (the launch) unless people ask for more, so honor that in Shopify. The page says it keeps only the email and signup date, so don't add fields without updating that note.
- **Secrets:** the Printify token is a **network secret**, not an environment variable. The proxy adds it automatically to requests to api.printify.com, so scripts call the API **without** their own Authorization header (`curl https://api.printify.com/v1/shops.json` returns 200). Rule: all tokens live in the environment settings, never in the repo or chat. Printify personal access tokens expire after 1 year, so regenerate it around Oct 2027 (or sooner if calls start returning 401). A scheduled reminder (trig_01Tqk91XWiYUnSFWtoVVR3z3) fires Oct 1, 2027, tests the token, and sends Brian renewal steps by push notification. Brian keeps a backup copy in his password manager. If automation ever moves to GitHub Actions, the token goes in that repo's Actions secrets.

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
10. Launch with 5 designs: the Great Lakes beach stone chart, "Agate Expectations," "Will brake for agates," Petoskey socks (Nov 3: now a cream tube sock with olive stripes and a Petoskey band, from a ChatGPT concept Brian loves), and **"I lick rocks"** (or "Will lick rocks"), Brian's idea from Nov 1, 2026. The phrase alone is common on Etsy, so the art carries it: a dull, dry stone with one glossy lick-shaped streak where the true color shows through. It's the brand idea in one picture. Nov 1, 2026: no USPTO filings for "I lick rocks," "Will lick rocks," or "lick rocks." Re-check before printing.
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
- When using the Impeccable skill, Brian's rules here take priority: no em dashes, Oxford comma, HTML readable in dark mode, and brand colors and fonts from the Step 4 brand kit once it exists.

## Repo layout (grows over time)

- `PLAN.md`: the plan.
- `CLAUDE.md`: this handoff.
- `models/POD_Profit_Model.xlsx`: the profit model.
- `brand/Store_Name_Shortlist.xlsx`: candidate names with checks (Heavy Pockets Co. marked CHOSEN).
- `brand/Step3_Accounts_Checklist.md`: Step 3 account setup checklist.
- `scripts/tm_search.py`: USPTO trademark knockout search.
- `brand/Naming_Brainstorm_Prompt.md`: the prompt for the separate naming session.
- `ChatGPT.md`: the team brief for ChatGPT (images, logo, and animation tasks with exact specs, file ownership, and a shared Handoff log). `prompt.md`: the message Brian pastes into ChatGPT. Read the Handoff log at the bottom of ChatGPT.md at the start of each session.
- `scripts/matte_dry.py`: makes a stone's dry image more matte without moving pixels (used for the hero agate stand-in).
- `scripts/build_preview.py`: rebuilds `site/prototype/preview-single-file.html` (inlines local CSS, JS, and `assets/` images). With two arguments it builds any page, for example `python3 scripts/build_preview.py site/prototype/directions/retro.html site/prototype/directions/retro-single-file.html`.
- `scripts/retro_pixels.py`: draws the retro pixel art (pebble wallpaper, waves, rockhound, pixel wordmark, pebble glyph) into `site/prototype/assets/retro/`.
- `DESIGN.md`: the web brand kit (Nov 3): retro colors (day and night), Pixelify Sans and Tinos type roles, bevels, components, and named rules such as One Red Button. `.impeccable/design.json` holds its machine-readable extras. Brian should confirm its names and wording.
- `scripts/matte_band.py`: takes the shine off one band of a concept image (used on the Petoskey sock concept).
- `site/prototype/retro.css`: the shared retro look (moved out of index.html on Nov 3; used by index.html and coming-soon.html).
- `site/prototype/coming-soon.html` and `coming-soon.js`: the coming-soon page. `worker/`: the Cloudflare Worker that serves it and saves signups (`worker/README.md` has setup). `scripts/build_coming_soon.py`, `scripts/deploy_coming_soon.py`, and `scripts/export_dibs.py` build, publish, and export.
- `PRODUCT.md`: product truth for the Impeccable skill (audience, voice, constraints, and principles).
- `site/prototype/`: the homepage prototype. `index.html` is the retro homepage (Nov 3); `sorting-tray.html` is the previous Direction B homepage (its menu lid and settle motion live in `motion-tray.css`; `motion.css` and `motion.js` are shared); `assets/retro/` holds the pixel art; `assets/products/` holds product concept images (the ChatGPT Petoskey sock). Also (`Image_Prompts.md` (ChatGPT prompts for dry and wet stone pairs), `index.html`, `preview-single-file.html` (a generated one-file copy for phone viewing), `tokens.css` with provisional tokens, `stone.js` code-drawn SAMPLE stones, and `IMAGE_CREDITS.md`). `directions/` holds the two Phase 1 direction sketches and the retro sketch (`retro.html`).
- `.impeccable/surfaces/`: Impeccable's homepage surface brief with the direction contract. Screenshots go in `.impeccable/review/` (gitignored).
- `.claude/skills/impeccable/`: the Impeccable design skill (v4.8.0, Apache 2.0, from github.com/pbakaus/impeccable), installed Nov 1, 2026. It loads in every session (`/impeccable`). License in `.claude/skills/LICENSE-impeccable`.
- Planned: `designs/` (art files), `tracker/Design_Tracker.xlsx`, `scripts/` (Python automation), `theme/` (the custom Shopify Liquid theme).

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
- **2026-11-02:** Brian's creative brief arrived (5 phases with approval gates). Step 4 is merged with it. Wrote PRODUCT.md. Chose a custom Shopify Liquid theme over Hydrogen. Impeccable's roll (degraded: impeccable.style blocked, no image generation, so code-first) assigned the rock club bulletin; Brian picked the sorting tray. Built the homepage prototype with a menu, Wet Stone (chalky dry to rich wet, by hover, tap, or keyboard), 5 concept products, a field note, a Field Guide strip, and signup. Checked at 390 and 1440 wide in light and dark. Next: Brian's prototype review.
- **2026-11-02:** Unsplash key confirmed working. Searches found no accurate agate or Petoskey photos, so wrote `site/prototype/Image_Prompts.md` (ChatGPT dry and wet pair prompts, plus a how-to for shooting Brian's own pairs). Ran Impeccable's full critique (dual-agent): 24/32. P1s: the Shop path dead-ends at "Price TBD" with five same-page "See the design" links, and the code-drawn agate and Leland Blue misrepresent the real stones. P2s: empty-looking first desktop tray, header overflow on small phones, and dark mode losing the open-lid moment. Waiting on Brian's pick of what to fix first.
- **2026-11-02 (later):** Brian picked: fix the shop dead-end first, make the orange button "Get first dibs" until Step 12, and fix the P1s and P2s. Done: "Pocket it" buttons on each design replace "See the design"; the orange Cart is now a Pocket counter; a "Get first dibs" signup sits right under the five designs and lists the pocketed designs (the old bottom signup was removed); the agate is redrawn with a pitted rind and bands only on a broken face; Leland Blue is redrawn as glassy slag with bubbles and flow lines; the first tray is fuller (a wider stone well and a compartment of six small dry stones) and product cards peek in at 900px tall; there's no sideways overflow down to 320px wide; the menu descriptions stack on phones; dark mode keeps a visible lid; and the settle motion is softer. The menu now says "Being checked by a rockhound." Dead same-page links were removed.
- **2026-11-02 (later):** Brian is bringing in ChatGPT as a teammate for images, the logo, and animation. Wrote `ChatGPT.md` (the full brief with slot specs and code contracts) and `prompt.md` (the paste-in message), plus `scripts/build_preview.py`. ChatGPT works on `gpt/*` branches and owns `site/prototype/assets/`, `motion.css`, `motion.js`, and `ChatGPT_Review.md`. Next session: check the Handoff log in ChatGPT.md and review any `gpt/*` branches.
- **2026-11-03:** Merged ChatGPT's `gpt/review`, `gpt/logo`, `gpt/motion`, and `gpt/stones` branches. Conflicts were only in the Handoff log, IMAGE_CREDITS.md (kept both sections), and motion.css (kept the full motion version, which already had the stones image rules). Rebuilt the preview. Checked 320, 390, and 1440 wide, light and dark, normal and reduced motion: no sideways scroll, no console errors or failed loads, the header fits at 320, and Wet Stone (keyboard), Pocket it, and the menu (Esc and focus return) work. Flagged for Brian: the dry agate is not chalky enough, and the phone logo is 18px tall.
- **2026-11-03 (later):** ChatGPT has read-only repo access, so `ChatGPT.md` and `prompt.md` now make the zip the normal delivery and point at `claude/gifted-clarke-u7rlbp`. Added Task 1b (redo the hero dry image as an edit of the revision 3 master) and a paste-in message for it. Kept color in the dry stone, because Brian's dry references show rust and bands when dry. Made a matte stand-in with `scripts/matte_dry.py` (color 84%, flatter contrast, softened highlights, and a 6% dusty film; alpha identical) and put it on the site. The revision 3 master is unchanged. Rechecked all sizes and modes: all pass.
- **2026-11-03 (later):** Brian skipped the dry redo (Task 1b). The matte stand-in stays. Marked Task 1b skipped in ChatGPT.md and removed its paste-in box from prompt.md.
- **2026-11-03 (later):** Brian chose: fix open items first, add an orange accent to the logo, and make the field note digital. Done: the wordmark's period is latch orange (site and `hp-wordmark.svg`; tokens.css comment updated); the phone logo is 24px tall from about 380px wide and 20px at 320 (measured to fit); a "Tees and socks for Great Lakes rockhounds" line sits above the stone on phones; the signup shows its "not connected yet" note under the button before anyone types; the field note line now says each design gets a field note on its page; the "I lick rocks" card title is screen-reader only, so the phrase shows once; the header hides behind the open menu (no orange glow); the desktop menu stones are dry until pointed at; the small-phone stone caption no longer collides; and PLAN.md now says product photos never get the wet effect. The sock badge overlap was already gone. Rechecked 320, 390, and 1440, light and dark, and reduced motion: all pass.
- **2026-11-03 (later):** Brian approved the prototype for now but expects to redo the look because it reads too AI; he'll give specific direction later. Held off on turning the provisional tokens into the brand kit until then.
- **2026-11-03 (later):** Brian likes cameronsworld.net and a 1990s-browser screenshot and wants those ideas merged in, not copied. With Impeccable as the design guide (Brian's direction was pinned, so no roll; code-led, no image generation), built `site/prototype/directions/retro.html`: Brian's store as a 1990s home page in one beveled gray browser window on a pixel pebble beach, with a pixel wordmark over Lake Superior waves, a ticker, the Wet Stone Viewer 1.0 (the real Wet Stone motion), an honest Under Construction band, all five concept designs on a pixel water band, Get first dibs (kept, not a guestbook), pocket and stones-wetted counters, a badge wall, and a zero-webrings footer. Night mode is a dark pixel beach. All art is original and drawn in code. An independent reviewer (Impeccable's finish review run by a fresh agent, since /advisor isn't installed) said fix; its 8 fixes were applied, including keeping the SAMPLE label on phones and toning down two overclaiming lines. Checked 320, 390, and 1440, light and dark, and reduced motion. The current prototype is unchanged. DESIGN.md waits until Brian picks a direction.
- **2026-11-03 (later):** Brian loved the retro sketch and picked it. Rebuilt `site/prototype/index.html` as the retro homepage, adding Field Notes (sample field note), the Field Guide (three SAMPLE stones you can wet), and Our Story (the pockets list) in the same world; the old homepage moved to `sorting-tray.html`, and the pixel art moved to `assets/retro/`. Added ChatGPT's Petoskey tube sock concept (Brian's) as the socks card, labeled "Concept" and "Prints matte, not shiny," with origin embedded and credited. Flagged for Brian: the mockup's gloss and knitted stripes can't be printed, fine detail may blur, the cells should pack tighter like real Petoskey, and his own wet Petoskey photo would be the best band. On phones, Get first dibs now follows the five finds. A fresh Impeccable finish review caught a real bug (the sock image didn't paint in full-page views; fixed by dropping async decoding).
- **2026-11-03 (later):** Finished the retro homepage through Impeccable's finish review (two rounds by a fresh agent). Fixed: the sock image not painting, a matte edit of the sock's Petoskey band (stone pixels only; original kept), dry SAMPLE stones keeping half their color, the ticker keeping items whole, and the contract's FORM wording. Still open, Brian's call: the dry code-drawn Leland Blue reads gray and the Petoskey pattern is too regular (his photos would replace both). Then wrote DESIGN.md and `.impeccable/design.json` from the built page. Cleanup noted by the documenter, not done: no manual theme switch, leftover sorting-tray rules in motion.css, a repeated night color (#16171c) that isn't a token, and dark title-bar icons on the night theme.
- **2026-11-03 (later):** Cleanup and the Pocket fix. Pocket picks now survive a refresh (saved on the device; safe when storage is blocked). Added a Day/Night switch in the menu bar (remembered on the device; otherwise follows the phone's setting), with a sun or moon pixel icon; on phones the word "Pocket" is hidden so the bar stays one line. Moved sorting-tray-only rules from `motion.css` into `motion-tray.css`. Tokens: `--field` replaces the repeated #16171c, `--pebble` replaces the misnamed `--on-soft`, the page fallback uses `--page`, title-bar icons follow the ink color at night, and inline heading sizes became classes snapped to the type scale (19px and 22px). DESIGN.md now documents the switch, the tokens, a 14px caption role, and the bumper sticker's art-only colors; the detector's design-system mismatches are cleared. Also fixed a ticker regression (doubled text on phones with animations off). All 12 size, theme, and motion checks pass, and the old sorting tray page still works.
- **2026-11-03 (later):** Brian said to leave the code-drawn Leland Blue and Petoskey samples for now. Updated PLAN.md Step 4 to name the retro direction (it still said Sorting tray).
- **2026-11-03 (later):** Brian approved Step 4. Marked it done in PLAN.md. He asked when the site goes live: Step 19, after samples, Shopify, and the theme. Suggested an optional early coming-soon page.
- **2026-11-03 (later):** Brian asked for a simple coming-soon page that collects emails, with signups kept in his own Cloudflare (his pick over a separate email service). Built `coming-soon.html` in the retro look (Wet Stone viewer, a sneak peek of the five designs with Pocket it, Get first dibs, a plain-language privacy box, and About), a Cloudflare Worker that serves it and saves signups to KV (bot trap, same-site check, size limits, and a no-scripts form fallback), a local test with a pretend list (17 checks pass), and publish and export scripts (tested against a pretend Cloudflare). Moved the homepage's styles into `retro.css` (pixel-identical before and after). Made a retro share card. Fixed an accuracy issue on the homepage: "Made in Grand Rapids" and "MADE IN MICHIGAN" became "Designed in," because Printify prints the products. Checked 320, 390, and 1440, light and dark, and reduced motion: no overflow or errors. Not published yet: waiting on Brian's Cloudflare token.
- **2026-11-03 (later):** Brian simplified the coming-soon page to three parts: the banner (wordmark, tagline, and "Tees and socks for Great Lakes rockhounds"), the "Coming soon" note, and Get first dibs (with a short privacy note under it). Removed the Wet Stone viewer, ticker, sneak peek, Pocket it, badges, counters, About, and the long privacy box. Kept the Day/Night switch. Page is 23 KB. All 17 Worker checks and the size, theme, and motion checks pass. Still waiting on the Cloudflare token to publish.
- **2026-11-03 (later):** Coming-soon tweaks. The rockhound now has a pixel speech bubble: "Something magnifico is in the tumbler. It'll rock." (no name; Brian's "magnifico" plus a tumbler joke). "It'll rock." is navy, not agate red, to keep One Red Button. "Hosted by Cloudflare. Fonts by Google Fonts." moved to a small retro status bar at the bottom of the browser window. All checks pass.
- **2026-11-04:** Brian added the Cloudflare token. Ran `scripts/deploy_coming_soon.py`: the Worker `heavypockets-coming-soon` is uploaded with the DIBS KV list and its workers.dev test address is on (confirmed through the API). workers.dev is blocked from this session, so the live page wasn't opened here. Next: Brian checks it on his phone and attaches heavypocketsco.com.
- **2026-11-04:** Brian attached heavypocketsco.com to the Worker (Custom Domain, Production) and signed up. `export_dibs.py --count` shows 2 signups, both gmail.com, at 9:34 and 9:35 PM Eastern on Nov 3 (emails not shown in chat). www didn't attach: the dialog said no zone matched and offered "Onboard domain"; told Brian not to onboard. Fix later if wanted.
- **2026-11-04 (later):** Brian confirmed both signups are his and to keep them (so the real count is total minus 2), and that hello@ forwarding still works. Coming-soon page done. Next: Step 5, the design tracker.
