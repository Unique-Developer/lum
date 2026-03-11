"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";

type Subcategory = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  order: number;
};

type Category = {
  id: string;
  name: string;
  slug: string;
  order: number;
};

export default function AdminSubcategoriesPage() {
  const { token, getHeaders, logout } = useAdminAuth();
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    if (!token) {
      router.replace("/admin");
      return;
    }
    Promise.all([
      fetch("/api/admin/categories", { headers: getHeaders() }).then((r) => (r.ok ? r.json() : [])),
      fetch(`/api/admin/subcategories${filterCategoryId ? `?categoryId=${filterCategoryId}` : ""}`, { headers: getHeaders() }).then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([cats, subs]) => {
        setCategories(cats);
        setSubcategories(subs);
      })
      .catch(() => router.replace("/admin"))
      .finally(() => setLoading(false));
  }, [token, getHeaders, router, filterCategoryId]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this subcategory?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/subcategories/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (res.ok) {
        setSubcategories((prev) => prev.filter((s) => s.id !== id));
      }
    } finally {
      setDeleting(null);
    }
  }

  const getCategoryName = (categoryId: string) => categories.find((c) => c.id === categoryId)?.name ?? categoryId;

  if (!token) return null;
  if (loading) return <div className="flex min-h-screen items-center justify-center">Loading...</div>;

  return (
    <main className="min-h-screen">
      <header className="border-b border-foreground/10 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/admin/dashboard" className="text-lg font-semibold tracking-tight text-primary-main">
            ← Dashboard
          </Link>
          <button
            type="button"
            onClick={() => {
              logout();
              router.replace("/admin");
            }}
            className="text-sm text-foreground/70 hover:text-foreground"
          >
            Sign out
          </button>
        </div>
      </header>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Subcategories</h1>
            <div className="flex gap-3">
              {filterCategoryId && (
                <Link
                  href="/admin/subcategories"
                  className="rounded-lg border border-foreground/20 px-4 py-2 text-sm font-medium text-foreground hover:bg-foreground/5"
                >
                  Show all
                </Link>
              )}
              <Link
                href={`/admin/subcategories/new${filterCategoryId ? `?categoryId=${filterCategoryId}` : ""}`}
                className="rounded-lg bg-primary-main px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Add subcategory
              </Link>
            </div>
          </div>

          {categories.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              <span className="text-sm text-foreground/60">Filter by category:</span>
              <Link
                href="/admin/subcategories"
                className={`rounded-full px-3 py-1 text-sm ${!filterCategoryId ? "bg-primary-main text-white" : "bg-foreground/10 text-foreground hover:bg-foreground/20"}`}
              >
                All
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/admin/subcategories?categoryId=${c.id}`}
                  className={`rounded-full px-3 py-1 text-sm ${filterCategoryId === c.id ? "bg-primary-main text-white" : "bg-foreground/10 text-foreground hover:bg-foreground/20"}`}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          )}

          <div className="space-y-4">
            {subcategories.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between rounded-xl border border-foreground/10 bg-foreground/[0.02] p-6"
              >
                <div>
                  <h2 className="font-semibold text-foreground">{sub.name}</h2>
                  <p className="mt-1 text-xs text-foreground/50">
                    Slug: {sub.slug} · Category: {getCategoryName(sub.categoryId)}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link
                    href={`/admin/subcategories/${sub.id}/edit`}
                    className="rounded-lg border border-foreground/20 px-4 py-2 text-sm font-medium text-foreground hover:bg-foreground/5"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(sub.id)}
                    disabled={!!deleting}
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
                  >
                    {deleting === sub.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {subcategories.length === 0 && (
            <div className="py-16 text-center text-foreground/60">
              <p>No subcategories yet. Add categories first, then add subcategories.</p>
              <div className="mt-4 flex justify-center gap-4">
                <Link href="/admin/categories" className="text-primary-main hover:underline">
                  Manage categories
                </Link>
                <Link href="/admin/subcategories/new" className="text-primary-main hover:underline">
                  Add subcategory
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
