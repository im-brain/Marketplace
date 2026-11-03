"""Take the shine off one horizontal band of a concept image, so it can't look better than a matte print.

Usage:
    python3 scripts/matte_band.py <source image> <output PNG> <output WebP> <top row> <bottom row>

Inside the band (rows top to bottom), any pixel brighter than its neighborhood
(a specular glint or wet film) is pulled most of the way back to the local
average, and the band is muted slightly. Everything outside the band is
untouched. The source file is never changed.
"""
import sys

import numpy as np
from PIL import Image, ImageFilter


def main(src, out_png, out_webp, top, bottom):
    im = Image.open(src).convert("RGB")
    a = np.asarray(im).astype(np.float64) / 255
    local = np.asarray(im.filter(ImageFilter.GaussianBlur(7))).astype(np.float64) / 255
    band = a[top:bottom]
    loc = local[top:bottom]
    lum = band.mean(-1, keepdims=True)
    loc_lum = loc.mean(-1, keepdims=True)
    glint = np.clip((lum - loc_lum - 0.04) / 0.18, 0, 1)
    band = band * (1 - 0.85 * glint) + loc * (0.85 * glint)
    gray = band.mean(-1, keepdims=True)
    band = gray + (band - gray) * 0.9
    band = np.minimum(band, 0.80)
    # feather the band edges over 10 rows so no seam shows
    h = bottom - top
    ramp = np.clip(np.minimum(np.arange(h), np.arange(h)[::-1]) / 10, 0, 1)[:, None, None]
    a[top:bottom] = a[top:bottom] * (1 - ramp) + band * ramp
    out = Image.fromarray((np.clip(a, 0, 1) * 255 + 0.5).astype(np.uint8))
    out.save(out_png, optimize=True)
    out.save(out_webp, "WEBP", quality=82, method=6)
    print("wrote", out_png, "and", out_webp)


if __name__ == "__main__":
    if len(sys.argv) != 6:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4]), int(sys.argv[5]))
