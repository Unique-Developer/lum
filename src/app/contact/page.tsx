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

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            Contact Us
          </h1>
          <p className="mt-4 text-xl text-foreground/70">
            Reach out for consultations, project inquiries, or collaborations.
          </p>

          <div className="mt-16 space-y-10">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Architects &amp; Designers
              </h2>
              <p className="mt-2 text-foreground/70">
                For project collaboration, specifications, and custom solutions, use our dedicated
                form.
              </p>
              <Link
                href="/architect-collaboration"
                className="mt-4 inline-flex items-center gap-2 font-medium text-primary-main hover:underline"
              >
                Architects — Let&apos;s Collaborate
                <span className="transition-transform hover:translate-x-1">→</span>
              </Link>
            </div>

            <div className="border-t border-foreground/10 pt-10">
              <h2 className="text-lg font-semibold text-foreground">
                General Inquiries
              </h2>
              <p className="mt-2 text-foreground/70">
                Configure your contact email in <code className="rounded bg-foreground/5 px-1.5 py-0.5 text-sm">.env.local</code> as{" "}
                <code className="rounded bg-foreground/5 px-1.5 py-0.5 text-sm">CONTACT_EMAIL</code>.
                You can also use the architect collaboration form above for all inquiries.
              </p>
            </div>

            <div className="border-t border-foreground/10 pt-10">
              <h2 className="text-lg font-semibold text-foreground">Office</h2>
              <p className="mt-2 text-foreground/70">
                Lumin Art — A Light House Creation
                <br />
                Trusted by architects, electricians, and builders for over 23 years.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
