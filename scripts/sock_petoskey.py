"""Draw an original Petoskey stone pattern for all-over-print socks.

What it draws: a Petoskey stone is fossil Hexagonaria coral. Seen polished or
wet, it shows six-sided cells packed together. Each cell has a dark "eye" in
the middle and thin lines (septa) running from the eye out to the cell wall.

How it works, in plain language:
1. Scatter random points, then nudge them apart a few times (Lloyd
   relaxation) so the cells come out roughly six-sided, like the real coral.
2. Build Voronoi cells around the points. The math wraps around the edges, so
   the finished image tiles seamlessly (left edge meets right, top meets
   bottom).
3. Paint each cell: light wall, shaded body, dark eye, and radial lines.

Everything here is drawn by code, so the art is original.

Run it:
    python3 scripts/sock_petoskey.py --width 1200 --height 1200 --out designs/petoskey_preview.png
    python3 scripts/sock_petoskey.py --colorway slate --cell 140 --seed 7 --out designs/x.png

Needs: numpy, scipy, and pillow (pip install numpy scipy pillow).
"""

import argparse
import math
import random

import numpy as np
from PIL import Image, ImageDraw
from scipy.spatial import Voronoi

# Each colorway: wall, body (outer), body (inner, near the eye), eye, septa lines.
# "natural" is a wet Petoskey stone. The others use the brand kit palettes.
COLORWAYS = {
    "natural": ("#D3CAB9", "#968E82", "#5E574E", "#2A241F", "#E2DACB"),
    "slate": ("#E9E1CF", "#6E7A82", "#1F2D38", "#0F171D", "#E9E1CF"),
    "agate": ("#EFE5D4", "#C98A72", "#8E2E1C", "#33170F", "#F4EADB"),
    "lake": ("#EEF5F9", "#7FA9C6", "#1F3A4F", "#0D1B26", "#F4F9FC"),
}


def hex_to_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def mix(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def relaxed_points(n, w, h, rng, rounds=10):
    """Random points nudged toward the centers of their cells, on a wrapped plane."""
    pts = np.column_stack([rng.random(n) * w, rng.random(n) * h])
    for _ in range(rounds):
        cells = wrapped_cells(pts, w, h)
        new = []
        for i, poly in enumerate(cells):
            if poly is None:
                new.append(pts[i])
                continue
            c = poly.mean(axis=0)
            new.append([c[0] % w, c[1] % h])
        pts = np.array(new)
    return pts


def wrapped_cells(pts, w, h):
    """Voronoi cell polygons for each point, computed as if the image wraps around."""
    n = len(pts)
    tiles = []
    for dx in (-1, 0, 1):
        for dy in (-1, 0, 1):
            tiles.append(pts + np.array([dx * w, dy * h]))
    allpts = np.vstack(tiles)
    vor = Voronoi(allpts)
    center_start = 4 * n  # tile (0, 0) is the 5th of the 9 copies
    cells = []
    for i in range(n):
        region = vor.regions[vor.point_region[center_start + i]]
        if not region or -1 in region:
            cells.append(None)
            continue
        cells.append(vor.vertices[region])
    return cells


def scaled(poly, c, s):
    return [(c[0] + (x - c[0]) * s, c[1] + (y - c[1]) * s) for x, y in poly]


def paint_cell(draw, poly, colors, rng, scale):
    wall, body_out, body_in, eye, septa = colors
    c = poly.mean(axis=0)
    pts = [tuple(p) for p in poly]
    draw.polygon(pts, fill=wall)
    # Shaded body: insets from the wall toward the eye, lighter outside, darker inside.
    steps = 9
    for k in range(steps):
        t = k / (steps - 1)
        s = 0.86 - t * 0.56
        draw.polygon(scaled(pts, c, s), fill=mix(body_out, body_in, t ** 0.8))
    # Radial septa from the eye to the wall.
    inner = scaled(pts, c, 0.86)
    perim = []
    for j in range(len(inner)):
        a, b = inner[j], inner[(j + 1) % len(inner)]
        perim.append((a, b, math.dist(a, b)))
    total = sum(p[2] for p in perim)
    count = rng.randint(18, 26)
    off = rng.random()
    width = max(1, round(1.1 * scale))
    for m in range(count):
        d = ((m + off) / count) * total
        for a, b, L in perim:
            if d <= L:
                f = d / L if L else 0
                end = (a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f)
                break
            d -= L
        start = (c[0] + (end[0] - c[0]) * 0.3, c[1] + (end[1] - c[1]) * 0.3)
        line_color = mix(septa, body_out, 0.35)
        draw.line([start, end], fill=line_color, width=width)
    # The eye: a small irregular dark blob, slightly off center.
    ex, ey = c[0] + rng.uniform(-0.04, 0.04) * 60 * scale / 2, c[1] + rng.uniform(-0.04, 0.04) * 60 * scale / 2
    r = 0.2 * math.sqrt(polygon_area(pts) / math.pi)
    blob = []
    for k in range(14):
        th = k / 14 * 2 * math.pi
        rr = r * (1 + rng.uniform(-0.18, 0.18))
        blob.append((ex + math.cos(th) * rr, ey + math.sin(th) * rr))
    draw.polygon(blob, fill=eye)


def polygon_area(pts):
    a = 0
    for i in range(len(pts)):
        x1, y1 = pts[i]
        x2, y2 = pts[(i + 1) % len(pts)]
        a += x1 * y2 - x2 * y1
    return abs(a) / 2


def render(width, height, cell, seed, colorway, supersample=2):
    rng_np = np.random.default_rng(seed)
    rng = random.Random(seed)
    colors = tuple(hex_to_rgb(c) for c in COLORWAYS[colorway])
    W, H = width * supersample, height * supersample
    n = max(4, round((width * height) / (cell * cell * 0.866)))
    pts = relaxed_points(n, W, H, rng_np)
    cells = wrapped_cells(pts, W, H)
    img = Image.new("RGB", (W, H), colors[0])
    draw = ImageDraw.Draw(img)
    # Draw every cell, plus wrapped copies near edges so the tile is seamless.
    for poly in cells:
        if poly is None:
            continue
        for dx in (-W, 0, W):
            for dy in (-H, 0, H):
                shifted = poly + np.array([dx, dy])
                xs, ys = shifted[:, 0], shifted[:, 1]
                if xs.max() < 0 or xs.min() > W or ys.max() < 0 or ys.min() > H:
                    continue
                paint_cell(draw, shifted, colors, random.Random(rng.random()), supersample)
    return img.resize((width, height), Image.LANCZOS)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--width", type=int, default=1200)
    ap.add_argument("--height", type=int, default=1200)
    ap.add_argument("--cell", type=int, default=120, help="average cell width in pixels")
    ap.add_argument("--seed", type=int, default=1)
    ap.add_argument("--colorway", choices=sorted(COLORWAYS), default="natural")
    ap.add_argument("--dpi", type=int, default=300)
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    img = render(a.width, a.height, a.cell, a.seed, a.colorway)
    img.save(a.out, dpi=(a.dpi, a.dpi))
    print(f"Saved {a.out} ({a.width} x {a.height} px, colorway {a.colorway}, seed {a.seed})")


if __name__ == "__main__":
    main()
