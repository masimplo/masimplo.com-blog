// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://masimplo.com',
  // Post URLs have always been `/<slug>/`; keep the trailing slash everywhere.
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // Pages carry ~20 KB of CSS; inlining it removes the only render-blocking request.
    inlineStylesheets: 'always',
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      // Default encoder settings; per-image `quality` still wins. AVIF keeps Sharp's defaults.
      config: {
        jpeg: { quality: 82, mozjpeg: true },
        webp: { quality: 80 },
      },
    },
  },
  markdown: {
    shikiConfig: {
      theme: 'night-owl',
      wrap: false,
      transformers: [
        {
          // Night Owl's comment colour (#637777) fails WCAG AA on its background; use the
          // lighter grey the old Prism theme had.
          span(node) {
            if (typeof node.properties.style === 'string') {
              node.properties.style = node.properties.style.replace('#637777', '#809393');
            }
          },
        },
      ],
    },
  },
  integrations: [
    sitemap({
      filter: page => !page.endsWith('/404/'),
    }),
  ],
});
