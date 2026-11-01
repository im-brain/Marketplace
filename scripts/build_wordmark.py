"""Build the Heavy Pockets Co. wordmark as SVG outlines and PNG exports.

Run: python3 scripts/build_wordmark.py

What it does, in plain terms:
1. Reads the Fraunces font file in brand/fonts.
2. Turns each letter into a vector shape (an "outline"), using the font's own
   spacing and kerning. The logo then never needs the font installed.
3. Adds the "lick": one swipe where the letters turn from dry to wet color,
   plus a thin gloss line. It is the brand idea in one mark.
4. Writes SVGs to brand/wordmark/ and 300 dpi PNGs to brand/wordmark/png/.

Needs: pip install fonttools uharfbuzz cairosvg
"""

from pathlib import Path

import cairosvg
import uharfbuzz as hb
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
FONT = ROOT / "brand/fonts/Fraunces-ExtraBold-Soft0.ttf"
OUT = ROOT / "brand/wordmark"

# Palette (keep in sync with theme/brand-tokens.css and brand/Brand_Guide.md)
SLATE_DRY, SLATE_WET = "#6B7780", "#22394A"
AGATE_WET = "#9A2B1C"
SAND_DRY, SAND_WET = "#DCCFB6", "#A8875A"
FOG, INK, NIGHT = "#EEEDE8", "#1C1E1F", "#14181B"

font = TTFont(FONT)
glyph_set = font.getGlyphSet()
UPM = font["head"].unitsPerEm
blob = hb.Blob(FONT.read_bytes())
hb_font = hb.Font(hb.Face(blob))


def shape(text, size, x0, baseline, tracking=0):
    """Return (svg path data, advance width) for one line of text."""
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(hb_font, buf, {"kern": True, "liga": True})
    scale = size / UPM
    pen = SVGPathPen(glyph_set)
    x = 0
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        name = font.getGlyphName(info.codepoint)
        # Font units point up; SVG points down, so flip y.
        t = (scale, 0, 0, -scale, x0 + (x + pos.x_offset) * scale, baseline)
        glyph_set[name].draw(TransformPen(pen, t))
        x += pos.x_advance + tracking
    return pen.getCommands(), (x - tracking) * scale


def swipe(x1, y1, x2, y2, width):
    """A lick: a rounded streak from (x1, y1) to (x2, y2), like a tongue swipe."""
    dx, dy = x2 - x1, y2 - y1
    length = (dx * dx + dy * dy) ** 0.5
    nx, ny = -dy / length * width / 2, dx / length * width / 2
    r = width / 2
    return (
        f"M{x1 + nx:.1f},{y1 + ny:.1f} L{x2 + nx:.1f},{y2 + ny:.1f} "
        f"A{r:.1f},{r:.1f} 0 0 0 {x2 - nx:.1f},{y2 - ny:.1f} "
        f"L{x1 - nx:.1f},{y1 - ny:.1f} "
        f"A{r:.1f},{r:.1f} 0 0 0 {x1 + nx:.1f},{y1 + ny:.1f}Z"
    )


def gloss(x1, y1, x2, y2, width):
    """The thin highlight inside the streak, like light on wet stone."""
    dx, dy = x2 - x1, y2 - y1
    length = (dx * dx + dy * dy) ** 0.5
    ox, oy = dy / length * width * 0.22, -dx / length * width * 0.22
    return (
        f"M{x1 + dx * 0.15 + ox:.1f},{y1 + dy * 0.15 + oy:.1f} "
        f"L{x1 + dx * 0.55 + ox:.1f},{y1 + dy * 0.55 + oy:.1f}"
    )


def svg(view_w, view_h, body):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {view_w:.0f} {view_h:.0f}" '
        f'width="{view_w:.0f}" height="{view_h:.0f}">\n{body}\n</svg>\n'
    )


def lick_group(uid, letters, dry, wet, swipe_d, gloss_d, gloss_w):
    """Letters in dry color, the swipe area in wet color, and a gloss line."""
    return f"""<defs>
  <clipPath id="{uid}-letters"><path d="{letters}"/></clipPath>
  <clipPath id="{uid}-swipe"><path d="{swipe_d}"/></clipPath>
</defs>
<path d="{letters}" fill="{dry}"/>
<g clip-path="url(#{uid}-letters)">
  <path d="{swipe_d}" fill="{wet}"/>
  <path d="{gloss_d}" fill="none" stroke="#FFFFFF" stroke-opacity="0.55"
        stroke-width="{gloss_w:.1f}" stroke-linecap="round" clip-path="url(#{uid}-swipe)"/>
</g>"""


def lick_over(x_left, baseline, size):
    """Place the streak: from low left of the "o" to high right of the "c"."""
    x1, y1 = x_left + size * 0.06, baseline - size * 0.12
    x2, y2 = x_left + size * 0.78, baseline - size * 0.46
    w = size * 0.2
    return swipe(x1, y1, x2, y2, w), gloss(x1, y1, x2, y2, w), size * 0.035


def build_primary():
    """One line: Heavy Pockets Co."""
    size, pad = 200, 40
    base = pad + size * 0.78
    heavy, w1 = shape("Heavy Pockets", size, pad, base)
    co, w2 = shape("Co.", size * 0.62, pad + w1 + size * 0.12, base)
    width = pad * 2 + w1 + size * 0.12 + w2
    height = pad * 2 + size * 0.98
    # The lick lands on "oc" in Pockets, the middle of the mark.
    _, before = shape("Heavy P", size, 0, 0)
    sw, gl, gw = lick_over(pad + before, base, size)
    return width, height, heavy + " " + co, sw, gl, gw


def build_stacked():
    """Two lines, left aligned: Heavy / Pockets Co. For hats and square spaces."""
    size, pad, lead = 200, 40, 0.86
    b1 = pad + size * 0.74
    b2 = b1 + size * lead
    p1, w1 = shape("Heavy", size, pad, b1)
    p2, pw = shape("Pockets", size, pad, b2)
    p3, w3 = shape("Co.", size * 0.62, pad + pw + size * 0.1, b2)
    width = pad * 2 + max(w1, pw + size * 0.1 + w3)
    height = b2 + size * 0.26 + pad
    _, before = shape("P", size, 0, 0)
    sw, gl, gw = lick_over(pad + before, b2, size)
    return width, height, f"{p1} {p2} {p3}", sw, gl, gw


def build_mark():
    """Small mark: HP. For sleeve tags, sock cuffs, and the hat side."""
    size, pad = 300, 40
    base = pad + size * 0.74
    hp, w = shape("HP", size, pad, base)
    width, height = pad * 2 + w, pad * 2 + size * 0.76
    # The streak crosses the bowl of the P.
    _, before = shape("H", size, 0, 0)
    x1, y1 = pad + before + size * 0.12, base - size * 0.3
    x2, y2 = pad + before + size * 0.52, base - size * 0.62
    sw_w = size * 0.2
    return width, height, hp, swipe(x1, y1, x2, y2, sw_w), gloss(x1, y1, x2, y2, sw_w), size * 0.035


# Color versions: (file suffix, dry letters, wet lick, background or None)
VERSIONS = [
    ("slate-on-light", SLATE_DRY, SLATE_WET, None),
    ("agate-on-light", SLATE_WET, AGATE_WET, None),
    ("sand-on-dark", SAND_DRY, SAND_WET, None),
    ("ink", INK, INK, None),        # one color: no lick, for one-ink printing
    ("white", "#FFFFFF", "#FFFFFF", None),
]


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "png").mkdir(exist_ok=True)
    for name, builder in [("primary", build_primary), ("stacked", build_stacked), ("mark", build_mark)]:
        w, h, letters, sw, gl, gw = builder()
        for suffix, dry, wet, _ in VERSIONS:
            uid = f"{name}-{suffix}"
            if dry == wet:
                body = f'<path d="{letters}" fill="{dry}"/>'
            else:
                body = lick_group(uid, letters, dry, wet, sw, gl, gw)
            doc = svg(w, h, body)
            path = OUT / f"hp-{name}-{suffix}.svg"
            path.write_text(doc)
            # 300 dpi export, 12 inches wide for primary, 6 for others.
            inches = 12 if name == "primary" else 6
            cairosvg.svg2png(
                bytestring=doc.encode(),
                write_to=str(OUT / "png" / f"hp-{name}-{suffix}.png"),
                output_width=int(inches * 300),
            )
            print("wrote", path.relative_to(ROOT))


if __name__ == "__main__":
    main()
