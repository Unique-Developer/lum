import Link from "next/link";
import { getCatalogues } from "@/lib/catalogue";
import { CatalogCoverImage } from "@/components/catalogue/CatalogCoverImage";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata = {
  title: "Catalogue | Lumin Art",
  description:
    "Browse our luxury lighting catalogues. Architectural, technical, and decorative solutions.",
};

export const dynamic = "force-dynamic";

export default async function CataloguePage() {
  const catalogues = await getCatalogues();

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              Catalogues
            </h1>
            <p className="mt-4 text-lg text-foreground/70">
              Explore our collections. Click to view in flipbook.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {catalogues.map((cat) => (
              <Link
                key={cat.id}
                href={`/catalogue/${cat.id}`}
                className="group block overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/[0.02] transition-all duration-300 hover:border-primary-200 hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200">
                  {cat.coverImage ? (
                    <CatalogCoverImage
                      src={cat.coverImage}
                      alt={cat.title}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-primary-main/60 text-6xl font-light">
                      {cat.title.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold tracking-tight text-foreground group-hover:text-primary-main transition-colors">
                    {cat.title}
                  </h2>
                  <p className="mt-2 text-sm text-foreground/70 line-clamp-2">
                    {cat.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-main">
                    View flipbook
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {catalogues.length === 0 && (
            <div className="py-20 text-center text-foreground/60">
              <p>Catalogues will appear here once published.</p>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
