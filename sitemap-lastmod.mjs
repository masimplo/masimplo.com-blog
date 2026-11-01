// @ts-check
// Builds the URL -> <lastmod> map for @astrojs/sitemap. The sitemap integration runs in the
// Astro config, before the content layer exists, so read post frontmatter straight from disk.
// Posts only carry a publish `date`, so that is their lastmod; archive pages (home, tag and
// author) take the date of their newest post. Pages with no honest date (/about/) get none.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { kebabCase } from 'lodash-es';

const SITE = 'https://masimplo.com';
const POSTS_DIR = new URL('./src/posts/', import.meta.url);

/** @param {string} dir @returns {string[]} */
const markdownFiles = dir =>
  readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory()
      ? markdownFiles(join(dir, entry.name))
      : entry.name.endsWith('.md')
        ? [join(dir, entry.name)]
        : [],
  );

/** @param {string} source @param {string} key */
const field = (source, key) =>
  source.match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, 'm'))?.[1].replace(/^["']|["']$/g, '');

export function buildLastmodMap() {
  /** @type {Map<string, string>} */
  const lastmod = new Map();
  /** @param {string} url @param {string} date */
  const newest = (url, date) => {
    if (date > (lastmod.get(url) ?? '')) {
      lastmod.set(url, date);
    }
  };

  for (const file of markdownFiles(POSTS_DIR.pathname)) {
    const frontmatter = readFileSync(file, 'utf8').split(/^---\s*$/m)[1] ?? '';
    const date = field(frontmatter, 'date');
    if (!date || field(frontmatter, 'draft') === 'true') {
      continue;
    }

    const slug = file.replace(/^.*\//, '').replace(/\.md$/, '');
    newest(`${SITE}/${slug}/`, date);
    newest(`${SITE}/`, date);
    newest(`${SITE}/author/masimplo/`, date);
    for (const tag of field(frontmatter, 'tags')
      ?.replace(/^\[|\]$/g, '')
      .split(',') ?? []) {
      if (tag.trim()) {
        newest(`${SITE}/tags/${kebabCase(tag.trim())}/`, date);
      }
    }
  }

  return lastmod;
}
