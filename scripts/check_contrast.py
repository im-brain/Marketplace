"""Check WCAG contrast for every Heavy Pockets Co. color pairing we use.

Run: python3 scripts/check_contrast.py
4.5 or higher passes for body text. 3.0 or higher passes for large text
(about 24px and up) and for graphics like the logo.
"""

PALETTE = {
    "Superior slate dry": "#6B7780", "Superior slate wet": "#22394A",
    "Agate red dry": "#B87358", "Agate red wet": "#9A2B1C",
    "Petoskey gray dry": "#A39E94", "Petoskey brown wet": "#6E4F35",
    "Sand dry": "#DCCFB6", "Sand wet": "#A8875A",
    "Fog": "#EEEDE8", "Ink": "#1C1E1F",
    "Night": "#14181B", "Night text": "#ECE6DA",
}

# (text color, background color, minimum ratio, where it is used)
PAIRS = [
    ("Ink", "Fog", 4.5, "body text, light mode"),
    ("Night text", "Night", 4.5, "body text, dark mode"),
    ("Ink", "Sand dry", 4.5, "text on sand panels"),
    ("Fog", "Superior slate wet", 4.5, "text on slate buttons"),
    ("Fog", "Agate red wet", 4.5, "text on red buttons"),
    ("Fog", "Petoskey brown wet", 4.5, "text on brown"),
    ("Superior slate wet", "Fog", 4.5, "headings, light mode"),
    ("Agate red wet", "Fog", 4.5, "accent text, light mode"),
    ("Sand dry", "Night", 4.5, "headings, dark mode"),
    ("Agate red dry", "Night", 4.5, "accent text, dark mode"),
    ("Superior slate dry", "Fog", 3.0, "captions at large size only"),
    ("Petoskey gray dry", "Night", 4.5, "muted text, dark mode"),
    ("Ink", "Petoskey gray dry", 4.5, "text on gray"),
]


def luminance(hex_color):
    rgb = [int(hex_color[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    lin = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in rgb]
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]


def ratio(a, b):
    la, lb = sorted((luminance(a), luminance(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


failures = 0
for fg, bg, need, use in PAIRS:
    r = ratio(PALETTE[fg], PALETTE[bg])
    ok = r >= need
    failures += not ok
    print(f"{'PASS' if ok else 'FAIL'}  {r:5.2f} (need {need})  {fg} on {bg}: {use}")
print("All pairings pass." if not failures else f"{failures} pairing(s) fail.")
