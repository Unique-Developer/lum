import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { readSubcategories, writeSubcategories } from "@/lib/storage";
import type { Subcategory } from "@/lib/categories";
import { clearCategoryCache } from "@/lib/categories";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const subcategories = await readSubcategories();
  const sub = subcategories.find((s) => s.id === id);
  if (!sub) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(sub);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const subcategories = await readSubcategories();
  const idx = subcategories.findIndex((s) => s.id === id);
  if (idx < 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const body = await req.json();
    const current = subcategories[idx];
    const name = body.name !== undefined ? String(body.name).trim() : current.name;
    const slug = body.slug !== undefined ? String(body.slug).trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/^-|-$/g, "") : current.slug;
    const updated: Subcategory = {
      ...current,
      name,
      slug: slug || current.slug,
      categoryId: body.categoryId !== undefined ? String(body.categoryId).trim() : current.categoryId,
      order: body.order !== undefined ? Number(body.order) : current.order,
    };
    subcategories[idx] = updated;
    await writeSubcategories(subcategories);
    clearCategoryCache();
    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update subcategory" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const subcategories = await readSubcategories();
  const filtered = subcategories.filter((s) => s.id !== id);
  if (filtered.length === subcategories.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await writeSubcategories(filtered);
  clearCategoryCache();
  return NextResponse.json({ success: true });
}
