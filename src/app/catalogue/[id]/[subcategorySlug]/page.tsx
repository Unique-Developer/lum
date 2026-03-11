import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getCataloguesBySubcategory } from "@/lib/catalogue";
import { getCategoryBySlug, getSubcategoryBySlug } from "@/lib/categories";
import { CatalogCoverImage } from "@/components/catalogue/CatalogCoverImage";

type Props = { params: Promise<{ id: string; subcategorySlug: string }> };

export const dynamic = "force-dynamic";

export default async function CatalogueSubcategoryPage({ params }: Props) {
  const { id: categorySlug, subcategorySlug } = await params;

  const category = await getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const subcategory = await getSubcategoryBySlug(category.id, subcategorySlug);
  if (!subcategory) notFound();

  const catalogues = await getCataloguesBySubcategory(subcategory.id);

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <section className="px-4 py-10 sm:px-6 sm:py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <nav className="mb-8 flex items-center gap-2 text-sm text-foreground/70">
            <Link href="/catalogue" className="hover:text-foreground transition-colors">
              Categories
            </Link>
            <span>/</span>
            <Link href={`/catalogue/${category.slug}`} className="hover:text-foreground transition-colors">
              {category.name}
            </Link>
            <span>/</span>
            <span className="text-foreground">{subcategory.name}</span>
          </nav>

          <h1 className="mb-10 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {subcategory.name}
          </h1>
          <p className="mb-10 text-foreground/70">
            {category.name} — {subcategory.name}
          </p>

          <div className="grid gap-5 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {catalogues.map((cat) => (
              <Link
                key={cat.id}
                href={`/catalogue/${category.slug}/${subcategory.slug}/${cat.id}`}
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
                <div className="p-4 sm:p-6">
                  <h2 className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary-main sm:text-xl">
                    {cat.title}
                  </h2>
                  <p className="mt-2 text-sm text-foreground/70 line-clamp-2">{cat.description}</p>
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
              <p>No catalogues in this subcategory yet.</p>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
