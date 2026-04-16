import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { readBlogCategories, writeBlogCategories } from "@/lib/storage";
import type { BlogCategory } from "@/lib/blog-categories";
import { clearBlogCategoryCache } from "@/lib/blog-categories";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const categories = await readBlogCategories();
  return NextResponse.json(categories.sort((a, b) => a.order - b.order));
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { name } = body as { name?: unknown };
    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Name required" }, { status: 400 });
    }

    const categories = await readBlogCategories();
    const baseSlug = slugify(name);
    if (!baseSlug) {
      return NextResponse.json({ error: "Invalid category name" }, { status: 400 });
    }
    const existing = new Set(categories.map((c) => c.slug));
    let finalSlug = baseSlug;
    let n = 0;
    while (existing.has(finalSlug)) {
      finalSlug = `${baseSlug}-${++n}`;
    }
    const maxOrder = categories.length ? Math.max(...categories.map((c) => c.order)) : -1;

    const newCategory: BlogCategory = {
      id: finalSlug,
      slug: finalSlug,
      name: String(name).trim(),
      order: maxOrder + 1,
    };

    categories.push(newCategory);
    await writeBlogCategories(categories);
    clearBlogCategoryCache();
    return NextResponse.json(newCategory);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create blog category" }, { status: 500 });
  }
}
