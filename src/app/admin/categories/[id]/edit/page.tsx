"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { AdminShell } from "@/components/admin/AdminShell";
import { FileUpload } from "@/components/admin/FileUpload";

type Category = {
  id: string;
  name: string;
  slug: string;
  image?: string;
  order: number;
  description?: string;
  includes?: string[];
};

export default function EditCategoryPage() {
  const params = useParams();
  const id = String(params.id);
  const { token, getHeaders } = useAdminAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState<Category | null>(null);

  useEffect(() => {
    if (!token) {
      router.replace("/admin");
      return;
    }
    fetch(`/api/admin/categories/${id}`, { headers: getHeaders() })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setForm)
      .catch(() => router.replace("/admin"))
      .finally(() => setFetching(false));
  }, [token, id, getHeaders, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getHeaders() },
        body: JSON.stringify({
        name: form.name,
        slug: form.slug,
        image: form.image,
        order: form.order,
        description: form.description,
        includes: form.includes,
      }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed to update");
        return;
      }
      router.push("/admin/categories");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  if (!token) return null;
  if (fetching || !form)
    return (
      <AdminShell title="Edit Category">
        <div className="flex h-48 items-center justify-center text-foreground/50">Loading…</div>
      </AdminShell>
    );

  return (
    <AdminShell title="Edit Category" subtitle={form.name}>
      <div className="mx-auto max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800">
                {error}
              </div>
            )}
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
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-foreground">
                Description (Lighting Solutions page)
              </label>
              <p className="mt-1 text-xs text-foreground/60">
                Optional. Shown on the Lighting Solutions page for this category.
              </p>
              <textarea
                id="description"
                rows={3}
                value={form.description ?? ""}
                onChange={(e) => setForm((f) => f && { ...f, description: e.target.value || undefined })}
                className="mt-2 w-full resize-none rounded-lg border border-foreground/20 bg-background px-4 py-2 text-foreground focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
                placeholder="e.g. Lighting designed to complement architectural forms..."
              />
            </div>
            <div>
              <label htmlFor="includes" className="block text-sm font-medium text-foreground">
                Includes (Lighting Solutions page)
              </label>
              <p className="mt-1 text-xs text-foreground/60">
                One item per line. Shown as bullet list on Lighting Solutions.
              </p>
              <textarea
                id="includes"
                rows={4}
                value={(form.includes ?? []).join("\n")}
                onChange={(e) =>
                  setForm((f) =>
                    f
                      ? {
                          ...f,
                          includes: e.target.value
                            .split("\n")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        }
                      : f
                  )
                }
                className="mt-2 w-full resize-none rounded-lg border border-foreground/20 bg-background px-4 py-2 font-mono text-sm text-foreground focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
                placeholder="Recessed lighting\nCove lighting\nWall washing"
              />
            </div>
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-foreground">
                Category image
              </label>
              <p className="mt-1 text-xs text-foreground/60">
                Optional. Shown on the public catalogue category cards.
              </p>
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
                      onChange={(e) => setForm((f) => f && { ...f, image: e.target.value || undefined })}
                      placeholder="https://... or upload"
                      className="flex-1 rounded-lg border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
                    />
                    <FileUpload
                      accept="image"
                      prefix="categories"
                      onUpload={(url) => setForm((f) => f && { ...f, image: url })}
                      getHeaders={getHeaders}
                      buttonLabel="Upload"
                    />
                  </div>
                </div>
              </div>
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
                href="/admin/categories"
                className="rounded-lg border border-foreground/20 px-4 py-2 font-medium text-foreground bg-foreground/5"
              >
                Cancel
              </Link>
            </div>
          </form>
          <div className="mt-6">
            <Link href="/admin/categories" className="text-sm text-primary-main hover:underline">
              ← Back to Categories
            </Link>
          </div>
        </div>
    </AdminShell>
  );
}
