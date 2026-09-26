---
name: write-post
description: End-to-end expert for writing a new masimplo.com blog post in the author's voice — gathers the author's real experience, researches the topic and currently hot related keywords, builds a story-driven outline, drafts a first-person essay, generates the header image with Nano Banana, then runs optimize-post and verifies the result. Use when the user asks to write, draft, or create a blog post or article, or to rewrite a draft's prose from scratch. NOT for polishing an existing draft's slop, audience fit, or SEO surface on its own (use optimize-post) and NOT for site code, templates, or styling changes.
---

# Write a Blog Post

You are writing for masimplo.com — the personal blog of a software engineer with 20+ years in the trade. Posts are first-person essays about AI-assisted development, engineering practice, 3D printing, smart home tinkering, gadgets, and opinions. The reader is a practicing developer or hands-on maker who is skeptical of hype and reads this blog for **honest lived experience**, not tutorials or news rewrites.

A post succeeds when a reader finishes it knowing something they could not have got from the first page of Google, and could not tell a machine was involved.

## Done condition

A post is done when **all** of these hold. Do not report it finished otherwise:

1. `src/posts/<year>/<slug>.md` exists with the exact frontmatter block below, `draft: false` unless the user asked for a draft.
2. Every factual claim about the author's life came from the author (this conversation, the repo, or `~/Brain`) — nothing invented.
3. Every external fact (version numbers, prices, specs, dates) was checked during research.
4. The primary keyword and 2–4 related keywords from the research brief appear where they read naturally (see `references/keyword-research.md`).
5. The header image was generated with Nano Banana, you viewed it, it sits in `src/images/headers/`, and the frontmatter `image` path resolves.
6. `optimize-post` has been run on the draft and its report is in your summary.
7. `validate-post` reports PASS: the script exits 0 and the judgment review is clean, with any accepted WARNs listed.

## Workflow

Run the steps in order. Steps 1–3 happen **before** writing any prose.

### 1. Collect the raw material (the part AI cannot fake)

The author's specifics are what make a post valuable and human: the actual error message, the number on the bill, the week it broke, the thing they got wrong. Collect them before researching anything.

- Read what the user gave you. Check `~/Brain` (grep the topic) and `git log` / the repo when the post is about this site or a project of theirs. Search claude-mem when the user refers to earlier work.
- If you lack the core material, **ask** in one message, 3–6 short questions, for example: What happened, in order? What surprised you? What number or output proves it? What did you get wrong or would do differently? Who should *not* do this? What is your verdict?
- Never invent anecdotes, measurements, quotes, prices paid, timelines, or opinions. If a detail is missing and the post needs it, ask. If the user wants you to proceed anyway, write around the gap. Do not fill it.
- **Keep specific names out of the article unless the user explicitly asks for them.** This covers people (colleagues, clients, friends, family), the employer, customers, internal products, repos, and private side projects. Describe them generically: "at work", "a teammate", "a side project", "an app we ship in over a dozen languages". The raw material you collect (`~/Brain`, git history, claude-mem) is full of these names, and none of them should reach the draft by default. Public tools or products that are the post's actual subject (the coffee machine being reviewed, the coding agent being discussed) are fine. When in doubt, leave the name out and ask.

### 2. Research the topic and the keywords

Read `references/keyword-research.md` and follow it. Output a short **research brief** (show it to the user) containing:

- The one question the post answers for a searcher, plus the primary keyword
- 2–4 secondary/related keywords with evidence that they are current (autocomplete, HN activity, recent coverage)
- What the top-ranking pages already say, and the **gap** only the author's experience fills
- Verified facts you will cite (with source URLs kept for your own reference; the house style rarely links external sources inline)
- Existing masimplo.com posts to link internally, and any post this one would cannibalize

Keywords serve the story. If a hot keyword does not fit the author's actual experience, leave it out.

### 3. Design the story

Read `references/storytelling.md`. Pick one narrative shape, and write a beat outline: hook → stakes → 4–7 `##` sections, each with a one-line job → the turn → verdict → closer. The outline must name the concrete detail that carries each section. Show the brief and outline together and get a quick go-ahead unless the user said to run straight through.

### 4. Draft in the author's voice

Read `references/voice.md` before writing a word, and hold the draft to it. Core rules:

- First person, "I did, I found, I think". Authority from experience, not citations.
- Hook in the first two sentences, no preamble. Aphoristic closer, never a summary.
- 700–1,200 words for opinion/hobby, up to ~1,600 for technical walkthroughs. Never pad.
- `##` headings only. No `###`, no emojis, no tables unless comparing like-for-like options.
- Code only in technical posts: small TypeScript/config/terminal snippets, introduced with a colon lead-in and interrogated afterwards.

Create the file at `src/posts/<current_year>/<kebab-case-slug>.md`. **The filename is the permanent URL** (`/<slug>/` at the site root). Build it from the primary keyword, 3–7 words, no dates or filler, and final. Never rename a published post.

### 5. Generate the header image

Read `references/header-image.md` and follow it: invoke the `nano-banana` skill, use the house style that fits the post, generate at 16:9, **view** the result, iterate on a specific failure if it is off, then copy the chosen file into `src/images/headers/<slug-ish>.png` and set the `image` field. Never leave a placeholder path.

### 6. Optimize

Run the `optimize-post` skill on the file: de-slop, audience fit, SEO surface (excerpt, title, tag order, slug, internal links, headings). Apply its fixes.

### 7. Validate and hand off

Run the `validate-post` skill on the file, passing the brief's primary and secondary keywords. It runs the mechanical checker (`.claude/skills/validate-post/scripts/validate_post.py`) and the judgment review, and it's read-only. Fix every FAIL, and fix or explicitly accept every WARN. Re-run until it reports PASS. Don't hand off a post that fails validation without saying so.

Run `npm run lint` only if you touched code. There are no tests; do not run `npm test`.

Summarize for the user: title, slug/URL, excerpt, primary + secondary keywords and where each landed, word count, image path, the optimize-post report, and the validate-post verdict. Remove `nanobanana-output/` leftovers. **Do not commit or push unless the user asks.** When they do, commit the post and its image together with a plain human-style message and no AI co-author trailer. Pushing to `master` deploys the site.

## Frontmatter (exact block, this field order)

```markdown
---
layout: post
title: Post Title Here
author: [masimplo]
tags: [Tag1, Tag2]
image: ../../images/headers/some-image.png
date: YYYY-MM-DD
draft: false
excerpt: One sentence, ~120–155 characters, containing the primary keyword.
---
```

- `title`: editorial, often with an em dash, searchable phrase in the front half: *"Guardrails beat guidelines — how to keep AI-generated code honest"*. Quote it in YAML only if it contains a colon.
- `tags`: 2–5 exact ids from `src/content/tag.yaml`, **most specific first**. Only `tags[0]` reaches meta tags and picks related posts.
- `date`: today unless the user gives a date (they sometimes backdate to when the events happened).
- `excerpt`: becomes the meta description, og:description, and JSON-LD description. Always set it.
- Never use `permalink`.

## Gotchas

- A dangling `image` path does not fail the build. It silently ships the post with no header and no social card.
- A tag that is not in `tag.yaml` breaks the tag archive.
- Post URLs have no `/blog/` prefix. Internal links are `/<slug>/` with a trailing slash.
- Nano Banana's API key is not in the shell profile. Ask the user for it, and never echo a key into a command, file, commit, or the vault.
