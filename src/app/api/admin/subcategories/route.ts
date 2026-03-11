import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { readSubcategories, writeSubcategories } from "@/lib/storage";
import type { Subcategory } from "@/lib/categories";
import { clearCategoryCache } from "@/lib/categories";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId");
  let subcategories = (await readSubcategories()).sort((a, b) => a.order - b.order);
  if (categoryId) {
    subcategories = subcategories.filter((s) => s.categoryId === categoryId);
  }
  return NextResponse.json(subcategories);
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { name, categoryId } = body;
    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Name required" }, { status: 400 });
    }
    if (!categoryId || typeof categoryId !== "string") {
      return NextResponse.json({ error: "Category required" }, { status: 400 });
    }

    const subcategories = await readSubcategories();
    const slug = slugify(name);
    const existingIds = new Set(subcategories.map((s) => s.id));
    let finalId = slug;
    let n = 0;
    while (existingIds.has(finalId)) {
      finalId = `${slug}-${++n}`;
    }

    const categorySubs = subcategories.filter((s) => s.categoryId === categoryId);
    const maxOrder = categorySubs.length ? Math.max(...categorySubs.map((s) => s.order)) : -1;
    const newSubcategory: Subcategory = {
      id: finalId,
      name: String(name).trim(),
      slug: finalId,
      categoryId: String(categoryId).trim(),
      order: maxOrder + 1,
    };

    subcategories.push(newSubcategory);
    await writeSubcategories(subcategories);
    clearCategoryCache();
    return NextResponse.json(newSubcategory);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create subcategory" }, { status: 500 });
  }
}
