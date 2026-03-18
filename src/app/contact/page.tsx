import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata = {
  title: "Contact | Lumin Art",
  description:
    "Get in touch with Lumin Art for professional lighting solutions, consultations, and project inquiries.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden px-5 py-12 md:px-6 md:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(17,79,117,0.1),transparent_55%)]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="mb-10 rounded-3xl border border-primary-main/15 bg-gradient-to-br from-primary-main/[0.08] via-background to-background p-6 shadow-[0_20px_50px_-38px_rgba(17,79,117,0.75)] md:mb-12 md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-main/80">
              Contact
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
              Let&apos;s Light Something Exceptional
            </h1>
            <p className="mt-4 max-w-3xl text-base text-foreground/75 md:text-lg">
              Reach out for consultations, product inquiries, or project collaborations. We respond
              quickly with practical guidance and the right next step for your space.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="tel:+917777949735"
                className="inline-flex items-center gap-2 rounded-full border border-primary-main/25 bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary-main/40 hover:text-primary-main"
              >
                Call us
              </a>
              <a
                href="mailto:contact@theluminart.com"
                className="inline-flex items-center gap-2 rounded-full border border-primary-main/25 bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary-main/40 hover:text-primary-main"
              >
                Email us
              </a>
              <Link
                href="/architect-collaboration"
                className="inline-flex items-center gap-2 rounded-full border border-primary-main bg-primary-main px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-main/90"
              >
                Architect collaboration <span>→</span>
              </Link>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-foreground/10 bg-background/80 p-6 shadow-sm backdrop-blur-sm">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">General Inquiries</h2>
              <p className="mt-2 text-sm text-foreground/65">
                For immediate support, call or email us directly.
              </p>

              <div className="mt-5 space-y-4">
                <div className="rounded-xl border border-foreground/10 bg-foreground/[0.02] p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-foreground/55">Phone</p>
                  <a
                    href="tel:+917777949735"
                    className="mt-1 inline-block text-lg font-semibold text-primary-main hover:underline"
                  >
                    +91 77779 49735
                  </a>
                </div>

                <div className="rounded-xl border border-foreground/10 bg-foreground/[0.02] p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-foreground/55">Email</p>
                  <a
                    href="mailto:contact@theluminart.com"
                    className="mt-1 inline-block break-all text-base font-semibold text-primary-main hover:underline"
                  >
                    contact@theluminart.com
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-foreground/10 bg-background/80 p-6 shadow-sm backdrop-blur-sm">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">Office</h2>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                M/3-4, Malhar Complex, Ichhanath Road, Parle Point, Surat, Gujarat - 395007
              </p>

              <div className="mt-5 rounded-xl border border-primary-main/15 bg-primary-main/[0.04] p-4">
                <p className="font-medium text-foreground">Lumin Art - A Light House Creation</p>
                <p className="mt-1 text-sm text-foreground/70">
                  Trusted by architects, electricians, and builders for over 23 years.
                </p>
              </div>

              <div className="mt-5 border-t border-foreground/10 pt-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-foreground/60">
                  Architects &amp; Designers
                </h3>
                <p className="mt-2 text-sm text-foreground/70">
                  For project collaboration, specifications, and custom solutions, use our dedicated
                  collaboration form.
                </p>
                <Link
                  href="/architect-collaboration"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary-main hover:underline"
                >
                  Open collaboration form <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
