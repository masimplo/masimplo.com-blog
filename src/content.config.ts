import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { parse } from 'yaml';

// Posts live in src/posts/<year>/<slug>.md. The filename (case preserved) is the URL slug,
// so the year folder is dropped and the default lowercasing id is overridden.
const posts = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/posts',
    generateId: ({ entry }) => entry.replace(/^.*\//, '').replace(/\.md$/, ''),
  }),
  schema: ({ image }) =>
    z.object({
      layout: z.literal('post').default('post'),
      title: z.string(),
      author: z.array(reference('authors')),
      tags: z.array(z.string()).default([]),
      image: image().optional(),
      date: z.coerce.date(),
      draft: z.boolean().default(false),
      excerpt: z.string().optional(),
      permalink: z.string().optional(),
    }),
});

// author.yaml is keyed by `name`; expose it as the entry id so posts can say `author: [masimplo]`.
const authors = defineCollection({
  loader: file('src/content/author.yaml', {
    parser: text =>
      (parse(text) as Array<{ name: string }>).map(author => ({ id: author.name, ...author })),
  }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      avatar: image(),
      bio: z.string().optional(),
      twitter: z.string().optional(),
      facebook: z.string().optional(),
      website: z.string().optional(),
      location: z.string().optional(),
      profile_image: image().optional(),
    }),
});

const tags = defineCollection({
  loader: file('src/content/tag.yaml'),
  schema: ({ image }) =>
    z.object({
      description: z.string().optional(),
      image: image().optional(),
    }),
});

export const collections = { posts, authors, tags };
