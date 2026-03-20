"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { FileUpload } from "@/components/admin/FileUpload";

type Category = {
  id: string;
  name: string;
  slug: string;
  order: number;
};

export default function NewSubcategoryPage() {
  const { token, getHeaders } = useAdminAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCategoryId = searchParams.get("categoryId");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(preselectedCategoryId || "");
  const [image, setImage] = useState("");
  const uploadPrefix = categoryId ? `subcategories/${categoryId}` : "subcategories";

  useEffect(() => {
    if (!token) {
      router.replace("/admin");
      return;
    }
    fetch("/api/admin/categories", { headers: getHeaders() })
      .then((r) => (r.ok ? r.json() : []))
      .then((cats: Category[]) => {
        setCategories(cats);
        if (preselectedCategoryId && cats.some((c) => c.id === preselectedCategoryId)) {
          setCategoryId(preselectedCategoryId);
        } else if (cats.length > 0 && !categoryId) {
          setCategoryId(cats[0].id);
        }
      });
  }, [token, getHeaders, router, preselectedCategoryId]);

  if (!token) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!categoryId) {
      setError("Please select a category");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/subcategories", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getHeaders() },
        body: JSON.stringify({ name, categoryId, image: image.trim() || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed to create");
        return;
      }
      router.push(`/admin/subcategories?categoryId=${categoryId}`);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen">
      <header className="border-b border-foreground/10 px-6 py-4">
        <Link href="/admin/subcategories" className="text-lg font-semibold tracking-tight text-primary-main">
          ← Subcategories
        </Link>
      </header>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-xl">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">New Subcategory</h1>
          <p className="mt-2 text-foreground/70">
            Add a subcategory (e.g. COB Light, Track Light under Architectural; Pendant Light, Wall Sconces under Decorative).
          </p>

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
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-foreground/20 bg-background px-4 py-2 text-foreground focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
              >
                <option value="">Select category</option>
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-foreground/20 bg-background px-4 py-2 text-foreground focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
                placeholder="e.g. COB Light, Pendant Light"
              />
            </div>
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-foreground">
                Subcategory image
              </label>
              <p className="mt-1 text-xs text-foreground/60">Optional. Shown on the public catalogue subcategory cards.</p>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-16 w-16 overflow-hidden rounded-lg border border-foreground/10 bg-foreground/5">
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={image} alt={name || "Subcategory"} className="h-full w-full object-cover" />
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
                      placeholder="https://... or upload"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="flex-1 rounded-lg border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
                    />
                    <FileUpload
                      accept="image"
                      prefix={uploadPrefix}
                      onUpload={(url) => setImage(url)}
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
                disabled={loading || categories.length === 0}
                className="rounded-lg bg-primary-main px-4 py-2 font-medium text-white hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create"}
              </button>
              <Link
                href="/admin/subcategories"
                className="rounded-lg border border-foreground/20 px-4 py-2 font-medium text-foreground bg-foreground/5"
              >
                Cancel
              </Link>
            </div>
          </form>
          {categories.length === 0 && (
            <p className="mt-4 text-sm text-foreground/60">
              No categories yet. <Link href="/admin/categories/new" className="text-primary-main hover:underline">Add a category</Link> first.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
