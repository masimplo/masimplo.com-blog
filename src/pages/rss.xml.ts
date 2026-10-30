import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { render } from 'astro:content';

import { getPublishedPosts, postExcerpt, postUrl } from '../lib/posts';

// Make root-relative links and image URLs absolute so they work inside feed readers.
const absolutize = (html: string, site: URL) =>
  html
    .replaceAll(/(href|src)="\/(?!\/)/g, `$1="${site.origin}/`)
    .replaceAll(
      /srcset="([^"]+)"/g,
      (_, srcset: string) => `srcset="${srcset.replaceAll(/(^|,\s*)\//g, `$1${site.origin}/`)}"`,
    );

export async function GET(context: APIContext) {
  const site = context.site!;
  const container = await AstroContainer.create();
  const posts = await getPublishedPosts();

  const items = await Promise.all(
    posts.map(async post => {
      const { Content } = await render(post);
      const html = await container.renderToString(Content);
      const link = new URL(postUrl(post), site).href;
      return {
        title: post.data.title,
        link,
        pubDate: post.data.date,
        description: postExcerpt(post),
        customData: `<guid isPermaLink="false">${link}</guid>`,
        content: absolutize(html, site),
      };
    }),
  );

  return rss({
    title: "Masimplo's Blog",
    description: 'Pressing keys, generating bytes',
    site,
    items,
    trailingSlash: true,
  });
}
