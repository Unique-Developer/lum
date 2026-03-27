import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { readCatalogues, writeCatalogues } from "@/lib/storage";
import type { Catalogue } from "@/lib/catalogue";
import { clearCatalogueCache } from "@/lib/catalogue";
import { deleteR2Object, urlToR2Key } from "@/lib/r2";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const catalogues = await readCatalogues();
  const cat = catalogues.find((c) => c.id === id);
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
  const catalogues = await readCatalogues();
  const idx = catalogues.findIndex((c) => c.id === id);
  if (idx < 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const body = await req.json();
    const current = catalogues[idx];
    const nextCoverImage =
      body.coverImage !== undefined ? String(body.coverImage).trim() : current.coverImage;
    const nextPdfUrl = body.pdfUrl !== undefined ? String(body.pdfUrl).trim() : current.pdfUrl;
    const updated: Catalogue = {
      ...current,
      title: body.title !== undefined ? String(body.title).trim() : current.title,
      description: body.description !== undefined ? String(body.description).trim() : current.description,
      coverImage: nextCoverImage,
      pdfUrl: nextPdfUrl,
      pageCount: body.pageCount !== undefined ? Number(body.pageCount) : current.pageCount,
      order: body.order !== undefined ? Number(body.order) : current.order,
      subcategoryId: body.subcategoryId !== undefined ? (body.subcategoryId ? String(body.subcategoryId).trim() : undefined) : current.subcategoryId,
    };

    const keysToDelete = new Set<string>();
    if (current.coverImage && current.coverImage !== nextCoverImage) {
      const key = urlToR2Key(current.coverImage);
      if (key) keysToDelete.add(key);
    }
    if (current.pdfUrl && current.pdfUrl !== nextPdfUrl) {
      const key = urlToR2Key(current.pdfUrl);
      if (key) keysToDelete.add(key);
    }

    catalogues[idx] = updated;
    await writeCatalogues(catalogues);
    for (const key of keysToDelete) {
      try {
        await deleteR2Object(key);
      } catch (deleteErr) {
        console.warn(`Failed to delete replaced R2 object: ${key}`, deleteErr);
      }
    }
    clearCatalogueCache();
    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update catalogue" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const catalogues = await readCatalogues();
  const filtered = catalogues.filter((c) => c.id !== id);
  if (filtered.length === catalogues.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await writeCatalogues(filtered);
  clearCatalogueCache();
  return NextResponse.json({ success: true });
}
