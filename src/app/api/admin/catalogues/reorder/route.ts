import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { readCatalogues, writeCatalogues } from "@/lib/storage";
import { clearCatalogueCache } from "@/lib/catalogue";

export async function PUT(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const ids: string[] = Array.isArray(body.ids) ? body.ids : [];
    if (ids.length === 0) return NextResponse.json({ error: "ids array required" }, { status: 400 });

    const catalogues = await readCatalogues();
    const byId = new Map(catalogues.map((c) => [c.id, c]));

    const reordered = ids
      .filter((id) => byId.has(id))
      .map((id, i) => ({ ...byId.get(id)!, order: i }));
    const rest = catalogues.filter((c) => !ids.includes(c.id));
    const maxOrder = reordered.length;
    rest.forEach((c, i) => (c.order = maxOrder + i));
    const merged = [...reordered, ...rest].sort((a, b) => a.order - b.order);

    await writeCatalogues(merged);
    clearCatalogueCache();
    return NextResponse.json(merged);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to reorder" }, { status: 500 });
  }
}
