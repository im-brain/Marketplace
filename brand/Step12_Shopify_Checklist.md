# Step 12: Open Shopify on the $1 Offer

Brian does the sign-up himself (his account, his card). Claude can't do this part. About 20 minutes.

## Before you start

- [ ] Be logged in to **heavypocketsco@gmail.com** (the store Gmail). Shopify will send a code there.
- [ ] Have a card ready. You won't be charged during the 3 free days, then $1 a month for 3 months.

## Sign up

1. [ ] Go to shopify.com and choose "Start free trial." Sign up with **heavypocketsco@gmail.com**.
2. [ ] Skip or answer the setup questions however you like. Nothing here is permanent.
3. [ ] Store name: **Heavy Pockets Co.** If it asks for a store address, use `heavypocketsco` (it becomes `heavypocketsco.myshopify.com`). That address is private and only for setup.
4. [ ] When asked to pick a plan, choose **Basic**. **Check that the screen says $1/month for the first 3 months before you enter a card.** If it shows something different, stop and tell Claude what it says.
5. [ ] Write down the date the 3 months end: ______________. Put a reminder on your calendar one week before.

## Keep it private

6. [ ] In the Shopify admin, go to **Online Store > Preferences** and confirm **Password protection** is on. New stores start with it on. Keep it on until launch.
7. [ ] **Do not connect heavypocketsco.com yet.** Skip any "Connect your domain" prompts. The coming-soon page on Cloudflare stays live until launch.
8. [ ] Payments, taxes, and shipping settings can wait. We'll do those together before launch.

## Connect Printify

9. [ ] In Printify (logged in with the store Gmail), go to **My stores** and connect the existing store to **Shopify**. Approve the Printify app when Shopify asks.
10. [ ] Don't publish anything yet. Tell Claude when it's connected, and Claude will check the connection and publish the six products from Printify into Shopify (still hidden behind the password).

## Tell Claude

- [ ] The `.myshopify.com` address you got in step 3.
- [ ] The end date from step 5.
- [ ] That Printify shows the store as connected.

Then Claude adds the `.myshopify.com` host to the allowed network list and starts Step 13: rebuilding the v3 preview as the Shopify theme. The theme gets built in Brian's account, so Claude may ask for a Shopify access token. Like the Printify token, it goes in the environment settings, never in chat or the repo.

## Test (Step 12 is done when)

- The six products, with their sizes and larger-size prices, show in the Shopify admin.
- Opening the store's address asks for a password.
- heavypocketsco.com still shows the coming-soon page.
