"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { Logo } from "@/components/layout/Logo";

export default function AdminDashboardPage() {
  const { token, email, logout } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.replace("/admin");
    }
  }, [token, router]);

  if (!token) return null;

  return (
    <main className="min-h-screen">
      <header className="border-b border-foreground/10 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo href="/admin/dashboard" height={32} width={100} />
            <span className="text-sm text-foreground/60">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-foreground/60">{email}</span>
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
        </div>
      </header>

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Dashboard</h1>
          <p className="mt-2 text-foreground/70">Manage catalogues and posts.</p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/admin/categories"
              className="block rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-8 transition-all hover:border-primary-200 hover:shadow-lg"
            >
              <h2 className="text-xl font-semibold tracking-tight text-foreground">Categories</h2>
              <p className="mt-2 text-sm text-foreground/70">
                Manage categories and subcategories (Architectural, Decorative, etc.).
              </p>
              <span className="mt-4 inline-flex text-sm font-medium text-primary-main">
                Manage categories →
              </span>
            </Link>
            <Link
              href="/admin/catalogues"
              className="block rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-8 transition-all hover:border-primary-200 hover:shadow-lg"
            >
              <h2 className="text-xl font-semibold tracking-tight text-foreground">Catalogues</h2>
              <p className="mt-2 text-sm text-foreground/70">
                Upload, edit, remove, and reorder catalogues.
              </p>
              <span className="mt-4 inline-flex text-sm font-medium text-primary-main">
                Manage catalogues →
              </span>
            </Link>
            <Link
              href="/admin/blogs"
              className="block rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-8 transition-all hover:border-primary-200 hover:shadow-lg"
            >
              <h2 className="text-xl font-semibold tracking-tight text-foreground">Posts</h2>
              <p className="mt-2 text-sm text-foreground/70">
                Create, edit, and remove posts — articles, updates, and more.
              </p>
              <span className="mt-4 inline-flex text-sm font-medium text-primary-main">
                Manage posts →
              </span>
            </Link>
            <Link
              href="/admin/storage"
              className="block rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-8 transition-all hover:border-primary-200 hover:shadow-lg"
            >
              <h2 className="text-xl font-semibold tracking-tight text-foreground">Storage</h2>
              <p className="mt-2 text-sm text-foreground/70">
                Find and remove unused catalogue images, PDFs, and post media to free up space.
              </p>
              <span className="mt-4 inline-flex text-sm font-medium text-primary-main">
                Manage storage →
              </span>
            </Link>
          </div>
          <div className="mt-12">
            <Link
              href="/"
              className="text-sm text-foreground/60 hover:text-foreground"
            >
              ← Back to site
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
