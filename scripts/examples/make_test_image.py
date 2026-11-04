"""Make the placeholder art for the test tee: scripts/examples/test_delete.png.

Usage: python3 scripts/examples/make_test_image.py
Needs Pillow (pip install pillow). The picture is transparent with red
text that says "TEST" and "DELETE," so nobody mistakes it for real art.
"""
import os

from PIL import Image, ImageDraw, ImageFont

# Size of the Bella+Canvas 3001 front print area at Monster Digital.
WIDTH, HEIGHT = 3319, 3761
RED = (200, 30, 30, 255)

img = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))  # fully transparent
draw = ImageDraw.Draw(img)
draw.rectangle([40, 40, WIDTH - 40, HEIGHT - 40], outline=RED, width=60)
draw.line([40, 40, WIDTH - 40, HEIGHT - 40], fill=RED, width=30)
draw.line([WIDTH - 40, 40, 40, HEIGHT - 40], fill=RED, width=30)
font = ImageFont.load_default(size=420)
for text, y in (("TEST", 1300), ("DELETE", 2000)):
    box = draw.textbbox((0, 0), text, font=font)
    x = (WIDTH - (box[2] - box[0])) // 2
    draw.rectangle([x - 60, y - 60, x + box[2] - box[0] + 60, y + box[3] + 60], fill=(255, 255, 255, 255))
    draw.text((x, y), text, font=font, fill=RED)

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "test_delete.png")
img.save(out, optimize=True)
print("Saved", out)
