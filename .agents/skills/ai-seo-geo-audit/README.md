# Install the AI SEO and GEO audit skill (Claude Code, Codex and other agents)

**`ai-seo-geo-audit` is an agent skill that audits a website for AI search visibility.** It fetches robots.txt, the sitemap, llms.txt, the JSON-LD and the page HTML. Then it reports pass, warn or fail for each item of the [AI SEO and GEO checklist](https://github.com/Cited-io/ai-seo-geo-checklist/blob/main/CHECKLIST.md). It follows the open [Agent Skills format](https://agentskills.io/specification): a folder with a `SKILL.md`, plus `references/` and `scripts/`. So it works in any agent that reads that format.

**Requirements:** `curl`, and Python 3 for the two helper scripts (standard library only). Without Python, the agent reads the raw files itself.

## Claude Code

**Option 1: plugin (recommended).** Inside Claude Code, run:

```text
/plugin marketplace add Cited-io/ai-seo-geo-checklist
/plugin install ai-seo-geo@cited-io
```

From your shell, the same thing is:

```bash
claude plugin marketplace add Cited-io/ai-seo-geo-checklist
claude plugin install ai-seo-geo@cited-io
```

Plugin skills are named after their plugin, so you run this one as `/ai-seo-geo:ai-seo-geo-audit https://example.com`. Claude also picks it up on its own when you ask for an AI SEO or GEO audit.

**Option 2: copy the folder.** Personal skills live in `~/.claude/skills/<name>/`. Project skills live in `.claude/skills/<name>/`, inside a repository you commit.

```bash
git clone https://github.com/Cited-io/ai-seo-geo-checklist.git
mkdir -p ~/.claude/skills
cp -r ai-seo-geo-checklist/skills/ai-seo-geo-audit ~/.claude/skills/
```

Then run `/ai-seo-geo-audit https://example.com`, or ask "run an AI SEO audit of example.com".

Docs: [Claude Code skills](https://code.claude.com/docs/en/skills), [plugin marketplaces](https://code.claude.com/docs/en/plugin-marketplaces).

## OpenAI Codex

Codex reads skills from `.agents/skills` in your repository (from the current folder up to the repository root) and from `~/.agents/skills` for your user.

```bash
git clone https://github.com/Cited-io/ai-seo-geo-checklist.git
mkdir -p ~/.agents/skills
cp -r ai-seo-geo-checklist/skills/ai-seo-geo-audit ~/.agents/skills/
```

In the Codex CLI or IDE extension, type `$ai-seo-geo-audit` (or pick it from `/skills`). Codex also chooses the skill on its own when your request matches its description.

Docs: [Codex skills](https://learn.chatgpt.com/docs/build-skills).

## Any agent, with the `skills` CLI

The open-source [`skills` CLI](https://github.com/vercel-labs/skills) installs skills from a GitHub repository into the agents it finds on your machine. That includes Claude Code, Codex, Cursor, OpenCode and others.

```bash
npx skills add Cited-io/ai-seo-geo-checklist
```

To target one agent, add `-a`, for example `-a claude-code` or `-a codex`. Add `-g` to install for your user instead of the current project. If you run it from inside an agent session, pass `-a`, so it installs where that agent looks.

## Other agents

Any tool that supports Agent Skills can load the folder as it is. Copy `skills/ai-seo-geo-audit/` into that tool's skills directory, keeping `SKILL.md`, `references/` and `scripts/` together. See the [Agent Skills specification](https://agentskills.io/specification).

## What it needs and what it sends

- **Requests:** it makes ordinary HTTPS requests to the site you name: about 15 at most, one at a time.
- **Identity:** it never poses as a search or AI crawler.
- **Privacy:** nothing is sent anywhere else.

## Check the scripts yourself

```bash
curl -sL https://example.com/robots.txt | python3 skills/ai-seo-geo-audit/scripts/check_robots.py - / /pricing
curl -sL https://example.com/ | python3 skills/ai-seo-geo-audit/scripts/inspect_page.py - https://example.com/
```

Both print JSON. Read them before you run them. They are short and use only the Python standard library.

---

Maintained by [Cited](https://cited.io): AI SEO and GEO agency with its own AI visibility platform. Background reading: [AI SEO and GEO, step by step](https://cited.io/guides/ai-seo).
