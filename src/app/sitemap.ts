import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { getCatalogues } from "@/lib/catalogue";
import { getBlogPosts } from "@/lib/blog";

const STATIC_PAGES = [
  { path: "/", changeFrequency: "weekly" as const, priority: 1 },
  { path: "/catalogue", changeFrequency: "weekly" as const, priority: 0.9 },
  { path: "/posts", changeFrequency: "weekly" as const, priority: 0.9 },
  { path: "/about", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/studio-philosophy", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/projects", changeFrequency: "weekly" as const, priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/architect-collaboration", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/privacy-policy", changeFrequency: "yearly" as const, priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = STATIC_PAGES.map((p) => ({
    url: absoluteUrl(p.path),
    lastModified: new Date(),
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  const [catalogues, posts] = await Promise.all([getCatalogues(), getBlogPosts()]);

  for (const cat of catalogues) {
    entries.push({
      url: absoluteUrl(`/catalogue/${cat.id}`),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  for (const post of posts) {
    entries.push({
      url: absoluteUrl(`/posts/${post.slug}`),
      lastModified: new Date(post.publishedAt),
      changeFrequency: "yearly",
      priority: 0.7,
    });
  }

  return entries;
}
