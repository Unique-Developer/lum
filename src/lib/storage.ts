import { getDb } from "./mongodb";
import type { Catalogue } from "./catalogue";
import type { BlogPost } from "./blog";
import type { Category, Subcategory } from "./categories";

const CATALOGUES_COLLECTION = "catalogues";
const BLOG_POSTS_COLLECTION = "blog_posts";
const CATEGORIES_COLLECTION = "categories";
const SUBCATEGORIES_COLLECTION = "subcategories";

export async function readCatalogues(): Promise<Catalogue[]> {
  try {
    const db = await getDb();
    const docs = await db.collection<Catalogue>(CATALOGUES_COLLECTION).find({}).toArray();
    return docs.map((d) => ({ ...d, _id: undefined })) as Catalogue[];
  } catch {
    return [];
  }
}

export async function writeCatalogues(catalogues: Catalogue[]): Promise<void> {
  const db = await getDb();
  const col = db.collection<Catalogue>(CATALOGUES_COLLECTION);
  await col.deleteMany({});
  if (catalogues.length > 0) {
    await col.insertMany(catalogues);
  }
}

export async function readBlogPosts(): Promise<BlogPost[]> {
  try {
    const db = await getDb();
    const docs = await db.collection<BlogPost>(BLOG_POSTS_COLLECTION).find({}).toArray();
    return docs.map((d) => ({ ...d, _id: undefined })) as BlogPost[];
  } catch {
    return [];
  }
}

export async function writeBlogPosts(posts: BlogPost[]): Promise<void> {
  const db = await getDb();
  const col = db.collection<BlogPost>(BLOG_POSTS_COLLECTION);
  await col.deleteMany({});
  if (posts.length > 0) {
    await col.insertMany(posts);
  }
}

export async function readCategories(): Promise<Category[]> {
  try {
    const db = await getDb();
    const docs = await db.collection<Category>(CATEGORIES_COLLECTION).find({}).toArray();
    return docs.map((d) => ({ ...d, _id: undefined })) as Category[];
  } catch {
    return [];
  }
}

export async function writeCategories(categories: Category[]): Promise<void> {
  const db = await getDb();
  const col = db.collection<Category>(CATEGORIES_COLLECTION);
  await col.deleteMany({});
  if (categories.length > 0) {
    await col.insertMany(categories);
  }
}

export async function readSubcategories(): Promise<Subcategory[]> {
  try {
    const db = await getDb();
    const docs = await db.collection<Subcategory>(SUBCATEGORIES_COLLECTION).find({}).toArray();
    return docs.map((d) => ({ ...d, _id: undefined })) as Subcategory[];
  } catch {
    return [];
  }
}

export async function writeSubcategories(subcategories: Subcategory[]): Promise<void> {
  const db = await getDb();
  const col = db.collection<Subcategory>(SUBCATEGORIES_COLLECTION);
  await col.deleteMany({});
  if (subcategories.length > 0) {
    await col.insertMany(subcategories);
  }
}
