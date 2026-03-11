import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getCatalogueById } from "@/lib/catalogue";
import { getCategoryBySlug, getSubcategories } from "@/lib/categories";
import { FlipbookViewer } from "@/components/catalogue/FlipbookViewer";
import { absoluteUrl } from "@/lib/seo";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const category = await getCategoryBySlug(id);
  if (category) {
    return { title: `${category.name} | Catalogue | Lumin Art` };
  }
  const catalogue = await getCatalogueById(id);
  if (!catalogue) return {};
  const url = absoluteUrl(`/catalogue/${id}`);
  return {
    title: catalogue.title,
    description: catalogue.description,
    alternates: { canonical: url },
    openGraph: {
      title: catalogue.title,
      description: catalogue.description,
      url,
      images: catalogue.coverImage ? [absoluteUrl(catalogue.coverImage)] : undefined,
    },
  };
}

export default async function CatalogueSlugPage({ params }: Props) {
  const { id: slug } = await params;

  const category = await getCategoryBySlug(slug);
  if (category) {
    const subcategories = await getSubcategories(category.id);
    return (
      <main className="min-h-screen bg-background">
        <SiteHeader />
        <section className="px-4 py-10 sm:px-6 sm:py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <Link href="/catalogue" className="mb-8 inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors">
              ← Back to Categories
            </Link>
            <h1 className="mb-10 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {category.name}
            </h1>
            <div className="grid gap-5 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {subcategories.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/catalogue/${category.slug}/${sub.slug}`}
                  className="group block overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/[0.02] transition-all duration-300 hover:border-primary-200 hover:shadow-xl"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                    <span className="text-5xl font-light text-primary-main/40 group-hover:text-primary-main/60 transition-colors">
                      {sub.name.charAt(0)}
                    </span>
                  </div>
                  <div className="p-4 sm:p-6">
                    <h2 className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary-main sm:text-xl">
                      {sub.name}
                    </h2>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-main">
                      View catalogues
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            {subcategories.length === 0 && (
              <p className="py-12 text-center text-foreground/60">No subcategories yet.</p>
            )}
          </div>
        </section>
        <SiteFooter />
      </main>
    );
  }

  const catalogue = await getCatalogueById(slug);
  if (catalogue) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-background">
        <SiteHeader />
        <section className="px-4 py-8 sm:px-6 sm:py-12">
          <div className="mx-auto w-full max-w-6xl">
            <Link href="/catalogue" className="mb-8 inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors">
              ← Back to Catalogues
            </Link>
            <h1 className="mb-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {catalogue.title}
            </h1>
            <p className="mb-6 text-sm text-foreground/70 sm:mb-12 sm:text-base">
              {catalogue.description}
            </p>
            <FlipbookViewer pdfUrl={catalogue.pdfUrl} title={catalogue.title} />
          </div>
        </section>
        <SiteFooter />
      </main>
    );
  }

  notFound();
}
