# Scripts

Run every command from the repo folder (`/home/user/Marketplace`). The Python scripts use only the standard library, except `make_test_image.py` (needs Pillow) and `sock_petoskey.py` (needs numpy, scipy, and Pillow). `render_lick.js` needs Node and Playwright.

## listing_check.py: check listing text

Checks a listing for em dashes (including look-alikes and HTML codes like `&mdash;`), en dashes, `--`, or a spaced ` - ` used as dashes, a missing Oxford comma (including "and," "or," and "&"), and risky claims (like "genuine," "made in USA," "Yooperlite," "healing," or "best").

```
python3 scripts/listing_check.py my_listing.txt
cat my_listing.txt | python3 scripts/listing_check.py
```

Each problem prints as `file:line:column`, with a reason. Exit code 0 means clean, 1 means problems were found, and 2 means the file could not be read. The Oxford comma check is a guess, so read its explanation before changing the text.

## publish_design.py: make a Printify draft

Reads one design file (see `examples/test_tee.json`), checks the title and description with `listing_check.py`, uploads the art, and creates an **unpublished** Printify product in shop 29566047. It never publishes. Publishing to Shopify comes at Step 12 (see the TODO in the script).

```
python3 scripts/publish_design.py scripts/examples/test_tee.json --dry-run   # check only, sends nothing
python3 scripts/publish_design.py scripts/examples/test_tee.json             # create the draft
python3 scripts/publish_design.py --delete PRODUCT_ID                        # shows the title, then asks first
python3 scripts/publish_design.py --delete PRODUCT_ID --dry-run              # only shows the title
python3 scripts/publish_design.py --archive-upload IMAGE_ID                  # hide an uploaded image
```

Product and image ids must be 24 characters (0 to 9 and a to f), or the script stops before calling Printify. When Claude runs `--delete`, nobody can type "yes," so it stops after showing the title. Only add `--yes` after Brian confirms that title. Every listing problem, including WARNING lines and Oxford comma guesses, stops the script. Running it twice makes two drafts.

Design file fields: `title`, `description`, `blueprint_id` (12 is the Bella+Canvas 3001 tee), `print_provider_id` (29 is Monster Digital in Columbus, Ohio), `variants` (a list of ids, or `"all"` plus optional `"colors"` and `"sizes"` lists), `price` in dollars, `image` (path next to the design file), `position` (like `"front"`), and optional `tags`. Printify allows at most 100 variants per product.

The Printify token is never in these files. The network proxy adds it, so the scripts send no Authorization header.

## tm_search.py: trademark knockout search

```
python3 scripts/tm_search.py '"agate expectations"' '"lick rocks"'
```

Lists live USPTO marks in Classes 25, 35, and 14. It waits 2 seconds between terms and stops (no retry) if USPTO rate limits. It is a first check, not legal clearance.

## sock_petoskey.py: Petoskey sock pattern

```
python3 scripts/sock_petoskey.py --width 1200 --height 1200 --out designs/petoskey_preview.png
```

Draws a seamless, repeating Petoskey cell pattern. Same `--seed` gives the same picture.

## render_lick.js: "I lick rocks" print files

```
node scripts/render_lick.js 7
```

Saves light-ink and dark-ink transparent PNGs (4250 x 5100 px) in `designs/lick/`.

## examples/make_test_image.py: placeholder art

Makes `examples/test_delete.png`, a transparent image that says "TEST" and "DELETE."

```
python3 scripts/examples/make_test_image.py
```

## Tests

```
python3 -m unittest discover scripts/tests
```

The last line should say `OK`.
