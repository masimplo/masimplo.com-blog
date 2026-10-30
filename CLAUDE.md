# CLAUDE.md — AI Assistant Guide for masimplo.com-blog

masimplo.com is the personal blog of a software engineer of 20+ years — first-person, essay-style posts about AI-assisted development, software engineering practice, 3D printing, smart home tinkering, and industry opinions, written for practicing developers and hands-on makers. It is an Astro 7 static site (TypeScript strict, plain CSS, a port of the Ghost Casper theme) deployed on Netlify; content is Markdown under `src/posts/<year>/`.

**Writing or editing a post? Use the project skills:** `write-post` (end-to-end: gather the author's material, keyword research, story outline, draft in the author's voice, Nano Banana header image, validate), `optimize-post` (de-slop, audience fit, and SEO polish for an existing draft), and `validate-post` (read-only spec check of a post and its header image; `python3 .claude/skills/validate-post/scripts/validate_post.py <post.md>`). The conventions they encode are summarized below, but the skills are the source of truth for content work.

---

## Development Commands

```bash
npm install            # install dependencies
npm run dev            # dev server at http://localhost:4321 (alias: npm start)
npm run build          # production build to /dist
npm run preview        # serve the built /dist locally
npm run lint           # ESLint + `astro check` (types, content schema)
npm run lint:fix       # auto-fix ESLint issues
npx netlify <command>  # Netlify CLI (pinned in devDependencies)
```

- Node **22.23.4** or newer (Astro 7's minimum), pinned via Volta, `.nvmrc`, and `NODE_VERSION` in `netlify.toml`.
- There are **no tests** — `npm test` exits with an error by design. Do not attempt to run tests.
- Optimized images are cached in `node_modules/.astro/`; the first build encodes every AVIF/WebP variant and takes several minutes, later builds take seconds. Stale output: delete `dist/` and `node_modules/.astro/`.
- CI (`.github/workflows/ci.yml`) runs `npm ci` + `npm run lint` only — no build, no tests. Pushing to `master` triggers a Netlify deploy.

---

## Repository Structure

```
src/
├── components/           # Astro components, each with its own scoped <style>: SiteNav/FixedSiteNav,
│                         #   ArchiveHeader, ArticleHeader, PostHero, Prose, PostCard, AuthorList, ReadNext, Footer, subscribe/
├── layouts/BaseLayout.astro  # <head> (meta, OG/Twitter, JSON-LD, theme + gtag scripts) and page shell
├── pages/                # Routes: index, [...slug] (posts), tags/[tag], author/[author], about, 404, rss.xml
├── lib/posts.ts          # Post queries, URLs, dates, reading time, excerpts
├── scripts/subscribe.ts  # Mailchimp JSONP subscribe + GA4 events (client-side)
├── styles/global.css     # Tokens, reset, base typography, shared layout primitives (Casper port)
├── posts/<year>/         # Markdown content, one folder per year (2011–2026)
├── content/              # author.yaml, tag.yaml (data collections), avatars/
├── images/               # headers/ (post header images), content/ (inline + about), logo, home covers
├── content.config.ts     # Content collections + frontmatter schema (posts, authors, tags)
└── website-config.ts     # Site-wide config (title, description, twitter, mailchimp)
public/                   # Copied as-is to the site root: _redirects, _headers, robots.txt, favicon.ico
astro.config.mjs          # Site URL, image encoder defaults, Shiki theme, sitemap
.claude/skills/           # Project skills: write-post, optimize-post, validate-post
```

---

## Content Model

### Posts

One Markdown file per post at `src/posts/<year>/<kebab-case-slug>.md`. Every post uses the same frontmatter block, in this field order:

```markdown
---
title: Post Title Here
author: [masimplo]
tags: [Tag1, Tag2]
image: ../../images/headers/some-image.jpg
date: YYYY-MM-DD
draft: false
excerpt: One sentence that becomes the meta description.
---
```

| Field | Notes |
|---|---|
| `title` | Unquoted unless it contains a colon |
| `author` | Always `[masimplo]`; each entry must match an `id` in `content/author.yaml` (validated at build) |
| `tags` | Inline array `[A, B, C]` with spaces; every tag should match an `id` in `content/tag.yaml` exactly (TitleCase) |
| `image` | Relative path from the post file; **without it the post gets no og:image/twitter:image at all** |
| `date` | ISO `YYYY-MM-DD` |
| `draft` | `true` excludes the post from pages, sitemap, and RSS |
| `excerpt` | One sentence, ~120–155 chars, containing the primary keyword; becomes the meta description (see SEO below). Required — `validate-post` fails a post without one |
| `permalink` | Supported by the schema but used by zero posts — avoid |

The schema lives in `src/content.config.ts` and is enforced by `astro check`/`astro build`.

### Tags and authors

- Tag vocabulary lives in `src/content/tag.yaml` (`id`, `description`, `image`). A post tag missing from that file still gets an archive page, but with a generic description and no header image. Most-used tags: Code, Tools, Technology, Tips, AI, Opinions, Hobbies.
- Author metadata lives in `src/content/author.yaml` (`id` is what posts reference, `name` is displayed); the about page (`src/pages/about.astro`) carries the author's positioning.

---

## URLs, SEO, and Feeds (how it actually works)

- **Post URLs are at the site root**: slug = `/<filename-without-.md>/`, case preserved (`src/content.config.ts` `generateId`, `src/lib/posts.ts` `postUrl`). There is **no `/blog/` prefix**. The filename IS the permanent URL — choose it carefully, never rename a published post's file.
- Tag pages: `/tags/<kebab-case-tag>/` (lodash `kebabCase`, so `3D Printing` → `/tags/3-d-printing/`); author pages: `/author/<kebab-case-name>/`. The home page lists every post on one page.
- **Meta description** (also og/twitter description and JSON-LD): frontmatter `excerpt` if present, otherwise a ~140-char plain-text truncation of the body. Every post sets `excerpt`; keep it that way.
- **Only `tags[0]` reaches meta tags** (`article:tag`, `twitter:data2`) and drives the "More in <tag>" related-posts card. Order tags most-relevant-first.
- Every page emits a canonical URL, OG + Twitter cards, and `WebSite` JSON-LD (`src/layouts/BaseLayout.astro`); post pages add a `BlogPosting` JSON-LD block (`src/pages/[...slug].astro`). Sitemap from `@astrojs/sitemap` (`/sitemap-index.xml`, referenced by `public/robots.txt`).
- RSS at `/rss.xml` (`src/pages/rss.xml.ts`) — items include full post HTML with absolute URLs; GUIDs are the post URLs. Every page's head links the feed.
- Analytics: GA4 (`G-SKNLCK1W2K`) via `gtag.js`, loaded from the same-origin `/gtag/js` Netlify proxy (`netlify.toml`, `public/_redirects`).
- Images: all images go through `astro:assets` (Sharp). Header and card images are served as responsive AVIF with a WebP fallback; markdown body images become WebP. Social images (`og:image`) are 1200px JPG/PNG with real width/height. Recent posts use **one header image and no inline body images**.
- The RSS channel description ("Pressing keys, generating bytes", in `src/pages/rss.xml.ts`) differs from the homepage meta description in `src/website-config.ts` on purpose. Edit `website-config.ts` for anything user-facing.

---

## Code Conventions

- **Components**: `.astro` components, PascalCase filenames, typed `Props`. No UI framework — interactivity is small vanilla `<script>` blocks (bundled and deduped by Astro).
- **Styling**: each component styles itself in a scoped `<style>` block; `src/styles/global.css` holds only the `:root` tokens, reset, base typography, and layout primitives shared across pages (`.outer`, `.inner`, `.site-main`, `.post-feed`, the page-title block). Use the custom properties (no new hardcoded palette colors). Dark mode is the `dark` class on `<html>` (set before paint from localStorage or the OS preference); in scoped styles write `:global(html.dark) .thing`. To style another component's markup (e.g. ReadNext restyling PostCard) wrap the foreign part in `:global(...)`, including any trailing element such as `:global(.post-card-byline-content a)`. Scoped selectors carry an extra attribute, so each scoped part adds specificity; if an override stops winning, make it more specific rather than adding `!important`. `Prose.astro` uses `<style is:global>` because it styles rendered Markdown. Small text uses `--text-muted`/`--text-accent`, which pass WCAG AA — don't swap them back to `--midgrey`/`--blue`.
- **Performance budget**: the site scores 98–100 on Lighthouse (mobile and desktop) in all categories. Keep it there: no web fonts, no client frameworks, `<Picture>`/`<Image>` (never raw `<img>` for local images), `loading="eager"` + `fetchpriority="high"` only for the above-the-fold image, and CSS stays inlined (`build.inlineStylesheets: 'always'`).
- **TypeScript**: strict (`astro/tsconfigs/strict`) plus `noUnusedLocals`/`noUnusedParameters`.
- **Lint/format**: ESLint flat config (`eslint.config.js`: typescript-eslint + eslint-plugin-astro) and Prettier with `prettier-plugin-astro` (semi, single quotes, trailing commas, printWidth 100, `arrowParens: avoid`). Run `npm run lint:fix` and `npx prettier --write .` before committing.
- **Lodash is `lodash-es`** — ESM imports only, never `lodash` (CommonJS).
- Astro 7's Rust compiler does not repair invalid HTML: close every tag, never nest `<a>` inside `<a>`, and add explicit `{' '}` between inline elements (whitespace is compressed with JSX rules).

---

## Key Constraints & Gotchas

- **No breaking changes to frontmatter schema** — `src/content.config.ts`, every page, and the post skills depend on it.
- Posts reference authors by exact name (build fails otherwise) and tags by exact `id`; keep `tag.yaml` / `author.yaml` in sync.
- Frontmatter `image` paths are relative to the Markdown file (`../../images/headers/...`). A missing file **fails the build** (`ImageNotFound`) for published posts — never commit a post with a placeholder image path.
- Renaming a post file changes its URL; there is no redirect automation (`public/_redirects` is hand-maintained).
