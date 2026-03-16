"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { AdminShell } from "@/components/admin/AdminShell";

type Project = {
  slug: string;
  title: string;
  category: string;
  description: string;
  order: number;
};

export default function AdminProjectsPage() {
  const { token, getHeaders } = useAdminAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.replace("/admin");
      return;
    }
    fetch("/api/admin/projects", { headers: getHeaders() })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setProjects)
      .catch(() => router.replace("/admin"))
      .finally(() => setLoading(false));
  }, [token, getHeaders, router]);

  async function handleDelete(slug: string) {
    if (!confirm("Delete this project?")) return;
    setDeleting(slug);
    try {
      const res = await fetch(`/api/admin/projects/${encodeURIComponent(slug)}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.slug !== slug));
      }
    } finally {
      setDeleting(null);
    }
  }

  if (!token) return null;
  if (loading)
    return (
      <AdminShell title="Projects">
        <div className="flex h-48 items-center justify-center text-foreground/50">Loading…</div>
      </AdminShell>
    );

  return (
    <AdminShell title="Projects" subtitle="Manage showcase projects">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/admin/projects/new"
            className="rounded-lg bg-primary-main px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Add project
          </Link>
        </div>

        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.slug}
              className="flex items-center justify-between rounded-xl border border-foreground/10 bg-foreground/[0.02] p-6"
            >
              <div>
                <h2 className="font-semibold text-foreground">{project.title}</h2>
                <p className="mt-1 text-sm text-foreground/70 line-clamp-1">{project.description}</p>
                <p className="mt-1 text-xs text-foreground/50">
                  {project.category} · /projects/{project.slug}
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  href={`/projects/${project.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-main hover:underline"
                >
                  Preview
                </Link>
                <Link
                  href={`/admin/projects/${encodeURIComponent(project.slug)}/edit`}
                  className="rounded-lg border border-foreground/20 px-4 py-2 text-sm font-medium text-foreground hover:bg-foreground/5"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(project.slug)}
                  disabled={!!deleting}
                  className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
                >
                  {deleting === project.slug ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="py-16 text-center text-foreground/60">
            <p>No projects yet. Add your first project or seed sample projects.</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/admin/projects/new"
                className="inline-flex rounded-lg bg-primary-main px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Add project
              </Link>
              <button
                type="button"
                onClick={async () => {
                  try {
                    const res = await fetch("/api/admin/projects/seed", {
                      method: "POST",
                      headers: getHeaders(),
                    });
                    const data = await res.json().catch(() => ({}));
                    if (res.ok) {
                      const list = await fetch("/api/admin/projects", { headers: getHeaders() })
                        .then((r) => (r.ok ? r.json() : []));
                      setProjects(list);
                    } else {
                      alert(data.error || "Seed failed");
                    }
                  } catch {
                    alert("Seed failed");
                  }
                }}
                className="inline-flex rounded-lg border border-foreground/20 px-4 py-2 text-sm font-medium text-foreground hover:bg-foreground/5"
              >
                Seed sample projects
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
