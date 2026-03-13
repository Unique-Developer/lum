import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { readCategories, writeCategories } from "@/lib/storage";
import type { Category } from "@/lib/categories";
import { clearCategoryCache } from "@/lib/categories";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const categories = await readCategories();
  const cat = categories.find((c) => c.id === id);
  if (!cat) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(cat);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const categories = await readCategories();
  const idx = categories.findIndex((c) => c.id === id);
  if (idx < 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const body = await req.json();
    const current = categories[idx];
    const name = body.name !== undefined ? String(body.name).trim() : current.name;
    const slug = body.slug !== undefined ? String(body.slug).trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/^-|-$/g, "") : current.slug;
    const updated: Category = {
      ...current,
      name,
      slug: slug || current.slug,
      image: body.image !== undefined ? (body.image ? String(body.image).trim() : undefined) : current.image,
      order: body.order !== undefined ? Number(body.order) : current.order,
    };
    categories[idx] = updated;
    await writeCategories(categories);
    clearCategoryCache();
    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const categories = await readCategories();
  const filtered = categories.filter((c) => c.id !== id);
  if (filtered.length === categories.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await writeCategories(filtered);
  clearCategoryCache();
  return NextResponse.json({ success: true });
}
