import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getCatalogueById } from "@/lib/catalogue";
import { FlipbookViewer } from "@/components/catalogue/FlipbookViewer";
import { absoluteUrl } from "@/lib/seo";
import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const cat = await getCatalogueById(id);
  if (!cat) return {};
  const url = absoluteUrl(`/catalogue/${id}`);
  return {
    title: cat.title,
    description: cat.description,
    alternates: { canonical: url },
    openGraph: {
      title: cat.title,
      description: cat.description,
      url,
      images: cat.coverImage ? [absoluteUrl(cat.coverImage)] : undefined,
    },
  };
}

export default async function CatalogueDetailPage({ params }: Props) {
  const { id } = await params;
  const catalogue = await getCatalogueById(id);

  if (!catalogue) notFound();

  return (
    <main className="min-h-screen overflow-x-hidden bg-background">
      <SiteHeader />

      <section className="px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto w-full max-w-6xl">
          <Link
            href="/catalogue"
            className="mb-8 inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors"
          >
            ← Back to Catalogues
          </Link>
          <h1 className="mb-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {catalogue.title}
          </h1>
          <p className="mb-6 text-foreground/70 sm:mb-12">{catalogue.description}</p>

          <FlipbookViewer
            pdfUrl={catalogue.pdfUrl}
            pageCount={catalogue.pageCount}
            title={catalogue.title}
          />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
