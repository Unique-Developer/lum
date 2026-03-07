"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const navLinks = [
  { href: "/catalogue", label: "Catalogue" },
  { href: "/posts", label: "Posts" },
  { href: "/about", label: "About" },
  { href: "/studio-philosophy", label: "Studio" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-foreground/10 px-6 py-6">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-primary-main hover:underline"
        >
          Lumin Art
        </Link>
        <nav className="flex flex-wrap gap-4 sm:gap-6" aria-label="Main navigation">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-foreground/70 transition-colors hover:text-foreground"
            >
              <motion.span
                className="inline-block"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {label}
              </motion.span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
