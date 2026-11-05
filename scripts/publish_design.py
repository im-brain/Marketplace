"""Create an UNPUBLISHED Printify product from one design file.

Usage:
    python3 scripts/publish_design.py scripts/examples/test_tee.json --dry-run
    python3 scripts/publish_design.py scripts/examples/test_tee.json
    python3 scripts/publish_design.py --delete PRODUCT_ID
    python3 scripts/publish_design.py --archive-upload IMAGE_ID

What it does, step by step:
  1. Reads the design file (JSON, or YAML if PyYAML is installed).
  2. Runs listing_check.py on the title and description. Any problem stops
     the script, so nothing with an em dash or a risky claim reaches Printify.
  3. Looks up the tee's variants (color and size combos) in Printify's catalog.
  4. Uploads the art image to Printify.
  5. Creates the product in Printify as a draft. It is NOT published anywhere.

--dry-run does steps 1 and 2 and prints what it would send. It makes no
calls to Printify at all.

About the Printify token: there is no token in this script, on purpose.
The session's network proxy adds it to every request to api.printify.com,
so we must NOT send our own Authorization header. (See CLAUDE.md, Secrets.)

Only the Python standard library is used, so there is nothing to install.
"""
import argparse
import base64
import json
import os
import re
import sys
import urllib.error
import urllib.request

import listing_check  # lives in the same scripts/ folder

API = "https://api.printify.com/v1"
SHOP_ID = 29566047  # Heavy Pockets Co. Printify shop (see CLAUDE.md)
USER_AGENT = "HeavyPocketsCo-scripts/1.0"
MAX_VARIANTS = 100  # Printify rejects products with more enabled variants

REQUIRED_FIELDS = ["title", "description", "blueprint_id", "print_provider_id",
                   "variants", "price", "image", "position"]

# Printify product and image ids are 24 letters and digits (0-9, a-f), like
# "5d39b411749d0a000f30e0f4". Checking the shape stops a typo or a stray
# "/" from sending a DELETE to the wrong place.
ID_PATTERN = re.compile(r"^[0-9a-f]{24}$")


def check_id(value, what):
    if not ID_PATTERN.match(value or ""):
        sys.exit("'%s' does not look like a Printify %s id (24 characters, 0-9 and a-f)."
                 % (value, what))
    return value


# ---------------------------------------------------------------------------
# Talking to Printify
# ---------------------------------------------------------------------------

def call_api(method, path, body=None):
    """Send one request to Printify and return the reply as Python data.

    method is "GET", "POST", or "DELETE". path is the part after /v1,
    like "/shops.json". body is a dict to send as JSON (or None).
    On an error, prints Printify's message and stops the script.
    """
    data = json.dumps(body).encode("utf-8") if body is not None else None
    headers = {"User-Agent": USER_AGENT, "Accept": "application/json"}
    if data is not None:
        headers["Content-Type"] = "application/json"
    # No Authorization header here. The proxy adds the token for us.
    req = urllib.request.Request(API + path, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            text = resp.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", errors="replace")
        sys.exit("Printify said %s %s for %s %s:\n%s" % (e.code, e.reason, method, path, detail))
    except urllib.error.URLError as e:
        sys.exit("Could not reach Printify (%s %s): %s" % (method, path, e.reason))
    return json.loads(text) if text.strip() else {}


# ---------------------------------------------------------------------------
# Reading and checking the design file
# ---------------------------------------------------------------------------

def load_design(path):
    """Read the design file and make sure every required field is there."""
    with open(path, encoding="utf-8") as f:
        if path.endswith((".yaml", ".yml")):
            try:
                import yaml  # optional: pip install pyyaml
            except ImportError:
                sys.exit("This is a YAML file but PyYAML is not installed. "
                         "Use a .json file, or run: pip install pyyaml")
            design = yaml.safe_load(f)
        else:
            design = json.load(f)

    missing = [name for name in REQUIRED_FIELDS if name not in design]
    if missing:
        sys.exit("The design file is missing: " + ", ".join(missing))

    # Catch typos early, before anything is uploaded.
    for name in ("blueprint_id", "print_provider_id"):
        if not isinstance(design[name], int) or isinstance(design[name], bool):
            sys.exit("%s must be a whole number, like 12 (no quotes)." % name)
    if design["variants"] != "all" and not (
            isinstance(design["variants"], list)
            and all(isinstance(i, int) and not isinstance(i, bool) for i in design["variants"])):
        sys.exit('variants must be "all" or a list of whole numbers, like [18540, 18541].')
    try:
        price = float(design["price"])
    except (TypeError, ValueError):
        sys.exit("price must be a number of dollars, like 27.99.")
    if not 0 < price < 1000:
        sys.exit("price %s looks wrong. Use dollars, like 27.99 (not cents)." % design["price"])

    # The image path is relative to the design file, so the file can move.
    folder = os.path.dirname(os.path.abspath(path))
    design["image"] = os.path.join(folder, design["image"])
    if not os.path.isfile(design["image"]):
        sys.exit("Image not found: " + design["image"])
    return design


def check_listing(design):
    """Run listing_check on the title and description. Stop if it finds anything."""
    problems = []
    for label in ("title", "description"):
        for p in listing_check.check_text(design[label]):
            problems.append(listing_check.format_problem(p, label))
    if problems:
        print("\n".join(problems))
        sys.exit("Listing check failed (%d problem(s)). Nothing was sent to Printify." % len(problems))
    print("Listing check: OK")


def price_in_cents(dollars):
    """Printify wants prices in cents, so $27.99 becomes 2799."""
    return int(round(float(dollars) * 100))


def pick_variants(design, catalog_variants):
    """Choose which variant ids to sell, and check they are real.

    design["variants"] is either "all" or a list of ids. With "all", the
    optional "colors" and "sizes" lists narrow it down, like
    "colors": ["White"].
    """
    by_id = {v["id"]: v for v in catalog_variants}
    if design["variants"] == "all":
        chosen = list(catalog_variants)
        if design.get("colors"):
            chosen = [v for v in chosen if v["options"].get("color") in design["colors"]]
        if design.get("sizes"):
            chosen = [v for v in chosen if v["options"].get("size") in design["sizes"]]
    else:
        unknown = [i for i in design["variants"] if i not in by_id]
        if unknown:
            sys.exit("These variant ids are not offered by this print provider: %s" % unknown)
        chosen = [by_id[i] for i in design["variants"]]

    if not chosen:
        sys.exit("No variants matched. Check the colors and sizes in the design file.")
    if len(chosen) > MAX_VARIANTS:
        sys.exit("%d variants is more than Printify allows (%d). Add a \"colors\" list "
                 "to the design file to narrow it down." % (len(chosen), MAX_VARIANTS))

    # Make sure every chosen variant can print in the requested spot.
    for v in chosen:
        spots = [p["position"] for p in v.get("placeholders", [])]
        if design["position"] not in spots:
            sys.exit("Variant %s (%s) can't print on '%s'. Options: %s"
                     % (v["id"], v["title"], design["position"], spots))
    return [v["id"] for v in chosen]


def build_product(design, variant_ids, image_id):
    """Build the product data Printify expects. The art sits centered."""
    cents = price_in_cents(design["price"])
    return {
        "title": design["title"],
        "description": design["description"],
        "tags": design.get("tags", []),
        "blueprint_id": design["blueprint_id"],
        "print_provider_id": design["print_provider_id"],
        "variants": [{"id": vid, "price": cents, "is_enabled": True} for vid in variant_ids],
        "print_areas": [{
            "variant_ids": variant_ids,
            "placeholders": [{
                "position": design["position"],
                "images": [{
                    "id": image_id,
                    # x and y are 0 to 1 (0.5 is the middle). scale 1 fills the width.
                    "x": design.get("x", 0.5),
                    "y": design.get("y", 0.5),
                    "scale": design.get("scale", 1),
                    "angle": 0,
                }],
            }],
        }],
    }


# ---------------------------------------------------------------------------
# The three jobs: create, delete, and archive an upload
# ---------------------------------------------------------------------------

def create(design_path, dry_run):
    design = load_design(design_path)
    check_listing(design)

    if dry_run:
        size_kb = os.path.getsize(design["image"]) / 1024
        variants = design["variants"]
        if variants == "all":
            variants = "all (filtered by colors=%s, sizes=%s; looked up when run for real)" % (
                design.get("colors"), design.get("sizes"))
        print("\nDRY RUN: no calls to Printify were made.\n")
        print("Would upload image: %s (%.0f KB)" % (design["image"], size_kb))
        print("Would sell variants: %s" % variants)
        ids = design["variants"] if isinstance(design["variants"], list) else ["<variant ids>"]
        payload = build_product(design, ids, "<image id from upload>")
        print("Would POST /v1/shops/%d/products.json with:" % SHOP_ID)
        print(json.dumps(payload, indent=2))
        return

    # 1. Look up the variants this print provider offers for this blueprint.
    path = "/catalog/blueprints/%d/print_providers/%d/variants.json" % (
        design["blueprint_id"], design["print_provider_id"])
    catalog = call_api("GET", path)["variants"]
    variant_ids = pick_variants(design, catalog)
    print("Variants: %d chosen" % len(variant_ids))

    # 2. Upload the art. Printify wants the file as base64 text.
    with open(design["image"], "rb") as f:
        contents = base64.b64encode(f.read()).decode("ascii")
    upload = call_api("POST", "/uploads/images.json",
                      {"file_name": os.path.basename(design["image"]), "contents": contents})
    print("Uploaded image: id %s" % upload["id"])
    print("(If the next step fails, hide this image with: --archive-upload %s)" % upload["id"])

    # 3. Create the product. This makes a draft in Printify only.
    product = call_api("POST", "/shops/%d/products.json" % SHOP_ID,
                       build_product(design, variant_ids, upload["id"]))
    print("Created UNPUBLISHED product: id %s" % product["id"])
    print("See it at: https://printify.com/app/products")

    # TODO (Step 12, after Shopify exists): publish to Shopify as a DRAFT with
    #   POST /v1/shops/{shop_id}/products/{product_id}/publish.json
    # Do not add this until Brian has opened Shopify and approved samples.
    # Until then, this script must never call the publish endpoint.

    print(json.dumps({"product_id": product["id"], "image_id": upload["id"]}))


def delete(product_id, yes, dry_run=False):
    """Delete one product, after showing its title so the right one goes."""
    check_id(product_id, "product")
    # Look the product up first (a read-only GET) and show what it is.
    product = call_api("GET", "/shops/%d/products/%s.json" % (SHOP_ID, product_id))
    print("Product %s: \"%s\"" % (product_id, product.get("title", "?")))
    if product.get("external"):
        print("WARNING: this product is connected to a sales channel (it was published).")
    if dry_run:
        print("DRY RUN: not deleted.")
        return
    if not yes:
        try:
            answer = input("Delete it? This can't be undone. Type yes: ")
        except EOFError:  # no keyboard, like when Claude runs the script
            sys.exit("Not deleted. Nobody could answer the question. Check the title above "
                     "with Brian, then run again with --yes.")
        if answer.strip().lower() != "yes":
            sys.exit("Not deleted.")
    call_api("DELETE", "/shops/%d/products/%s.json" % (SHOP_ID, product_id))
    print("Deleted product %s" % product_id)


def archive_upload(image_id, dry_run=False):
    """Hide an uploaded image from the Printify media library."""
    check_id(image_id, "image")
    if dry_run:
        print("DRY RUN: would archive uploaded image %s" % image_id)
        return
    call_api("POST", "/uploads/%s/archive.json" % image_id, {})
    print("Archived uploaded image %s" % image_id)


def main():
    parser = argparse.ArgumentParser(description="Create an unpublished Printify product from a design file.")
    parser.add_argument("design", nargs="?", help="path to the design .json (or .yaml) file")
    parser.add_argument("--dry-run", action="store_true", help="check and print the payload, but send nothing")
    parser.add_argument("--delete", metavar="PRODUCT_ID", help="delete a Printify product")
    parser.add_argument("--archive-upload", metavar="IMAGE_ID", help="archive an uploaded image")
    parser.add_argument("--yes", action="store_true", help="skip the 'are you sure' question for --delete")
    args = parser.parse_args()

    # Only one job per run, so a delete never rides along with a create.
    jobs = [bool(args.design), bool(args.delete), bool(args.archive_upload)]
    if sum(jobs) > 1:
        sys.exit("Pick one job: a design file, --delete, or --archive-upload.")

    if args.delete:
        delete(args.delete, args.yes, args.dry_run)
    elif args.archive_upload:
        archive_upload(args.archive_upload, args.dry_run)
    elif args.design:
        create(args.design, args.dry_run)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
