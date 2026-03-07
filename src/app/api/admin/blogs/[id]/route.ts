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

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const posts = await readBlogPosts();
  const post = posts.find((p) => p.id === id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const posts = await readBlogPosts();
  const idx = posts.findIndex((p) => p.id === id);
  if (idx < 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const body = await req.json();
    const current = posts[idx];

    let slug = current.slug;
    if (body.slug !== undefined) {
      slug = slugify(String(body.slug)) || current.slug;
      const existing = posts.filter((p) => p.id !== id).some((p) => p.slug === slug);
      if (existing) return NextResponse.json({ error: "Slug already in use" }, { status: 400 });
    }

    const updated: BlogPost = {
      ...current,
      slug,
      title: body.title !== undefined ? String(body.title).trim() : current.title,
      excerpt: body.excerpt !== undefined ? String(body.excerpt).trim() : current.excerpt,
      content: body.content !== undefined ? String(body.content).trim() : current.content,
      publishedAt:
        body.publishedAt !== undefined
          ? new Date(body.publishedAt).toISOString()
          : current.publishedAt,
      author: body.author !== undefined ? String(body.author).trim() : current.author,
      thumbnail:
        body.thumbnail !== undefined
          ? (typeof body.thumbnail === "string" ? body.thumbnail.trim() : undefined) || undefined
          : current.thumbnail,
      media:
        body.media !== undefined
          ? Array.isArray(body.media) && body.media.every((m: unknown) => m && typeof m === "object" && "type" in m && "url" in m)
            ? body.media.map((m: { type: string; url: string }) => ({
                type: m.type === "video" ? ("video" as const) : ("image" as const),
                url: String(m.url),
              }))
            : undefined
          : current.media,
      adminNotes:
        body.adminNotes !== undefined
          ? (typeof body.adminNotes === "string" ? body.adminNotes.trim() : undefined) || undefined
          : current.adminNotes,
      postType:
        body.postType === "social" || body.postType === "blog"
          ? body.postType
          : current.postType,
    };

    posts[idx] = updated;
    await writeBlogPosts(posts);
    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const posts = await readBlogPosts();
  const filtered = posts.filter((p) => p.id !== id);
  if (filtered.length === posts.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await writeBlogPosts(filtered);
  return NextResponse.json({ success: true });
}
