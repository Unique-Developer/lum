import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { readProjects, writeProjects } from "@/lib/storage";
import type { Project } from "@/lib/project-types";
import { clearProjectsCache } from "@/lib/projects";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const projects = await readProjects();
  return NextResponse.json(projects.sort((a, b) => a.order - b.order));
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { slug, title, category, description, overview, concept, fixtures } = body;
    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Title required" }, { status: 400 });
    }

    const projects = await readProjects();
    const baseSlug = slug && typeof slug === "string" ? slugify(slug) : slugify(title);
    const existingSlugs = new Set(projects.map((p) => p.slug));
    let finalSlug = baseSlug;
    let n = 0;
    while (existingSlugs.has(finalSlug)) {
      finalSlug = `${baseSlug}-${++n}`;
    }

    const maxOrder = projects.length ? Math.max(...projects.map((p) => p.order)) : -1;
    const newProject: Project = {
      slug: finalSlug,
      title: String(title).trim(),
      category: String(category ?? "Residential").trim(),
      description: String(description ?? "").trim(),
      overview: String(overview ?? "").trim(),
      concept: String(concept ?? "").trim(),
      fixtures: Array.isArray(fixtures)
        ? fixtures.map((f) => String(f).trim()).filter(Boolean)
        : [],
      order: maxOrder + 1,
    };

    projects.push(newProject);
    await writeProjects(projects);
    clearProjectsCache();
    return NextResponse.json(newProject);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
