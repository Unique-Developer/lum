import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  getLightingSolutionsPageContent,
  saveLightingSolutionsPageContent,
  type LightingSolutionsPageContent,
} from "@/lib/lighting-solutions-content";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const content = await getLightingSolutionsPageContent();
  return NextResponse.json(content);
}

export async function PUT(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = (await req.json()) as Partial<LightingSolutionsPageContent>;
    await saveLightingSolutionsPageContent(body);
    const content = await getLightingSolutionsPageContent();
    return NextResponse.json(content);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
