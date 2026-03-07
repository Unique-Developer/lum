import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { readBlogPosts, writeBlogPosts } from "@/lib/storage";
import type { BlogPost } from "@/lib/blog";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const posts = await readBlogPosts();
  return NextResponse.json(
    posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  );
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { title, slug, excerpt, content, author, thumbnail, media, adminNotes } = body;
    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Title required" }, { status: 400 });
    }

    const posts = await readBlogPosts();
    const baseSlug = slug && typeof slug === "string" ? slugify(slug) : slugify(title);
    const existingSlugs = new Set(posts.map((p) => p.slug));
    let finalSlug = baseSlug;
    let n = 0;
    while (existingSlugs.has(finalSlug)) {
      finalSlug = `${baseSlug}-${++n}`;
    }

    const maxId = posts.reduce((m, p) => Math.max(m, parseInt(p.id, 10) || 0), 0);
    const newId = String(maxId + 1);
    const now = new Date().toISOString();

    const newPost: BlogPost = {
      id: newId,
      slug: finalSlug,
      title: String(title).trim(),
      excerpt: String(excerpt ?? "").trim(),
      content: String(content ?? "").trim(),
      publishedAt: now,
      author: String(author ?? "Lumin Art Studio").trim(),
      thumbnail: thumbnail && typeof thumbnail === "string" ? thumbnail.trim() || undefined : undefined,
      media: Array.isArray(media) && media.every((m) => m?.type && m?.url)
        ? media.map((m: { type: string; url: string }) => ({
            type: m.type === "video" ? "video" as const : "image" as const,
            url: String(m.url),
          }))
        : undefined,
      adminNotes:
        adminNotes !== undefined && typeof adminNotes === "string"
          ? adminNotes.trim() || undefined
          : undefined,
    };

    posts.push(newPost);
    await writeBlogPosts(posts);
    return NextResponse.json(newPost);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
