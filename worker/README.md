# Coming-soon page (Cloudflare Worker)

A simple coming-soon page for heavypocketsco.com: the Heavy Pockets Co. banner, a "Coming soon" note, and a first dibs signup. It stays up until the real Shopify store opens at Step 12.

## How it works, in plain terms

- **The page:** `site/prototype/coming-soon.html` (plus `retro.css` and `coming-soon.js`). It uses the same retro look as the homepage.
- **The Worker:** `worker/src/index.js` is a tiny program that Cloudflare runs for every visit. It hands back the page and its images, and saves each signup.
- **The list:** signups go into a Cloudflare KV list named `heavypockets-first-dibs`, inside your own Cloudflare account. Each email is saved once, with when they signed up. No emails are ever saved in this repo.
- **Spam protection:** a hidden box that only bots fill in, and signups are accepted only from the page itself.
- **Cost:** $0. The free Workers plan allows 100,000 visits and 1,000 new signups a day.

## Files

| File | What it is |
|---|---|
| `worker/src/index.js` | The Worker (page, images, and the `/api/dibs` signup) |
| `worker/test/local.mjs` | Runs the Worker on this computer with a pretend list, and checks it |
| `scripts/build_coming_soon.py` | Builds `worker/dist/` (not saved in git) from the page |
| `scripts/deploy_coming_soon.py` | Publishes the Worker to Cloudflare |
| `scripts/export_dibs.py` | Downloads the list to `private/` (not saved in git) |
| `site/prototype/assets/logo/og-retro.jpg` | The share card (source: `assets/logo/src/og-retro.html`) |

## Test it here (no Cloudflare needed)

```bash
python3 scripts/build_coming_soon.py
```

```bash
node worker/test/local.mjs --check
```

## One-time setup (Brian)

### 1. Make a Cloudflare API token

1. Log in to Cloudflare as heavypocketsco@gmail.com.
2. Go to **My Profile**, then **API Tokens**, then **Create Token**, then **Create Custom Token**.
3. Name it `Claude coming-soon`.
4. Add these three permissions (all **Account** permissions):
   - Account Settings: **Read**
   - Workers Scripts: **Edit**
   - Workers KV Storage: **Edit**
5. Under **Account Resources**, include only the Heavy Pockets account.
6. Create it and copy the token. Save a backup in your password manager. Never paste it into chat.

This token can publish the page and read the signup list. It can't change DNS, email forwarding, or the domain.

### 2. Add it to the Claude environment

In the Claude Code session, open the environment menu in the title bar, then **Edit**. Under **Network secrets**, add one for the host `api.cloudflare.com` with the header `Authorization` set to `Bearer ` followed by the token. Then start a new session so it takes effect.

### 3. Publish

Claude runs:

```bash
python3 scripts/deploy_coming_soon.py
```

That prints a free test address (`heavypockets-coming-soon.<something>.workers.dev`). Check the page there on your phone first.

### 4. Point the domain (by hand, about 2 minutes)

1. In Cloudflare, go to **Workers & Pages**, then `heavypockets-coming-soon`, then **Settings**, then **Domains & Routes**.
2. Click **Add**, then **Custom domain**, and enter `heavypocketsco.com`.
3. Do it again for `www.heavypocketsco.com` (the Worker sends www visitors to the main address).
4. If Cloudflare says a DNS record already exists for that name, stop and tell Claude. Don't delete records, because the email forwarding records (MX and TXT) must stay.
5. Test: open heavypocketsco.com, sign up with your own email, then send a test email to hello@heavypocketsco.com to make sure forwarding still works.

## Check the list

```bash
python3 scripts/export_dibs.py --count
```

That prints how many signed up. Without `--count`, it also writes `private/first-dibs-<date>.csv`, set up for Shopify's customer import.

## At Step 12 (Shopify opens)

1. Export the list and import it into Shopify customers (check Shopify's current sample CSV first).
2. Send the one launch email. The page promises that's the only email unless people ask for more. Shopify's emails need a mailing address in the footer (US anti-spam law), so get a P.O. box or a mailing service first if you don't want to use your home address.
3. Remove the custom domain from the Worker, then connect heavypocketsco.com to Shopify.
4. Delete the KV list once the import is confirmed, so the emails don't sit in two places.
