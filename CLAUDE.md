# CLAUDE.md — AI Assistant Guide for masimplo.com-blog

## Project Overview

A personal blog for [masimplo.com](https://masimplo.com), built as a Gatsby v5 static site generator. It is a TypeScript/React port of the Ghost Casper theme. The blog covers software engineering, 3D printing, AI, and technology topics.

- **Framework:** Gatsby 5
- **Language:** TypeScript 5 (strict mode)
- **Styling:** Emotion (CSS-in-JS)
- **Deployment:** Netlify
- **Node version:** 18.12.0 (pinned via Volta)

---

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:8000)
npm run dev
# or
npm start

# GraphQL explorer (development only)
# http://localhost:8000/___graphql

# Production build (output to /public)
npm run build

# Lint TypeScript/TSX files
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

There are no tests configured. `npm test` exits with an error by design.

---

## Repository Structure

```
masimplo.com-blog/
├── src/
│   ├── components/           # Reusable React components
│   │   ├── header/           # Navigation bar components
│   │   ├── icons/            # SVG icon components
│   │   └── subscribe/        # Email subscription modal
│   ├── layouts/
│   │   └── index.tsx         # Root layout with global CSS
│   ├── pages/
│   │   ├── about.tsx         # Static /about page
│   │   └── 404.tsx           # 404 page
│   ├── templates/            # Gatsby page templates (generated at build)
│   │   ├── index.tsx         # Blog home / paginated list
│   │   ├── post.tsx          # Individual post page
│   │   ├── author.tsx        # Author archive
│   │   └── tags.tsx          # Tag archive
│   ├── styles/
│   │   ├── colors.ts         # Centralized color palette
│   │   └── shared.ts         # Shared Emotion CSS mixins/breakpoints
│   ├── posts/                # Markdown blog content (organized by year)
│   │   ├── 2011/
│   │   ├── 2012/
│   │   ├── 2016/
│   │   ├── 2017/
│   │   ├── 2019/
│   │   └── 2023/
│   ├── content/
│   │   ├── author.yaml       # Author metadata
│   │   ├── tag.yaml          # Tag definitions
│   │   └── img/              # Legacy images
│   ├── images/
│   │   ├── headers/          # Post featured images
│   │   └── avatars/          # Author avatars
│   ├── static/
│   │   └── _redirects        # Netlify redirect rules
│   ├── website-config.ts     # Site-wide configuration
│   └── typings.d.ts          # Custom TypeScript type declarations
├── gatsby-config.js          # Gatsby plugin and metadata config
├── gatsby-node.js            # Dynamic page creation, reading time
├── tsconfig.json             # TypeScript compiler options
├── .eslintrc.js              # ESLint rules (XO base + React + TypeScript)
├── .prettierrc               # Prettier formatting rules
└── .github/workflows/
    └── ci.yml                # GitHub Actions: lint on push/PR
```

---

## Adding Blog Posts

Create a new Markdown file under `src/posts/<year>/post-title.md`:

```markdown
---
layout: post
title: Your Post Title
author: [masimplo]
tags: [Technology, Tag2]
image: ../../images/headers/your-image.jpg
date: 2024-01-15
draft: false
---

Post content here in Markdown...
```

**Frontmatter fields:**
| Field | Type | Required | Notes |
|---|---|---|---|
| `layout` | string | Yes | Always `post` |
| `title` | string | Yes | Display title |
| `author` | array | Yes | Must match name in `content/author.yaml` |
| `tags` | array | Yes | Must match entries in `content/tag.yaml` |
| `image` | string | No | Relative path from the post file |
| `date` | ISO date | Yes | `YYYY-MM-DD` format |
| `draft` | boolean | No | `true` excludes from build |
| `excerpt` | string | No | Custom excerpt (otherwise auto-generated) |
| `permalink` | string | No | Custom URL slug |

### Adding a new tag

Edit `src/content/tag.yaml`:
```yaml
- name: YourTag
  description: Description of the tag
  image: ../images/headers/tag-image.jpg
```

---

## Component Conventions

### File Naming
- **Components:** PascalCase — `PostCard.tsx`, `AuthorList.tsx`
- **Pages:** camelCase — `about.tsx`, `404.tsx`
- **Styles/Utilities:** camelCase — `colors.ts`, `shared.ts`

### Component Structure

All components are **functional React components** with TypeScript prop interfaces:

```typescript
import styled from '@emotion/styled';
import { css } from '@emotion/react';

export type PostCardProps = {
  post: PageContext;
  isLarge?: boolean;
};

export function PostCard({ post, isLarge = false }: PostCardProps) {
  return (
    <article css={PostCardStyles}>
      {/* ... */}
    </article>
  );
}

const PostCardStyles = css`
  /* Emotion styles */
`;
```

### Styling with Emotion

- Use `css` prop for component-scoped styles
- Use `styled` components for reusable styled elements
- Global styles are defined in `src/layouts/index.tsx`
- Use colors from `src/styles/colors.ts` — do not hardcode color values
- Use mixins/breakpoints from `src/styles/shared.ts`
- Dark mode: use `@media (prefers-color-scheme: dark)` within Emotion styles

```typescript
import { colors } from '../styles/colors';
import { outer, inner } from '../styles/shared';
```

### Import Order (by convention)

1. External libraries (`react`, `gatsby`, `@emotion/*`)
2. Third-party utilities (`date-fns`, `lodash-es`)
3. Internal components
4. Local styles and config

---

## TypeScript Configuration

TypeScript is in **strict mode** with these enforced rules:

- `strict: true` — full strict checking
- `noUnusedLocals: true` — no unused variables
- `noUnusedParameters: true` — no unused function params
- `noImplicitAny: true` — explicit types required
- `target: ESNext`
- `jsx: preserve` — for Emotion compatibility

Custom type declarations are in `src/typings.d.ts`.

---

## Code Style & Linting

Formatting is enforced via Prettier (`.prettierrc`):

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "arrowParens": "avoid"
}
```

ESLint uses the XO style guide with React and TypeScript extensions (`.eslintrc.js`). Run `npm run lint:fix` before committing to resolve auto-fixable issues.

---

## Site Configuration

Edit `src/website-config.ts` to change global site settings:

```typescript
export interface WebsiteConfig {
  title: string;           // Site title displayed in header
  description: string;     // Site description for meta tags
  language: string;        // HTML lang attribute
  siteUrl: string;         // Canonical base URL
  twitter?: string;        // Twitter profile URL
  mailchimpAction?: string; // Mailchimp subscribe URL
  showAllTags: boolean;    // Whether to show all tags in nav
}
```

---

## Gatsby Architecture

### Page Generation (`gatsby-node.js`)

Pages are generated dynamically at build time:

- **Posts** → `/blog/{slug}` using `src/templates/post.tsx`
- **Tags** → `/tags/{tag}` using `src/templates/tags.tsx`
- **Authors** → `/author/{author}` using `src/templates/author.tsx`
- **Home** → `/` using `src/templates/index.tsx`

Related posts are computed by shared tags. Reading time is calculated and injected as a GraphQL field.

### GraphQL Queries

Each template contains a co-located `pageQuery` using Gatsby's GraphQL layer. Content comes from:

- `gatsby-transformer-remark` (Markdown files)
- `gatsby-transformer-yaml` (YAML data files)

### Plugins (key ones)

| Plugin | Purpose |
|---|---|
| `gatsby-transformer-remark` | Markdown → HTML |
| `gatsby-remark-images` | Responsive post images |
| `gatsby-remark-prismjs` | Syntax highlighting |
| `gatsby-plugin-image` | Optimized `<GatsbyImage>` |
| `gatsby-plugin-sharp` | Image processing (max 2000px, quality 100) |
| `gatsby-plugin-emotion` | Emotion SSR support |
| `gatsby-plugin-feed` | RSS feed at `/rss.xml` |
| `gatsby-plugin-google-gtag` | Google Analytics 4 |
| `gatsby-plugin-netlify` | Netlify headers/redirects |

---

## CI/CD

GitHub Actions runs on every push and pull request (`.github/workflows/ci.yml`):

1. Install Node 18 dependencies via `npm ci`
2. Run `npm run lint`

The pipeline does **not** run a build or tests. Merging to `master` triggers a Netlify deployment.

---

## Key Constraints & Notes

- **No test suite** — there are no unit or integration tests. Do not attempt to run tests.
- **No breaking changes to frontmatter** — changing the YAML schema in `gatsby-node.js` can break all post queries.
- **Author/tag YAML must stay in sync** — posts reference author names and tag names that must exist in `content/author.yaml` and `content/tag.yaml`.
- **Emotion + SSR** — styles must work server-side; avoid browser-only APIs in styled components.
- **Image paths are relative** — images referenced in frontmatter use paths relative to the Markdown file location.
- **Gatsby cache** — if you see stale build artifacts, run `gatsby clean` (or delete `.cache/` and `public/`).
- **Lodash is lodash-es** — use `lodash-es` imports (ESM), not `lodash` (CommonJS).
