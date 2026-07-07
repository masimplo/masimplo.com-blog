---
name: optimize-post
description: Polish an existing masimplo.com draft post — strip AI-tell slop while preserving the author's voice, tighten it for the target audience (working developers and makers), and set up the SEO surface this Gatsby site actually reads (excerpt, tag order, image, slug, internal links). Use on a written draft before publishing. NOT for drafting a new post from scratch (use write-post) and NOT for site-wide SEO code changes to templates or plugins.
---

# Optimize a Post

Run three passes over the draft, in order. Report what changed after each. Do not restyle the author's voice — em dashes, rhetorical questions, fragments, and deadpan asides are *intentional* here; you are removing generic AI tells and wiring up SEO, not homogenizing the prose.

## Pass 1 — De-slop

Scan the full text and rewrite every hit. Patterns to kill:

**Phrases**
- Throat-clearing: "Here's the thing", "Let me be clear", "It's worth noting", "The truth is", "In today's...", "At its core", "When it comes to".
- Emphasis crutches: "Full stop.", "Let that sink in.", "Make no mistake", "This matters because".
- Marketing words: powerful, robust, seamless, game-changing, revolutionary, deep dive, landscape, leverage, unlock.
- Vague declaratives that announce importance without naming it: "The implications are significant", "The stakes are high". Replace with the specific thing.
- Announcing structure: "In this section...", "As we'll see...", "But that's another post".

**Structures**
- Binary-contrast formulas: "Not X. It's Y.", "The answer isn't X. It's Y.", "It's not about X, it's about Y." State Y directly. (A natural contrastive tail like "concrete branches, not vibes" is fine — the formula is the problem, not contrast itself.)
- Negative listing: "Not a X. Not a Y. A Z." State Z.
- Manufactured profundity: "[Noun]. That's it. That's the post."
- Passive voice hiding the actor; false agency ("the decision emerged" — someone decided).
- Adverb stacks: cut "really", "actually", "genuinely", "simply", "literally" unless one is doing real work in a conversational sentence.
- Lazy extremes ("every developer", "nobody ever") when a specific claim is available.
- Metronomic rhythm: three same-length sentences in a row, or every paragraph ending on a punchy one-liner. Vary it.

**Keep** (author's voice — do not remove): em dashes, one bold thesis phrase per section, italics on pivot words, rhetorical questions, first-person hedges that are honesty ("I underestimated..."), the aphoristic closer.

## Pass 2 — Audience fit

The reader is a practicing software engineer or technical maker, mid-career, skeptical of hype — the person reading posts like *Guardrails beat guidelines* or *Vibe coding: an honest take*.

- Cut any explanation of basics (what a linter is, what CI does, what an LLM is).
- Every major claim should be grounded in the author's experience — flag any paragraph that reads as theory with no "I" in it, and either ground it or cut it.
- Front-load why the reader should care: the hook must land within the first two sentences.
- Check length against the house range: 700–1,200 words for opinion/hobby, up to ~1,600 for technical walkthroughs. If it's over, cut sections — do not compress sentences into fragments.
- Verify one extended analogy maximum, and that it gets stress-tested, not just asserted.

## Pass 3 — SEO surface

These are the only levers this site reads. All verified against `gatsby-node.js`, `gatsby-config.js`, and `src/templates/post.tsx` — do not invent others.

1. **Excerpt = meta description.** Frontmatter `excerpt` feeds meta description, og:description, twitter:description, and JSON-LD. Without it, Gatsby auto-truncates the opening ~140 chars mid-sentence. Write a one-sentence `excerpt` of ~120–155 characters that contains the post's main keyword and reads as a hook — often the post's first line works verbatim.
2. **Title.** Becomes `<title>`, og:title, and JSON-LD headline as-is. Keep the editorial voice, but put the searchable phrase in the front half (e.g. "Guardrails beat guidelines — how to keep AI-generated code honest"). Quote it in YAML only if it contains a colon.
3. **Tag order.** Only `tags[0]` is emitted as `article:tag`/`twitter:data2` and selects related posts shown under the article. Reorder so the most specific relevant tag is first. Every tag must match an `id` in `src/content/tag.yaml` exactly.
4. **Image.** No frontmatter `image` = no og:image, no twitter:image, no JSON-LD image — the post shares as a bare link. Confirm the referenced file exists in `src/images/headers/` (a dangling path fails the build). Flag placeholders loudly.
5. **Slug = filename.** The URL is `/<filename-without-.md>/` at the site root, forever. Check the filename is kebab-case, keyword-bearing, and free of dates or filler words. Renaming after publication breaks the URL (redirects are hand-maintained in `src/static/_redirects`).
6. **Internal links.** Add 1–3 root-relative links (`/other-post-slug/`) to related posts where the prose naturally supports a back-reference. Verify each target filename exists under `src/posts/**`. Descriptive anchor text, never "click here".
7. **Headings.** `##` only. Make sure at least one H2 carries the topic phrase naturally — but keep headings wry and voice-forward, never keyword-stuffed.
8. **`draft: false`** — drafts are excluded from pages, sitemap, and RSS.

## Output

Deliver: the edited file (apply changes directly), then a change report — slop patterns found and fixed (with counts), audience-fit cuts, and each SEO lever checked with its before/after value. Flag anything deliberately kept. If the excerpt, image, or a link target could not be verified in the repo, say so explicitly rather than guessing.
