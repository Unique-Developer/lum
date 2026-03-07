"use client";

import { useEffect } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
          Something went wrong
        </h1>
        <p className="mt-4 max-w-md text-lg text-foreground/70">
          An unexpected error occurred. Please try again.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg border border-primary-main/30 bg-primary-main/5 px-6 py-3 text-sm font-medium text-primary-main transition-colors hover:bg-primary-main/10 focus:outline-none focus:ring-2 focus:ring-primary-main focus:ring-offset-2"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-foreground/20 px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:ring-offset-2"
          >
            Return home
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
