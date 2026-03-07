import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import Link from "next/link";

export const metadata = {
  title: "About Us | Lumin Art",
  description:
    "The story of Lumin Art — a luxury lighting studio born from Light House's 23-year legacy in architectural and technical lighting.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            Our Story
          </h1>
          <p className="mt-4 text-xl text-primary-main font-medium">
            Born from 23 years of Light House excellence.
          </p>
          <div className="mt-12 space-y-8 text-lg text-foreground/80 leading-relaxed">
            <p>
              Lumin Art emerged from Light House — a name trusted for over two decades by architects,
              electricians, and builders across the region. What started as economy-range lighting
              leadership evolved into something more: a dedicated studio for those who refuse to
              compromise on design, performance, or craft.
            </p>
            <p>
              Today, Lumin Art focuses on luxury lighting solutions that merge architectural rigour
              with artistic sensibility. We work with designers and developers who understand that
              light is not just illumination — it shapes space, mood, and experience.
            </p>
            <p>
              Our strength lies in after-sales support, technical depth, and a genuine commitment
              to collaboration. Every project is an opportunity to elevate how people live and work
              in light.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-foreground/10 bg-foreground/[0.02] px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Explore further
          </h2>
          <div className="mt-8 flex flex-wrap gap-6">
            <Link
              href="/studio-philosophy"
              className="group inline-flex items-center gap-2 text-primary-main font-medium hover:underline"
            >
              Studio Philosophy
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 text-primary-main font-medium hover:underline"
            >
              Projects Showcase
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
