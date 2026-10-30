import { type CollectionEntry, getCollection, getEntries } from 'astro:content';
import { kebabCase } from 'lodash-es';
import readingTime from 'reading-time';

export type Post = CollectionEntry<'posts'>;
export type Author = CollectionEntry<'authors'>;

export type PostSummary = {
  slug: string;
  title: string;
  date: Date;
  tags: string[];
  image: Post['data']['image'];
  excerpt: string;
  readingTime: string;
  authors: Author[];
};

export const tagUrl = (tag: string) => `/tags/${kebabCase(tag)}/`;
export const authorUrl = (name: string) => `/author/${kebabCase(name)}/`;
export const postUrl = (post: Post) => post.data.permalink ?? `/${post.id}/`;

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2018-08-20" for <time datetime>. Dates are calendar dates, so format in UTC. */
export const isoDate = (date: Date) => date.toISOString().slice(0, 10);

/** "20 Aug 2018" */
export const displayDate = (date: Date) =>
  `${String(date.getUTCDate()).padStart(2, '0')} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;

/** Fallback when a post has no `excerpt`: first ~140 chars of plain text, like Gatsby's auto-excerpt. */
function autoExcerpt(markdown: string) {
  const text = markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/[#>*_`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= 140) {
    return text;
  }

  return `${text.slice(0, 139).replace(/\s+\S*$/, '')}…`;
}

export const postExcerpt = (post: Post) => post.data.excerpt ?? autoExcerpt(post.body ?? '');

/** All published posts, newest first. Drafts are never built. */
export async function getPublishedPosts() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function summarize(post: Post): Promise<PostSummary> {
  return {
    slug: postUrl(post),
    title: post.data.title,
    date: post.data.date,
    tags: post.data.tags,
    image: post.data.image,
    excerpt: postExcerpt(post),
    readingTime: readingTime(post.body ?? '').text,
    authors: await getEntries(post.data.author),
  };
}

export async function getPostSummaries() {
  return Promise.all((await getPublishedPosts()).map(async post => summarize(post)));
}

export const countLabel = (count: number) =>
  count > 1 ? `${count} posts` : count === 1 ? '1 post' : 'No posts';
