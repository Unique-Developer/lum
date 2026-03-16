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

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const projects = await readProjects();
  const project = projects.find((p) => p.slug === slug);
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const projects = await readProjects();
  const idx = projects.findIndex((p) => p.slug === slug);
  if (idx < 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const body = await req.json();
    const current = projects[idx];
    const newSlug =
      body.slug !== undefined
        ? slugify(String(body.slug).trim() || current.slug)
        : current.slug;

    // Ensure new slug doesn't collide with another project (excluding current)
    if (newSlug !== current.slug) {
      const existingSlugs = new Set(projects.map((p) => p.slug));
      if (existingSlugs.has(newSlug)) {
        return NextResponse.json(
          { error: "Another project already uses this slug" },
          { status: 400 }
        );
      }
    }

    const updated: Project = {
      ...current,
      slug: newSlug,
      title: body.title !== undefined ? String(body.title).trim() : current.title,
      category: body.category !== undefined ? String(body.category).trim() : current.category,
      description: body.description !== undefined ? String(body.description).trim() : current.description,
      overview: body.overview !== undefined ? String(body.overview).trim() : current.overview,
      concept: body.concept !== undefined ? String(body.concept).trim() : current.concept,
      fixtures: body.fixtures !== undefined
        ? (Array.isArray(body.fixtures)
            ? body.fixtures.map((f: unknown) => String(f).trim()).filter(Boolean)
            : current.fixtures)
        : current.fixtures,
      order: body.order !== undefined ? Number(body.order) : current.order,
    };
    projects[idx] = updated;
    await writeProjects(projects);
    clearProjectsCache();
    return NextResponse.json(updated);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const projects = await readProjects();
  const filtered = projects.filter((p) => p.slug !== slug);
  if (filtered.length === projects.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await writeProjects(filtered);
  clearProjectsCache();
  return NextResponse.json({ success: true });
}
