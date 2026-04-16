import { readBlogCategories } from "./storage";

export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
  order: number;
};

const BLOG_CATEGORY_CACHE_TTL_MS = 60_000;
let cachedBlogCategories: BlogCategory[] | null = null;
let cachedBlogCategoriesExpiresAt = 0;

export async function getBlogCategories(): Promise<BlogCategory[]> {
  const now = Date.now();
  if (cachedBlogCategories && now < cachedBlogCategoriesExpiresAt) {
    return cachedBlogCategories;
  }

  const categories = (await readBlogCategories()).sort((a, b) => a.order - b.order);
  cachedBlogCategories = categories;
  cachedBlogCategoriesExpiresAt = now + BLOG_CATEGORY_CACHE_TTL_MS;
  return categories;
}

export async function getBlogCategoryBySlug(slug: string): Promise<BlogCategory | undefined> {
  const categories = await getBlogCategories();
  return categories.find((c) => c.slug === slug);
}

export function clearBlogCategoryCache() {
  cachedBlogCategories = null;
  cachedBlogCategoriesExpiresAt = 0;
}
