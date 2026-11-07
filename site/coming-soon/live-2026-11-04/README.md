# Rollback copy of the live coming-soon Worker

Downloaded Nov 7, 2026, read-only, from Cloudflare Worker `heavypockets-coming-soon` (last deployed Nov 4, 2026).

- `index.js`: routing, security headers, and the `/api/dibs` signup.
- `site.js`: the page HTML (`PAGE`) and every asset, base64-encoded (`FILES`).
- `settings.json`: compatibility date `2025-09-01` and the KV binding `DIBS` (namespace `21d60f8208ca4dcda50fbf2a9bf29af9`).

No signup data is in this folder. To roll back, upload both modules as multipart with `main_module: "index.js"`, the same compatibility date, and the same `DIBS` binding. Leaving out the binding breaks the signups.
