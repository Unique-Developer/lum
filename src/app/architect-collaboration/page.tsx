import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CollaborationForm } from "@/components/architect/CollaborationForm";

export const metadata = {
  title: "Architects & Designers — Collaborate | Lumin Art",
  description:
    "Partner with Lumin Art for luxury lighting solutions. Architects and designers — let's collaborate on your next project.",
};

export default function ArchitectCollaborationPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            Architects & Designers — Let&apos;s Collaborate
          </h1>
          <p className="mt-4 text-lg text-foreground/70">
            Share your project details and we&apos;ll get back to you within 24 hours.
          </p>
        </div>
        <div className="mx-auto mt-14 max-w-2xl px-4">
          <CollaborationForm />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
