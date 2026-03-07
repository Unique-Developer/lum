import { getDb } from "./mongodb";
import type { Catalogue } from "./catalogue";
import type { BlogPost } from "./blog";

const CATALOGUES_COLLECTION = "catalogues";
const BLOG_POSTS_COLLECTION = "blog_posts";

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
