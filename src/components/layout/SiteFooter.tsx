import Link from "next/link";

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
    <footer className="border-t border-foreground/10 bg-foreground/[0.02] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-primary-main hover:underline"
          >
            Lumin Art
          </Link>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {mainLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-foreground/70 transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <nav
          aria-label="Legal and collaboration"
          className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-foreground/10 pt-6 text-sm text-foreground/60"
        >
          {otherLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="hover:text-foreground transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <p className="mx-auto mt-8 max-w-6xl text-center text-sm text-foreground/50">
        © {new Date().getFullYear()} Lumin Art. Luxury Lighting Studio. A Light House brand.
      </p>
    </footer>
  );
}
