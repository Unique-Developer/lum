import { readCategories, readSubcategories } from "./storage";

export type Category = {
  id: string;
  name: string;
  slug: string;
  order: number;
};

export type Subcategory = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  order: number;
};

const CATEGORY_CACHE_TTL_MS = 60_000; // 1 minute
let cachedCategories: Category[] | null = null;
let cachedCategoriesExpiresAt = 0;

const SUBCATEGORY_CACHE_TTL_MS = 60_000;
let cachedSubcategories: Subcategory[] | null = null;
let cachedSubcategoriesExpiresAt = 0;

export async function getCategories(): Promise<Category[]> {
  const now = Date.now();
  if (cachedCategories && now < cachedCategoriesExpiresAt) {
    return cachedCategories;
  }
  const categories = (await readCategories()).sort((a, b) => a.order - b.order);
  cachedCategories = categories;
  cachedCategoriesExpiresAt = now + CATEGORY_CACHE_TTL_MS;
  return categories;
}

export async function getSubcategories(categoryId?: string): Promise<Subcategory[]> {
  const now = Date.now();
  if (cachedSubcategories && now < cachedSubcategoriesExpiresAt) {
    const list = cachedSubcategories;
    if (categoryId) return list.filter((s) => s.categoryId === categoryId).sort((a, b) => a.order - b.order);
    return list.sort((a, b) => a.order - b.order);
  }
  const subcategories = (await readSubcategories()).sort((a, b) => a.order - b.order);
  cachedSubcategories = subcategories;
  cachedSubcategoriesExpiresAt = now + SUBCATEGORY_CACHE_TTL_MS;
  if (categoryId) return subcategories.filter((s) => s.categoryId === categoryId).sort((a, b) => a.order - b.order);
  return subcategories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug);
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
  const categories = await getCategories();
  return categories.find((c) => c.id === id);
}

export async function getSubcategoryBySlug(categoryId: string, slug: string): Promise<Subcategory | undefined> {
  const subcategories = await getSubcategories(categoryId);
  return subcategories.find((s) => s.slug === slug);
}

export async function getSubcategoryById(id: string): Promise<Subcategory | undefined> {
  const subcategories = await getSubcategories();
  return subcategories.find((s) => s.id === id);
}

export function clearCategoryCache() {
  cachedCategories = null;
  cachedCategoriesExpiresAt = 0;
  cachedSubcategories = null;
  cachedSubcategoriesExpiresAt = 0;
}
