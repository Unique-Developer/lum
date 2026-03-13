import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata = {
  title: "Studio | Lumin Art",
  description:
    "Our approach to design-driven lighting: architectural rigour, material honesty, and light as a medium for experience. Consult → Design → Execute — our process from vision to reality.",
};

const tenets = [
  {
    title: "Light as medium",
    body: "We treat light as a primary material, not an afterthought. Every fixture, placement, and control choice shapes how people perceive and inhabit space.",
  },
  {
    title: "Architectural rigour",
    body: "Our designs align with structure and intent. We avoid decorative excess in favour of clarity, proportion, and purpose.",
  },
  {
    title: "Material honesty",
    body: "Materials are chosen for durability, clarity, and resonance. We favour honest expression over surface effect.",
  },
  {
    title: "Collaboration first",
    body: "The best outcomes come from working alongside architects and designers — not against them. We listen, adapt, and elevate.",
  },
];

const processSteps = [
  {
    phase: "01",
    title: "Consult",
    description:
      "We start with understanding your space, intent, and constraints. Site visits, briefs, and dialogue ensure alignment before a single fixture is specified.",
  },
  {
    phase: "02",
    title: "Design",
    description:
      "We propose layouts, product selections, and control strategies that balance aesthetics, performance, and budget. Options are presented clearly for informed decision-making.",
  },
  {
    phase: "03",
    title: "Execute",
    description:
      "From procurement to installation support, we stay involved. Quality control, documentation, and after-sales service are built into every handover.",
  },
];

export default function StudioPhilosophyPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            Studio
          </h1>
          <p className="mt-4 text-xl text-foreground/70">
            Philosophy and process — how we think and how we work.
          </p>

          <h2 className="mt-20 text-2xl font-semibold tracking-tight text-foreground">
            Philosophy
          </h2>
          <p className="mt-2 text-foreground/70">
            Our guiding principles in every project we touch.
          </p>
          <div className="mt-12 space-y-12">
            {tenets.map((item, i) => (
              <div key={i} className="border-l-2 border-primary-main pl-8">
                <h3 className="text-xl font-semibold tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="mt-4 text-foreground/80 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          <h2 id="process" className="mt-24 text-2xl font-semibold tracking-tight text-foreground">
            Our Process
          </h2>
          <p className="mt-2 text-foreground/70">
            Consult → Design → Execute — a clear path from vision to reality.
          </p>
          <div className="mt-12 space-y-16">
            {processSteps.map((step, i) => (
              <div key={i} className="grid gap-8 md:grid-cols-[auto_1fr] md:gap-16">
                <span className="text-6xl font-light text-primary-main/40 tabular-nums">
                  {step.phase}
                </span>
                <div>
                  <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-lg text-foreground/80 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
