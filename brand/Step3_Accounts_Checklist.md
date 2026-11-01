# Step 3: Accounts checklist for Heavy Pockets Co.

Do these in order. Each one takes about 5 to 10 minutes. Tell Claude when you finish each one, so it can test and update the handoff.

Save every login in a password manager (Apple Passwords works). Claude never needs your passwords.

---

## (a) Store Gmail

- [ ] Go to accounts.google.com and choose "Create account," then "For my personal use."
- [ ] Try `heavypocketsco`. If it's taken, use a close variant like `heavypocketsco.shop` or `heavypocketsco.hq`. Customers never see this address, so any version is fine.
- [ ] Turn on 2-step verification: Google Account, then Security, then 2-Step Verification. This account is the master key to the whole store, so this matters.
- Gmail address I got: `______________________`

## (b) Domain: heavypocketsco.com

- [ ] Go to dash.cloudflare.com and sign up with the store Gmail.
- [ ] In the sidebar, open "Domain Registration," then "Register Domains," and search `heavypocketsco.com`.
- [ ] Buy it for 1 year (about $10 to $11, at cost, with free privacy protection).
- [ ] Turn on **auto-renew**.
- Optional: also buy `wetthumbco.com` as a backup. You can skip this, because the handles are the more important placeholder.

## (c) Social handles

- [ ] **Instagram:** sign up with the store Gmail, username `heavypocketsco`. Then go to Settings, Account type, and switch to Professional (Creator or Business). That's free and gives you stats.
- [ ] **TikTok:** sign up with the store Gmail, username `heavypocketsco`. Switch to a Business account in Settings (free).
- [ ] **Placeholders:** claim `wetthumbco` on Instagram and TikTok too. You can use the same Gmail with a "+" trick, like `heavypocketsco+wet@gmail.com`, which still lands in the same inbox.
- Optional, also free: `heavypocketsco` on Pinterest and YouTube. Rockhound content does well on both.

## (d) Printify and the API token

- [ ] Go to printify.com and sign up (free plan) with the store Gmail.
- [ ] Skip connecting a store for now. Shopify waits until Step 12.
- [ ] Click your profile (top right), then **Connections**, then generate an **API token**. Name it `claude`, and give it access to the catalog, products, uploads, orders, and shops.
- [ ] Copy the token and save it in the Claude Code environment: open the environment menu in the session title bar, choose **Edit**, then **Secrets** (or Environment variables), and add the name `PRINTIFY_API_TOKEN` with the token as the value.
- [ ] **Never paste the token into chat or any file.**
- [ ] Tell Claude "token saved." Claude will test that it can read your Printify account.

## (e) Email: hello@heavypocketsco.com

Do this once the domain is active, about 5 to 30 minutes after buying it.

- [ ] In Cloudflare, open heavypocketsco.com, then **Email**, then **Email Routing**, then **Get started**.
- [ ] Create the address `hello`, set the action to "Send to an email," and enter the store Gmail as the destination.
- [ ] Open the verification email in the Gmail and click the link.
- [ ] Let Cloudflare add the DNS records it suggests (one click).
- [ ] **Test:** from your personal email, send a message to hello@heavypocketsco.com. It should arrive in the store Gmail.
- [ ] **Replies from hello@:** tell Claude when the test works, and Claude will walk you through Gmail's "Send mail as" setup click by click. It needs an app password and one extra DNS record so replies don't land in spam.

---

When all five are checked, Step 3 is done. Next is Step 4: the brand kit (colors, fonts, and wordmark).
