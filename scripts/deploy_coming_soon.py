"""Publish the coming-soon page to Cloudflare.

Run from the repo root:  python3 scripts/deploy_coming_soon.py

What it does, in plain terms:
  1. Builds the Worker (scripts/build_coming_soon.py).
  2. Checks the Cloudflare token works. The token is a network secret: the
     proxy adds it to requests to api.cloudflare.com, so it never appears here.
  3. Finds (or makes, the first time) the KV list "heavypockets-first-dibs".
  4. Uploads the Worker "heavypockets-coming-soon" with that list attached.
  5. Turns on its free test address (<name>.<your-subdomain>.workers.dev).

It never touches DNS or email routing. Pointing heavypocketsco.com at the
Worker is one step Brian does by hand in the Cloudflare dashboard (see
worker/README.md), so the token never needs DNS permissions.
"""
import json
import sys
import urllib.error
import urllib.request
import uuid

sys.path.insert(0, __import__("os").path.dirname(__file__))
from build_coming_soon import build  # noqa: E402

API = "https://api.cloudflare.com/client/v4"
SCRIPT = "heavypockets-coming-soon"
KV_TITLE = "heavypockets-first-dibs"
COMPAT = "2025-09-01"


def cf(method, path, body=None, headers=None):
    data = json.dumps(body).encode() if isinstance(body, (dict, list)) else body
    h = {"content-type": "application/json"} if isinstance(body, (dict, list)) else {}
    h.update(headers or {})
    req = urllib.request.Request(API + path, data=data, method=method, headers=h)
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:
        try:
            out = json.loads(e.read())
        except ValueError:
            out = {"errors": [{"message": f"HTTP {e.code}"}]}
        out["status"] = e.code
        return out


def fail(msg, out=None):
    if out:
        msg += "\n  Cloudflare said: " + "; ".join(x.get("message", "") for x in out.get("errors", [])) + f" (HTTP {out.get('status', '?')})"
    sys.exit(msg)


def account_id():
    out = cf("GET", "/accounts")
    if not out.get("success"):
        fail("Couldn't read the Cloudflare account. Is the token added as a network secret for api.cloudflare.com, "
             "and does it include Account Settings: Read? See worker/README.md.", out)
    accts = out["result"]
    if len(accts) != 1:
        fail("The token sees " + str(len(accts)) + " accounts; limit it to the Heavy Pockets account.")
    return accts[0]["id"]


def kv_namespace(acct):
    out = cf("GET", f"/accounts/{acct}/storage/kv/namespaces?per_page=100")
    if not out.get("success"):
        fail("Couldn't list KV lists. Does the token include Workers KV Storage: Edit?", out)
    for ns in out["result"]:
        if ns["title"] == KV_TITLE:
            return ns["id"]
    out = cf("POST", f"/accounts/{acct}/storage/kv/namespaces", {"title": KV_TITLE})
    if not out.get("success"):
        fail("Couldn't create the KV list.", out)
    print("made the KV list", KV_TITLE)
    return out["result"]["id"]


def upload(acct, ns, dist):
    meta = {"main_module": "index.js", "compatibility_date": COMPAT,
            "bindings": [{"type": "kv_namespace", "name": "DIBS", "namespace_id": ns}]}
    boundary = "----hp" + uuid.uuid4().hex
    parts = [("metadata", "blob", "application/json", json.dumps(meta).encode())]
    for name in ("index.js", "site.js"):
        parts.append((name, name, "application/javascript+module", (dist / name).read_bytes()))
    body = b""
    for field, filename, ctype, data in parts:
        body += (f"--{boundary}\r\nContent-Disposition: form-data; name=\"{field}\"; filename=\"{filename}\"\r\n"
                 f"Content-Type: {ctype}\r\n\r\n").encode() + data + b"\r\n"
    body += f"--{boundary}--\r\n".encode()
    out = cf("PUT", f"/accounts/{acct}/workers/scripts/{SCRIPT}", body,
             {"content-type": f"multipart/form-data; boundary={boundary}"})
    if not out.get("success"):
        fail("The upload didn't go through. Does the token include Workers Scripts: Edit?", out)
    print("uploaded the Worker", SCRIPT)


def test_address(acct):
    sub = cf("GET", f"/accounts/{acct}/workers/subdomain")
    name = (sub.get("result") or {}).get("subdomain")
    if not name:
        print("No workers.dev test address yet. Open Workers & Pages once in the Cloudflare dashboard to set one up,\n"
              "then run this again. (Not needed if you attach heavypocketsco.com.)")
        return
    out = cf("POST", f"/accounts/{acct}/workers/scripts/{SCRIPT}/subdomain", {"enabled": True, "previews_enabled": False})
    if not out.get("success"):
        print("Couldn't turn on the test address (the page is still uploaded).")
        return
    print(f"test address: https://{SCRIPT}.{name}.workers.dev")


if __name__ == "__main__":
    dist = build()
    out = cf("GET", "/user/tokens/verify")
    if not out.get("success"):
        out2 = cf("GET", "/accounts")  # account-owned tokens verify differently
        if not out2.get("success"):
            fail("Cloudflare didn't accept a token. Add it as a network secret for api.cloudflare.com "
                 "(steps in worker/README.md), then start a new session.", out)
    acct = account_id()
    ns = kv_namespace(acct)
    upload(acct, ns, dist)
    test_address(acct)
    print("Done. If heavypocketsco.com isn't attached yet, follow 'Point the domain' in worker/README.md.")
