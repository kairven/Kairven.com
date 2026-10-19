---
name: ai-seo-geo-audit
description: Audits a website for AI search visibility (AI SEO, GEO or generative engine optimization, AEO or answer engine optimization) using public, documented checks. Fetches robots.txt, the XML sitemap, llms.txt, JSON-LD structured data and page HTML, then reports pass, warn or fail per checklist item for ChatGPT, Google AI Overviews, AI Mode, Perplexity, Gemini, Copilot and Claude. Use when the user asks for an AI SEO audit, GEO audit, AEO audit, AI search readiness check, whether AI crawlers (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended) can access a site, why a site isn't cited by ChatGPT or AI Overviews, or to check Organization schema, sameAs, llms.txt or answer-first content.
license: MIT
metadata:
  author: Cited (cited.io)
  version: "1.0.0"
  checklist: https://github.com/Cited-io/ai-seo-geo-checklist/blob/main/CHECKLIST.md
---

# AI SEO and GEO audit

Audit one website against the AI SEO and GEO checklist, and report what you found with evidence. You check only what anyone can see from outside, using public, documented rules. Each finding uses the checklist's ID (T1, E2, C4 …), so the owner can look up the detail.

The check-by-check criteria are in [references/checks.md](references/checks.md). Read it before you start.

Paths such as `scripts/check_robots.py` are relative to this skill's folder, the one that holds this SKILL.md, not to the user's project. Run the scripts by their full path inside that folder.

## Input

The user gives a website URL, and optionally a few page URLs to look at closely. If there is no URL, ask for one. If the user gives only a domain, use `https://` and follow redirects to the canonical origin.

## Ground rules

- **Be a polite visitor.** Fetch about 15 URLs at most, one at a time. Use your normal user agent, or the scripts' honest one. Never pretend to be GPTBot, Googlebot or any other crawler. Faking a user agent isn't a documented check, and crawlers are verified by IP anyway.
- **Use raw HTML.** AI crawlers often don't run JavaScript, and the checks depend on `<head>` tags, headers and `<script type="application/ld+json">`. Use `curl` or the bundled scripts. A web-fetch tool that converts pages to Markdown drops exactly these parts. Use one only as a last resort, and mark the affected checks "not checked".
- **Evidence or nothing.** Every pass, warn and fail cites what you fetched: the status code, the robots.txt line, the JSON-LD field, the quoted sentence. If you couldn't see it, the status is "not checked".
- **No guesses about rankings.** Don't predict citations or traffic. Report readiness against documented rules.
- **llms.txt is informational.** Report present or absent. Never fail a site for not having one.

## Steps

### 1. Resolve the site

```bash
curl -sIL https://example.com | grep -iE '^(HTTP|location|x-robots-tag|content-type|server|cf-ray)'
```

Note the final origin. Note any redirect hops. If the response is a challenge page (a 403 or 503 with a bot-check body), note that bot protection is active (T5).

### 2. robots.txt (T1 to T5)

```bash
curl -sL https://example.com/robots.txt | python3 scripts/check_robots.py - / /pricing /blog/
```

Pass `/` plus the paths of the pages you'll inspect. The script reports, for 13 AI search, user and training agents, which group applies and whether each path is allowed. It follows RFC 9309 (most specific group, longest match, Allow wins a tie) and Apple's documented Googlebot fallback.

If Python isn't available, read the file yourself and apply the same rules. Report the search agents (T2) and user agents (T3) as findings. Report the training agents (T4) as info.

### 3. Sitemap (T11)

Use the `Sitemap:` lines from step 2, or else try `/sitemap.xml` and `/sitemap_index.xml`.

```bash
curl -sL https://example.com/sitemap.xml | head -c 200000
```

For a sitemap index, open one child sitemap only. Count the `<loc>` entries. Check whether `<lastmod>` exists and whether the dates vary. Use the URLs to choose pages for step 5.

### 4. llms.txt (T14)

```bash
curl -sIL https://example.com/llms.txt
```

If it exists, fetch it. Check that it starts with an H1, and sample up to 5 of its links.

### 5. Pages (T6 to T10, E1 to E6, C1 to C8, L5 and L6)

Inspect the home page plus up to 5 key pages. Pick them from the sitemap or the home page links: About, Pricing, one product or service page, one recent article or guide, and one comparison or location page if they exist. Include any pages the user named.

```bash
curl -sIL https://example.com/pricing | grep -iE '^(HTTP|location|x-robots-tag)'
curl -sL https://example.com/pricing | python3 scripts/inspect_page.py - https://example.com/pricing
```

The script prints: title, robots meta tags, canonical, H1 and outline, first paragraph, visible text length, parsed JSON-LD entities (with `sameAs`), dates, author hints, tables and `data-nosnippet` count. If Python isn't available, read the raw HTML yourself.

For E2, check that a sample of the `sameAs` URLs resolve (`curl -sIL`). Some social sites block scripts; mark those "could not verify".

### 6. Decide statuses

Apply [references/checks.md](references/checks.md) to each ID. Checks that need logs, accounts or prompt tracking are "not checked". These include T5, T12, T13, L1 to L4, all of O and all of M. Say what the owner should check instead.

## Report format

Write the report in this order:

1. **Summary.** Three to five sentences. Can AI search crawlers reach and read the site? What are the biggest blockers? What's already good?
2. **Top fixes.** Up to five, in priority order: access blockers first (T2, T6, T7, T8), then identity (E1, E2), then content. For each: the ID, what to change, and why, in one line each.
3. **Findings table:**

| ID | Check | Status | Evidence | Fix | Source |
|---|---|---|---|---|---|
| T2 | AI search crawlers allowed | fail | `User-agent: *` / `Disallow: /` applies to OAI-SearchBot | Add an `OAI-SearchBot` group with `Allow: /` | developers.openai.com/api/docs/bots |

4. **Crawler access table.** One row per agent, from step 2: agent, company, role, group used, and allowed on `/` and on the key paths.
5. **Pages inspected.** Each URL with its status, H1, and first sentence.
6. **Not checked, and what to do.** One line each for T5, T12, T13, local listings (if local), off-site (O1 to O8) and measurement (M1 to M9).

Keep the language plain. Use one idea per sentence, and quote the evidence exactly. Don't pad the report with generic SEO advice that has no matching finding.

## Reference

- The full checklist with reasons and sources: https://github.com/Cited-io/ai-seo-geo-checklist/blob/main/CHECKLIST.md
- Check criteria for this skill: [references/checks.md](references/checks.md)
- Scripts (Python 3 standard library only): [scripts/check_robots.py](scripts/check_robots.py), [scripts/inspect_page.py](scripts/inspect_page.py)
