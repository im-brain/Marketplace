"""Storefront v3 assets: read-only Printify snapshot plus web images.

  python3 scripts/storefront_assets.py fetch   # GET only. Never creates, edits, or publishes.
  python3 scripts/storefront_assets.py build   # makes theme/v3/img/* and theme/v3/src/printify-snapshot.json

fetch: reads the six launch products from Printify (shop 29566047) and saves
the raw JSON, every mockup image, and the web previews of the uploaded design
files into .cache/printify/ (gitignored). The proxy adds the Printify token;
this script never sends or stores one.

build: writes a trimmed snapshot (enabled variants, availability flag, cost,
image map) and WebP images:
  img/products/<slug>/<color>-<view>.webp  900px, cropped to a shared garment box
  img/art/<file>.webp                      design-file previews (artwork close-ups)
  img/size-chart-<tee|hoodie>.webp         supplier size charts
  img/hero/shore-<wide|tall>.(webp|jpg)    hero review crops (see HERO_CROPS)
Masters in brand/v2/hero-assets/ are read, never changed.
"""
import json
import os
import re
import sys
import urllib.request

from PIL import Image, ImageChops

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, ".cache/printify")
V3 = os.path.join(ROOT, "theme/v3")
SHOP = 29566047
API = "https://api.printify.com/v1"

# Printify product id -> storefront slug (register from the Nov 7, 2026 brief)
PRODUCTS = {
    "6aed148a25c13f11c005d795": "midnight-rock-hunt-tee",
    "6aed15a703c89fadbb06417b": "great-lakes-rock-crew-tee",
    "6aed16a023aa5c82ac0ec3fa": "field-notebook-tee",
    "6aed172ca1cc08ceee0d84e8": "pocket-full-of-treasures-tee",
    "6aed5b31258438e5f0070465": "shoreline-hoodie",
    "6aed59eda33f458524013eb9": "floral-butterfly-embroidered-hoodie",
}
# Printify mockup camera ids -> our view names
VIEWS = {
    "98445": "front", "98446": "back", "100629": "folded", "126094": "flatlay", "110132": "sizechart",
    "98424": "front", "98425": "back", "98426": "back-hood", "98432": "folded", "110151": "sizechart",
}
# Hero review crops (left, top, right, bottom) from the approved masters.
# Both exclude the baked-in old logo and tagline completely and keep the
# sunset, lighthouse, and featured stones. They are review treatments, not
# replacements for clean logo-free art.
HERO_CROPS = {
    "wide": ("brand/v2/hero-assets/hero-approved-desktop.webp", (600, 95, 1774, 795)),
    "tall": ("brand/v2/hero-assets/hero-approved-mobile.webp", (0, 492, 1086, 1252)),
}
PANEL = 900


def get(url, binary=False):
    req = urllib.request.Request(url, headers={"User-Agent": "heavy-pockets-preview/1.0"})
    with urllib.request.urlopen(req, timeout=90) as r:
        data = r.read()
    return data if binary else json.loads(data)


def slugify(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def fetch():
    os.makedirs(os.path.join(CACHE, "mock"), exist_ok=True)
    os.makedirs(os.path.join(CACHE, "art"), exist_ok=True)
    data = get(f"{API}/shops/{SHOP}/products.json?limit=50")
    prods = [p for p in data["data"] if p["id"] in PRODUCTS]
    missing = set(PRODUCTS) - {p["id"] for p in prods}
    if missing:
        sys.exit(f"missing products: {missing}")
    with open(os.path.join(CACHE, "products.json"), "w") as f:
        json.dump(prods, f)
    n = 0
    for p in prods:
        for im in p["images"]:
            parts = im["src"].split("/")
            dest = os.path.join(CACHE, "mock", f"{p['id']}_{parts[5]}_{parts[6]}.jpg")
            if not os.path.exists(dest):
                with open(dest, "wb") as f:
                    f.write(get(im["src"], binary=True))
                n += 1
        for pa in p["print_areas"]:
            for ph in pa["placeholders"]:
                for im in ph["images"]:
                    if not im.get("src"):
                        continue
                    dest = os.path.join(CACHE, "art", im["name"])
                    if not os.path.exists(dest):
                        with open(dest, "wb") as f:
                            f.write(get(im["src"], binary=True))
    print(f"fetched {len(prods)} products, {n} new mockups")


def garment_box(paths):
    """Union bounding box of non-white pixels across images (same camera)."""
    box = None
    for p in paths:
        im = Image.open(p).convert("RGB")
        diff = ImageChops.difference(im, Image.new("RGB", im.size, (255, 255, 255))).convert("L")
        b = diff.point(lambda v: 255 if v > 14 else 0).getbbox()
        if b:
            box = b if box is None else (min(box[0], b[0]), min(box[1], b[1]), max(box[2], b[2]), max(box[3], b[3]))
    return box


def square_crop(box, size, margin=0.05):
    l, t, r, b = box
    side = max(r - l, b - t)
    side = int(side * (1 + 2 * margin))
    cx, cy = (l + r) / 2, (t + b) / 2
    side = min(side, size[0], size[1])
    x0 = int(min(max(cx - side / 2, 0), size[0] - side))
    y0 = int(min(max(cy - side / 2, 0), size[1] - side))
    return (x0, y0, x0 + side, y0 + side)


def sample_color(path, box):
    """Median garment color from a plain fabric patch (no print)."""
    im = Image.open(path).convert("RGB").crop(box)
    px = sorted(im.get_flattened_data() if hasattr(im, "get_flattened_data") else im.getdata(), key=lambda c: sum(c))
    r, g, b = px[len(px) // 2]
    return f"#{r:02X}{g:02X}{b:02X}"


# where to sample plain fabric for each product: (view, box in 1200px mockup)
SWATCH_SAMPLE = {
    "midnight-rock-hunt-tee": ("front", (520, 700, 680, 860)),
    "great-lakes-rock-crew-tee": ("back", (520, 520, 680, 680)),
    "field-notebook-tee": ("back", (520, 520, 680, 680)),
    "pocket-full-of-treasures-tee": ("back", (520, 520, 680, 680)),
    "shoreline-hoodie": ("front", (520, 820, 680, 900)),
    "floral-butterfly-embroidered-hoodie": ("back", (520, 560, 680, 700)),
}


def build():
    with open(os.path.join(CACHE, "products.json")) as f:
        prods = json.load(f)
    out_img = os.path.join(V3, "img")
    snap = {"source": f"Printify shop {SHOP}, read-only GET", "captured": "2026-11-07", "products": {}}
    charts = {}
    for p in prods:
        slug = PRODUCTS[p["id"]]
        opt_names = {}
        for o in p["options"]:
            for v in o["values"]:
                opt_names[v["id"]] = (o["type"], v["title"])
        variants = []
        color_of_variant = {}
        for v in p["variants"]:
            if not v["is_enabled"]:
                continue
            o = dict(opt_names[i] for i in v["options"])
            color_of_variant[v["id"]] = o["color"]
            variants.append({"id": v["id"], "color": o["color"], "size": o["size"],
                             "printify_available": v["is_available"], "cost_cents": v["cost"],
                             "printify_price_cents": v["price"]})
        # images by color and view
        by_cam = {}
        for im in p["images"]:
            parts = im["src"].split("/")
            cam = parts[6]
            view = VIEWS.get(cam)
            colors = {color_of_variant[i] for i in im["variant_ids"] if i in color_of_variant}
            if not view or not colors:
                continue
            path = os.path.join(CACHE, "mock", f"{p['id']}_{parts[5]}_{cam}.jpg")
            if view == "sizechart":
                charts["hoodie" if "hoodie" in slug else "tee"] = path
                continue
            for c in colors:
                by_cam.setdefault(view, {})[c] = path
        dest = os.path.join(out_img, "products", slug)
        os.makedirs(dest, exist_ok=True)
        images = {}
        for view, cmap in by_cam.items():
            if view == "flatlay":
                crop = None  # full styled scene, keep as is
            else:
                crop = square_crop(garment_box(cmap.values()), (1200, 1200))
            for color, path in cmap.items():
                im = Image.open(path).convert("RGB")
                if crop:
                    im = im.crop(crop)
                im = im.resize((PANEL, PANEL), Image.LANCZOS)
                name = f"{slugify(color)}-{view}.webp"
                im.save(os.path.join(dest, name), "WEBP", quality=80, method=6)
                images.setdefault(color, {})[view] = f"img/products/{slug}/{name}"
        sv, sbox = SWATCH_SAMPLE[slug]
        swatches = {c: sample_color(by_cam[sv][c], sbox) for c in by_cam[sv]}
        snap["products"][slug] = {"printify_id": p["id"], "printify_title": p["title"],
                                  "blueprint_id": p["blueprint_id"], "print_provider_id": p["print_provider_id"],
                                  "variants": variants, "images": images, "swatches": swatches}
    # size charts
    for kind, path in charts.items():
        im = Image.open(path).convert("RGB")
        im.thumbnail((1200, 1200))
        im.save(os.path.join(out_img, f"size-chart-{kind}.webp"), "WEBP", quality=88, method=6)
    # artwork previews (transparent PNG previews of the uploaded design files)
    os.makedirs(os.path.join(out_img, "art"), exist_ok=True)
    for name in sorted(os.listdir(os.path.join(CACHE, "art"))):
        im = Image.open(os.path.join(CACHE, "art", name)).convert("RGBA")
        bb = im.getchannel("A").getbbox()
        if bb:
            pad = 24
            im = im.crop((max(bb[0] - pad, 0), max(bb[1] - pad, 0), min(bb[2] + pad, im.width), min(bb[3] + pad, im.height)))
        im.thumbnail((1000, 1000))
        im.save(os.path.join(out_img, "art", os.path.splitext(name)[0] + ".webp"), "WEBP", quality=86, method=6)
    # hero review crops
    os.makedirs(os.path.join(out_img, "hero"), exist_ok=True)
    for key, (src, box) in HERO_CROPS.items():
        im = Image.open(os.path.join(ROOT, src)).convert("RGB").crop(box)
        im.save(os.path.join(out_img, "hero", f"shore-{key}.webp"), "WEBP", quality=86, method=6)
        im.save(os.path.join(out_img, "hero", f"shore-{key}.jpg"), "JPEG", quality=84, optimize=True, progressive=True)
        snap.setdefault("hero_crops", {})[key] = {"master": src, "box": box, "size": im.size}
    with open(os.path.join(V3, "src/printify-snapshot.json"), "w") as f:
        json.dump(snap, f, indent=1)
    print("built", {k: len(v["variants"]) for k, v in snap["products"].items()})


if __name__ == "__main__":
    {"fetch": fetch, "build": build}[sys.argv[1] if len(sys.argv) > 1 else "build"]()
