"""Quick USPTO trademark knockout search.

Usage: python3 scripts/tm_search.py '"agate expectations"' wetrock
Shows live marks that match each term, flagging Class 25 (clothing),
35 (retail), and 14 (jewelry). This is a first check, not legal clearance,
and it does not find unregistered (common-law) use.
"""
import json
import sys
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


for term in sys.argv[1:]:
    data = search(term)
    hits = [h["source"] for h in data["hits"]["hits"]]
    live = [s for s in hits if s.get("alive")]
    flagged = [s for s in live if any(c.strip() in WATCH for c in s.get("internationalClass") or [])]
    print(f"== {term}: {data['hits']['totalValue']} total, {len(live)} live, {len(flagged)} live in clothing, retail, or jewelry")
    for s in flagged:
        classes = ", ".join(s.get("internationalClass") or [])
        print(f"   {s.get('wordmark')} | {classes} | serial {s.get('id')} | {owner(s)}")
