import { readBlogPosts } from "./storage";
import type { BlogPost, PostMediaItem } from "./blog-types";

export type { BlogPost, PostMediaItem, PostType } from "./blog-types";

export async function getBlogPosts(): Promise<BlogPost[]> {
  const posts = await readBlogPosts();
  return posts.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug);
}

export { filterPostsBySearch } from "./blog-types";

export function getHeadingsFromHtml(html: string): { id: string; text: string; level: number }[] {
  const headings: { id: string; text: string; level: number }[] = [];
  const regex = /<h([2-3])[^>]*>([^<]+)<\/h\1>/gi;
  let match;
  let index = 0;
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1], 10);
    const text = match[2].trim();
    const id = `heading-${index++}`;
    headings.push({ id, text, level });
  }
  return headings;
}
