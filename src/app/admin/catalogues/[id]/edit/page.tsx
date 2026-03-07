"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { FileUpload } from "@/components/admin/FileUpload";

type Catalogue = {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  pdfUrl: string;
  pageCount: number;
  order: number;
};

export default function EditCataloguePage() {
  const params = useParams();
  const id = String(params.id);
  const { token, getHeaders } = useAdminAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState<Catalogue | null>(null);

  useEffect(() => {
    if (!token) {
      router.replace("/admin");
      return;
    }
    fetch(`/api/admin/catalogues/${id}`, { headers: getHeaders() })
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
      const res = await fetch(`/api/admin/catalogues/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getHeaders() },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          coverImage: form.coverImage,
          pdfUrl: form.pdfUrl,
          pageCount: form.pageCount,
          order: form.order,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed to update");
        return;
      }
      router.push("/admin/catalogues");
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
        <Link href="/admin/catalogues" className="text-lg font-semibold tracking-tight text-primary-main">
          ← Catalogues
        </Link>
      </header>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-xl">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Edit Catalogue</h1>

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
              <label htmlFor="description" className="block text-sm font-medium text-foreground">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => f && { ...f, description: e.target.value })}
                className="mt-1 w-full rounded-lg border border-foreground/20 bg-background px-4 py-2 text-foreground focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
              />
            </div>
            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-foreground">
                Cover image URL
              </label>
              <div className="mt-1 flex gap-2">
                <input
                  id="coverImage"
                  value={form.coverImage}
                  onChange={(e) => setForm((f) => f && { ...f, coverImage: e.target.value })}
                  className="flex-1 rounded-lg border border-foreground/20 bg-background px-4 py-2 text-foreground focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
                />
                <FileUpload
                  accept="image"
                  onUpload={(url) => setForm((f) => f && { ...f, coverImage: url })}
                  getHeaders={getHeaders}
                  buttonLabel="Upload"
                />
              </div>
            </div>
            <div>
              <label htmlFor="pdfUrl" className="block text-sm font-medium text-foreground">
                PDF URL
              </label>
              <div className="mt-1 flex gap-2">
                <input
                  id="pdfUrl"
                  value={form.pdfUrl}
                  onChange={(e) => setForm((f) => f && { ...f, pdfUrl: e.target.value })}
                  className="flex-1 rounded-lg border border-foreground/20 bg-background px-4 py-2 text-foreground focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
                />
                <FileUpload
                  accept="pdf"
                  onUpload={(url) => setForm((f) => f && { ...f, pdfUrl: url })}
                  getHeaders={getHeaders}
                  buttonLabel="Upload PDF"
                />
              </div>
            </div>
            <div>
              <label htmlFor="pageCount" className="block text-sm font-medium text-foreground">
                Page count
              </label>
              <input
                id="pageCount"
                type="number"
                min={0}
                value={form.pageCount}
                onChange={(e) => setForm((f) => f && { ...f, pageCount: parseInt(e.target.value, 10) || 0 })}
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
                href="/admin/catalogues"
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
