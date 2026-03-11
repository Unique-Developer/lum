import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getCatalogueById } from "@/lib/catalogue";
import { getCategoryById, getSubcategoryById } from "@/lib/categories";
import { FlipbookViewer } from "@/components/catalogue/FlipbookViewer";
import { absoluteUrl } from "@/lib/seo";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string; subcategorySlug: string; catalogueId: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, subcategorySlug, catalogueId } = await params;
  const catalogue = await getCatalogueById(catalogueId);
  if (!catalogue) return {};
  const url = absoluteUrl(`/catalogue/${id}/${subcategorySlug}/${catalogueId}`);
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

export default async function CatalogueDetailPage({ params }: Props) {
  const { id: categorySlug, subcategorySlug, catalogueId } = await params;

  const catalogue = await getCatalogueById(catalogueId);
  if (!catalogue) notFound();

  let breadcrumbCategory = null;
  let breadcrumbSub = null;
  if (catalogue.subcategoryId) {
    const sub = await getSubcategoryById(catalogue.subcategoryId);
    if (!sub) notFound();
    const cat = await getCategoryById(sub.categoryId);
    if (!cat || cat.slug !== categorySlug || sub.slug !== subcategorySlug) notFound();
    breadcrumbCategory = cat;
    breadcrumbSub = sub;
  } else {
    notFound();
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-background">
      <SiteHeader />

      <section className="px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto w-full max-w-6xl">
          {breadcrumbCategory && breadcrumbSub ? (
            <nav className="mb-8 flex items-center gap-2 text-sm text-foreground/70">
              <Link href="/catalogue" className="hover:text-foreground transition-colors">
                Categories
              </Link>
              <span>/</span>
              <Link href={`/catalogue/${breadcrumbCategory.slug}`} className="hover:text-foreground transition-colors">
                {breadcrumbCategory.name}
              </Link>
              <span>/</span>
              <Link
                href={`/catalogue/${breadcrumbCategory.slug}/${breadcrumbSub.slug}`}
                className="hover:text-foreground transition-colors"
              >
                {breadcrumbSub.name}
              </Link>
              <span>/</span>
              <span className="text-foreground">{catalogue.title}</span>
            </nav>
          ) : null}
          <Link
            href={breadcrumbCategory && breadcrumbSub ? `/catalogue/${breadcrumbCategory.slug}/${breadcrumbSub.slug}` : "/catalogue"}
            className="mb-8 inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors"
          >
            ← Back to {breadcrumbSub?.name || "Catalogues"}
          </Link>
          <h1 className="mb-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {catalogue.title}
          </h1>
          <p className="mb-6 text-sm text-foreground/70 sm:mb-12 sm:text-base">{catalogue.description}</p>

          <FlipbookViewer pdfUrl={catalogue.pdfUrl} title={catalogue.title} />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
