---
name: validate-post
description: Validate a masimplo.com post and its header image against the house spec before publishing — runs a mechanical checker (frontmatter, tags, image file/aspect/size, slug, links, headings, length, slop phrases, keyword placement) and then a judgment review (voice, story value, fact sourcing, keyword naturalness, image quality). Read-only; produces a PASS/FAIL report. Use after write-post or optimize-post, before committing, or when the user asks to check, validate, lint, or review a post. NOT for fixing the issues (hand them to optimize-post or edit on request) and NOT for site code.
---

# Validate a Post

Checks that a post and its assets match the spec in `write-post` (SKILL.md plus `references/`) and `optimize-post`. **This skill is read-only.** It reports problems and doesn't fix them unless the user asks. Keeping validation separate from editing is what makes the verdict trustworthy.

Input: the post path, e.g. `src/posts/2026/<slug>.md`. If none is given, use the most recently modified file under `src/posts/` and say which one you picked. If the post came from a `write-post` run in this conversation, also collect its **research brief** (primary and secondary keywords) and the author's raw material.

## Step 1 — Mechanical checks (script)

```bash
python3 .claude/skills/validate-post/scripts/validate_post.py src/posts/<year>/<slug>.md \
  --keyword "<primary keyword>" --secondary "<kw2>" --secondary "<kw3>"
```

Skip `--keyword`/`--secondary` if no brief exists and note that keyword checks were skipped. Add `--kind technical` for a code-heavy walkthrough; otherwise the kind is inferred from code fences. Exit code 1 means at least one FAIL.

What it covers:

| Area | FAIL | WARN |
|---|---|---|
| Location/slug | not `src/posts/<yyyy>/<slug>.md`, not kebab-case, date in slug | slug length outside 2–9 words |
| Frontmatter | missing field, wrong order (`layout,title,author,tags,image,date,draft,excerpt`), `permalink`, layout ≠ `post`, author ≠ `[masimplo]`, unquoted colon in title/excerpt, bad date, unknown tag, no excerpt | 2–5 tags, excerpt outside 100–165 chars, draft: true, date/folder year mismatch, future date |
| Header image | missing, placeholder, not under `images/headers/`, file not found, < 50 KB (failed generation), wider than 2:1, gitignored | taller than 1.3:1, < 1200 px wide, > 4 MB, non-descriptive filename, reused from another post, leftover `nanobanana-output/` |
| Structure | `###`+ or H1 in body, opens with a heading, inline images, emoji, placeholders (`TODO:`, `TBD`, `[TK]`) | H2 count outside 4–7, tables, closer > 70 words |
| Links | internal link to a missing post or without trailing slash | no internal links, absolute masimplo.com links |
| Length | < 550 words or > range + 300 | outside 700–1,200 (opinion) / 700–1,600 (technical) |
| Voice heuristics | slop phrases ("in this post", "this matters because", "nobody tells you"…), banned words (delve, landscape, leverage, robust, seamless, powerful…) | fillers (> 3 total or "actually" > 1), em dashes > 2 per 100 words, > 1 "it's not X — it's Y", > 3 questions, > 1 bold phrase in a section's prose |
| Keywords | — | primary missing from title / excerpt / first 100 words / an H2 / slug, stuffing, secondary missing or overused |

A banned word inside a quoted product name or error string is legitimate. Mark it **justified** in the report rather than failing the post. Don't edit the script's lists to make a post pass.

Calibration: `validate_post.py --all` runs over every 2025+ post and shows only FAIL/WARN lines (`--since 2011` for the whole archive). Use it after changing the script, so you can see whether a rule change creates false positives on published posts.

## Step 2 — Judgment review (you)

Read the post in full, and re-read `.claude/skills/write-post/references/voice.md` and `storytelling.md` first. Score each item **PASS / FAIL / N/A** with one line of evidence (a quote or line number):

**Truth and value**
1. **Every personal claim is sourced.** List each anecdote, number, price, date, and measurement, and mark where it came from: the author in this conversation, `~/Brain`, the repo or git history, or **UNSOURCED**. Any UNSOURCED personal detail is a FAIL, because it may be invented.
2. **External facts are verified.** Specs, versions, prices, and release dates match the research brief's sources. Spot-check the riskiest one or two with WebSearch if there's no brief.
3. **Value test.** The post delivers at least 3 of: a unique number or measurement, a mistake and its cost, a decision with the rejected alternative, a concrete action for the reader, a clear "who this is *not* for", or a contrarian position backed by the author's own evidence. Name the ones it delivers.
4. **No explaining the basics** to a practicing developer or maker.
4a. **No specific names** of people, the employer, clients, internal products, repos, or private side projects unless the user explicitly asked for them. Public tools or products that are the post's subject are fine. List every proper noun in the post and mark each one OK (public subject or user-approved) or FAIL.

**Story**
5. The hook lands in the first two sentences with a concrete scene or setup-then-subversion, and no preamble.
6. One recognizable narrative shape (investigation, measured change, expectation vs. ownership, argument, or build log) with a turn before about 60% of the way through.
7. Every section has a job you can state in one line. Section lengths vary.
8. The closer is 1–3 sentences, calls back to a concrete detail, and isn't a summary or a restated thesis.
9. If there's an extended analogy, there's only one, and it gets stress-tested ("where it breaks").

**Voice** (the tells the script can't see)
10. First-person spine ("I did, I found, I think"). Second person only in the prescriptive part.
11. No paragraph-ending zinger on most paragraphs. No triads everywhere. No metronomic sentence lengths.
12. Committed verdict with honest exceptions, and no hedging on every claim.
13. Read three random paragraphs aloud. Could they have come from any other blog? If so, FAIL with the quotes.

**SEO naturalness**
14. Each keyword sentence passes the out-of-place test: it wouldn't read as written for Google.
15. The title keeps the editorial voice with the searchable phrase in its front half. `tags[0]` is the most specific relevant tag.
16. Internal link anchors are descriptive and fit the prose ("click here" or bare slugs fail).

**Header image** — view it with the Read tool, and read `.claude/skills/write-post/references/header-image.md`
17. Matches a house style: dark tech (indigo/violet, glowing UI) for code/AI, warm editorial illustration for physical/lifestyle.
18. Shows the post's thesis as a visual metaphor rather than a generic stock scene.
19. No rendered text, logos, watermarks, garbled details, extra fingers, or faces of real people.
20. Real objects are drawn accurately (shape, where the ports and controls sit) compared with the research.
21. The subject is centred with margins, so it survives an 800px-tall `cover` crop and a social-card crop.

## Step 3 — Report

```
VALIDATION: <slug> — PASS | FAIL
Mechanical: <n> fail, <n> warn  (keywords checked: yes/no)
  FAIL …            ← each, with the fix owner: optimize-post / write-post / author input / regenerate image
  WARN …            ← each, marked "fix" or "accept: <reason>"
Judgment:
  FAIL #1 Unsourced: "the €80/year saving" — ask the author
  …
  PASS #3 Value: unique measurement, rejected alternative, reader action
Verdict: <ready to publish | blocked on N items>
```

The overall result is **PASS only if** the script exits 0, every judgment item is PASS or N/A, and every WARN is either fixed or explicitly accepted with a reason. Don't round up. If something couldn't be checked (image won't open, no brief, no network for fact checks), say so and don't mark it PASS.

After reporting, offer to apply fixes: slop, voice, and SEO items go to `optimize-post`, a bad image goes back through `write-post` step 5, and unsourced claims go to the author as questions.
