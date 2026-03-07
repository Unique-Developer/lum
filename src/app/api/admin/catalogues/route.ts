import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { readCatalogues, writeCatalogues } from "@/lib/storage";
import type { Catalogue } from "@/lib/catalogue";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const catalogues = await readCatalogues();
  return NextResponse.json(catalogues.sort((a, b) => a.order - b.order));
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { title, description, coverImage, pdfUrl, pageCount = 0 } = body;
    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Title required" }, { status: 400 });
    }

    const catalogues = await readCatalogues();
    const id = slugify(title);
    const existingIds = new Set(catalogues.map((c) => c.id));
    let finalId = id;
    let n = 0;
    while (existingIds.has(finalId)) {
      finalId = `${id}-${++n}`;
    }

    const maxOrder = catalogues.length ? Math.max(...catalogues.map((c) => c.order)) : -1;
    const newCatalogue: Catalogue = {
      id: finalId,
      title: String(title).trim(),
      description: String(description ?? "").trim(),
      coverImage: String(coverImage ?? "/catalogue/placeholder.jpg").trim(),
      pdfUrl: String(pdfUrl ?? "").trim(),
      pageCount: Number(pageCount) || 0,
      order: maxOrder + 1,
    };

    catalogues.push(newCatalogue);
    await writeCatalogues(catalogues);
    return NextResponse.json(newCatalogue);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create catalogue" }, { status: 500 });
  }
}
