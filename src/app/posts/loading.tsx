import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export default function PostsLoading() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 animate-pulse text-center">
            <div className="mx-auto h-12 w-48 rounded-lg bg-foreground/10" />
            <div className="mx-auto mt-4 h-6 w-80 max-w-full rounded bg-foreground/5" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-foreground/[0.08] bg-card"
              >
                <div className="aspect-[16/10] animate-pulse bg-foreground/5" />
                <div className="space-y-3 p-5 sm:p-6">
                  <div className="h-3 w-24 rounded bg-foreground/10" />
                  <div className="h-6 w-4/5 rounded bg-foreground/10" />
                  <div className="h-4 w-full rounded bg-foreground/5" />
                  <div className="h-4 w-2/3 rounded bg-foreground/5" />
                  <div className="h-4 w-28 rounded bg-primary-main/20" />
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
