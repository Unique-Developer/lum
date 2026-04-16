"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminDashboardPage() {
  const { token } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.replace("/admin");
    }
  }, [token, router]);

  if (!token) return null;

  const cards = [
    {
      href: "/admin/homepage",
      title: "Homepage",
      desc: "Edit hero image, visual proof images, legacy milestones, dual brand links, pillars, and CTA.",
    },
    {
      href: "/admin/categories",
      title: "Categories",
      desc: "Manage categories and subcategories. Edit name, image, description, and includes for the Lighting Solutions page.",
    },
    {
      href: "/admin/subcategories",
      title: "Subcategories",
      desc: "Manage subcategories under each category for catalogue organisation.",
    },
    {
      href: "/admin/catalogues",
      title: "Catalogues",
      desc: "Upload, edit, remove, and reorder PDF catalogues.",
    },
    {
      href: "/admin/blogs",
      title: "Posts",
      desc: "Create, edit, and remove blog posts and articles.",
    },
    {
      href: "/admin/blog-categories",
      title: "Post Categories",
      desc: "Add and delete categories used for blog/post filtering.",
    },
    {
      href: "/admin/lighting-solutions",
      title: "Lighting Solutions Page",
      desc: "Edit page title, subtitle, Custom Studio section text, and collaboration process.",
    },
    {
      href: "/admin/storage",
      title: "Storage",
      desc: "Find and remove unused catalogue images, PDFs, and post media.",
    },
  ];

  return (
    <AdminShell title="Dashboard" subtitle="Manage your site content">
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="block rounded-xl border border-foreground/10 bg-foreground/[0.02] p-6 transition-all hover:border-primary-200 hover:shadow-md"
            >
              <h2 className="text-lg font-semibold tracking-tight text-foreground">{c.title}</h2>
              <p className="mt-2 text-sm text-foreground/70">{c.desc}</p>
              <span className="mt-4 inline-flex text-sm font-medium text-primary-main">
                Open →
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-10">
          <Link href="/" target="_blank" rel="noopener noreferrer" className="text-sm text-foreground/60 hover:text-foreground">
            View public site →
          </Link>
        </div>
      </div>
    </AdminShell>
  );
}
