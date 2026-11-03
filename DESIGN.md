---
name: Heavy Pockets Co.
description: Tees and socks for Great Lakes rockhounds, sold from a 1990s personal home page that is honestly under construction. Head down. Pockets full.
colors:
  sticker-ink: "#11163a"
  sticker-shade: "#9aa0b5"
  sticker-small: "#3a4170"
  page-teal: "#0b7a78"
  on-page: "#ffffff"
  window-gray: "#c4c4c4"
  ink: "#111111"
  ink-soft: "#3b3b3b"
  bevel-light: "#ffffff"
  bevel-light-inner: "#e2e2e2"
  bevel-shade: "#7d7d7d"
  bevel-dark: "#0b0b0b"
  field-gray: "#e2e2e2"
  title-navy: "#0d2668"
  title-blue: "#3c6fb0"
  link-blue: "#0000d6"
  visited-purple: "#5a1a8f"
  agate-red: "#b3261e"
  agate-red-light: "#e0665c"
  agate-red-deep: "#5e0f0a"
  on-agate: "#ffffff"
  tape-yellow: "#ffd60a"
  tape-ink: "#141414"
  viewer-screen: "#0c1220"
  odometer-black: "#000000"
  odometer-yellow: "#ffe14d"
  lake-navy: "#16336b"
  wordmark-orange: "#ff6a1a"
  badge-water-blue: "#1f5fbf"
  badge-sand: "#e6d6b2"
  badge-sand-ink: "#3a2a10"
  badge-terminal-green: "#3cff6a"
  badge-purple: "#7b2fb5"
  night-page-teal: "#0b3438"
  night-on-page: "#e9f4f3"
  night-window-gray: "#2b2d35"
  night-ink: "#ececf1"
  night-ink-soft: "#b9bcc8"
  night-bevel-light: "#5c606e"
  night-bevel-light-inner: "#3e414c"
  night-bevel-shade: "#15161b"
  night-bevel-dark: "#000000"
  night-field: "#16171c"
  night-title-navy: "#0a1b4d"
  night-title-blue: "#2b5592"
  night-link-blue: "#9cc2ff"
  night-visited-purple: "#d0a6ff"
  night-viewer-screen: "#05080f"
typography:
  display:
    fontFamily: "Pixelify Sans, system-ui, sans-serif"
    fontSize: "clamp(26px, 3.2vw, 34px)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "0.01em"
  headline:
    fontFamily: "Pixelify Sans, system-ui, sans-serif"
    fontSize: "clamp(18px, 2.6vw, 26px)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.012em"
  title:
    fontFamily: "Pixelify Sans, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.012em"
  title-small:
    fontFamily: "Pixelify Sans, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 700
    lineHeight: 1.15
  window-title:
    fontFamily: "Pixelify Sans, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.02em"
  label:
    fontFamily: "Pixelify Sans, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.012em"
  label-small:
    fontFamily: "Pixelify Sans, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.012em"
  tag:
    fontFamily: "Pixelify Sans, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.06em"
  odometer:
    fontFamily: "Pixelify Sans, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 700
    lineHeight: 1
    fontFeature: "tnum"
  body:
    fontFamily: "Tinos, Times New Roman, serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.5
  body-small:
    fontFamily: "Tinos, Times New Roman, serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: "Pixelify Sans, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.35
rounded:
  none: "0px"
spacing:
  hair: "2px"
  bevel: "3px"
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "22px"
  touch: "44px"
components:
  button:
    backgroundColor: "{colors.window-gray}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 18px"
    height: "44px"
  button-pressed:
    backgroundColor: "{colors.window-gray}"
    textColor: "{colors.ink}"
    padding: "2px 16px 0 20px"
    height: "44px"
  button-primary:
    backgroundColor: "{colors.agate-red}"
    textColor: "{colors.on-agate}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 18px"
    height: "44px"
  input:
    backgroundColor: "{colors.field-gray}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0 12px"
    height: "46px"
  window:
    backgroundColor: "{colors.window-gray}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "3px"
  title-bar:
    backgroundColor: "{colors.title-navy}"
    textColor: "{colors.on-page}"
    typography: "{typography.window-title}"
    padding: "3px 4px 3px 8px"
    height: "30px"
  menubar-link:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "0 12px"
    height: "44px"
  menubar-link-hover:
    backgroundColor: "{colors.title-navy}"
    textColor: "{colors.on-page}"
  tag:
    backgroundColor: "{colors.tape-yellow}"
    textColor: "{colors.tape-ink}"
    typography: "{typography.tag}"
    rounded: "{rounded.none}"
    padding: "5px 7px"
  tag-matte:
    backgroundColor: "{colors.odometer-black}"
    textColor: "{colors.on-page}"
    typography: "{typography.tag}"
    padding: "5px 7px"
  odometer-digit:
    backgroundColor: "{colors.odometer-black}"
    textColor: "{colors.odometer-yellow}"
    typography: "{typography.odometer}"
    padding: "4px 2px"
    width: "16px"
  badge-88:
    typography: "{typography.tag}"
    rounded: "{rounded.none}"
    width: "132px"
    height: "46px"
  status-cell:
    textColor: "{colors.ink}"
    typography: "{typography.label-small}"
    padding: "6px 8px"
  ticker:
    backgroundColor: "{colors.odometer-black}"
    textColor: "{colors.odometer-yellow}"
    padding: "9px 0"
---

# Design System: Heavy Pockets Co.

## Overview

**Creative North Star: "The Webmaster's Beach"**

The site is Brian's own 1998-style home page: one beveled gray browser window resting on a tiled pixel beach of sand, slate, and rust pebbles. Inside the window, the page field is the old desktop teal, and every piece of content sits in its own small gray window with a navy title bar, as if Brian opened a few programs and arranged them by hand. It is honestly under construction, and the one thing that works perfectly is wetting a stone. The world refuses the rounded-card Shopify template and the tasteful modern AI site.

Density is that of a personal home page, not a storefront grid: windows stack in a main column with a sticky sidebar beside them, badges sit in a wall, and a ticker scrolls across the top. Everything is square, raised, or sunken. Depth comes only from two-pixel gray bevels, the way 1990s operating systems drew it. Color is loud only where the era was loud (title bars, caution tape, badges, odometers) and stays gray everywhere you read.

The humor carries the honesty. The page admits what it is not yet ("This store is under construction," "Price TBD," "SAMPLE stone, AI image," "This site belongs to zero webrings (so far)"), and those admissions are part of the look, not fine print. Night mode is the same window on a dark pixel beach at a deeper teal, and it is a full theme, not an afterthought.

**Key Characteristics:**
- One beveled browser window on a tiled pixel pebble beach (light) or dark pebble beach (night).
- Teal page field, gray content windows, navy-to-blue gradient title bars.
- Pixelify Sans for every heading, label, button, and number; Tinos (a Times-style serif) for reading.
- Square corners everywhere. Raised gray buttons that visibly press in.
- Lake Superior agate red appears on exactly one action: "Get first dibs."
- 1990s devices used straight: odometer digits, 88x31-style badges, caution tape, a ticker, hyperlink blue and visited purple.
- Honest labels (Concept, SAMPLE, Prints matte, not shiny) styled as yellow caution tags.

## Colors

A gray operating-system palette on a teal desktop, with period-correct primaries for chrome and one deep agate red for the action that matters.

### Primary
- **Lake Superior Agate Red** (agate-red): the one primary action, "Get first dibs," and nothing else interactive. It also fills the "Dry rocks lie" badge and the pebble that flies into the Pocket counter. Its lighter and deeper partners (agate-red-light, agate-red-deep) only draw that button's bevel; agate-red-light is also the flying pebble at night.

### Secondary
- **Title Bar Navy to Blue** (title-navy to title-blue): a left-to-right gradient on every window's title bar, the menu hover fill, and the text selection color. Navy is also the browser theme color.
- **Hyperlink Blue** (link-blue) and **Visited Purple** (visited-purple): plain underlined text links, kept exactly as the era drew them. Menu and footer links are the exception: they read as ink because they behave as buttons.

### Tertiary
- **Caution Tape Yellow** (tape-yellow) on **Tape Ink** (tape-ink): honesty tags (Concept, Sample text, Sample field note) and the diagonal stripes above and below the Under Construction band.
- **Odometer Black and Yellow** (odometer-black, odometer-yellow): counter digits, the ticker, and the banner tagline.
- **Lake Navy** (lake-navy): the water behind the pixel waves, under the banner and the band that holds the five finds.
- **Wordmark Orange** (wordmark-orange): the period in the pixel wordmark, and only there.
- **Badge set** (badge-water-blue, tape-yellow, agate-red, badge-terminal-green on black, badge-sand with badge-sand-ink, badge-purple): fixed fills for the 88x31-style badge wall. They do not change at night, because real badges were images.

### Neutral
- **Old Desktop Teal** (page-teal): the page field inside the browser window, and the fallback behind the pebble wallpaper. White (on-page) is the only text color placed directly on it.
- **Window Gray** (window-gray): every window, button, card, and the footer.
- **Ink** (ink) and **Soft Ink** (ink-soft): reading text and secondary text (meta lines, hints, small notes) on gray.
- **Bevel set** (bevel-light, bevel-light-inner, bevel-shade, bevel-dark): the four one-pixel lines that make a surface look raised or sunken.
- **Field Gray** (field-gray): sunken text fields, the address bar, and the field note card. In code it is the --field token, and the flying pocket pebble is --pebble.
- **Concept art colors** (sticker-ink #11163a, sticker-shade #9aa0b5, sticker-small #3a4170): used only inside the "Will brake for agates" bumper sticker concept. They belong to that artwork, not the interface, and should not appear in chrome or text.
- **Viewer Screen** (viewer-screen): the near-black screen behind every stone and every product concept, so stones read as lit specimens.

### Night theme
Night mode follows the visitor's system setting (prefers-color-scheme: dark) until they press the Day or Night switch in the menu bar; the switch sets data-theme on the page and is remembered on that device. It swaps the wallpaper to the dark pebble beach and replaces each light token with its night- partner: deep teal page (night-page-teal), charcoal windows (night-window-gray), light ink (night-ink, night-ink-soft), a darker bevel set, darker title bar navy and blue, lighter link blue and visited purple, a near-black field (night-field), and a deeper viewer screen. Agate red, tape yellow, odometers, lake navy, badges, and the wordmark stay the same in both themes. Every text pair in both themes measures at least 5:1 contrast.

### Named Rules
**The One Red Button Rule.** Agate red marks one action per page: "Get first dibs" now, and the add-to-cart or checkout action later. Everything else that can be pressed is a gray button.

**The Gray Is For Reading Rule.** Body text always sits on window gray or field gray, never directly on the teal, the wallpaper, or the water. Only short white lines (the tagline, the offer line) sit on color.

**The Orange Period Rule.** Wordmark orange lives only in the wordmark's period. It is not a second accent.

## Typography

**Display Font:** Pixelify Sans (with system-ui, sans-serif)
**Body Font:** Tinos (with Times New Roman, serif)

**Character:** A chunky pixel face for anything the operating system or the webmaster would label, paired with the default-looking Times serif that every 1990s home page used for its paragraphs. The pairing reads as a real old page, not a pastiche, because the serif is plain and the pixel face is used only where the era used system type.

### Hierarchy
- **Display** (700, clamp(26px, 3.2vw, 34px), 1.05): window headings such as "The first five finds" and "Get first dibs." The Under Construction heading runs slightly smaller (clamp(24px, 3vw, 32px)).
- **Headline** (700, clamp(18px, 2.6vw, 26px), 1.1): the banner tagline in odometer yellow with a hard two-pixel black drop.
- **Title** (700, 22px, 1.1): product names in the five finds. **Title small** (700, 19px, 1.15) names Field Guide stones.
- **Window title** (700, 15px, 1.1, 0.02em): title bar text, written like file names (shop.html, fieldnotes.txt).
- **Label** (500, 17px, 1): buttons, menu items, and footer links.
- **Label small** (400, 15px, 1.4): meta lines, the viewer hint, status cells, and small notes.
- **Tag** (700, 12px, 1, 0.06em): caution tags and badge top lines.
- **Odometer** (700, 16px, tabular figures): counter digits, 22px in the sidebar counters.
- **Caption** (400 or 700, 14px, 1.35): the Wet Stone status bar, Field Guide hints, and field note labels.
- **Body** (400, 18px, 1.5): paragraphs, capped at about 62ch. **Body small** (400, 16px) for footer text, lists, and the field note.

### Named Rules
**The No Ligatures Rule.** Ligatures and contextual alternates are off on the whole page (font-feature-settings "liga" 0, "clig" 0, "calt" 0, "dlig" 0) so the pixel face stays one glyph per letter.

**The System Voice Rule.** If a 1990s operating system would have drawn it (a button, a title bar, a menu, a counter, a status bar), it is Pixelify Sans. If Brian would have typed it as a paragraph, it is Tinos.

## Layout

The page is one browser window, at most 1180px wide and centered, with clamp(8px, 2.4vw, 32px) of beach showing around it. Inside the window, from top to bottom: the title bar, the menu bar (with the Pocket odometer pushed to the right), the address bar, then the teal page.

On desktop the page is a two-column grid: a flexible main column and a sidebar up to 340px wide, with gaps of clamp(12px, 1.8vw, 22px). The banner, ticker, footer, and pebble rule span both columns. The sidebar is sticky (16px from the top), sits on its own patch of pebble wallpaper inside a 2px black border, and holds Get first dibs first, then the counters, badges, and About the webmaster.

At 860px and below the grid becomes one column and the sidebar dissolves into the flow in story order: banner, ticker, Wet Stone Viewer, Under Construction, the five finds, Get first dibs, Field Notes, Field Guide, the rest of the sidebar, and the footer. Three menu items hide on phones (Shop, First dibs, and Pocket stay). At 640px Field Notes and the Field Guide go to one column; at 480px the five finds go to one column, the address bar hides, and the Under Construction band stacks.

Spacing is tight and pixel-literal: 2px and 3px for bevels and window padding, 4px and 8px inside chrome, 12px between cards, and 16px to 22px inside windows. Every tappable item is at least 44px tall.

## Elevation & Depth

Depth is drawn, not lit. Surfaces are flat colors with a four-line inset bevel: light on the top and left, dark on the bottom and right for raised; the reverse for sunken. There are no soft ambient shadows on content, and no blur.

### Shadow Vocabulary
- **Raised** (inset -1px -1px bevel-dark, inset 1px 1px bevel-light, inset -2px -2px bevel-shade, inset 2px 2px bevel-light-inner): windows, buttons, footer, and title bar controls.
- **Sunken** (the same four lines reversed): the viewer screen, status cells, product cards, the field note card, text fields, the address bar, and the ticker.
- **Pressed** (the sunken bevel plus a 2px shift of the label down and right): a button while held, or a toggle that is on.
- **Browser drop** (raised bevel plus 6px 10px 24px rgba(0,0,0,.35)): only the outer browser window, lifting it off the beach.
- **Pixel text drop** (2px 2px 0 black): the banner tagline and the "I lick rocks" type. This hard offset is native to 1990s pixel type and belongs to this world.

### Named Rules
**The Bevel Or Nothing Rule.** A surface is raised, sunken, or flat on color. Nothing floats, glows, or blurs. The single soft shadow is under the browser window itself.

**The Press Rule.** Every gray button visibly presses in: the bevel flips and the label shifts 2px. A toggle that is on (Pocket it, Wet it) stays pressed.

## Shapes

Every corner is square (0px). Edges come from bevels and from solid 2px black borders around the banner, ticker, water band, sidebar, and Under Construction band. Pixel art (the pebble wallpaper, waves, rockhound, wordmark, and pebble divider) is drawn on a square grid in code by scripts/retro_pixels.py and always rendered with crisp, unsmoothed pixels. The only soft shapes in the system are the stones themselves and the small pebble that flies to the Pocket counter.

## Components

### Buttons
Tactile, square, and a little clunky, like the real thing.
- **Shape:** square corners (0px), 44px tall, 18px side padding, label type, optional 16px pixel icon.
- **Default:** window gray with the raised bevel.
- **Pressed / On:** the sunken bevel with the label shifted 2px; on toggles also change their word ("Pocket it" becomes "In your pocket," "Wet it" becomes "Dry it").
- **Primary:** agate red with white bold label and its own red bevel. Used once ("Get first dibs").
- **Focus:** a 2px dotted outline in ink, 2px outside the element (white and inset on the dark viewer screen).

### Tags
- **Style:** caution yellow on tape ink, tag type, square, pinned to the top left of a product or stone image.
- **Matte tag:** black with white text, pinned bottom right of the sock concept: "Prints matte, not shiny."
- **Inline:** the same tag set inline before text ("Sample text").

### Cards / Containers
- **Windows:** window gray, raised bevel, 3px padding, a title bar on top, body padding clamp(14px, 2vw, 22px).
- **Product cards (the five finds):** sunken gray cards, 10px padding, an image area on the viewer screen at 4:3, then the name, a meta line, and a gray Pocket it button. The chart tee spans the full row.
- **Field note card:** field gray, sunken, an italic Tinos line under a short definition list with pixel labels.
- **Internal padding:** 10px to 22px.

### Inputs / Fields
- **Style:** field gray (night field at night), sunken bevel, square, 46px tall, 12px padding, body type.
- **Placeholder:** soft ink at full opacity.
- **Focus:** the dotted ink outline.
- **Messages:** a bold status line under the form, announced to screen readers. The prototype states plainly that nothing is saved.

### Navigation
- **Menu bar:** label type in ink, 44px tall items, no underline. Hover fills title navy with white text. The Pocket link sits at the far right with an odometer.
- **Footer:** the same items as plain links in a raised gray footer, plus the webring line and the last-updated line.

### Wet Stone Viewer (signature)
A small program window: a toolbar with a "Wet it" button and a hint, a sunken near-black screen (2:1 on desktop, 5:4 on phones) holding a dry and a wet image of the same stone, and a three-cell status bar ("Dry rocks lie." / "SAMPLE stone, AI image" / a live hint). Mouse hover previews the wet look; tap, click, Enter, or Space toggles it and it stays. Water spreads from the touch point in about 1100ms (with the shared ease-out curve) and dries back in about 1600ms. With reduced motion it switches instantly. The same control drives the smaller Field Guide stones (5:4 screens).

### Odometer and Badges
- **Odometer:** black cells with yellow tabular digits, padded to three digits (000). They count only real actions on the page: designs pocketed and stones wetted.
- **88x31-style badges:** 132 by 46px, 2px black border, a light inner top-left line and dark inner bottom-right line, two lines of pixel type. Six fixed colors, set in a two-column wall.

### Ticker and Under Construction band
- **Ticker:** black strip, yellow pixel type, pebble glyph separators, scrolling left at a steady 34 seconds per loop; it pauses on hover or focus and becomes a static centered line with reduced motion.
- **Under Construction band:** window gray with 14px caution-tape stripes top and bottom, the pixel rockhound, and a plain sentence about when things go on sale.

## Do's and Don'ts

### Do:
- **Do** label every stone SAMPLE (or "Sample text") until Brian approves its image and its facts.
- **Do** keep product images no better looking than the real print, and say so where it matters (the sock concept carries "Prints matte, not shiny").
- **Do** call concept art a concept ("Concept art, not a product photo," "AI concept image") and keep "Price TBD" until real prices exist.
- **Do** make every counter count something real on the page, starting at 000.
- **Do** give every new section its own gray window with a title bar written like a file name.
- **Do** design night mode at the same time as day mode, using the night- tokens, and check both.
- **Do** keep every tappable item at least 44px tall and give a non-animated fallback for every motion.
- **Do** render pixel art with crisp pixels and draw it in code from scripts/retro_pixels.py.

### Don't:
- **Don't** use agate red for anything clickable except the one primary action.
- **Don't** round corners, add soft drop shadows, glows, or blur to content.
- **Don't** invent claims, reviews, sales, visitor counts, or fake urgency; no hit counter that does not count something real, and no pop-ups.
- **Don't** put body text directly on the teal, the wallpaper, or the water.
- **Don't** use wordmark orange anywhere but the wordmark's period.
- **Don't** add a guestbook, a webring, or other 1990s furniture that pretends to work when it does not.
- **Don't** trace or copy other sites' pixel art, badges, or GIFs; every pixel is original.
- **Don't** use the pixel wordmark on merch or social. The Loaded letters vector logo in site/prototype/assets/logo/ stays the logo there; the pixel wordmark is the website banner.
- **Don't** use em dashes in any copy, and always use the Oxford comma.
