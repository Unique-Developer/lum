import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { readCategories, writeCategories } from "@/lib/storage";
import type { Category } from "@/lib/categories";
import { clearCategoryCache } from "@/lib/categories";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const categories = await readCategories();
  return NextResponse.json(categories.sort((a, b) => a.order - b.order));
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { name, image } = body;
    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Name required" }, { status: 400 });
    }

    const categories = await readCategories();
    const slug = slugify(name);
    const existingIds = new Set(categories.map((c) => c.id));
    let finalId = slug;
    let n = 0;
    while (existingIds.has(finalId)) {
      finalId = `${slug}-${++n}`;
    }

    const maxOrder = categories.length ? Math.max(...categories.map((c) => c.order)) : -1;
    const newCategory: Category = {
      id: finalId,
      name: String(name).trim(),
      slug: finalId,
      image: image ? String(image).trim() : undefined,
      order: maxOrder + 1,
    };

    categories.push(newCategory);
    await writeCategories(categories);
    clearCategoryCache();
    return NextResponse.json(newCategory);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
