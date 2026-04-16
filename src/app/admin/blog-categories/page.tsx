"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { AdminShell } from "@/components/admin/AdminShell";

type BlogCategory = {
  id: string;
  name: string;
  slug: string;
  order: number;
};

export default function AdminBlogCategoriesPage() {
  const { token, getHeaders } = useAdminAuth();
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.replace("/admin");
      return;
    }

    fetch("/api/admin/blog-categories", { headers: getHeaders() })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((list) => setCategories(Array.isArray(list) ? list : []))
      .catch(() => router.replace("/admin"))
      .finally(() => setLoading(false));
  }, [token, getHeaders, router]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/admin/blog-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getHeaders() },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed to create category");
        return;
      }
      setCategories((prev) => [...prev, data].sort((a, b) => a.order - b.order));
      setName("");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this blog category? Posts using it will become uncategorized.")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/blog-categories/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      }
    } finally {
      setDeleting(null);
    }
  }

  if (!token) return null;
  if (loading) {
    return (
      <AdminShell title="Post Categories">
        <div className="flex h-48 items-center justify-center text-foreground/50">Loading…</div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Post Categories" subtitle="Add or delete categories used for posts/blog filtering.">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <Link href="/admin/blogs" className="text-sm text-primary-main hover:underline">
            ← Back to Posts
          </Link>
        </div>

        <form onSubmit={handleCreate} className="mb-6 rounded-xl border border-foreground/10 bg-foreground/[0.02] p-4 sm:p-5">
          <label htmlFor="name" className="block text-sm font-medium text-foreground">
            New category
          </label>
          <div className="mt-2 flex gap-3">
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Lighting Guides"
              className="w-full rounded-lg border border-foreground/20 bg-background px-4 py-2 text-foreground focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
            />
            <button
              type="submit"
              disabled={creating}
              className="whitespace-nowrap rounded-lg bg-primary-main px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
            >
              {creating ? "Adding..." : "Add"}
            </button>
          </div>
          {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
        </form>

        <div className="space-y-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between rounded-xl border border-foreground/10 bg-foreground/[0.02] p-4"
            >
              <div>
                <p className="font-medium text-foreground">{cat.name}</p>
                <p className="text-xs text-foreground/50">{cat.slug}</p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(cat.id)}
                disabled={!!deleting}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
              >
                {deleting === cat.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="py-10 text-center text-foreground/60">No post categories yet. Add your first one.</div>
        )}
      </div>
    </AdminShell>
  );
}
