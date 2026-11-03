"""Draw the retro direction's pixel art as SVG files, all in code.

Run from the repo root:  python3 scripts/retro_pixels.py
Writes into site/prototype/directions/retro/:
  pebbles-day.svg    tiled beach wallpaper (sand with pebbles)
  pebbles-night.svg  the same beach at night
  waves.svg          Lake Superior waves for the banner (tiles sideways)
  rockhound.svg      a two-frame rockhound, head down, picking up a stone
  wordmark.svg       "Heavy Pockets Co." in hand-placed pixel letters (orange period)
  pebble-glyph.svg   a tiny pebble used between ticker items
Nothing here is traced or copied; every pixel is placed by this script.
"""
import pathlib
import random

OUT = pathlib.Path(__file__).resolve().parent.parent / "site" / "prototype" / "directions" / "retro"
OUT.mkdir(parents=True, exist_ok=True)


def svg(w, h, scale, pixels, extra=""):
    """pixels: list of (x, y, color). One <rect> per pixel, merged per row run."""
    rows = {}
    for x, y, c in pixels:
        rows.setdefault((y, c), []).append(x)
    rects = []
    for (y, c), xs in rows.items():
        xs.sort()
        start = prev = xs[0]
        for x in xs[1:] + [None]:
            if x is not None and x == prev + 1:
                prev = x
                continue
            rects.append(f'<rect x="{start}" y="{y}" width="{prev - start + 1}" height="1" fill="{c}"/>')
            if x is not None:
                start = prev = x
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w * scale}" height="{h * scale}" '
            f'viewBox="0 0 {w} {h}" shape-rendering="crispEdges">{extra}{"".join(rects)}</svg>')


def beach(night=False, seed=7):
    rnd = random.Random(seed)
    W = H = 40
    if night:
        base, speck = "#1a2140", "#232b52"
        stones = [("#4b5470", "#6a7392", "#323a55"), ("#6b3a2e", "#8a5040", "#4a281f"),
                  ("#5d6a63", "#7c8a82", "#3f4944"), ("#3a3f5c", "#545a7c", "#272b40")]
    else:
        base, speck = "#e6d6b2", "#d5c196"
        stones = [("#8c939b", "#b2b8bf", "#5f656c"), ("#b5522f", "#d27a52", "#7e3519"),
                  ("#efe7d3", "#ffffff", "#c9bea3"), ("#55585f", "#7a7e86", "#36383d"),
                  ("#7a8f86", "#9fb3aa", "#56675f"), ("#c98a3a", "#e3ab5f", "#8f5d1f")]
    grid = {(x, y): base for x in range(W) for y in range(H)}
    for _ in range(90):
        grid[(rnd.randrange(W), rnd.randrange(H))] = speck
    taken = set()
    placed = 0
    tries = 0
    while placed < 9 and tries < 500:
        tries += 1
        rx, ry = rnd.randint(2, 4), rnd.randint(2, 3)
        cx, cy = rnd.randint(0, W - 1), rnd.randint(0, H - 1)
        cells = []
        for dx in range(-rx, rx + 1):
            for dy in range(-ry, ry + 1):
                if (dx / (rx + .5)) ** 2 + (dy / (ry + .5)) ** 2 <= 1:
                    cells.append(((cx + dx) % W, (cy + dy) % H, dx, dy))
        halo = {((x + ax) % W, (y + ay) % H) for x, y, _, _ in cells for ax in (-1, 0, 1) for ay in (-1, 0, 1)}
        if halo & taken:
            continue
        taken |= {(x, y) for x, y, _, _ in cells}
        body, light, dark = rnd.choice(stones)
        banded = not night and body == "#b5522f" and rnd.random() < .8
        for x, y, dx, dy in cells:
            c = body
            if dy >= ry - 0 and dy > 0:
                c = dark
            elif dx <= -rx + 1 and dy <= -ry + 1:
                c = light
            elif banded and (dx + dy) % 3 == 0:
                c = "#efe0c8"
            grid[(x, y)] = c
        # soft shadow under the stone
        for x, y, dx, dy in cells:
            if dy == ry or (dy == ry - 1 and abs(dx) == rx):
                sx, sy = (x + 1) % W, (y + 1) % H
                if (sx, sy) not in taken:
                    grid[(sx, sy)] = "#11162e" if night else "#c4ad80"
        placed += 1
    if night:
        for _ in range(6):
            x, y = rnd.randrange(W), rnd.randrange(H)
            if (x, y) not in taken:
                grid[(x, y)] = "#f4e7a1"
    return svg(W, H, 4, [(x, y, c) for (x, y), c in grid.items()])


def waves():
    W, H = 32, 28
    deep, mid, crest, foam, sand = "#16336b", "#2552a0", "#4a7fd0", "#e9f2ff", "#e6d6b2"
    px = []
    for x in range(W):
        for y in range(H):
            c = deep
            # three rows of rolling crests, offset for depth
            for row, (y0, shift) in enumerate([(5, 0), (12, 8), (19, 16)]):
                k = (x + shift) % 16
                hump = [2, 1, 1, 0, 0, 0, 1, 1, 2, 3, 3, 3, 3, 3, 3, 2][k]
                if y == y0 + hump:
                    c = foam if k in (3, 4, 5) else crest
                elif y0 + hump < y <= y0 + hump + 2:
                    c = mid
            if y >= 24:
                c = sand if (x + y) % 5 else "#d5c196"
            if y == 23 and x % 4 in (0, 1):
                c = foam
            px.append((x, y, c))
    return svg(W, H, 4, px)


ROCKHOUND = [
    # frame 1: walking the shoreline, head down
    """
    ................
    .......hhh......
    ......hhhhh.....
    .....hhhhhhh....
    .......sss......
    ......jjjjs.....
    .....jjjjjj.....
    ....jjjjjjj.....
    ....jjjjjjjs....
    ....jj.jjj.k....
    ....jj.jjj.kk...
    ....ss.ppp.kk...
    .......ppp......
    ......pp.pp.....
    ......pp.pp.....
    ......pp.pp.....
    .....bbb.bbb....
    """,
    # frame 2: bending to pick up a stone
    """
    ................
    ................
    ................
    ................
    ........hhh.....
    .......hhhhh....
    ......hhhhhhh...
    ....jjjjsss.....
    ...jjjjjjj......
    ...jjjjjjjj.....
    ...jj.ppp.js....
    ...k..ppp..s....
    ..kk..ppp..r....
    ..kk.pp.pp......
    .....pp.pp......
    .....pp.pp......
    ....bbb.bbb.....
    """,
]
PALETTE = {"h": "#c0392b", "s": "#e2b48d", "j": "#2f5d8a", "p": "#3d3d44", "b": "#4a2f1b",
           "k": "#d9a521", "r": "#b5522f"}


def rockhound():
    frames = []
    for i, art in enumerate(ROCKHOUND):
        rows = [r.strip() for r in art.strip().splitlines()]
        px = [(x, y, PALETTE[ch]) for y, row in enumerate(rows) for x, ch in enumerate(row) if ch != "."]
        body = svg(16, 17, 1, px)
        inner = body[body.index(">") + 1:-len("</svg>")]
        frames.append(f'<g class="f{i + 1}">{inner}</g>')
    style = ("<style>.f2{opacity:0}@media (prefers-reduced-motion:no-preference)"
             "{.f1{animation:a 1.6s steps(1) infinite}.f2{animation:b 1.6s steps(1) infinite}}"
             "@keyframes a{50%{opacity:0}}@keyframes b{50%{opacity:1}}</style>")
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="96" height="102" viewBox="0 0 16 17" '
            f'shape-rendering="crispEdges">{style}{"".join(frames)}</svg>')


(OUT / "pebbles-day.svg").write_text(beach())
(OUT / "pebbles-night.svg").write_text(beach(night=True, seed=11))
(OUT / "waves.svg").write_text(waves())
(OUT / "rockhound.svg").write_text(rockhound())
print("wrote", ", ".join(sorted(p.name for p in OUT.iterdir())))


# ---------- pixel wordmark: "Heavy Pockets Co." on its own grid ----------
# Rows 0-6 are cap height (baseline under row 6); rows 7-8 hold the descender.
# Lowercase sits on rows 2-6. X is ink. Drawn by hand for this brand, no font used.
GLYPHS = {
    "H": (0, ["XX..XX", "XX..XX", "XX..XX", "XXXXXX", "XX..XX", "XX..XX", "XX..XX"]),
    "P": (0, ["XXXXX.", "XX..XX", "XX..XX", "XXXXX.", "XX....", "XX....", "XX...."]),
    "C": (0, [".XXXX.", "XX..XX", "XX....", "XX....", "XX....", "XX..XX", ".XXXX."]),
    "e": (2, [".XXXX.", "XX..XX", "XXXXXX", "XX....", ".XXXX."]),
    "a": (2, [".XXXX.", "....XX", ".XXXXX", "XX..XX", ".XXXXX"]),
    "v": (2, ["XX..XX", "XX..XX", "XX..XX", ".XXXX.", "..XX.."]),
    "y": (2, ["XX..XX", "XX..XX", "XX..XX", "XX..XX", ".XXXXX", "....XX", "XXXXX."]),
    "o": (2, [".XXXX.", "XX..XX", "XX..XX", "XX..XX", ".XXXX."]),
    "c": (2, [".XXXX.", "XX..XX", "XX....", "XX..XX", ".XXXX."]),
    "k": (0, ["XX....", "XX....", "XX..XX", "XX.XX.", "XXXX..", "XX.XX.", "XX..XX"]),
    "t": (0, [".XX..", ".XX..", "XXXXX", ".XX..", ".XX..", ".XX..", "..XXX"]),
    "s": (2, [".XXXXX", "XX....", ".XXXX.", "....XX", "XXXXX."]),
    ".": (5, ["XX", "XX"]),
}


def wordmark(text="Heavy Pockets Co.", ink="#ffffff", shadow="#000000", dot="#ff6a1a"):
    x, cells = 1, []
    for ch in text:
        if ch == " ":
            x += 3
            continue
        top, rows = GLYPHS[ch]
        for dy, row in enumerate(rows):
            for dx, c in enumerate(row):
                if c == "X":
                    cells.append((x + dx, top + dy + 1, dot if ch == "." else ink))
        x += len(rows[0]) + 1
    W, H = x + 1, 11
    shade = [(cx + 1, cy + 1, shadow) for cx, cy, _ in cells]
    keep = {(cx, cy) for cx, cy, _ in cells}
    shade = [p for p in shade if (p[0], p[1]) not in keep]
    return svg(W, H, 8, shade + cells)


def pebble_glyph():
    rows = ["..XXXX..", ".XXXXXX.", "XXOXXXXX", "XXXXXXXX", ".XXXXXX.", "..XXXX.."]
    px = [(x, y, "#ffe14d" if c == "X" else "#fff6b8") for y, r in enumerate(rows) for x, c in enumerate(r) if c != "."]
    return svg(8, 6, 2, px)


(OUT / "wordmark.svg").write_text(wordmark())
(OUT / "pebble-glyph.svg").write_text(pebble_glyph())
print("wrote wordmark.svg and pebble-glyph.svg")
