import Link from "next/link";
import { Logo } from "./Logo";

const mainLinks = [
  { href: "/catalogue", label: "Catalogue" },
  { href: "/posts", label: "Posts" },
  { href: "/about", label: "About" },
  { href: "/studio-philosophy", label: "Studio" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

const otherLinks = [
  { href: "/architect-collaboration", label: "Architects — Collaborate" },
  { href: "/privacy-policy", label: "Privacy Policy" },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-foreground/10 bg-gradient-to-b from-foreground/[0.02] to-primary-50/30">
      {/* Subtle ambient glow — references light/luxury theme */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(17, 79, 117, 0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-12 pb-16 sm:px-6 md:py-16 md:pb-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1fr_auto_auto] lg:gap-16">
          {/* Brand column */}
          <div className="space-y-4">
            <Logo href="/" height={40} width={130} />
            <p className="max-w-xs text-sm leading-relaxed text-foreground/60">
              Light is not a product. It is an experience. Luxury lighting studio — A Light House Creation.
            </p>
            <div className="h-px w-12 bg-primary-main/30" aria-hidden />
          </div>

          {/* Main nav */}
          <nav
            aria-label="Footer navigation"
            className="grid grid-cols-2 gap-x-8 gap-y-3"
          >
            {mainLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary-main focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-main focus-visible:ring-offset-2 rounded"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Collaborate + legal */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start lg:flex-col">
            <Link
              href="/architect-collaboration"
              className="group inline-flex items-center gap-2 text-sm font-medium text-primary-main transition-colors hover:text-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-main focus-visible:ring-offset-2 rounded"
            >
              <span className="rounded-full bg-primary-100 px-2.5 py-1 text-xs font-semibold text-primary-main">
                For pros
              </span>
              Architects — Collaborate
            </Link>
            <Link
              href="/privacy-policy"
              className="text-sm text-foreground/55 transition-colors hover:text-foreground/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-main focus-visible:ring-offset-2 rounded"
            >
              Privacy Policy
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-foreground/10 pt-8 pb-[env(safe-area-inset-bottom)] md:flex-row md:pt-10">
          <p className="text-center text-sm text-foreground/50 md:text-left">
            © {new Date().getFullYear()} Lumin Art. All rights reserved.
          </p>
          <p className="text-sm text-foreground/40">
            A Light House Creation.
          </p>
        </div>
      </div>
    </footer>
  );
}
