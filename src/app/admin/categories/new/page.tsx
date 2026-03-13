"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { FileUpload } from "@/components/admin/FileUpload";

export default function NewCategoryPage() {
  const { token, getHeaders } = useAdminAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  if (!token) {
    router.replace("/admin");
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getHeaders() },
        body: JSON.stringify({ name, image }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed to create");
        return;
      }
      router.push("/admin/categories");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen">
      <header className="border-b border-foreground/10 px-6 py-4">
        <Link href="/admin/categories" className="text-lg font-semibold tracking-tight text-primary-main">
          ← Categories
        </Link>
      </header>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-xl">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">New Category</h1>
          <p className="mt-2 text-foreground/70">Add a top-level category (e.g. Architectural Lighting, Decorative Lighting).</p>

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
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-foreground/20 bg-background px-4 py-2 text-foreground focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
                placeholder="e.g. Architectural Lighting"
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
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={image} alt={name || "Category"} className="h-full w-full object-cover" />
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
                      prefix="categories"
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
                disabled={loading}
                className="rounded-lg bg-primary-main px-4 py-2 font-medium text-white hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create"}
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
