#!/usr/bin/env python3
"""Inspect one page the way a crawler without JavaScript sees it.

Usage:
    python3 inspect_page.py https://example.com/page
    curl -sL https://example.com/page | python3 inspect_page.py - https://example.com/page

The second form reads the HTML from standard input (status and headers then come
from `curl -sIL`). Use it when Python can't verify TLS certificates on your machine.

Prints JSON with the HTTP status, redirects, X-Robots-Tag, the robots meta tags,
canonical, title, headings, the first paragraph, visible text length, JSON-LD
blocks (parsed), dates, author hints, tables and data-nosnippet use.
It reads only the raw HTML the server sends. Standard library only.
"""

import json
import re
import sys
import urllib.error
import urllib.request
from html.parser import HTMLParser

USER_AGENT = "ai-seo-geo-audit/1.0 (+https://github.com/Cited-io/ai-seo-geo-checklist)"
MAX_BYTES = 3 * 1024 * 1024
SKIP_TEXT = {"script", "style", "noscript", "template", "svg"}


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title, self.meta, self.links = "", [], []
        self.headings, self.paragraphs, self.jsonld_raw = [], [], []
        self.tables = self.nosnippet = 0
        self.times, self.text_parts = [], []
        self.lang = None
        self._stack, self._buf, self._capture = [], [], None

    def handle_starttag(self, tag, attrs):
        a = {k.lower(): (v or "") for k, v in attrs}
        if tag == "html":
            self.lang = a.get("lang")
        if "data-nosnippet" in a:
            self.nosnippet += 1
        if tag == "meta":
            self.meta.append(a)
        elif tag == "link":
            self.links.append(a)
        elif tag == "table":
            self.tables += 1
        elif tag == "time":
            self.times.append(a.get("datetime", ""))
        if tag == "script" and a.get("type", "").lower() == "application/ld+json":
            self._capture, self._buf = "jsonld", []
        elif tag == "title" and (self.title or "svg" in self._stack):
            pass  # keep the document title, not an SVG <title>
        elif tag in ("title", "h1", "h2", "h3", "p") and self._capture is None:
            self._capture, self._buf = tag, []
        self._stack.append(tag)

    def handle_endtag(self, tag):
        if self._capture == tag or (self._capture == "jsonld" and tag == "script"):
            text = "".join(self._buf).strip()
            if self._capture == "jsonld":
                self.jsonld_raw.append(text)
            elif self._capture == "title":
                self.title = re.sub(r"\s+", " ", text)
            elif self._capture == "p":
                if len(text) > 40:
                    self.paragraphs.append(re.sub(r"\s+", " ", text))
            else:
                self.headings.append((self._capture, re.sub(r"\s+", " ", text)))
            self._capture = None
        if tag in self._stack:
            while self._stack and self._stack.pop() != tag:
                pass

    def handle_data(self, data):
        if self._capture:
            self._buf.append(data)
        if not any(t in SKIP_TEXT for t in self._stack):
            self.text_parts.append(data)


def jsonld_types(node, found):
    if isinstance(node, list):
        for item in node:
            jsonld_types(item, found)
    elif isinstance(node, dict):
        t = node.get("@type")
        if t:
            found.append(node)
        for key in ("@graph", "mainEntity", "publisher", "author", "itemListElement"):
            if key in node:
                jsonld_types(node[key], found)


def main():
    if len(sys.argv) not in (2, 3):
        print(__doc__)
        sys.exit(2)
    if sys.argv[1] == "-":
        url = sys.argv[2] if len(sys.argv) == 3 else "stdin"
        body = sys.stdin.read()[:MAX_BYTES]
        status, final_url, content_type, x_robots = "see curl -sIL", url, None, None
    else:
        url = sys.argv[1]
        req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept": "text/html"})
        try:
            resp = urllib.request.urlopen(req, timeout=30)
            status, final_url = resp.status, resp.geturl()
            content_type, x_robots = resp.headers.get("Content-Type"), resp.headers.get_all("X-Robots-Tag")
            charset = resp.headers.get_content_charset() or "utf-8"
            body = resp.read(MAX_BYTES).decode(charset, errors="replace")
        except urllib.error.HTTPError as err:
            print(json.dumps({"url": url, "status": err.code, "x_robots_tag": err.headers.get_all("X-Robots-Tag")}, indent=2))
            return
        except Exception as err:
            print(json.dumps({"url": url, "error": str(err),
                              "note": "retry with: curl -sL <url> | python3 inspect_page.py - <url>"}, indent=2))
            return

    page = Page()
    page.feed(body)

    robots_meta = {}
    description = None
    for m in page.meta:
        name = (m.get("name") or m.get("property") or "").lower()
        if name in ("robots", "googlebot", "bingbot", "googlebot-news"):
            robots_meta[name] = m.get("content", "")
        elif name == "description":
            description = m.get("content", "")
    canonical = [l.get("href") for l in page.links if "canonical" in l.get("rel", "").lower().split()]

    blocks, errors, entities = [], [], []
    for raw in page.jsonld_raw:
        try:
            data = json.loads(raw)
            blocks.append(data)
            jsonld_types(data, entities)
        except ValueError as err:
            errors.append(f"invalid JSON-LD: {err}")

    summary = []
    for e in entities:
        t = e.get("@type")
        if t in ("ListItem", "Question", "Answer"):
            continue
        item = {"type": t}
        for key in ("name", "url", "logo", "sameAs", "address", "telephone", "datePublished",
                    "dateModified", "author", "headline", "aggregateRating"):
            if key in e:
                value = e[key]
                item[key] = value if key == "sameAs" or not isinstance(value, (dict, list)) else "present"
        summary.append(item)

    text = re.sub(r"\s+", " ", " ".join(page.text_parts)).strip()
    date_hints = sorted(set(re.findall(
        r"(?:Updated|Last updated|Published|Posted)[:\s]+[A-Z]?[a-z]*\.?\s?\d{1,2},?\s\d{4}|\d{4}-\d{2}-\d{2}", text)))[:5]
    author_meta = [m.get("content") for m in page.meta if (m.get("name") or "").lower() == "author"]

    print(json.dumps({
        "url": url,
        "final_url": final_url,
        "status": status,
        "content_type": content_type,
        "x_robots_tag": x_robots,
        "lang": page.lang,
        "title": page.title,
        "meta_description": description,
        "robots_meta": robots_meta,
        "canonical": canonical,
        "h1": [h for tag, h in page.headings if tag == "h1"],
        "outline": [f"{tag}: {h}" for tag, h in page.headings][:40],
        "first_paragraph": page.paragraphs[0] if page.paragraphs else None,
        "visible_text_chars": len(text),
        "visible_text_start": text[:300],
        "jsonld_entities": summary,
        "jsonld_errors": errors,
        "time_datetimes": page.times[:5],
        "date_hints_in_text": date_hints,
        "author_meta": author_meta,
        "tables": page.tables,
        "data_nosnippet_elements": page.nosnippet,
    }, indent=2, ensure_ascii=False, default=str))


if __name__ == "__main__":
    main()
