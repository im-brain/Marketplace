"""Prepare ChatGPT dry/wet stone pairs for the storefront wet test.

For each pair:
  1. Build ONE shared outline: pixels that are solid (alpha > 200) in both the
     dry and the wet image, smoothed by 1 px. This drops the soft glow halo that
     the generator baked into the transparent edge (IMAGE_STANDARDS.md: no glow
     around the stone) and makes the dry and wet outlines identical.
  2. Apply that outline to both images. No pixel inside the stone is moved,
     recolored, or retouched.
  3. Crop both with the same 5:4 box around the stone and save 1280 x 1024 WebP.

Usage: python3 scripts/stone_pairs.py   (reads theme/v2/img/src/, writes theme/v2/img/)
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "theme/v2/img/src"
OUT = ROOT / "theme/v2/img"
PAIRS = ["jasper", "petoskey", "leland"]
W, H, PAD = 1280, 1024, 0.07


def load(path):
    return Image.open(path).convert("RGBA")


def shared_mask(dry, wet):
    a = np.array(dry)[..., 3] > 200
    b = np.array(wet)[..., 3] > 200
    m = Image.fromarray(((a & b) * 255).astype("uint8"))
    m = m.filter(ImageFilter.MinFilter(3))          # pull in 1 px to drop edge fringe
    return m.filter(ImageFilter.GaussianBlur(0.8))  # soft 1 px edge, no halo


def crop_box(mask):
    x0, y0, x1, y1 = mask.point(lambda v: 255 if v > 128 else 0).getbbox()
    w, h = x1 - x0, y1 - y0
    w, h = w * (1 + 2 * PAD), h * (1 + 2 * PAD)
    if w / h < W / H:
        w = h * W / H
    else:
        h = w * H / W
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    return tuple(round(v) for v in (cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2))


def main():
    for name in PAIRS:
        dry, wet = load(SRC / f"{name}-dry.png"), load(SRC / f"{name}-wet.png")
        assert dry.size == wet.size, name
        mask = shared_mask(dry, wet)
        box = crop_box(mask)
        for state, img in (("dry", dry), ("wet", wet)):
            out = img.copy()
            out.putalpha(mask)
            out = out.crop(box).resize((W, H), Image.LANCZOS)
            out.save(OUT / f"{name}-{state}.webp", "WEBP", quality=82, method=6)
        d = np.array(Image.open(OUT / f"{name}-dry.webp"))[..., 3]
        w = np.array(Image.open(OUT / f"{name}-wet.webp"))[..., 3]
        print(f"{name}: crop {box}, alpha identical: {np.array_equal(d, w)}")


if __name__ == "__main__":
    main()
