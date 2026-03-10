"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";

type UnusedFile = { key: string; size: number; lastModified?: string };

type Analysis = {
  used: number;
  unused: number;
  totalSize: number;
  unusedSize: number;
  unusedFiles: UnusedFile[];
};

function formatBytes(n: number): string {
  if (n === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(n) / Math.log(k));
  return `${parseFloat((n / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export default function AdminStoragePage() {
  const { token, getHeaders } = useAdminAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!token) {
      router.replace("/admin");
      return;
    }
    fetch("/api/admin/storage/unused", { headers: getHeaders() })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.statusText))))
      .then(setAnalysis)
      .catch((e) => setError(e.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, [token, getHeaders, router]);

  function toggleSelect(key: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function selectAll() {
    if (!analysis?.unusedFiles.length) return;
    setSelected(new Set(analysis.unusedFiles.map((f) => f.key)));
  }

  function selectNone() {
    setSelected(new Set());
  }

  async function handleDelete() {
    if (selected.size === 0) return;
    if (!confirm(`Permanently delete ${selected.size} file(s)? This cannot be undone.`)) return;
    setError("");
    setDeleting(true);
    try {
      const res = await fetch("/api/admin/storage/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getHeaders() },
        body: JSON.stringify({ keys: Array.from(selected) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setSelected(new Set());
      setAnalysis(null);
      setLoading(true);
      const refresh = await fetch("/api/admin/storage/unused", { headers: getHeaders() });
      const updated = await refresh.json();
      setAnalysis(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  if (!token) return null;

  return (
    <main className="min-h-screen">
      <header className="border-b border-foreground/10 px-6 py-4">
        <Link
          href="/admin/dashboard"
          className="text-lg font-semibold tracking-tight text-primary-main"
        >
          ← Dashboard
        </Link>
      </header>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Storage cleanup
          </h1>
          <p className="mt-2 text-foreground/70">
            Find and remove unused files (catalogue images, cover images, PDFs, post media) from
            Backblaze B2 to free up space.
          </p>

          {error && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800">
              {error}
            </div>
          )}

          {loading ? (
            <div className="mt-8 flex justify-center py-12 text-foreground/60">Loading…</div>
          ) : analysis != null ? (
            <div className="mt-8 space-y-6">
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="rounded-lg border border-foreground/10 bg-foreground/[0.02] p-4">
                  <p className="text-sm text-foreground/60">Used files</p>
                  <p className="text-xl font-semibold text-foreground">{analysis.used}</p>
                </div>
                <div className="rounded-lg border border-foreground/10 bg-foreground/[0.02] p-4">
                  <p className="text-sm text-foreground/60">Unused files</p>
                  <p className="text-xl font-semibold text-foreground">{analysis.unused}</p>
                </div>
                <div className="rounded-lg border border-foreground/10 bg-foreground/[0.02] p-4">
                  <p className="text-sm text-foreground/60">Total size</p>
                  <p className="text-xl font-semibold text-foreground">
                    {formatBytes(analysis.totalSize)}
                  </p>
                </div>
                <div className="rounded-lg border border-foreground/10 bg-foreground/[0.02] p-4">
                  <p className="text-sm text-foreground/60">Reclaimable</p>
                  <p className="text-xl font-semibold text-primary-main">
                    {formatBytes(analysis.unusedSize)}
                  </p>
                </div>
              </div>

              {analysis.unusedFiles.length === 0 ? (
                <div className="rounded-lg border border-foreground/10 bg-foreground/[0.02] p-8 text-center text-foreground/70">
                  No unused files found. Storage is clean.
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={selectAll}
                      className="rounded-lg border border-foreground/20 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-foreground/5"
                    >
                      Select all
                    </button>
                    <button
                      type="button"
                      onClick={selectNone}
                      className="rounded-lg border border-foreground/20 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-foreground/5"
                    >
                      Clear selection
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={deleting || selected.size === 0}
                      className="rounded-lg bg-red-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      {deleting ? "Deleting…" : `Delete selected (${selected.size})`}
                    </button>
                  </div>

                  <div className="overflow-hidden rounded-lg border border-foreground/10">
                    <div className="max-h-96 overflow-y-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="sticky top-0 bg-foreground/[0.03]">
                          <tr>
                            <th className="w-10 px-4 py-3"></th>
                            <th className="px-4 py-3 font-medium text-foreground">File</th>
                            <th className="px-4 py-3 font-medium text-foreground">Size</th>
                            <th className="px-4 py-3 font-medium text-foreground">Modified</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analysis.unusedFiles.map((f) => (
                            <tr
                              key={f.key}
                              className="border-t border-foreground/[0.06] hover:bg-foreground/[0.02]"
                            >
                              <td className="px-4 py-2">
                                <input
                                  type="checkbox"
                                  checked={selected.has(f.key)}
                                  onChange={() => toggleSelect(f.key)}
                                  className="rounded border-foreground/30"
                                />
                              </td>
                              <td className="px-4 py-2 font-mono text-xs text-foreground">
                                {f.key}
                              </td>
                              <td className="px-4 py-2 text-foreground/70">
                                {formatBytes(f.size)}
                              </td>
                              <td className="px-4 py-2 text-foreground/60">
                                {f.lastModified
                                  ? new Date(f.lastModified).toLocaleDateString()
                                  : "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
