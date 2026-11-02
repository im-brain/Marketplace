"""Build site/prototype/preview-single-file.html from index.html.

Inlines every local stylesheet (<link rel="stylesheet" href="x.css">) and
local script (<script src="x.js"></script>) so the page opens as one file on
a phone. Images under assets/ are inlined as data: URIs so they show up too.

Run from the repo root:  python3 scripts/build_preview.py
"""
import base64
import mimetypes
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent / "site" / "prototype"
html = (ROOT / "index.html").read_text()


def local(path):
    return not re.match(r"^(https?:)?//", path)


def css(m):
    href = m.group(1)
    if not local(href):
        return m.group(0)
    return "<style>\n" + (ROOT / href).read_text() + "</style>"


def js(m):
    src = m.group(1)
    if not local(src):
        return m.group(0)
    return "<script>\n" + (ROOT / src).read_text() + "</script>"


def asset(m):
    path = m.group(2)
    f = ROOT / path
    if not f.is_file():
        return m.group(0)
    mime = mimetypes.guess_type(f.name)[0] or "application/octet-stream"
    data = base64.b64encode(f.read_bytes()).decode()
    return m.group(1) + "data:" + mime + ";base64," + data + m.group(3)


html = re.sub(r'<link rel="stylesheet" href="([^"]+)">', css, html)
html = re.sub(r'<script src="([^"]+)"></script>', js, html)
html = re.sub(r'((?:src|href)=")(assets/[^"]+)(")', asset, html)
(ROOT / "preview-single-file.html").write_text(html)
print("wrote", ROOT / "preview-single-file.html", f"({len(html) // 1024} KB)")
