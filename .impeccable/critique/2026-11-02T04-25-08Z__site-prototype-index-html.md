---
target: Sorting tray homepage prototype
total_score: 24
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
target_identity: "file:/home/user/Marketplace/site/prototype/index.html"
target_fingerprint: "sha256:b2027d78662f78aecdc184bac30b10bea8e7d5e62cb77b19efae4579a315f239"
target_path: /home/user/Marketplace/site/prototype/index.html
timestamp: 2026-11-02T04-25-08Z
slug: site-prototype-index-html
---
# Critique: Sorting tray homepage prototype (Nov 2, 2026)

Method: dual-agent (A: design review, B: detector and browser evidence).

## Heuristics (24/32, Good; 7 and 10 n/a for Persuade)
1 Status 3 (hover wets but hint still says "Tap to wet it"). 2 Real world 3 (concentric slab art for agate and Leland Blue). 3 Control 3 ("See the design" and Cart jump to same-page anchors). 4 Consistency 3 (Cart goes to signup). 5 Error prevention 3. 6 Recognition 3 (five identical "See the design" links). 7 n/a. 8 Aesthetic 3 (mobile page about 5,960px tall). 9 Recovery 3. 10 n/a.

## Specificity
Authored, not stock: cobalt tray, recessed wells, orange reserved for Shop, Cart, and signup, smoked lid menu. Weakened by an emptier-than-promised first desktop tray and stone art that misreads real stones.

## Detector
CLI: 5 warnings (4 cramped-padding, 1 nested-cards), all judged false positives (full-bleed stone well, decorative wells, concept art sticker). Overlay: 17 at 390, 12 at 1440. Real: bounce easing on .settle (cubic-bezier .34,1.4,.64,1), "Agate Expectations" h3 overflowing its half-width card, 3 stragglers, tiny "SAMPLE stone" text. No JS errors, no dashes, all measured contrast AA (lowest 5.94:1). Header overflows at 320 and Cart has no right gutter at 390. Touch targets under 44px: wordmark (20px tall), "Read the Field Notes" link, footer links (40px).

## Priority issues
1. [P1] Shopping path dead-ends at intent: "Price TBD" cards, five "See the design" links all to #shop (also WCAG 2.4.4), Cart to signup about 5,000px down. Fix: per-design "Tell me when it's live" capture or a signup row under the five finds; unique link names. clarify, layout.
2. [P1] Code-drawn stones misrepresent real stones: agate drawn as full-face concentric rings (slab or tree rings), Leland Blue drawn banded instead of glassy and vesicular. Fix: redraw, or Brian's photo pairs or approved AI pairs (Image_Prompts.md). polish.
3. [P2] First desktop tray reads as empty bento: Wet Stone well and s1 about 60% empty, product wells don't peek at 900px. Fix: bigger hero stone, short or crowded s1, cap hero height. layout.
4. [P2] Mobile overflow and clipping: header at 320 and 390, Agate Expectations h3, ragged menu descriptors. adapt.
5. [P2] Dark mode loses the open-lid moment (navy on navy). Fix: distinct smoked lid with a light lip. colorize.

## Persona red flags
TikTok phone rockhound: Shop leads to Price TBD, "See the design" seems broken, Cart lands on signup. Screen reader: identical link names, Wet Stone change not announced. Expert rockhound: tree-ring agate; menu says "checked by a rockhound" before it is.

## Minor
Hover and click conflict on Wet Stone; "I lick rocks" title repeated; Concept badge covers sock cuff; Cart glows through the lid; "Shipping and returns" goes to #cart; menu stones always wet; "Each shirt comes with a field note" is a promise to confirm.
