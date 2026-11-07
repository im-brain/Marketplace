# Coming-soon page (heavypocketsco.com)

The live page is a Cloudflare Worker named `heavypockets-coming-soon`. This folder is now its source.

| Path | What it is |
|---|---|
| `src/page.html` | The page. Brand tokens and the v3 look, wordmark inlined by the build. |
| `src/worker.js` | Routing, security headers, and the `/api/dibs` signup. Becomes `dist/index.js`. |
| `src/copy.json` | Speech bubble options. `chosen` is the one that goes live. |
| `src/assets/` | Hero art (from `theme/v3/img/hero/`), the rockhound mascot, icons, and the social image. |
| `build.js` | `node site/coming-soon/build.js` writes `dist/index.js`, `dist/site.js`, and `preview/index.html`. No dependencies. Stops if it finds an em dash, "supplier", "Printify", socks, a cart, or a price. |
| `make_images.js` | `node site/coming-soon/make_images.js` redraws the social image and icons (Playwright). |
| `qa/run_qa.mjs` | Runs the real Worker locally with a fake signup list, then checks the page in a browser. Never touches Cloudflare. |
| `live-2026-11-04/` | Rollback copy of what was live before this change. |

## Signups

The form collects the email only (Brian, Nov 7, 2026). The KV binding `DIBS` (namespace `21d60f8208ca4dcda50fbf2a9bf29af9`) stays the same. Existing entries are never rewritten: if an email is already on the list, the Worker writes nothing, so any old design picks stay as they were.

## Deploy (only after Brian's OK)

`PUT /accounts/e44445921056d6c6141bcaf2be70da10/workers/scripts/heavypockets-coming-soon` as multipart with `dist/index.js` and `dist/site.js`, and metadata `{"main_module":"index.js","compatibility_date":"2025-09-01","bindings":[{"type":"kv_namespace","name":"DIBS","namespace_id":"21d60f8208ca4dcda50fbf2a9bf29af9"}]}`. Leaving out the binding breaks the signups. To roll back, do the same with the files in `live-2026-11-04/`.
