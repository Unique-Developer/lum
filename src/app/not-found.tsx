import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-primary-main">404</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          Page not found
        </h1>
        <p className="mt-4 max-w-md text-lg text-foreground/70">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-lg border border-primary-main/30 bg-primary-main/5 px-6 py-3 text-sm font-medium text-primary-main transition-colors hover:bg-primary-main/10 focus:outline-none focus:ring-2 focus:ring-primary-main focus:ring-offset-2"
        >
          Return home
          <span aria-hidden>→</span>
        </Link>
      </section>
      <SiteFooter />
    </main>
  );
}
