"""Trace the approved wordmark (option A, "Warm & human") into provisional SVGs.

Source: brand/v3/wordmark/source/wordmark-comparison-board.png (the comparison
board Brian approved option A from, Nov 7, 2026). Only the top row (option A)
is traced; the A/B labels and option B are never used.

Method: crop option A, upscale 4x (Lanczos), measure each pixel's position on
the teal-to-cream axis, blur slightly to ignore paper texture, threshold at the
midpoint, then fit curves with potrace (pip package `potracer`).

Outputs (brand/v3/wordmark/):
  heavy-pockets-wordmark.svg        single color, fill="currentColor" (master)
  heavy-pockets-wordmark-cream.svg  Warm Cream #F3E8D2, for dark surfaces
  heavy-pockets-wordmark-teal.svg   Deep Teal #164745, for light surfaces
  heavy-pockets-wordmark-teal-rust.svg  secondary: "heavy" teal, "pockets" rust
  qa/                               mask, render diff, and numbers

Run: python3 scripts/trace_wordmark.py
This is a PROVISIONAL trace of a raster mockup, not finished production art.
"""
import json
import os
import sys

import numpy as np
import potrace
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "brand/v3/wordmark/source/wordmark-comparison-board.png")
OUT = os.path.join(ROOT, "brand/v3/wordmark")
CROP = (140, 220, 1420, 450)  # option A only, in source pixels
S = 4  # upscale factor
TEAL_SRC = np.array([16, 72, 82])
CREAM_SRC = np.array([243, 230, 208])
COLORS = {"cream": "#F3E8D2", "teal": "#164745", "rust": "#A7472D"}


def build_mask():
    im = Image.open(SRC).convert("RGB").crop(CROP)
    im = im.resize((im.width * S, im.height * S), Image.LANCZOS)
    a = np.asarray(im).astype(float)
    ax = CREAM_SRC - TEAL_SRC
    t = ((a - TEAL_SRC) @ ax) / (ax @ ax)  # 0 = teal ink, 1 = cream paper
    g = Image.fromarray(np.clip(t * 255, 0, 255).astype("uint8")).filter(ImageFilter.GaussianBlur(3))
    return np.asarray(g) < 128  # True = ink


# Brian, Nov 7, 2026: separate the "v" and "y", which touch at the top in the
# source art. The bridge sits above the notch between them at crop x ~445 (1x).
SPLIT_VY = True
VY_APEX_X = 445   # 1x crop px; refined to the true notch apex below
VY_GAP = 9        # 1x px, about the space between the other letters
ROUND = 7         # 1x px corner rounding for the two new stroke ends


def split_vy(mask):
    """Cut the v/y bridge and round the new ends. Returns a new mask."""
    m = mask.copy()
    # find the notch apex: the column whose inner gap starts highest
    best = None
    for x in range((VY_APEX_X - 25) * S, (VY_APEX_X + 25) * S):
        col = m[:, x]
        ys = np.where(col)[0]
        if not len(ys):
            continue
        below = np.where(~col[ys[0]:])[0]
        if not len(below):
            continue
        gap = ys[0] + below[0]
        if not np.where(col[gap:])[0].size:
            continue
        if best is None or gap < best[1]:
            best = (x, gap)
    ax, gap = best
    half = VY_GAP * S // 2
    # cut down only until the natural notch is already as wide as the gap,
    # so the cut edges run straight into the existing diagonal edges (no ledge)
    y_end = gap
    for y in range(gap, m.shape[0]):
        row = m[y]
        l = ax
        while l > 0 and not row[l - 1]:
            l -= 1
        r_ = ax
        while r_ < m.shape[1] - 1 and not row[r_ + 1]:
            r_ += 1
        if r_ - l + 1 >= 2 * half:
            y_end = y
            break
    m[: y_end + 1, ax - half: ax + half] = False
    # round only the freshly cut corners: blur + threshold inside a small window
    r = ROUND * S
    y0, y1 = 0, y_end + 6 * S
    x0, x1 = ax - half - 3 * r, ax + half + 3 * r
    win = Image.fromarray((m[y0:y1, x0:x1] * 255).astype("uint8")).filter(ImageFilter.GaussianBlur(r / 2))
    rounded = np.asarray(win) >= 128
    # keep the original outline away from the cut; only allow removing ink near it
    m[y0:y1, x0:x1] &= rounded | (np.abs(np.arange(x0, x1) - ax)[None, :] > half + 2 * r)
    return m, (ax / S, gap / S)


def trace(mask):
    # potracer traces values below blacklevel, so pass ink as 0
    bm = potrace.Bitmap(~mask)
    return bm.trace(turdsize=200, turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY,
                    alphamax=1.0, opticurve=True, opttolerance=0.2)


def main():
    mask = build_mask()
    cut = None
    if SPLIT_VY:
        mask, cut = split_vy(mask)
    curves = trace(mask)
    ys, xs = np.where(mask)
    pad = 8 * S
    ox, oy = xs.min() - pad, ys.min() - pad
    w = (xs.max() - xs.min() + 2 * pad) / S
    h = (ys.max() - ys.min() + 2 * pad) / S

    def pt(p):
        return f"{(p.x - ox) / S:.1f} {(p.y - oy) / S:.1f}"

    subpaths = []
    for c in curves:
        d = [f"M{pt(c.start_point)}"]
        for seg in c.segments:
            if seg.is_corner:
                d.append(f"L{pt(seg.c)}L{pt(seg.end_point)}")
            else:
                d.append(f"C{pt(seg.c1)} {pt(seg.c2)} {pt(seg.end_point)}")
        d.append("Z")
        subpaths.append(((c.start_point.x - ox) / S, "".join(d)))

    # the word space sits between "y" (ends ~x 530) and "p" (starts ~x 575)
    split = 552
    heavy = "".join(d for x, d in subpaths if x < split)
    pockets = "".join(d for x, d in subpaths if x >= split)
    allp = heavy + pockets
    vb = f'viewBox="0 0 {w:.0f} {h:.0f}"'
    head = f'<svg xmlns="http://www.w3.org/2000/svg" {vb} role="img" aria-label="heavy pockets">'

    def one(fill):
        return f'{head}<path fill="{fill}" fill-rule="evenodd" d="{allp}"/></svg>\n'

    files = {
        "heavy-pockets-wordmark.svg": one("currentColor"),
        "heavy-pockets-wordmark-cream.svg": one(COLORS["cream"]),
        "heavy-pockets-wordmark-teal.svg": one(COLORS["teal"]),
        "heavy-pockets-wordmark-teal-rust.svg": (
            f'{head}<path fill="{COLORS["teal"]}" fill-rule="evenodd" d="{heavy}"/>'
            f'<path fill="{COLORS["rust"]}" fill-rule="evenodd" d="{pockets}"/></svg>\n'),
    }
    for name, svg in files.items():
        with open(os.path.join(OUT, name), "w") as f:
            f.write(svg)
    os.makedirs(os.path.join(OUT, "qa"), exist_ok=True)
    Image.fromarray(np.where(mask, 0, 255).astype("uint8")).save(os.path.join(OUT, "qa/trace-mask-4x.png"))
    info = {"contours": len(curves), "viewBox": [round(w), round(h)], "vy_cut_at": cut,
            "heavy_contours": sum(1 for x, _ in subpaths if x < split),
            "pockets_contours": sum(1 for x, _ in subpaths if x >= split)}
    print(json.dumps(info))


if __name__ == "__main__":
    sys.exit(main())
