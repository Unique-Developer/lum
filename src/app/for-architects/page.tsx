import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

const mosaicGlassStyle = {
  backgroundImage:
    "linear-gradient(to right, rgba(17,79,117,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(17,79,117,0.22) 1px, transparent 1px)",
  backgroundSize: "18px 18px",
} as const;

function MosaicGlass({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <div className={`relative overflow-hidden border border-foreground/10 bg-white/60 backdrop-blur-md ${className}`}>
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={mosaicGlassStyle}
      />
      {children}
    </div>
  );
}

function Feature({ title, text }: { title: string; text: string }) {
  return (
    <MosaicGlass className="rounded-2xl p-4">
      <div className="relative z-10 flex gap-3">
        <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-main/10 text-primary-main">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M9 12.5l2 2 4.5-5.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.35"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-sm text-foreground/70">{text}</p>
        </div>
      </div>
    </MosaicGlass>
  );
}

export const metadata = {
  title: "Lighting Partner for Architects | Lumin Art",
  description:
    "Lumin Art works closely with architects and interior designers to develop architectural lighting strategies, custom fixtures, and technical solutions.",
};

export default function ForArchitectsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-background">
        {/* Subtle photography background (kept light so text/cards stay readable). */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <Image
            src="/hero-fixture2.jpg"
            alt="Architectural lighting installation"
            fill
            priority
            className="object-cover object-center opacity-20"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(17,79,117,0.18),_transparent_55%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-background" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 md:py-24">
              <div className="grid items-start gap-10 md:items-center md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/70 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-primary-main" />
                Architect Partner Program
                <span className="text-foreground/40">|</span>
                Loyalty perks
              </div>

              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                Lighting Partner for Architects
              </h1>

              <p className="mt-4 max-w-2xl text-lg text-foreground/70">
                Lumin Art works alongside architects and interior designers to shape lighting strategies that
                stay aligned with the architectural intent - from early planning to on-site support.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/architect-collaboration"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-main px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-main/90 focus:outline-none focus:ring-2 focus:ring-primary-main focus:ring-offset-2 focus:ring-offset-background"
                >
                  Book Lighting Consultation <span aria-hidden="true">-&gt;</span>
                </Link>
                <Link
                  href="/catalogue"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground/20 bg-background px-8 py-3 text-sm font-semibold text-foreground/80 transition-colors hover:border-primary-main hover:text-primary-main focus:outline-none focus:ring-2 focus:ring-primary-main focus:ring-offset-2 focus:ring-offset-background"
                >
                  Download Catalogue <span aria-hidden="true">v</span>
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <MosaicGlass className="rounded-2xl p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/50">Collaboration</p>
                  <p className="mt-2 text-sm font-semibold text-foreground">Design + technical partnership</p>
                </MosaicGlass>
                <MosaicGlass className="rounded-2xl p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/50">Perks</p>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    Preferential progress + loyalty rewards over time
                  </p>
                </MosaicGlass>
              </div>
            </div>

            <div className="md:col-span-5">
              <div className="relative">
                <div className="absolute -inset-3 rounded-[2rem] bg-primary-main/15 blur-2xl" />

                <MosaicGlass className="relative overflow-hidden rounded-[2rem]">
                  <div className="relative aspect-[16/11]">
                    <Image
                      src="/light-house-sketch.png"
                      alt="Light house sketch graphic"
                      fill
                      className="object-contain p-6 md:p-7"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/10 via-transparent to-transparent" />
                  </div>
                </MosaicGlass>

                <MosaicGlass className="absolute -bottom-6 -left-6 z-10 rounded-2xl p-4 bg-white/80">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/55">
                    Partner Perks
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground/80">
                    Loyalty rewards for architects who return project after project.
                  </p>
                </MosaicGlass>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support + workflow */}
      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                How We Support Your Projects
              </h2>
              <p className="mt-4 text-lg text-foreground/70">
                Our collaboration goes beyond product suggestion. We act as a design and technical partner
                throughout the project lifecycle.
              </p>

              <div className="mt-6 space-y-4">
                <Feature title="Lighting consultation" text="Translate intent into lighting layers and fixtures." />
                <Feature title="Fixture selection support" text="Curated picks that match aesthetics and constraints." />
                <Feature title="Custom fixture development" text="Bespoke solutions when standard products do not fit." />
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="relative overflow-hidden rounded-[2rem] p-6 shadow-[0_20px_55px_-35px_rgba(17,79,117,0.55)] md:p-8 bg-gradient-to-br from-white/70 via-white/55 to-white/70 backdrop-blur-md">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(17,79,117,0.10),_transparent_55%)]" />
                <div
                  className="pointer-events-none absolute inset-0 opacity-30"
                  style={mosaicGlassStyle}
                />
                <div className="relative">
                  <h3 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                    Project workflow
                  </h3>
                  <p className="mt-3 text-sm text-foreground/75">
                    A simple process designed to reduce rework and keep approvals moving.
                  </p>

                  <ol className="mt-6 space-y-5">
                    <li className="flex gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-main/10 text-primary-main font-semibold">
                        1
                      </div>
                      <div>
                        <p className="font-semibold">Share drawings and lighting goals</p>
                        <p className="mt-1 text-sm text-foreground/70">
                          We review your concept and note the constraints that matter.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-main/10 text-primary-main font-semibold">
                        2
                      </div>
                      <div>
                        <p className="font-semibold">Receive a structured lighting proposal</p>
                        <p className="mt-1 text-sm text-foreground/70">
                          Options, technical specs, and a clear path from concept to execution.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-main/10 text-primary-main font-semibold">
                        3
                      </div>
                      <div>
                        <p className="font-semibold">Coordination + on-site support</p>
                        <p className="mt-1 text-sm text-foreground/70">
                          We align installation details and stay involved through after-sales.
                        </p>
                      </div>
                    </li>
                  </ol>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <MosaicGlass className="rounded-2xl p-4">
                      <p className="text-sm font-semibold">Technical coordination</p>
                      <p className="mt-2 text-sm text-foreground/70">
                        Spec clarity for smoother procurement and approvals.
                      </p>
                    </MosaicGlass>
                    <MosaicGlass className="rounded-2xl p-4">
                      <p className="text-sm font-semibold">After-sales service</p>
                      <p className="mt-2 text-sm text-foreground/70">
                        Reliable support so the light performs long after install.
                      </p>
                    </MosaicGlass>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href="/architect-collaboration"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-main px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-main/90"
                    >
                      Start a consultation <span aria-hidden="true">-&gt;</span>
                    </Link>
                    <Link
                      href="/projects"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground/20 bg-background px-6 py-3 text-sm font-semibold text-foreground/80 transition-colors hover:border-primary-main hover:text-primary-main"
                    >
                      View project examples <span aria-hidden="true">-&gt;</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Loyalty rewards (indirectly presented) */}
      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-main">
                Partner perks
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                Loyalty rewards for architect partners
              </h2>
              <p className="mt-4 max-w-2xl text-lg text-foreground/70">
                Designed for repeat collaborations. As your projects move from concept to completion, you
                build access to preferential support, faster progress, and loyalty rewards that grow over time.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MosaicGlass className="rounded-[1.5rem] p-5">
              <p className="text-sm font-semibold">Priority progress</p>
              <p className="mt-2 text-sm text-foreground/70">
                Clear timelines and faster turnaround on key milestones.
              </p>
            </MosaicGlass>
            <MosaicGlass className="rounded-[1.5rem] p-5">
              <p className="text-sm font-semibold">Architect-first support</p>
              <p className="mt-2 text-sm text-foreground/70">
                Technical clarity for specifications and coordination.
              </p>
            </MosaicGlass>
            <MosaicGlass className="rounded-[1.5rem] p-5">
              <p className="text-sm font-semibold">Repeat-collaboration benefits</p>
              <p className="mt-2 text-sm text-foreground/70">
                Incentives that recognize partners who trust the process.
              </p>
            </MosaicGlass>
            <MosaicGlass className="rounded-[1.5rem] p-5">
              <p className="text-sm font-semibold">Loyalty rewards</p>
              <p className="mt-2 text-sm text-foreground/70">
                Rewards you can apply across future fixtures and upgrades.
              </p>
            </MosaicGlass>
          </div>

          <div className="mt-8 rounded-[2rem] border border-primary-main/20 bg-primary-main/5 p-6 md:p-8 relative overflow-hidden">
            <div
              className="pointer-events-none absolute inset-0 opacity-25"
              style={mosaicGlassStyle}
            />
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-primary-main">A subtle promise</p>
                <p className="mt-2 text-sm text-foreground/75">
                  If you keep building with us, we keep improving the experience - because your
                  long-term project pipeline deserves more than one-time support.
                </p>
              </div>
              <Link
                href="/architect-collaboration"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-main px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-main/90"
              >
                Ask about partner perks <span aria-hidden="true">-&gt;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-6 pb-20 md:pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-[2rem] border border-foreground/10 bg-white/60 backdrop-blur-md p-6 md:p-10">
            <div className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-primary-main/15 blur-3xl" />
            <div className="pointer-events-none absolute -left-28 bottom-0 h-72 w-72 rounded-full bg-primary-main/10 blur-3xl" />
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={mosaicGlassStyle}
            />

            <div className="relative grid gap-8 md:grid-cols-12 md:items-center">
              <div className="md:col-span-7">
                <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                  Start your lighting project with Lumin Art
                </h2>
                <p className="mt-4 text-lg text-foreground/70">
                  Share your project details and we&apos;ll respond with a structured lighting proposal or a
                  consultation slot.
                </p>
              </div>
              <div className="md:col-span-5 flex flex-wrap gap-4 md:justify-end">
                <Link
                  href="/architect-collaboration"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-main px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-main/90"
                >
                  Book Lighting Consultation <span aria-hidden="true">-&gt;</span>
                </Link>
                <Link
                  href="/catalogue"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground/20 px-8 py-3 text-sm font-semibold text-foreground/80 transition-colors hover:border-primary-main hover:text-primary-main"
                >
                  Download Product Catalogue <span aria-hidden="true">v</span>
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

