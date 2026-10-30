# masimplo.com

Source of [masimplo.com](https://masimplo.com), a personal blog about software engineering, AI-assisted development, 3D printing, and smart home tinkering.

Built with [Astro](https://astro.build) and deployed on [Netlify](https://www.netlify.com). The design is a port of [Casper](https://github.com/TryGhost/Casper), the Ghost theme.

## Getting started

Requires Node 22.23.4 or newer.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
npm run lint     # ESLint + astro check
```

## Writing

Posts are Markdown files in `src/posts/<year>/<slug>.md`; the filename becomes the URL (`/<slug>/`). Header images live in `src/images/headers/`. See [CLAUDE.md](CLAUDE.md) for the frontmatter schema and site conventions.

## Configuration

- Site title, description, social links, and the Mailchimp form: `src/website-config.ts`
- Tags and authors: `src/content/tag.yaml`, `src/content/author.yaml`
- Redirects and headers: `public/_redirects`, `public/_headers`
