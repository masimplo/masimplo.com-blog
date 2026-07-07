---
name: write-post
description: Write a new blog post for masimplo.com in the author's established voice — a tight, first-person tech essay grounded in lived experience. Use when drafting a new post or rewriting a draft's prose from scratch. NOT for polishing an existing draft's slop, audience fit, or SEO surface (use optimize-post) and NOT for site code, templates, or styling changes.
---

# Write a Blog Post

Write a post for masimplo.com in the author's voice. The user provides a topic, and optionally an angle, target length, code examples, or year folder. If no topic is given, ask before proceeding.

Create the file at `src/posts/<current_year>/<kebab-case-slug>.md`. The filename becomes the permanent URL (`/slug/`, at the site root) — make it short, keyword-bearing, and final.

## The reader

A practicing software engineer or hands-on maker. Assume they know what CI, TypeScript, and a linter are — never explain basics. They read this blog for honest first-person experience, not tutorials or news coverage.

## Frontmatter (exact block, this field order)

```markdown
---
layout: post
title: Post Title Here
author: [masimplo]
tags: [Tag1, Tag2]
image: ../../images/headers/PLACEHOLDER.jpg
date: YYYY-MM-DD
draft: false
---
```

- `title`: unquoted unless it contains a colon. Titles are editorial, often with an em dash: *"Guardrails beat guidelines — how to keep AI-generated code honest"*, *"The Voron build was hard — owning one is the real project"*.
- `tags`: 2–5 tags, inline array with spaces, exact TitleCase ids from `src/content/tag.yaml`. Put the **most relevant tag first** — only `tags[0]` reaches meta tags and picks related posts. Typical combos: `[AI, Code, Tools]`, `[Technology, AI, Code, Opinions]`, `[3D Printing, Hobbies]`, `[Smart Home, Technology, Hobbies]`.
- `excerpt` (optional eighth field): add one for posts that matter — a single punchy sentence, often identical to the post's first line. It becomes the meta description.
- Never use `permalink`. Never use `###` headings.

## Voice

First person, grounded in lived experience. Authority comes from "I have been doing X" — *"I have been shipping AI-assisted code in production for a while now"* — never from citations or theory. Specifics over abstractions: name the tool, the error, the week it happened.

Signature moves, all verified against the strongest posts:

- **Em dashes** are the signature punctuation — asides, reveals, titles. Use them liberally.
- **One bold phrase per section**, flagging that section's thesis: *"**guardrails that say no.**"* Not more.
- *Italics* stress a single pivotal word mid-sentence (*deciding*, *context*, *not*).
- **Long-then-short rhythm**: a clause-heavy sentence, then a terse verdict. *"Speed is not wisdom."* Occasional fragments and triads for punch.
- **Dry, deadpan humor** in asides — *"the function quietly does the wrong thing on the third Tuesday of the month"* — never zany, never jokey headers.
- **Direct second person** to pull the reader in: *"Treat it like one."*, *"You still lock the doors."*
- **Rhetorical questions** as pivots: *"was that intentional? Nobody said."*
- **Honesty markers**: admit what you got wrong or glossed over. *"My actual honest opinion"*, *"I underestimated..."*
- **One extended analogy** per argument post (AI as junior hire, architect vs builder) — introduce it, use it, then stress-test where it breaks.

## Structure

1. **Hook, no preamble** — 2–4 short un-headed paragraphs. The best openers are setup-then-subversion: *"Smart home products love to sell you convenience. What they do not mention is that most of that convenience runs through someone else's server."* Or a personal anecdote: *"I fell from a step ladder while doing electrical work in the garage of our new house."*
2. **4–7 `##` sections** with short, voice-forward, often wry headings: *"The 'guidelines' trap"*, *"Where this stops working"*, *"Why bother"*. H2 only.
3. **A prescriptive wrap** near the end when it fits: *"Where to start"*, *"Who this is actually for"*.
4. **Aphoristic closer**, 1–3 sentences, often a callback to the opening or an earlier line: *"Turn them on. Then let the AI cook."*, *"Was any of this easy? No. Was it falling off a ladder hard? Also no."* Never a summary, never "In conclusion".

## Length

700–1,200 words for opinion and hobby pieces; up to ~1,600 for a heavy technical walkthrough. Never pad. If a section adds nothing, cut it.

## Code samples

Only in technical posts; opinion/hobby posts often have none. TypeScript is the default language. Small, self-contained snippets — a function, a config block, three tests — never long listings. Introduce with a colon lead-in (*"The model produces something like:"*) and follow immediately with prose that **interrogates** the code (*"It is not wrong. It compiles. Except..."*), not merely describes it.

## Links and images

- Internal links are root-relative slugs with trailing slash, woven into the prose as back-references: `I have written before about [using AI agents for development](/vibe-coding-a-developers-honest-take/)`. A `Related:` line near the end is an alternative. Verify the target filename exists under `src/posts/`.
- One header image in frontmatter, **no inline body images**.

## Avoid

- Opening with "In this post, I will..." or any announcement of structure.
- Marketing words: powerful, robust, game-changing, revolutionary, seamless.
- Hedging every claim; commit to a position, then note the exceptions honestly.
- Second person as the dominant register — the spine is "I did, I found, I think".
- Emojis, `###` headings, tables (unless comparing options with identical attributes).

## After writing

1. Run the `optimize-post` skill on the draft (slop scan, audience fit, SEO surface).
2. Remind the user to add a real header image to `src/images/headers/` and update the `image` field — a dangling path does not fail the build; it silently ships the post with no header and no social-card image.
3. Verify every tag exists as an exact `id` in `src/content/tag.yaml`.
