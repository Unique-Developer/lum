import Link from "next/link";
import { getCategories } from "@/lib/categories";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata = {
  title: "Catalogue | Lumin Art",
  description:
    "Browse our architectural lighting catalogues. Professional, technical, and decorative solutions.",
};

export const dynamic = "force-dynamic";

export default async function CataloguePage() {
  const categories = await getCategories();

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <section className="px-4 py-10 sm:px-6 sm:py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center sm:mb-16">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Catalogues
            </h1>
            <p className="mt-3 text-base text-foreground/70 sm:mt-4 sm:text-lg">
              Choose a category to explore our lighting collections.
            </p>
          </div>

          <div className="grid gap-5 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/catalogue/${cat.slug}`}
                className="group block overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/[0.02] transition-all duration-300 hover:border-primary-200 hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200">
                  {cat.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-6xl font-light text-primary-main/40 group-hover:text-primary-main/60 transition-colors">
                        {cat.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4 sm:p-6">
                  <h2 className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary-main sm:text-xl">
                    {cat.name}
                  </h2>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-main">
                    View subcategories
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {categories.length === 0 && (
            <div className="py-20 text-center text-foreground/60">
              <p>Categories will appear here once configured in admin.</p>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
