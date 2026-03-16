import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata = {
  title: "Lighting Partner for Architects | Lumin Art",
  description:
    "Lumin Art works closely with architects and interior designers to develop architectural lighting strategies, custom fixtures, and technical solutions.",
};

export default function ForArchitectsPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <header className="mb-12 md:mb-16">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              Lighting Partner for Architects
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-foreground/70">
              Lumin Art works closely with architects and interior designers to develop lighting strategies
              that align with architectural concepts — from early planning to on-site support.
            </p>
          </header>

          <div className="space-y-14 md:space-y-16">
            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                How We Support Your Projects
              </h2>
              <p className="mt-3 text-foreground/75">
                Our collaboration goes beyond product suggestion. We act as a design and technical partner
                throughout the project lifecycle.
              </p>
              <ul className="mt-5 grid gap-3 text-sm text-foreground/85 sm:grid-cols-2">
                <li>• Lighting consultation</li>
                <li>• Fixture selection support</li>
                <li>• Custom fixture development</li>
                <li>• Technical coordination</li>
                <li>• Site support and after-sales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Why Architects Work With Us
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-foreground/85">
                <li>• 23+ years industry experience through Light House</li>
                <li>• Access to a wide lighting product ecosystem</li>
                <li>• Custom lighting development capabilities</li>
                <li>• Reliable after-sales and service support</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Start Your Lighting Project
              </h2>
              <p className="mt-3 text-foreground/75">
                Share your project details and we&apos;ll respond with a structured lighting proposal or
                consultation slot.
              </p>
              <div className="mt-5 flex flex-wrap gap-4">
                <Link
                  href="/architect-collaboration"
                  className="inline-flex items-center gap-2 rounded-full bg-primary-main px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-main/90"
                >
                  Book Lighting Consultation
                  <span>→</span>
                </Link>
                <Link
                  href="/catalogue"
                  className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-8 py-3 text-sm font-semibold text-foreground/80 transition-colors hover:border-primary-main hover:text-primary-main"
                >
                  Download Product Catalogue
                  <span>↓</span>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

