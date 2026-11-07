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
from PIL import Image, ImageDraw, ImageFilter

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
# source art. A straight cut left flat-sided ends, so instead the two joined
# arms are REBUILT from the font's own terminals:
#   - the y's left arm gets the v's left-arm top (same slant),
#   - the v's right arm gets the y's right-arm top (same slant),
# and the "y" plus "pockets" move right just enough that the new gap matches
# the gap between "a" and "v". Every corner then comes from the source art.
SPLIT_VY = True
VY_CUT_BELOW_APEX = 14   # 1x px below the bridge where the arms are clean


def _runs(row):
    d = np.diff(np.concatenate([[0], row.astype(np.int8), [0]]))
    return list(zip(np.where(d == 1)[0], np.where(d == -1)[0] - 1))


def _component(mask, seed):
    im = Image.fromarray((mask * 255).astype("uint8")).copy()  # fill is ignored on array-backed images
    ImageDraw.floodfill(im, seed, 128)
    return np.asarray(im) == 128


def split_vy(mask):
    """Return (new_mask, info). new_mask may be wider (the kern)."""
    m = mask
    H, W = m.shape
    x0, x1 = 330 * S, 560 * S
    # notch apex = bottom of the bridge, near crop x 445
    best = None
    for x in range(420 * S, 470 * S):
        col = m[:, x]
        c = np.where(col)[0]
        if not len(c):
            continue
        below = np.where(~col[c[0]:])[0]
        if not len(below):
            continue
        g = c[0] + below[0]
        if np.where(col[g:])[0].size and (best is None or g < best[1]):
            best = (x, g)
    apex = best[1]
    y_cut = apex + VY_CUT_BELOW_APEX * S
    first = _runs(m[y_cut, 340 * S: x1])[0]
    vy = _component(m, (340 * S + int((first[0] + first[1]) / 2), y_cut))
    y_top = np.where(vy.any(axis=1))[0][0]

    def rr(y):
        return [(a + x0, b + x0) for a, b in _runs(vy[y, x0:x1])]

    r_cut = rr(y_cut)
    assert len(r_cut) >= 4, "v and y arms not separate at the cut row"
    v_right, y_left = r_cut[1], r_cut[2]
    tA = {y: rr(y)[0] for y in range(y_top, y_cut + 1) if rr(y)}   # v left arm
    tB = {y: rr(y)[-1] for y in range(y_top, y_cut + 1) if rr(y)}  # y right arm
    mid = lambda r: (r[0] + r[1]) / 2
    dA = mid(y_left) - mid(tA[y_cut])
    dB = mid(v_right) - mid(tB[y_cut])
    min_gap = min((tA[y][0] + dA) - (tB[y][1] + dB) - 1 for y in tA if y in tB)
    av = []  # gap between "a" and "v" at their closest, in the same rows
    for y in range(y_top, y_cut + 1):
        r2 = _runs(m[y, 230 * S: 345 * S])
        if len(r2) >= 2:
            av.append(r2[-1][0] - r2[-2][1] - 1)
    target = min(av)
    k = int(max(0, np.ceil(target - min_gap)))
    # remove the joined arms in the band, then split into v and y
    m2 = m.copy()
    for y in range(y_top, y_cut + 1):
        a, b = tA[y][1] + 1, tB[y][0]
        m2[y, a:b] &= ~vy[y, a:b]
    v = _component(m2, (int(mid(tA[y_cut])), y_cut))
    yy = m2 & vy & ~v
    rest = m2 & ~vy
    pockets = rest.copy()
    pockets[:, :500 * S] = False
    out = np.zeros((H, W + k), bool)
    out[:, :W] |= (rest & ~pockets) | v
    out[:, k:] |= yy | pockets
    for y in range(y_top, y_cut + 1):
        a, b = tA[y]
        out[y, int(round(a + dA + k)): int(round(b + dA + k)) + 1] = True
        a, b = tB[y]
        out[y, int(round(a + dB)): int(round(b + dB)) + 1] = True
    # soften the joins where the rebuilt tops meet the original arms
    s0, s1 = y_cut - 4 * S, y_cut + 4 * S
    xa, xb = int(v_right[0] - 6 * S), int(y_left[1] + k + 6 * S)
    win = Image.fromarray((out[s0:s1, xa:xb] * 255).astype("uint8")).filter(ImageFilter.GaussianBlur(2 * S))
    out[s0:s1, xa:xb] = np.asarray(win) >= 128
    return out, {"kern_px": round(k / S, 2), "gap_px": round(target / S, 2)}


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
    info = {"contours": len(curves), "viewBox": [round(w), round(h)], "vy_split": cut,
            "heavy_contours": sum(1 for x, _ in subpaths if x < split),
            "pockets_contours": sum(1 for x, _ in subpaths if x >= split)}
    print(json.dumps(info))


if __name__ == "__main__":
    sys.exit(main())
