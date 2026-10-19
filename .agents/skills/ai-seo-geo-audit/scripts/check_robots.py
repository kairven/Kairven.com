#!/usr/bin/env python3
"""Check a site's robots.txt for AI search, user-triggered and training crawlers.

Usage:
    python3 check_robots.py https://example.com [/path ...]
    curl -sL https://example.com/robots.txt | python3 check_robots.py - [/path ...]

The second form reads robots.txt from standard input. Use it when Python can't
verify TLS certificates on your machine, or to test a draft file.

Prints JSON: the robots.txt status, the Sitemap lines, and for each crawler the
group that applies to it and whether each path is allowed. Group selection and
rule matching follow RFC 9309 (the robots exclusion protocol): a crawler obeys
the group naming it, else the `*` group; the longest matching rule wins and
Allow wins a tie. Standard library only.
"""

import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

USER_AGENT = "ai-seo-geo-audit/1.0 (+https://github.com/Cited-io/ai-seo-geo-checklist)"

# Product tokens as each company documents them. Role decides how a block is reported.
CRAWLERS = [
    ("OAI-SearchBot", "search", "OpenAI"),
    ("ChatGPT-User", "user", "OpenAI"),
    ("GPTBot", "training", "OpenAI"),
    ("Claude-SearchBot", "search", "Anthropic"),
    ("Claude-User", "user", "Anthropic"),
    ("ClaudeBot", "training", "Anthropic"),
    ("PerplexityBot", "search", "Perplexity"),
    ("Perplexity-User", "user", "Perplexity"),
    ("Googlebot", "search", "Google"),
    ("Google-Extended", "training", "Google"),
    ("Bingbot", "search", "Microsoft"),
    ("Applebot", "search", "Apple"),
    ("Applebot-Extended", "training", "Apple"),
]


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            body = resp.read(512 * 1024).decode("utf-8", errors="replace")
            return resp.status, resp.geturl(), resp.headers.get("Content-Type", ""), body
    except urllib.error.HTTPError as err:
        return err.code, url, err.headers.get("Content-Type", ""), ""
    except Exception as err:  # network errors are reported, not raised
        return None, url, "", str(err)


def parse(text):
    """Return (groups, sitemaps). Each group is {agents: [...], rules: [(allow, pattern)], delay}."""
    groups, sitemaps = [], []
    current, last_was_agent = None, False
    for raw in text.splitlines():
        line = raw.split("#", 1)[0].strip()
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        key, value = key.strip().lower(), value.strip()
        if key == "user-agent":
            if current is None or not last_was_agent:
                current = {"agents": [], "rules": [], "delay": None}
                groups.append(current)
            current["agents"].append(value.lower())
            last_was_agent = True
            continue
        last_was_agent = False
        if key == "sitemap":
            sitemaps.append(value)
        elif current is not None and key in ("allow", "disallow"):
            if value or key == "allow":
                current["rules"].append((key == "allow", value))
        elif current is not None and key == "crawl-delay":
            current["delay"] = value
    return groups, sitemaps


def group_for(agent, groups):
    token = agent.lower()
    named = [g for g in groups if token in g["agents"]]
    if named:
        merged = {"agents": [token], "rules": [], "delay": None}
        for g in named:
            merged["rules"] += g["rules"]
            merged["delay"] = merged["delay"] or g["delay"]
        return "named", merged
    # Apple documents that Applebot follows Googlebot's rules when robots.txt doesn't name Applebot.
    if token == "applebot" and any("googlebot" in g["agents"] for g in groups):
        return "googlebot (Apple's documented fallback)", group_for("Googlebot", groups)[1]
    star = [g for g in groups if "*" in g["agents"]]
    if star:
        merged = {"agents": ["*"], "rules": [], "delay": None}
        for g in star:
            merged["rules"] += g["rules"]
            merged["delay"] = merged["delay"] or g["delay"]
        return "*", merged
    return "none", {"agents": [], "rules": [], "delay": None}


def pattern_to_regex(pattern):
    anchored = pattern.endswith("$")
    if anchored:
        pattern = pattern[:-1]
    regex = "".join(".*" if ch == "*" else re.escape(ch) for ch in pattern)
    return re.compile("^" + regex + ("$" if anchored else ""))


def allowed(path, rules):
    best = None  # (length, allow)
    for allow, pattern in rules:
        if pattern and pattern_to_regex(pattern).match(path):
            length = len(pattern)
            if best is None or length > best[0] or (length == best[0] and allow):
                best = (length, allow)
    return True if best is None else best[1]


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(2)
    site = sys.argv[1]
    paths = sys.argv[2:] or ["/"]
    if site == "-":
        robots_url, status, final_url, ctype = "stdin", 200, "stdin", "text/plain"
        body = sys.stdin.read()
    else:
        if "://" not in site:
            site = "https://" + site
        parts = urllib.parse.urlsplit(site)
        robots_url = f"{parts.scheme}://{parts.netloc}/robots.txt"
        status, final_url, ctype, body = fetch(robots_url)
    result = {
        "robots_url": robots_url,
        "status": status,
        "final_url": final_url,
        "content_type": ctype,
        "looks_like_html": "<html" in body[:2000].lower(),
        "sitemaps": [],
        "crawlers": [],
    }
    if status is None:
        result["error"] = body
        result["note"] = "fetch failed; retry with: curl -sL <site>/robots.txt | python3 check_robots.py -"
        print(json.dumps(result, indent=2))
        return
    if status >= 400 or result["looks_like_html"]:
        # RFC 9309: 4xx means no restrictions; 5xx or unreachable means assume full disallow.
        result["note"] = "robots.txt missing or unusable; 4xx means crawlers may fetch everything, 5xx means they may stop"
        print(json.dumps(result, indent=2))
        return

    groups, sitemaps = parse(body)
    result["sitemaps"] = sitemaps
    for agent, role, company in CRAWLERS:
        source, group = group_for(agent, groups)
        result["crawlers"].append({
            "agent": agent,
            "company": company,
            "role": role,
            "group": source,
            "crawl_delay": group["delay"],
            "paths": {p: allowed(p, group["rules"]) for p in paths},
        })
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
