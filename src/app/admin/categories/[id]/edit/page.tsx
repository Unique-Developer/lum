"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { FileUpload } from "@/components/admin/FileUpload";

type Category = {
  id: string;
  name: string;
  slug: string;
  image?: string;
  order: number;
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
        body: JSON.stringify({ name: form.name, slug: form.slug, image: form.image, order: form.order }),
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
  if (fetching || !form) return <div className="flex min-h-screen items-center justify-center">Loading...</div>;

  return (
    <main className="min-h-screen">
      <header className="border-b border-foreground/10 px-6 py-4">
        <Link href="/admin/categories" className="text-lg font-semibold tracking-tight text-primary-main">
          ← Categories
        </Link>
      </header>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-xl">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Edit Category</h1>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
        </div>
      </section>
    </main>
  );
}
