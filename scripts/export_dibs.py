"""Download the first dibs list from Cloudflare.

Run from the repo root:  python3 scripts/export_dibs.py
(add --count to only print how many signed up and which designs they pocketed)

Writes private/first-dibs-<date>.csv, laid out for Shopify's customer import
(Step 12): First Name, Last Name, Email, Accepts Email Marketing, Tags.
Check Shopify's current sample CSV at Step 12 before importing; the columns
may have changed. private/ is in .gitignore: these are real people's emails,
so they never go in the repo or in chat.
"""
import csv
import datetime
import pathlib
import sys
import urllib.parse

sys.path.insert(0, __import__("os").path.dirname(__file__))
from deploy_coming_soon import KV_TITLE, account_id, cf, fail  # noqa: E402

OUT = pathlib.Path(__file__).resolve().parent.parent / "private"


def entries(acct, ns):
    cursor = ""
    while True:
        q = "?limit=1000" + ("&cursor=" + urllib.parse.quote(cursor) if cursor else "")
        out = cf("GET", f"/accounts/{acct}/storage/kv/namespaces/{ns}/keys{q}")
        if not out.get("success"):
            fail("Couldn't read the list.", out)
        for k in out["result"]:
            yield k["name"], k.get("metadata") or {}
        cursor = (out.get("result_info") or {}).get("cursor")
        if not cursor:
            return


if __name__ == "__main__":
    acct = account_id()
    found = [n for n in cf("GET", f"/accounts/{acct}/storage/kv/namespaces?per_page=100").get("result", []) if n["title"] == KV_TITLE]
    if not found:
        fail("There's no first dibs list yet. Publish the page first.")
    rows = sorted(entries(acct, found[0]["id"]), key=lambda r: r[1].get("first", ""))
    tally = {}
    for _, meta in rows:
        for p in meta.get("picks", []):
            tally[p] = tally.get(p, 0) + 1
    print(f"{len(rows)} signed up.")
    for name, n in sorted(tally.items(), key=lambda x: -x[1]):
        print(f"  {name}: pocketed by {n}")
    if "--count" in sys.argv:
        sys.exit(0)
    OUT.mkdir(exist_ok=True)
    path = OUT / f"first-dibs-{datetime.date.today().isoformat()}.csv"
    with path.open("w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["First Name", "Last Name", "Email", "Accepts Email Marketing", "Tags"])
        for email, meta in rows:
            tags = ["first-dibs"] + ["pocket: " + p for p in meta.get("picks", [])]
            w.writerow(["", "", email, "yes", ", ".join(tags)])
    print("wrote", path.relative_to(path.parent.parent), "(private, not in git)")
