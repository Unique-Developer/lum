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

          <h2 className="mt-24 text-2xl font-semibold tracking-tight text-foreground">
            Lighting Philosophy
          </h2>
          <p className="mt-2 text-foreground/70">
            How we think about light — layers, mood, architectural intent, and the balance of technical
            and decorative elements.
          </p>

          <div className="mt-10 space-y-10 text-foreground/80 leading-relaxed">
            <section>
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                The importance of light layers
              </h3>
              <p className="mt-3">
                We never start with a catalogue; we start with layers. Ambient, accent, task, and
                decorative lighting each play a specific role. Ambient light keeps spaces legible.
                Accent light draws attention to what matters — art, textures, objects, or key junctions.
                Task light supports focused activity. Decorative light adds identity. A successful scheme
                does not rely on one of these layers; it combines them in measured proportions.
              </p>
              <p className="mt-3">
                When layers are planned early, ceilings stay calm, wiring is efficient, and controls feel
                intuitive. When layers are ignored, spaces often end up either overlit and flat or underlit
                and impractical. Our role is to balance all four so architecture, interiors, and daily life
                sit comfortably together.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                Mood creation and human experience
              </h3>
              <p className="mt-3">
                Light sets the emotional tone of a space long before furniture or art. Subtle differences
                in brightness, contrast, and colour temperature can make the same room feel clinical,
                focused, or calm. We design scenes — not just circuits — so spaces can shift mood across the
                day, from bright and functional to soft and intimate.
              </p>
              <p className="mt-3">
                For residences, this often means giving clients a clear daytime and evening setting, with
                intermediate scenes for hosting or quiet work. For hospitality and commercial projects,
                it means ensuring that brand, comfort, and operational needs are all respected in the
                lighting brief.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                Architectural lighting principles
              </h3>
              <p className="mt-3">
                Architectural lighting starts with the plan and section. We look at how people move, where
                they pause, what surfaces they face, and how volumes relate to each other. Instead of
                filling every grid with downlights, we use light to support circulation, emphasise key
                volumes, and reveal materiality.
              </p>
              <p className="mt-3">
                We favour clean ceilings, clear sightlines, and well-controlled optics. Grazing, washing,
                and backlighting are chosen intentionally, not applied as decoration. The goal is that
                visitors remember how the space felt — not how many fixtures they saw.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                Technical vs decorative lighting
              </h3>
              <p className="mt-3">
                Technical lighting is the invisible backbone of a project. Profiles, spotlights, magnetic
                tracks, and recessed systems provide performance, flexibility, and longevity. Decorative
                lighting, on the other hand, carries narrative and character — the chandelier in a lobby,
                the pendant above a dining table, the sculptural piece in a double-height volume.
              </p>
              <p className="mt-3">
                Our philosophy is simple: let technical lighting quietly do most of the work, and let
                decorative fixtures speak where they matter. When both are balanced, architecture feels
                coherent, moods feel intentional, and future maintenance stays manageable.
              </p>
            </section>
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
