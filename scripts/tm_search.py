"""Quick USPTO trademark knockout search.

Usage: python3 scripts/tm_search.py '"agate expectations"' wetrock
Shows live marks that match each term, flagging Class 25 (clothing),
35 (retail), and 14 (jewelry). This is a first check, not legal clearance,
and it does not find unregistered (common-law) use.
"""
import json
import sys
import time
import urllib.error
import urllib.request

URL = "https://tmsearch.uspto.gov/prod-stage-v1-0-0/tmsearch"
WATCH = {"IC 025": "clothing", "IC 035": "retail", "IC 014": "jewelry"}


def search(term, size=200):
    body = {"query": {"bool": {"must": [{"query_string": {"query": term, "default_field": "wordmark"}}]}}, "size": size}
    req = urllib.request.Request(URL, data=json.dumps(body).encode(), headers={"Content-Type": "application/json"})
    return json.load(urllib.request.urlopen(req, timeout=30))


def owner(s):
    o = s.get("ownerName")
    return o if isinstance(o, str) else (o or [""])[0]


def main(terms):
    for term in terms:
        try:
            data = search(term)
        except urllib.error.HTTPError as e:
            if e.code in (403, 429):
                sys.exit("USPTO is rate limiting (%s). Wait a few minutes before searching "
                         "again. Do not retry in a loop." % e.code)
            sys.exit("USPTO search failed for %s: %s %s" % (term, e.code, e.reason))
        except urllib.error.URLError as e:
            sys.exit("Could not reach USPTO: %s" % e.reason)
        report(term, data)
        time.sleep(2)  # space searches out so USPTO does not block us


def report(term, data):
    hits = [h["source"] for h in data["hits"]["hits"]]
    live = [s for s in hits if s.get("alive")]
    flagged = [s for s in live if any(c.strip() in WATCH for c in s.get("internationalClass") or [])]
    print(f"== {term}: {data['hits']['totalValue']} total, {len(live)} live, {len(flagged)} live in clothing, retail, or jewelry")
    for s in flagged:
        classes = ", ".join(s.get("internationalClass") or [])
        print(f"   {s.get('wordmark')} | {classes} | serial {s.get('id')} | {owner(s)}")


if __name__ == "__main__":
    main(sys.argv[1:])
