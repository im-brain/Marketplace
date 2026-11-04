# Scripts

Run every command from the repo folder (`/home/user/Marketplace`). They use only the Python standard library, except `make_test_image.py`, which needs Pillow.

## listing_check.py: check listing text

Checks a listing for em dashes, en dashes or `--` used as dashes, a missing Oxford comma, and risky claims (like "genuine," "made in USA," "Yooperlite," "healing," or "best").

```
python3 scripts/listing_check.py my_listing.txt
cat my_listing.txt | python3 scripts/listing_check.py
```

Each problem prints as `file:line:column`, with a reason. Exit code 0 means clean, and 1 means problems were found. The Oxford comma check is a guess, so read its explanation before changing the text.

## publish_design.py: make a Printify draft

Reads one design file (see `examples/test_tee.json`), checks the title and description with `listing_check.py`, uploads the art, and creates an **unpublished** Printify product in shop 29566047. It never publishes. Publishing to Shopify comes at Step 12 (see the TODO in the script).

```
python3 scripts/publish_design.py scripts/examples/test_tee.json --dry-run   # check only, sends nothing
python3 scripts/publish_design.py scripts/examples/test_tee.json             # create the draft
python3 scripts/publish_design.py --delete PRODUCT_ID                        # delete a product (asks first)
python3 scripts/publish_design.py --archive-upload IMAGE_ID                  # hide an uploaded image
```

Design file fields: `title`, `description`, `blueprint_id` (12 is the Bella+Canvas 3001 tee), `print_provider_id` (29 is Monster Digital in Columbus, Ohio), `variants` (a list of ids, or `"all"` plus optional `"colors"` and `"sizes"` lists), `price` in dollars, `image` (path next to the design file), `position` (like `"front"`), and optional `tags`. Printify allows at most 100 variants per product.

The Printify token is never in these files. The network proxy adds it, so the scripts send no Authorization header.

## examples/make_test_image.py: placeholder art

Makes `examples/test_delete.png`, a transparent image that says "TEST DELETE."

```
python3 scripts/examples/make_test_image.py
```

## Tests

```
python3 -m unittest discover scripts/tests
```

The last line should say `OK`.
