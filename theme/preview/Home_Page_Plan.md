# Home Page Brief (Step 5)

Shaped Nov 1, 2026 with the Impeccable `shape` command. Brian's answers are in. **Waiting on Brian's OK, then build `theme/preview/index.html`.** No code yet.

## 1. Job and audience

A rockhound taps through from a TikTok or Instagram product video, almost always **on a phone**, having just seen one shirt. Mode: **Persuade**. Within 5 seconds they should get "shirts drawn from real Great Lakes stones, by a rockhound," and tap a product.

## 2. Outcome and proof

- **Main action:** tap a launch-5 product. The second action is "Shop the shirts" in the hero.
- **Proof:** the real stone next to the shirt drawn from it (section 4). It stays an honest, labeled empty frame until Brian's photos exist.
- **Never:** fake reviews, "as seen in" logos, trust badges, or countdown timers.

## 3. Direction: "The wave line"

The brand kit stays as it is (palette, Fraunces, Work Sans, IBM Plex Mono, and the wordmark). The new idea is in the hero.

- **Hero scene:** Brian's choice is an "epic, beautiful rock scene," not a single stone. The best fit for the wet effect is a **cobble beach at the waterline**. In real life it already has both states: dark, glossy stones where the wave just reached, and pale, dusty stones above it.
- **On load:** one wave of "wet" washes up the scene (fast, 0.45 seconds), then dries slowly (1.4 seconds), using the brand kit's timing. The stones show their true colors for a moment, then go dull. Headline: "Dry rocks lie." Button: "Shop the shirts."
- **Then:** press and hold anywhere on the scene to wet that spot. Normal swipes still scroll (Brian approved this fix). On desktop, moving the mouse wets the stones.
- **How it works:** the page uses **one wet image** and makes the dry look in code (paler, flatter, with less shine). So every photo or generated scene only has to be made once, wet.
- This is the page's **only** animation. Nothing fades in on scroll.

## 4. Scope

- The home page only, at preview quality, in `theme/preview/index.html`, using `theme/brand-tokens.css`.
- **Sections, in order:** (1) header (wordmark, menu, and cart), (2) the wave-line hero, (3) the launch 5 (two columns on a phone, with name and price), (4) beach to shirt, (5) the free field guide teaser ("Is it an agate? Three checks."), and (6) the footer (email signup, hello@, @heavypocketsco, and the shipping, returns, and privacy links).
- **Cut from the home page (Brian, Nov 1, 2026):** the bundle offer (goes on product pages as "add socks for $12"), field notes (go on product pages), the About story (its own page), and reviews (wait until real ones exist).
- **Rules to avoid the "AI slop" look:** no grid of rounded cards with shadows, left-aligned text, no decorative icons or emoji, and short, specific copy with real place names.

## 5. States and ranges

- **Products:** always exactly 5 at launch (4 tees and 1 pair of socks), at $27.99 and $18.99. Long names like "Great Lakes beach stone chart" must wrap cleanly on a 360-pixel-wide phone.
- **Placeholders:** each is labeled "placeholder" on the page itself.
- **Reduced motion:** for people who turn animation off in their phone settings, skip the wave and show the scene half wet and still. Press and hold still works.
- **No JavaScript or a slow load:** the wet image shows as a normal photo, and the button works.
- **Dark mode:** follows the phone's setting. The hero scene looks the same in both modes; only the page around it changes.

## 6. Layout and interaction

- **Phone:** the hero fills most of the first screen, with the headline and button at the bottom, close to the thumb. The first product row peeks up from the bottom edge so people know to scroll.
- **Desktop:** the same order, just wider. The hero is a wide panorama, and the products sit in one row of 5.
- **Product art:** the dry look until it's touched or hovered, then wet. The product name and price are always fully readable, wet or dry.

## 7. Constraints and open decisions

- **Moving to Shopify (Step 13):** sections 1 and 3 to 6 are standard Dawn sections. Only the hero is custom.
- **Open: the hero image.** Brian writes the image prompt, and Claude refines it before anything is generated (Brian's request). The scene must be generated **wet**, landscape (about 16:9) with room to crop to a tall phone view, and with no text, people, or logos in it.
- **Pushback on the hero image:** an AI scene on a brand whose line is "Dry rocks lie" is a risk if it passes as a real beach. It's fine as a mood scene, but don't caption it as a real place, and replace it with Brian's own beach photo when he has a good one. A real photo is the strongest version of this page.
- **Placeholders until then:** a code-drawn cobble beach for the hero, the brand kit sketches for product art, and an empty frame for beach to shirt.

## Test

Brian opens it on his phone and on a desktop, in light and dark mode, and approves it.
