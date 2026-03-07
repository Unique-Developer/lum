import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function CatalogueLoading() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 animate-pulse text-center">
            <div className="mx-auto h-12 w-64 rounded-lg bg-foreground/10" />
            <div className="mx-auto mt-4 h-6 w-96 max-w-full rounded bg-foreground/5" />
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/[0.02]"
              >
                <div className="aspect-[4/3] animate-pulse bg-foreground/5" />
                <div className="space-y-3 p-6">
                  <div className="h-6 w-3/4 rounded bg-foreground/10" />
                  <div className="h-4 w-full rounded bg-foreground/5" />
                  <div className="h-4 w-2/3 rounded bg-foreground/5" />
                  <div className="h-4 w-24 rounded bg-primary-main/20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
