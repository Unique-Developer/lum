"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { FileUpload } from "@/components/admin/FileUpload";

type Subcategory = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  order: number;
  image?: string;
};

type Category = {
  id: string;
  name: string;
  slug: string;
  order: number;
};

export default function EditSubcategoryPage() {
  const params = useParams();
  const id = String(params.id);
  const { token, getHeaders } = useAdminAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState<Subcategory | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (!token) {
      router.replace("/admin");
      return;
    }
    Promise.all([
      fetch(`/api/admin/subcategories/${id}`, { headers: getHeaders() }).then((r) => (r.ok ? r.json() : null)),
      fetch("/api/admin/categories", { headers: getHeaders() }).then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([sub, cats]) => {
        setForm(sub);
        setCategories(cats);
      })
      .catch(() => router.replace("/admin"))
      .finally(() => setFetching(false));
  }, [token, id, getHeaders, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/subcategories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getHeaders() },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug,
          categoryId: form.categoryId,
          order: form.order,
          // Send empty string when cleared so the backend can remove the image.
          image: form.image?.trim() ?? "",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed to update");
        return;
      }
      router.push("/admin/subcategories");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  if (!token) return null;
  if (fetching || !form) return <div className="flex min-h-screen items-center justify-center">Loading...</div>;

  const uploadPrefix = form.categoryId ? `subcategories/${form.categoryId}` : "subcategories";

  return (
    <main className="min-h-screen">
      <header className="border-b border-foreground/10 px-6 py-4">
        <Link href="/admin/subcategories" className="text-lg font-semibold tracking-tight text-primary-main">
          ← Subcategories
        </Link>
      </header>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-xl">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Edit Subcategory</h1>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-foreground">
                Category *
              </label>
              <select
                id="categoryId"
                required
                value={form.categoryId}
                onChange={(e) => setForm((f) => f && { ...f, categoryId: e.target.value })}
                className="mt-1 w-full rounded-lg border border-foreground/20 bg-background px-4 py-2 text-foreground focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground">
                Name *
              </label>
              <input
                id="name"
                required
                value={form.name}
                onChange={(e) => setForm((f) => f && { ...f, name: e.target.value })}
                className="mt-1 w-full rounded-lg border border-foreground/20 bg-background px-4 py-2 text-foreground focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
              />
            </div>
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-foreground">
                Subcategory image
              </label>
              <p className="mt-1 text-xs text-foreground/60">Optional. Shown on the public catalogue subcategory cards.</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-16 w-16 overflow-hidden rounded-lg border border-foreground/10 bg-foreground/5">
                  {form.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={form.image} alt={form.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-foreground/40">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex gap-2">
                    <input
                      id="image"
                      value={form.image ?? ""}
                      onChange={(e) => setForm((f) => (f ? { ...f, image: e.target.value || undefined } : f))}
                      placeholder="https://... or upload"
                      className="flex-1 rounded-lg border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
                    />
                    <FileUpload
                      accept="image"
                      prefix={uploadPrefix}
                      onUpload={(url) => setForm((f) => (f ? { ...f, image: url } : f))}
                      getHeaders={getHeaders}
                      buttonLabel="Upload"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-foreground">
                Slug (URL)
              </label>
              <input
                id="slug"
                value={form.slug}
                onChange={(e) => setForm((f) => f && { ...f, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
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
                href="/admin/subcategories"
                className="rounded-lg border border-foreground/20 px-4 py-2 font-medium text-foreground bg-foreground/5"
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
