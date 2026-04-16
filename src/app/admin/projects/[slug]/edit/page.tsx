"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { FileUpload } from "@/components/admin/FileUpload";

type Project = {
  slug: string;
  title: string;
  category: string;
  description: string;
  coverImage: string;
  photos: string[];
  overview: string;
  concept: string;
  fixtures: string[];
  order: number;
};

export default function EditProjectPage() {
  const params = useParams();
  const slug = String(params.slug);
  const { token, getHeaders } = useAdminAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState<Project | null>(null);

  useEffect(() => {
    if (!token) {
      router.replace("/admin");
      return;
    }
    fetch(`/api/admin/projects/${encodeURIComponent(slug)}`, { headers: getHeaders() })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setForm)
      .catch(() => router.replace("/admin"))
      .finally(() => setFetching(false));
  }, [token, slug, getHeaders, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/projects/${encodeURIComponent(slug)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getHeaders() },
        body: JSON.stringify({
          slug: form.slug,
          title: form.title,
          category: form.category,
          description: form.description,
          coverImage: form.coverImage || form.photos[0] || "",
          photos: form.photos,
          overview: form.overview,
          concept: form.concept,
          fixtures: form.fixtures,
          order: form.order,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed to update");
        return;
      }
      if (data.slug && data.slug !== slug) {
        router.push(`/admin/projects/${encodeURIComponent(data.slug)}/edit`);
      } else {
        router.push("/admin/projects");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  if (!token) return null;
  if (fetching || !form)
    return (
      <div className="flex min-h-screen items-center justify-center">Loading...</div>
    );

  const fixturesText = form.fixtures.join("\n");

  return (
    <main className="min-h-screen">
      <header className="border-b border-foreground/10 px-6 py-4">
        <Link href="/admin/projects" className="text-lg font-semibold tracking-tight text-primary-main">
          ← Projects
        </Link>
      </header>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-xl">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Edit Project</h1>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-foreground">
                Title *
              </label>
              <input
                id="title"
                required
                value={form.title}
                onChange={(e) => setForm((f) => f && { ...f, title: e.target.value })}
                className="mt-1 w-full rounded-lg border border-foreground/20 bg-background px-4 py-2 text-foreground focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
              />
            </div>
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-foreground">
                URL slug
              </label>
              <input
                id="slug"
                value={form.slug}
                onChange={(e) => setForm((f) => f && { ...f, slug: e.target.value })}
                className="mt-1 w-full rounded-lg border border-foreground/20 bg-background px-4 py-2 text-foreground focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
              />
              <p className="mt-1 text-xs text-foreground/50">Changing slug updates the project URL</p>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-foreground">
                Category
              </label>
              <input
                id="category"
                value={form.category}
                onChange={(e) => setForm((f) => f && { ...f, category: e.target.value })}
                className="mt-1 w-full rounded-lg border border-foreground/20 bg-background px-4 py-2 text-foreground focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-foreground">
                Short description (list view)
              </label>
              <textarea
                id="description"
                rows={2}
                value={form.description}
                onChange={(e) => setForm((f) => f && { ...f, description: e.target.value })}
                className="mt-1 w-full rounded-lg border border-foreground/20 bg-background px-4 py-2 text-foreground focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Project photos</label>
              <div className="mt-2 flex flex-wrap items-start gap-3">
                <FileUpload
                  accept="image"
                  prefix="projects"
                  buttonLabel="Add photo"
                  getHeaders={getHeaders}
                  onUpload={(url) =>
                    setForm((f) => {
                      if (!f) return null;
                      const photos = [...f.photos, url];
                      return {
                        ...f,
                        photos,
                        coverImage: photos[0] || "",
                      };
                    })
                  }
                />
              </div>
              {form.photos.length > 0 && (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {form.photos.map((photo, index) => (
                    <div key={photo} className="overflow-hidden rounded-lg border border-foreground/10 p-2">
                      <Image
                        src={photo}
                        alt={`Project photo ${index + 1}`}
                        width={480}
                        height={270}
                        className="h-36 w-full rounded-md object-cover"
                      />
                      <div className="mt-2 flex items-center justify-between gap-3 text-xs text-foreground/60">
                        <span>{index === 0 ? "Used as project thumbnail" : `Photo ${index + 1}`}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setForm((f) => {
                              if (!f) return null;
                              const photos = f.photos.filter((_, photoIndex) => photoIndex !== index);
                              return {
                                ...f,
                                photos,
                                coverImage: photos[0] || "",
                              };
                            })
                          }
                          className="rounded-lg border border-foreground/20 px-2 py-1 text-foreground hover:bg-foreground/5"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <p className="mt-1 text-xs text-foreground/50">
                Add multiple photos. The first photo is used as the thumbnail on the projects page.
              </p>
            </div>
            <div>
              <label htmlFor="overview" className="block text-sm font-medium text-foreground">
                Overview (detail page)
              </label>
              <textarea
                id="overview"
                rows={3}
                value={form.overview}
                onChange={(e) => setForm((f) => f && { ...f, overview: e.target.value })}
                className="mt-1 w-full rounded-lg border border-foreground/20 bg-background px-4 py-2 text-foreground focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
              />
            </div>
            <div>
              <label htmlFor="concept" className="block text-sm font-medium text-foreground">
                Lighting concept
              </label>
              <textarea
                id="concept"
                rows={4}
                value={form.concept}
                onChange={(e) => setForm((f) => f && { ...f, concept: e.target.value })}
                className="mt-1 w-full rounded-lg border border-foreground/20 bg-background px-4 py-2 text-foreground focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
              />
            </div>
            <div>
              <label htmlFor="fixturesText" className="block text-sm font-medium text-foreground">
                Fixtures used (one per line)
              </label>
              <textarea
                id="fixturesText"
                rows={5}
                value={fixturesText}
                onChange={(e) =>
                  setForm((f) =>
                    f
                      ? {
                          ...f,
                          fixtures: e.target.value
                            .split("\n")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        }
                      : null
                  )
                }
                className="mt-1 w-full rounded-lg border border-foreground/20 bg-background px-4 py-2 text-foreground focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-primary-main px-4 py-2 font-medium text-white hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <Link
                href="/admin/projects"
                className="rounded-lg border border-foreground/20 px-4 py-2 font-medium text-foreground hover:bg-foreground/5"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
