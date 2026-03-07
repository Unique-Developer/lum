"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { filterPostsBySearch, type BlogPost } from "@/lib/blog-types";

export default function AdminBlogsPage() {
  const { token, getHeaders, logout } = useAdminAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const filteredPosts = useMemo(
    () => filterPostsBySearch(posts, searchQuery, { includeAdminNotes: true }),
    [posts, searchQuery]
  );

  useEffect(() => {
    if (!token) {
      router.replace("/admin");
      return;
    }
    fetch("/api/admin/blogs", { headers: getHeaders() })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setPosts)
      .catch(() => router.replace("/admin"))
      .finally(() => setLoading(false));
  }, [token, getHeaders, router]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this post?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
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
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Posts</h1>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="search"
                placeholder="Search by title, excerpt, notes…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-foreground/20 bg-background px-4 py-2 text-sm text-foreground placeholder:text-foreground/50 focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main sm:w-64"
              />
              <Link
                href="/admin/blogs/new"
                className="rounded-lg bg-primary-main px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Add post
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between rounded-xl border border-foreground/10 bg-foreground/[0.02] p-6"
              >
                <div>
                  <h2 className="font-semibold text-foreground">{post.title}</h2>
                  <p className="mt-1 text-sm text-foreground/70 line-clamp-1">{post.excerpt}</p>
                  <p className="mt-1 text-xs text-foreground/50">
                    /posts/{post.slug} · {new Date(post.publishedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Link
                    href={`/posts/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-main hover:underline"
                  >
                    Preview
                  </Link>
                  <Link
                    href={`/admin/blogs/${post.id}/edit`}
                    className="rounded-lg border border-foreground/20 px-4 py-2 text-sm font-medium text-foreground hover:bg-foreground/5"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(post.id)}
                    disabled={!!deleting}
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
                  >
                    {deleting === post.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {posts.length === 0 ? (
            <div className="py-16 text-center text-foreground/60">
              <p>No posts yet. Add your first post.</p>
              <Link
                href="/admin/blogs/new"
                className="mt-4 inline-block text-primary-main hover:underline"
              >
                Add post
              </Link>
            </div>
          ) : searchQuery && filteredPosts.length === 0 ? (
            <div className="py-16 text-center text-foreground/60">
              <p>No posts match &quot;{searchQuery}&quot;</p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-2 text-sm text-primary-main hover:underline"
              >
                Clear search
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
