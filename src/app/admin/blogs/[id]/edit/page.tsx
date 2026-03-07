"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { FileUpload } from "@/components/admin/FileUpload";
import type { BlogPost, PostMediaItem, PostType } from "@/lib/blog";

type FormPost = BlogPost;

export default function EditBlogPage() {
  const params = useParams();
  const id = String(params.id);
  const { token, getHeaders } = useAdminAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [form, setForm] = useState<FormPost | null>(null);

  useEffect(() => {
    if (!token) {
      router.replace("/admin");
      return;
    }
    fetch(`/api/admin/blogs/${id}`, { headers: getHeaders() })
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
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getHeaders() },
        body: JSON.stringify({
          title: form.title,
          slug: form.slug,
          excerpt: form.excerpt,
          content: form.content,
          publishedAt: form.publishedAt,
          author: form.author,
          thumbnail: form.thumbnail || undefined,
          media: form.media?.length ? form.media : undefined,
          adminNotes: form.adminNotes?.trim() || undefined,
          postType: form.postType === "social" || form.postType === "blog" ? form.postType : undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed to update");
        return;
      }
      router.push("/admin/blogs");
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
        <Link href="/admin/blogs" className="text-lg font-semibold tracking-tight text-primary-main">
          ← Posts
        </Link>
      </header>

      <section className="px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Edit Post</h1>

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
              <label htmlFor="slug" className="block text-sm font-medium text-foreground">
                Slug (URL path)
              </label>
              <input
                id="slug"
                value={form.slug}
                onChange={(e) => setForm((f) => f && { ...f, slug: e.target.value })}
                className="mt-1 w-full rounded-lg border border-foreground/20 bg-background px-4 py-2 text-foreground focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
              />
              <p className="mt-1 text-xs text-foreground/50">URL: /posts/{form.slug}</p>
            </div>
            <div>
              <label htmlFor="postType" className="block text-sm font-medium text-foreground">
                Post type
              </label>
              <p className="mt-0.5 text-xs text-foreground/60">Blog = article with TOC; Social = Instagram-style.</p>
              <select
                id="postType"
                value={form.postType ?? "blog"}
                onChange={(e) => setForm((f) => f && { ...f, postType: e.target.value as PostType })}
                className="mt-1 w-full rounded-lg border border-foreground/20 bg-background px-4 py-2 text-foreground focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
              >
                <option value="blog">Blog article</option>
                <option value="social">Social / Instagram</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Thumbnail (for card)</label>
              <p className="mt-0.5 text-xs text-foreground/60">Optional. Used in list view.</p>
              <div className="mt-1 flex flex-wrap items-center gap-3">
                {form.thumbnail ? (
                  <>
                    <img src={form.thumbnail} alt="Thumbnail" className="h-20 w-20 rounded-lg object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm((f) => f && { ...f, thumbnail: undefined })}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <FileUpload
                    accept="image"
                    prefix="posts"
                    onUpload={(url) => setForm((f) => f && { ...f, thumbnail: url })}
                    buttonLabel="Upload thumbnail"
                    getHeaders={getHeaders}
                  />
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">Media (photos / videos)</label>
              <p className="mt-0.5 text-xs text-foreground/60">Instagram-style gallery.</p>
              <div className="mt-2 flex flex-wrap gap-4">
                {(form.media ?? []).map((m, i) => (
                  <div key={i} className="relative">
                    {m.type === "image" ? (
                      <img src={m.url} alt="" className="h-24 w-24 rounded-lg object-cover" />
                    ) : (
                      <video src={m.url} className="h-24 w-24 rounded-lg object-cover" muted />
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setForm((f) =>
                          f ? { ...f, media: (f.media ?? []).filter((_, j) => j !== i) } : f
                        )
                      }
                      className="absolute -right-2 -top-2 rounded-full bg-red-500 px-1.5 py-0.5 text-xs text-white"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <div className="flex flex-col gap-2">
                  <FileUpload
                    accept="image"
                    prefix="posts"
                    onUpload={(url) =>
                      setForm((f) =>
                        f
                          ? { ...f, media: [...(f.media ?? []), { type: "image" as const, url }] }
                          : f
                      )
                    }
                    buttonLabel="+ Photo"
                    getHeaders={getHeaders}
                  />
                  <FileUpload
                    accept="video"
                    prefix="posts"
                    onUpload={(url) =>
                      setForm((f) =>
                        f
                          ? { ...f, media: [...(f.media ?? []), { type: "video" as const, url }] }
                          : f
                      )
                    }
                    buttonLabel="+ Video"
                    getHeaders={getHeaders}
                  />
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-foreground">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                rows={2}
                value={form.excerpt}
                onChange={(e) => setForm((f) => f && { ...f, excerpt: e.target.value })}
                className="mt-1 w-full rounded-lg border border-foreground/20 bg-background px-4 py-2 text-foreground focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="content" className="block text-sm font-medium text-foreground">
                  Content (HTML)
                </label>
                <FileUpload
                  accept="image"
                  prefix="posts"
                  onUpload={(url) => {
                    const img = `<img src="${url}" alt="" />`;
                    const ta = contentRef.current;
                    if (ta) {
                      const start = ta.selectionStart;
                      const end = ta.selectionEnd;
                      const before = form.content.slice(0, start);
                      const after = form.content.slice(end);
                      setForm((f) => f && { ...f, content: before + img + after });
                      setTimeout(() => {
                        ta.focus();
                        ta.setSelectionRange(start + img.length, start + img.length);
                      }, 0);
                    } else {
                      setForm((f) => f && { ...f, content: form.content + img });
                    }
                  }}
                  buttonLabel="Insert image"
                  getHeaders={getHeaders}
                />
              </div>
              <p className="mt-0.5 text-xs text-foreground/60">Use &lt;img src=&quot;...&quot;&gt; or Insert image.</p>
              <textarea
                ref={contentRef}
                id="content"
                rows={12}
                value={form.content}
                onChange={(e) => setForm((f) => f && { ...f, content: e.target.value })}
                className="mt-1 w-full rounded-lg border border-foreground/20 bg-background px-4 py-2 font-mono text-sm text-foreground focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
              />
            </div>
            <div>
              <label htmlFor="publishedAt" className="block text-sm font-medium text-foreground">
                Published at
              </label>
              <input
                id="publishedAt"
                type="datetime-local"
                value={form.publishedAt.slice(0, 16)}
                onChange={(e) => setForm((f) => f && { ...f, publishedAt: new Date(e.target.value).toISOString() })}
                className="mt-1 w-full rounded-lg border border-foreground/20 bg-background px-4 py-2 text-foreground focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
              />
            </div>
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-foreground">
                Author
              </label>
              <input
                id="author"
                value={form.author}
                onChange={(e) => setForm((f) => f && { ...f, author: e.target.value })}
                className="mt-1 w-full rounded-lg border border-foreground/20 bg-background px-4 py-2 text-foreground focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
              />
            </div>
            <div>
              <label htmlFor="adminNotes" className="block text-sm font-medium text-foreground">
                Admin notes (only visible to you)
              </label>
              <p className="mt-0.5 text-xs text-foreground/60">Private raw text. Searchable in admin. Not shown on site.</p>
              <textarea
                id="adminNotes"
                rows={4}
                value={form.adminNotes ?? ""}
                onChange={(e) => setForm((f) => f && { ...f, adminNotes: e.target.value })}
                placeholder="Keywords, tags, reminders…"
                className="mt-1 w-full rounded-lg border border-foreground/20 bg-foreground/[0.03] px-4 py-2 text-foreground placeholder:text-foreground/40 focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
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
                href={`/posts/${form.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-foreground/20 px-4 py-2 font-medium text-foreground hover:bg-foreground/5"
              >
                Preview
              </Link>
              <Link
                href="/admin/blogs"
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
