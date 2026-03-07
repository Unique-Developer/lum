import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata = {
  title: "Privacy Policy | Lumin Art",
  description:
    "Privacy policy for Lumin Art — how we collect, use, and protect your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-foreground/70">
            Last updated: February 2025
          </p>

          <div className="mt-16 space-y-12 text-foreground/80 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-foreground">1. Introduction</h2>
              <p className="mt-4">
                Lumin Art (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to
                protecting your privacy. This policy explains how we collect, use, and safeguard
                your information when you use our website and services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">2. Information We Collect</h2>
              <p className="mt-4">
                We may collect information you provide directly, such as when you submit our
                architect collaboration form: name, firm name, email, phone number, project type,
                and message content. We may also collect usage data and analytics via standard
                web technologies (cookies, log files) to improve our site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">3. How We Use Your Information</h2>
              <p className="mt-4">
                We use your information to respond to inquiries, provide consultations, manage
                projects, and improve our services. We do not sell your personal data to third
                parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">4. Data Security</h2>
              <p className="mt-4">
                We implement appropriate technical and organisational measures to protect your
                data against unauthorised access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">5. Your Rights</h2>
              <p className="mt-4">
                You have the right to access, correct, or delete your personal data. To exercise
                these rights or for any privacy-related questions, please contact us via the
                contact information provided on this site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">6. Changes to This Policy</h2>
              <p className="mt-4">
                We may update this privacy policy from time to time. We will notify you of any
                material changes by posting the updated policy on this page with a revised
                &quot;Last updated&quot; date.
              </p>
            </section>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
