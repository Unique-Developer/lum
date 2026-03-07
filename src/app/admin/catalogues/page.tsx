"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";

type Catalogue = {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  pdfUrl: string;
  pageCount: number;
  order: number;
};

export default function AdminCataloguesPage() {
  const { token, getHeaders, logout } = useAdminAuth();
  const [catalogues, setCatalogues] = useState<Catalogue[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.replace("/admin");
      return;
    }
    fetch("/api/admin/catalogues", { headers: getHeaders() })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setCatalogues)
      .catch(() => router.replace("/admin"))
      .finally(() => setLoading(false));
  }, [token, getHeaders, router]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this catalogue?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/catalogues/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (res.ok) {
        setCatalogues((prev) => prev.filter((c) => c.id !== id));
      }
    } finally {
      setDeleting(null);
    }
  }

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
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Catalogues</h1>
            <Link
              href="/admin/catalogues/new"
              className="rounded-lg bg-primary-main px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Add catalogue
            </Link>
          </div>

          <div className="space-y-4">
            {catalogues.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between rounded-xl border border-foreground/10 bg-foreground/[0.02] p-6"
              >
                <div>
                  <h2 className="font-semibold text-foreground">{cat.title}</h2>
                  <p className="mt-1 text-sm text-foreground/70 line-clamp-1">{cat.description}</p>
                  <p className="mt-1 text-xs text-foreground/50">
                    {cat.pageCount} pages · {cat.pdfUrl || "No PDF"}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link
                    href={`/admin/catalogues/${cat.id}/edit`}
                    className="rounded-lg border border-foreground/20 px-4 py-2 text-sm font-medium text-foreground hover:bg-foreground/5"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat.id)}
                    disabled={!!deleting}
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
                  >
                    {deleting === cat.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {catalogues.length === 0 && (
            <div className="py-16 text-center text-foreground/60">
              <p>No catalogues yet. Add your first catalogue.</p>
              <Link
                href="/admin/catalogues/new"
                className="mt-4 inline-block text-primary-main hover:underline"
              >
                Add catalogue
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
