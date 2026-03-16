import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getCategories } from "@/lib/categories";
import { getLightingSolutionsPageContent } from "@/lib/lighting-solutions-content";

export const metadata = {
  title: "Lighting Solutions | Lumin Art",
  description:
    "Architectural, decorative, technical, and custom lighting solutions designed to complement contemporary architecture and interiors.",
};

export const dynamic = "force-dynamic";

const FALLBACK_IMAGE = "/hero-fixture2.jpg";

export default async function LightingSolutionsPage() {
  const [categories, content] = await Promise.all([
    getCategories(),
    getLightingSolutionsPageContent(),
  ]);

  const pageTitle = content.pageTitle ?? "Lighting Solutions";
  const pageSubtitle = content.pageSubtitle ?? "Browse solutions as catalogue categories.";
  const customStudioTitle = content.customStudioTitle ?? "Custom Lighting Studio";
  const customStudioIntro = content.customStudioIntro ?? "";
  const whatWeDevelop = content.whatWeDevelop ?? [];
  const collaborationSteps = content.collaborationSteps ?? [];

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <header className="mb-12 md:mb-16">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              {pageTitle}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-foreground/70">{pageSubtitle}</p>
          </header>

          <div className="grid gap-6 sm:grid-cols-2">
            {categories.map((cat) => {
              const href = `/catalogue/${cat.slug}`;
              const image = cat.image ?? FALLBACK_IMAGE;
              const description = cat.description || "";
              const includes = Array.isArray(cat.includes) ? cat.includes : [];

              return (
                <Link
                  key={cat.id}
                  href={href}
                  className="group overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/[0.02] transition-all duration-300 hover:border-primary-200 hover:shadow-xl"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image}
                      alt={cat.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                    <div className="absolute left-5 top-5 inline-flex items-center rounded-full bg-black/35 px-3 py-1 text-xs font-semibold tracking-wide text-white backdrop-blur">
                      Catalogue category
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary-main">
                      {cat.name}
                    </h2>
                    {description && (
                      <p className="mt-2 text-sm text-foreground/70 leading-relaxed">
                        {description}
                      </p>
                    )}
                    {includes.length > 0 && (
                      <div className="mt-4 rounded-xl border border-foreground/10 bg-background/60 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-main">
                          Includes
                        </p>
                        <ul className="mt-3 grid gap-2 text-sm text-foreground/80 sm:grid-cols-2">
                          {includes.map((i) => (
                            <li key={i}>{i}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-main">
                      View in catalogue
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {(customStudioIntro || whatWeDevelop.length > 0 || collaborationSteps.length > 0) && (
            <div className="mt-16 space-y-10 md:mt-20 md:space-y-12">
              <section className="rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-6 md:p-8">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  {customStudioTitle}
                </h2>
                {customStudioIntro && (
                  <p className="mt-3 text-foreground/75">{customStudioIntro}</p>
                )}
              </section>

              <section className="grid gap-6 md:grid-cols-2">
                {whatWeDevelop.length > 0 && (
                  <div className="rounded-2xl border border-foreground/10 bg-background p-6">
                    <h3 className="text-xl font-semibold tracking-tight text-foreground">
                      What We Develop
                    </h3>
                    <p className="mt-3 text-sm text-foreground/70">
                      Each fixture is developed based on project design intent, architectural context,
                      and technical constraints.
                    </p>
                    <ul className="mt-5 grid gap-3 text-sm text-foreground/85 sm:grid-cols-2">
                      {whatWeDevelop.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {collaborationSteps.length > 0 && (
                  <div className="rounded-2xl border border-foreground/10 bg-background p-6">
                    <h3 className="text-xl font-semibold tracking-tight text-foreground">
                      Collaboration Process
                    </h3>
                    <ol className="mt-4 space-y-3 text-sm text-foreground/80">
                      {collaborationSteps.map((step) => (
                        <li key={step.title}>
                          <strong className="font-semibold text-foreground">{step.title}</strong> —{" "}
                          {step.body}
                        </li>
                      ))}
                    </ol>
                    <div className="mt-6">
                      <Link
                        href="/architect-collaboration"
                        className="inline-flex items-center gap-2 rounded-full bg-primary-main px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-main/90"
                      >
                        Start your custom lighting brief
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                )}
              </section>
            </div>
          )}

          {categories.length === 0 && (
            <div className="mt-10 rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-6 text-sm text-foreground/70">
              <p>
                No catalogue categories are configured yet. Create categories in the admin panel and
                they will appear here.
              </p>
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
