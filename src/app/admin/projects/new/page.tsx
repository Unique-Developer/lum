"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";

export default function NewProjectPage() {
  const { token, getHeaders } = useAdminAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    slug: "",
    title: "",
    category: "Residential",
    description: "",
    overview: "",
    concept: "",
    fixturesText: "",
  });

  if (!token) {
    router.replace("/admin");
    return null;
  }

  const fixtures = form.fixturesText
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getHeaders() },
        body: JSON.stringify({
          slug: form.slug || undefined,
          title: form.title,
          category: form.category,
          description: form.description,
          overview: form.overview,
          concept: form.concept,
          fixtures,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed to create");
        return;
      }
      router.push("/admin/projects");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen">
      <header className="border-b border-foreground/10 px-6 py-4">
        <Link href="/admin/projects" className="text-lg font-semibold tracking-tight text-primary-main">
          ← Projects
        </Link>
      </header>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-xl">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">New Project</h1>
          <p className="mt-2 text-foreground/70">Add a showcase project.</p>

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
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-foreground/20 bg-background px-4 py-2 text-foreground focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
              />
            </div>
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-foreground">
                URL slug
              </label>
              <input
                id="slug"
                placeholder="e.g. luxury-residence-lighting-surat"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-foreground/20 bg-background px-4 py-2 text-foreground placeholder:text-foreground/50 focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
              />
              <p className="mt-1 text-xs text-foreground/50">Leave blank to auto-generate from title</p>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-foreground">
                Category
              </label>
              <input
                id="category"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="Residential, Hospitality, Corporate..."
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
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-foreground/20 bg-background px-4 py-2 text-foreground focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
              />
            </div>
            <div>
              <label htmlFor="overview" className="block text-sm font-medium text-foreground">
                Overview (detail page)
              </label>
              <textarea
                id="overview"
                rows={3}
                value={form.overview}
                onChange={(e) => setForm((f) => ({ ...f, overview: e.target.value }))}
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
                onChange={(e) => setForm((f) => ({ ...f, concept: e.target.value }))}
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
                value={form.fixturesText}
                onChange={(e) => setForm((f) => ({ ...f, fixturesText: e.target.value }))}
                placeholder="Recessed downlights with low-glare optics&#10;Linear profiles in coves&#10;..."
                className="mt-1 w-full rounded-lg border border-foreground/20 bg-background px-4 py-2 text-foreground placeholder:text-foreground/50 focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-primary-main px-4 py-2 font-medium text-white hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create"}
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
