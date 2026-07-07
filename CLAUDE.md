# CLAUDE.md — AI Assistant Guide for masimplo.com-blog

masimplo.com is the personal blog of a software engineer of 20+ years — first-person, essay-style posts about AI-assisted development, software engineering practice, 3D printing, smart home tinkering, and industry opinions, written for practicing developers and hands-on makers. It is a Gatsby 5 static site (TypeScript strict + Emotion CSS-in-JS, a port of the Ghost Casper theme) deployed on Netlify; content is Markdown under `src/posts/<year>/`.

**Writing or editing a post? Use the project skills:** `write-post` (draft a new post in the author's voice) and `optimize-post` (de-slop, audience fit, and SEO polish for an existing draft). The conventions they encode are summarized below, but the skills are the source of truth for content work.

---

## Development Commands

```bash
npm install            # install dependencies
npm run dev            # dev server at http://localhost:8000 (alias: npm start)
                       # GraphQL explorer: http://localhost:8000/___graphql
npm run build          # production build to /public
npm run lint           # ESLint over .js/.ts/.tsx
npm run lint:fix       # auto-fix lint issues
npx netlify <command>  # Netlify CLI (pinned in devDependencies)
```

- Node **22.22.1**, pinned via Volta.
- There are **no tests** — `npm test` exits with an error by design. Do not attempt to run tests.
- Stale build artifacts: run `npx gatsby clean` (or delete `.cache/` and `public/`).
- CI (`.github/workflows/ci.yml`) runs `npm ci` + `npm run lint` only — no build, no tests. Pushing to `master` triggers a Netlify deploy.

---

## Repository Structure

```
src/
├── components/           # Reusable React components (header/, icons/, subscribe/)
├── layouts/index.tsx     # Root layout + global CSS
├── pages/                # Static pages: about.tsx, 404.tsx
├── templates/            # Build-time page templates: index, post, author, tags
├── styles/               # colors.ts (palette), shared.ts (mixins/breakpoints)
├── posts/<year>/         # Markdown content, one folder per year (2011–2026)
├── content/              # author.yaml, tag.yaml, legacy img/
├── images/               # headers/ (post header images), avatars/
├── static/               # _redirects, _headers, robots.txt (copied to site root)
└── website-config.ts     # Site-wide config (title, siteUrl, twitter, mailchimp)
gatsby-config.js          # Plugins and siteMetadata
gatsby-node.js            # Slugs, page creation, reading time, related posts
.claude/skills/           # Project skills: write-post, optimize-post
```

---

## Content Model

### Posts

One Markdown file per post at `src/posts/<year>/<kebab-case-slug>.md`. All 50+ posts use the same frontmatter block, in this field order:

```markdown
---
layout: post
title: Post Title Here
author: [masimplo]
tags: [Tag1, Tag2]
image: ../../images/headers/some-image.jpg
date: YYYY-MM-DD
draft: false
---
```

| Field | Notes |
|---|---|
| `layout` | Always `post` (selects `src/templates/post.tsx`) |
| `title` | Unquoted unless it contains a colon |
| `author` | Always `[masimplo]`; must match `content/author.yaml` |
| `tags` | Inline array `[A, B, C]` with spaces; every tag must match an `id` in `content/tag.yaml` exactly (TitleCase) |
| `image` | Relative path from the post file; **without it the post gets no og:image/twitter:image at all** |
| `date` | ISO `YYYY-MM-DD` |
| `draft` | `true` excludes the post from pages, sitemap, and RSS |
| `excerpt` | Optional single sentence; becomes the meta description (see SEO below) |
| `permalink` | Supported by `gatsby-node.js` but used by zero posts — avoid |

### Tags and authors

- Tag vocabulary lives in `src/content/tag.yaml` (`id`, `description`, `image`). Posts referencing a tag not in that file break the tag archive. Most-used tags: Code, Tools, Technology, Tips, AI, Opinions, Hobbies.
- Author metadata lives in `src/content/author.yaml`; the about page (`src/pages/about.tsx`) carries the author's positioning.

---

## URLs, SEO, and Feeds (how it actually works)

- **Post URLs are at the site root**: slug = `/<filename-without-.md>/` (`gatsby-node.js`). There is **no `/blog/` prefix**. The filename IS the permanent URL — choose it carefully, never rename a published post's file.
- Tag pages: `/tags/<kebab-case-tag>/`; author pages: `/author/<kebab-case-name>/`. The index is effectively a single page (`postsPerPage = 1000`).
- **Meta description** (also og/twitter description and JSON-LD): frontmatter `excerpt` if present, otherwise Gatsby's auto-excerpt (~140-char truncation). Only a handful of posts set `excerpt`; set it on any post you care about.
- **Only `tags[0]` reaches meta tags** (`article:tag`, `twitter:data2`) and drives related-post selection (`primaryTag`). Order tags most-relevant-first.
- Post pages emit full OG + Twitter cards + a `BlogPosting` JSON-LD block (`src/templates/post.tsx`). Canonical URLs come from `gatsby-plugin-canonical-urls`; sitemap from `gatsby-plugin-sitemap` (referenced by `src/static/robots.txt` as `/sitemap-index.xml`).
- RSS at `/rss.xml` via `gatsby-plugin-feed` — items include full post HTML. Note: the feed's `match: '^/blog/'` option means no post page injects the feed `<link>` into its head (post paths don't start with `/blog/`); the feed itself is still complete.
- Analytics: `gatsby-plugin-google-gtag` (GA4, `G-SKNLCK1W2K`).
- Images: `gatsby-plugin-sharp` / `gatsby-remark-images` at quality 85, `maxWidth` 2000, WEBP/AVIF variants. Recent posts use **one header image and no inline body images**.
- `siteMetadata.description` in `gatsby-config.js` ("Pressing keys, generating bytes") feeds only the RSS feed; the homepage meta description comes from `src/website-config.ts` — they differ on purpose. Edit `website-config.ts` for anything user-facing.

---

## Code Conventions

- **Components**: functional React + TypeScript prop types, PascalCase filenames. Pages and utilities are camelCase.
- **Styling**: Emotion — `css` prop for component-scoped styles, `styled` for reusable elements, global styles in `src/layouts/index.tsx`. Use `colors` from `src/styles/colors.ts` (no hardcoded colors) and mixins/breakpoints from `src/styles/shared.ts`. Dark mode via `@media (prefers-color-scheme: dark)`.
- **TypeScript**: strict mode, `noUnusedLocals`, `noUnusedParameters`, `noImplicitAny`. Custom declarations in `src/typings.d.ts`.
- **Lint/format**: ESLint (XO base + React + TypeScript) and Prettier (semi, single quotes, trailing commas, printWidth 100, `arrowParens: avoid`). Run `npm run lint:fix` before committing.
- **Lodash is `lodash-es`** — ESM imports only, never `lodash` (CommonJS).
- **Emotion + SSR**: no browser-only APIs in styled components; styles must render server-side.
- Import order: external libs → third-party utils (`date-fns`, `lodash-es`) → internal components → local styles/config.

---

## Key Constraints & Gotchas

- **No breaking changes to frontmatter schema** — `gatsby-node.js` and every template query depend on it.
- Posts reference tags/authors by exact name; keep `tag.yaml` / `author.yaml` in sync or the build breaks.
- Frontmatter `image` paths are relative to the Markdown file (`../../images/headers/...`) and the file must exist — a dangling path does NOT fail the build; it silently publishes the post with no header image and no og:image/twitter:image. Never commit a post with a placeholder image path.
- Renaming a post file changes its URL; there is no redirect automation (`src/static/_redirects` is hand-maintained).
