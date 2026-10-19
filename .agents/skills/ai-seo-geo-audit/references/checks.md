# Check reference for the AI SEO and GEO audit

Each check has an ID that matches the public checklist. For each one you'll find what to fetch, how to decide the status, the fix, and a source. The statuses are:

- **pass:** meets the check.
- **warn:** works, but is weak or risky.
- **fail:** blocks or clearly hurts AI visibility.
- **info:** worth knowing, but not a defect.
- **not checked:** can't be seen from outside the site. Say what the owner should check instead.

Never mark something pass or fail without evidence you actually fetched.

Numeric thresholds below, such as 160 characters or 500 characters, are rules of thumb for flagging. They are not documented limits, so say so when you use one.

## Technical access (T)

### T1. robots.txt loads
- **Fetch:** `curl -sI <origin>/robots.txt` and `curl -sL <origin>/robots.txt`.
- **pass:** status 200, with plain text that contains `User-agent` lines.
- **warn:** status 404. Crawlers then treat everything as allowed, but you have no control.
- **fail:** status 5xx, a timeout, or an HTML page served as robots.txt. Under RFC 9309, crawlers may treat an unreachable robots.txt as a full disallow.
- **Source:** https://developers.google.com/search/docs/crawling-indexing/robots/intro

### T2. AI search crawlers allowed
- **Agents:** `OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`, `Googlebot`, `Bingbot` and `Applebot`.
- **Run:** `scripts/check_robots.py` with `/` plus the key paths you inspect.
- **fail:** any of these is disallowed from `/` or from a key page.
- **warn:** allowed only through `*` while other AI agents have named groups. That isn't wrong, but it is worth confirming it was intended.
- **Rule details:** a crawler obeys only the most specific group that names it. Apple documents that Applebot follows Googlebot's rules when robots.txt doesn't name Applebot.
- **Sources:**
  - https://developers.openai.com/api/docs/bots ("Sites that are opted out of OAI-SearchBot will not be shown in ChatGPT search answers")
  - https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
  - https://docs.perplexity.ai/guides/bots
  - https://support.apple.com/en-us/119829

### T3. User-triggered fetchers allowed
- **Agents:** `ChatGPT-User`, `Claude-User` and `Perplexity-User`.
- **warn:** disallowed. OpenAI says robots.txt "may not apply" to `ChatGPT-User`, and Perplexity says `Perplexity-User` "generally ignores robots.txt rules". Anthropic says blocking `Claude-User` stops it retrieving your content for user queries.

### T4. Training crawlers: report, don't judge
- **Agents:** `GPTBot`, `ClaudeBot`, `Google-Extended` and `Applebot-Extended`.
- **info:** report allowed or blocked. Blocking them is a legitimate choice. OpenAI, Google and Apple each document that their training token is separate from search inclusion.
- **Flag:** a site that blocks a training agent and also blocks the same company's search agent. Often only the first was intended.
- **Source:** https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers ("does not impact a site's inclusion in Google Search nor is it used as a ranking signal")

### T5. CDN, firewall and bot protection
- **not checked**, always. A real crawler is verified by IP, so a request that fakes its user agent proves nothing. Don't send one.
- **Tell the owner:** check CDN or WAF bot settings and server logs for `403`, `429` or challenge responses to the agents in T2 and T3.
- **Signal to report:** if your own normal request got a challenge page (status 403 or 503 with a challenge body), report it as evidence that bot protection is active.
- **Source:** https://developers.google.com/search/docs/appearance/ai-features ("crawling is allowed in robots.txt, and by any CDN or hosting infrastructure")

### T6. Key pages indexable
- **Fetch:** `curl -sIL <url>` for the status, the redirect chain and `X-Robots-Tag`. Run `scripts/inspect_page.py` for `robots_meta`.
- **fail:** `noindex` in the meta tag or header, a final status other than 200, or a canonical page that redirects.
- **warn:** more than one redirect hop.
- **Source:** https://developers.google.com/search/docs/appearance/ai-features (must be "indexed and eligible to be shown in Google Search with a snippet")

### T7. Snippet controls
- **Look for:** `nosnippet`, `max-snippet:0` or a small `max-snippet`, `noarchive` and `nocache` in the meta tags or `X-Robots-Tag`, and `data-nosnippet` around main content.
- **fail:** `nosnippet` on a page meant to be quoted. Google says it prevents use "as a direct input for AI Overviews and AI Mode".
- **warn:** `noarchive` or `nocache`. Bing documented in 2023 that `NOARCHIVE` keeps content out of its AI answers, and that `NOCACHE` limits them to the URL, title and snippet.
- **warn:** `max-snippet` under about 160.
- **info:** `data-nosnippet` on navigation or boilerplate only.
- **Sources:**
  - https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
  - https://blogs.bing.com/webmaster/september-2023/Announcing-new-options-for-webmasters-to-control-usage-of-their-content-in-Bing-Chat

### T8. Content in server HTML
- **Fetch:** `scripts/inspect_page.py`. Compare `visible_text_chars`, `h1` and `first_paragraph` with what the page shows in a browser.
- **fail:** no H1 and under about 500 characters of visible text in the raw HTML, such as an app shell like `<div id="root"></div>`.
- **warn:** the H1 is present but the main body is missing or truncated.
- **Source:** https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics ("not all bots can run JavaScript")

### T9. Canonical
- **pass:** one absolute canonical pointing to the page itself, or to a deliberate preferred URL.
- **warn:** missing, relative, or more than one canonical.
- **fail:** every page's canonical points to the home page, or it points to a URL that doesn't return 200.
- **Source:** https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls

### T10. Internal links
- **warn:** a key page (pricing, product, about) isn't linked from the home page's HTML.
- **Otherwise:** not checked beyond the pages you fetch.
- **Source:** https://developers.google.com/search/docs/appearance/ai-features

### T11. Sitemap
- **Fetch:** the `Sitemap:` lines from robots.txt. If there are none, try `<origin>/sitemap.xml` and `<origin>/sitemap_index.xml`.
- **fail:** no sitemap found, or it is not valid XML.
- **warn:**
  - not listed in robots.txt;
  - no `<lastmod>` at all;
  - every URL has the same `<lastmod>`, which suggests generated, not real, dates;
  - more than 50,000 URLs in one file;
  - URLs on a different host or protocol.
- **Report:** the URL count and the newest and oldest `lastmod`.
- **Source:** https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap

### T12. Search Console and Bing Webmaster Tools
- **not checked.** Ask the owner to confirm both are verified and the sitemap is submitted.
- **Mention:** Google's Generative AI performance report and Bing's AI Performance report.

### T13. IndexNow
- **not checked**, unless the owner tells you the key, since the key file name is the secret key. Then confirm `<origin>/<key>.txt` returns the key.
- **Participants:** https://www.indexnow.org/searchengines.json (Google is not listed).

### T14. llms.txt
- **Fetch:** `curl -sIL <origin>/llms.txt`.
- **info** only. Never pass or fail. Report present or absent. If present, report whether it starts with an H1 (the only required part of the proposal) and whether its links resolve. Sample at most 5.
- **Context to include:** Google says such files "will neither harm nor help" visibility in Search.
- **Sources:** https://llmstxt.org/ and https://developers.google.com/search/docs/fundamentals/ai-optimization-guide

## Entity and identity (E)

### E1. Organization JSON-LD on the home page
- **pass:** the home page has `Organization`, or a subtype such as `LocalBusiness` or `Corporation`, with `name` and `url`, plus `logo`.
- **warn:** present but missing `logo` or `sameAs`.
- **fail:** absent, or the JSON-LD doesn't parse (`jsonld_errors`).
- **Source:** https://developers.google.com/search/docs/appearance/structured-data/organization

### E2. sameAs
- **pass:** at least 3 official profiles, and every one returns 200 or a normal redirect. Sample with `curl -sIL`. Some social sites block scripted requests; report those as "could not verify", not as broken.
- **warn:** fewer than 3, or the home page footer links to profiles that `sameAs` leaves out.

### E3. Markup matches the page
- **Compare:** the JSON-LD `name`, `telephone`, `address` and ratings with the visible text.
- **fail:** a rating or review count in the markup that doesn't appear on the page.
- **warn:** other mismatches.
- **Source:** https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data

### E4. Consistent identity
- **Partly checkable.** Compare the brand name and description in the `<title>`, the `og:site_name`, the Organization `name` and the About page.
- **warn:** the brand name is spelled more than one way.

### E5. About page
- **Find:** a link containing "about" in the home page HTML, and inspect it.
- **pass:** the first paragraph defines the company ("X is a … for …").
- **warn:** missing, or it opens with a slogan.

### E6. Authors
- On article pages, look for a visible byline, an `author` in JSON-LD or meta, and a link to a bio.
- **warn:** none of these.
- **Source:** https://developers.google.com/search/docs/fundamentals/creating-helpful-content

### E7 and E8
- **not checked.** Mention them only if the brand name is generic or shared, which you'll notice when fetched profiles describe a different company.

## Content (C), on the pages you inspect

### C1. Answer first
- Read `h1` and `first_paragraph`.
- **pass:** the first paragraph directly answers or defines what the H1 asks or names.
- **warn:** it opens with background, a slogan or a question.

### C2. One question per page
- **warn:** a page with no clear single topic in its H1, or more than one H1 with different topics.

### C3. Subheadings
- **warn:** a long page (over 1,500 visible characters of body) with no H2s, or with vague H2s ("Overview", "More").

### C4. Evidence
- Scan the body text for numbers, named sources or outbound links to primary sources, and attributed quotations.
- **warn:** a commercial or guide page with none of these.
- **Source:** https://arxiv.org/abs/2311.09735

### C7. Facts as text
- **warn:** the pricing page has no price, range or plan names in the raw HTML text.

### C8. Dates
- Look for `datePublished`/`dateModified` in JSON-LD, `<time datetime>`, or "Updated" text.
- **warn:** an article or guide with no date.
- **info:** the `dateModified` equals today's date on every page, which suggests an automatic date, not a real update.

### C5, C6, C9, C10, C11
- **not checked** automatically. Note obvious issues only if you saw them.

## Local (L): only if the site is a local business

Signs of a local business: an address in the footer, a `LocalBusiness` type, or a locations page.

- **L5:**
  - **pass:** each location page has `LocalBusiness`, or a subtype, with `address`, `telephone` and opening hours.
  - **warn:** one sitewide block for several locations.
  - **fail:** no LocalBusiness markup.
  - **Source:** https://developers.google.com/search/docs/appearance/structured-data/local-business
- **L6:** compare the name, address and phone in the footer, the location page and the JSON-LD.
  - **warn:** any mismatch.
- **L1 to L4 and L7:** **not checked.** Tell the owner to confirm their Google Business Profile, Bing Places and Apple Business listings, and to test local prompts from the location.

## Off-site (O) and measurement (M)

- **not checked.** These need prompt tracking across engines over time, not a site crawl.
- **Close with:** list the off-site and measurement checks as next steps, with one line each.
