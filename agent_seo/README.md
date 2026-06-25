# Siplinx AI — SEO Agent System

Multi-agent pipeline for writing and publishing SEO articles via Claude Code.

## Agents (run via Claude Code: `/agent <name>`)

| Agent              | Command                     | What it does                                    |
| ------------------ | --------------------------- | ----------------------------------------------- |
| `seo-orchestrator` | `/agent seo-orchestrator`   | Write a new article from prompts.csv            |
| `seo-rewriter`     | `/agent seo-rewriter`       | Rewrite existing articles to fix quality issues |
| `seo-approve`      | `/agent seo-approve [slug]` | Publish an approved draft to the live blog      |
| `seo-audit`        | `/agent seo-audit`          | Audit all articles for quality issues           |

## Workflow

```
1. /agent seo-audit          → see which articles need fixing
2. /agent seo-rewriter        → rewrite next article in queue
   → draft saved to agent_seo/drafts/
   → Telegram notification sent
3. You review article preview in Telegram
4. Reply "да" = you want to publish
5. /agent seo-approve [slug]  → publish to siplinx.com
```

## File structure

```
agent_seo/
├── README.md                  ← this file
├── SIPLINX_MASTER_PROMPT.md  ← full writing rules (adapted for Siplinx)
├── prompts.csv               ← topics queue (20 articles)
├── authors.json              ← author profiles
├── telegram_send.py          ← Telegram notification script
└── drafts/                   ← draft articles waiting for approval
    └── [slug].md
```

## prompts.csv status values

| Status        | Meaning                                                  |
| ------------- | -------------------------------------------------------- |
| `pending`     | Not started yet                                          |
| `rewrite`     | Existing article needs rewriting                         |
| `in_progress` | Currently being written                                  |
| `draft`       | Written, saved to drafts/, waiting for Telegram approval |
| `published`   | Live on siplinx.com                                      |

## Rules

- Articles are always in **English**
- Author is **Samal Bekmaganbetova** (for now)
- Word count is **random 2000-4000 words** per article
- Every article has **2-3 internal siplinx.com links with UTM**
- **Zero em dashes** (—) in any published article
- All deploys go to **main branch** via GitHub Actions `actions.yaml`

## Telegram approval

When a draft is ready, the Telegram bot sends:

```
📝 New article draft ready for review

Title: [title]
Keyword: [keyword]
Words: [N]
Slug: granola-alternative-siplinx

Excerpt: [first 140 chars]

Draft file: agent_seo/drafts/[slug].md

Reply да to publish, нет to discard.
To publish, run in Claude Code:
/agent seo-approve [slug]
```

After you reply "да" in Telegram, run `/agent seo-approve [slug]` in Claude Code.

## Adding new topics

Add a row to `prompts.csv`:

```
new-slug,"Article Title","primary keyword","lsi 1, lsi 2, lsi 3",Category,pending,guide,
```
