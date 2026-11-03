"""Make a stone's dry image read more matte, without moving a single pixel.

Usage:
    python3 scripts/matte_dry.py <dry master PNG> <output PNG> <output WebP>

What it does, in plain terms:
  1. Mutes the color a little (saturation x 0.84), so the wet image looks richer.
  2. Lifts the darks slightly and lowers contrast, like a thin dry film.
  3. Softens the brightest spots, so the dry stone has no wet-looking shine.
  4. Adds a faint dusty bloom (a light warm gray mixed in at 6%).

The outline, the bands, and the transparency (alpha) stay exactly the same,
so the dry and wet pair still lines up for the Wet Stone effect.
"""
import sys

import numpy as np
from PIL import Image

SAT = 0.84      # how much color to keep
LIFT = 0.04     # how much to raise the darks
CONTRAST = 0.92 # below 1 means flatter
KNEE = 0.80     # brightness where highlights start getting softened
DUST = (0.86, 0.83, 0.79)
DUST_MIX = 0.06


def matte(rgb):
    gray = (rgb * [0.299, 0.587, 0.114]).sum(-1, keepdims=True)
    rgb = gray + (rgb - gray) * SAT
    rgb = (rgb - 0.5) * CONTRAST + 0.5 + LIFT * (1 - rgb)
    over = np.clip(rgb - KNEE, 0, None)
    rgb = rgb - over * 0.6
    rgb = rgb * (1 - DUST_MIX) + np.array(DUST) * DUST_MIX
    return np.clip(rgb, 0, 1)


def main(src, out_png, out_webp):
    im = Image.open(src).convert("RGBA")
    a = np.asarray(im).astype(np.float64) / 255
    rgb = matte(a[..., :3])
    # Only the stone itself changes. The soft contact shadow (partly
    # transparent pixels) is blended back so it stays as it was.
    w = np.clip((a[..., 3:4] - 0.5) / 0.45, 0, 1)
    rgb = a[..., :3] * (1 - w) + rgb * w
    out = np.concatenate([rgb, a[..., 3:4]], -1)
    res = Image.fromarray((out * 255 + 0.5).astype(np.uint8), "RGBA")
    assert np.array_equal(np.asarray(res)[..., 3], np.asarray(im)[..., 3])
    res.save(out_png, optimize=True)
    res.save(out_webp, "WEBP", quality=82, method=6)
    print("wrote", out_png, "and", out_webp)


if __name__ == "__main__":
    if len(sys.argv) != 4:
        sys.exit(__doc__)
    main(*sys.argv[1:])
