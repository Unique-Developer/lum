"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAdminAuth } from "./AdminAuthProvider";
import { Logo } from "@/components/layout/Logo";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "◉" },
  { href: "/admin/homepage", label: "Homepage", icon: "⌂" },
  { href: "/admin/projects", label: "Projects", icon: "◇" },
  { href: "/admin/categories", label: "Categories", icon: "▤" },
  { href: "/admin/subcategories", label: "Subcategories", icon: "▦" },
  { href: "/admin/catalogues", label: "Catalogues", icon: "☰" },
  { href: "/admin/blogs", label: "Posts", icon: "✎" },
  { href: "/admin/lighting-solutions", label: "Lighting Solutions", icon: "◐" },
  { href: "/admin/storage", label: "Storage", icon: "◉" },
];

export function AdminShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { token, email, logout } = useAdminAuth();

  if (!token) return null;

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-56 shrink-0 border-r border-foreground/10 bg-foreground/[0.02] lg:block">
        <div className="sticky top-0 flex flex-col py-6">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 px-6 pb-6"
          >
            <Logo href="/admin/dashboard" height={28} width={100} />
            <span className="text-xs font-medium uppercase tracking-wider text-foreground/50">
              Admin
            </span>
          </Link>
          <nav className="space-y-0.5 px-3" aria-label="Admin navigation">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary-main/10 text-primary-main"
                      : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                  }`}
                >
                  <span className="text-base opacity-70">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto border-t border-foreground/10 px-6 pt-6">
            <p className="truncate text-xs text-foreground/50">{email}</p>
            <div className="mt-2 flex gap-2">
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary-main hover:underline"
              >
                View site
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.replace("/admin");
                }}
                className="text-xs text-foreground/60 hover:text-foreground"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-foreground/10 bg-background/95 px-4 py-4 backdrop-blur sm:px-6 lg:hidden">
          <Link href="/admin/dashboard" className="text-lg font-semibold text-primary-main">
            ← Admin
          </Link>
          <button
            type="button"
            onClick={() => {
              logout();
              router.replace("/admin");
            }}
            className="text-sm text-foreground/70"
          >
            Sign out
          </button>
        </header>

        <div className="px-4 py-8 sm:px-6 lg:px-8">
          {(title || subtitle) && (
            <div className="mb-8">
              {title && (
                <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="mt-1 text-foreground/70">{subtitle}</p>
              )}
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
