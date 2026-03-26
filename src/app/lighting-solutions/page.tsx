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

const mosaicGlassStyle = {
  backgroundImage:
    "linear-gradient(to right, rgba(17,79,117,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(17,79,117,0.22) 1px, transparent 1px)",
  backgroundSize: "18px 18px",
} as const;

type MaterialKind = "natural" | "fabric" | "metal" | "wood" | "acrylic" | "glass" | "stone";

type MaterialItem = {
  name: string;
  subline: string;
  kind: MaterialKind;
};

type MaterialCategory = {
  title: string;
  gridClassName: string;
  items: MaterialItem[];
};

const MATERIAL_CATEGORIES: MaterialCategory[] = [
  {
    title: "Natural Materials",
    gridClassName: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
    items: [
      { name: "Bamboo", subline: "Natural weaving for warm, textured lighting.", kind: "natural" },
      { name: "Cane", subline: "Lightweight structure for airy woven fixtures.", kind: "natural" },
      { name: "Rattan", subline: "Curved forms crafted for signature lighting pieces.", kind: "natural" },
      { name: "Jute", subline: "Earthy texture for soft ambient lighting.", kind: "natural" },
      { name: "Raffia", subline: "Handwoven surfaces with natural character.", kind: "natural" },
    ],
  },
  {
    title: "Fabrics & Diffusers",
    gridClassName: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    items: [
      { name: "Linen Fabric", subline: "Soft diffusion for warm architectural lighting.", kind: "fabric" },
      { name: "Cotton Fabric", subline: "Clean diffusion for minimal lighting designs.", kind: "fabric" },
      { name: "Silk Fabric", subline: "Premium diffusion with a smooth glow.", kind: "fabric" },
      { name: "Textured Fabric", subline: "Patterned diffusion for decorative lighting.", kind: "fabric" },
    ],
  },
  {
    title: "Structure Materials",
    gridClassName: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    items: [
      { name: "Metal", subline: "Precision frames and custom lighting structures.", kind: "metal" },
      { name: "Wood", subline: "Warm structural elements for architectural lights.", kind: "wood" },
      { name: "Acrylic", subline: "Modern diffusion with clean light transmission.", kind: "acrylic" },
      { name: "Glass", subline: "Elegant diffusion for premium lighting fixtures.", kind: "glass" },
    ],
  },
  {
    title: "Stone Materials",
    gridClassName: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    items: [
      { name: "Marble", subline: "Luxury stone for statement lighting pieces.", kind: "stone" },
      { name: "Alabaster", subline: "Natural translucent stone for soft luminous glow.", kind: "stone" },
      { name: "Stone Veneer", subline: "Stone texture with lightweight lighting structure.", kind: "stone" },
    ],
  },
];

function KindIcon({ kind }: { kind: MaterialKind }) {
  const common = "currentColor";
  switch (kind) {
    case "natural":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 16c3-4 6-6 10-6s7 2 6 6"
            stroke={common}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M4 20c3-4 6-6 10-6s7 2 6 6"
            stroke={common}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.35"
          />
          <path d="M12 4v6" stroke={common} strokeWidth="2" strokeLinecap="round" opacity="0.45" />
        </svg>
      );
    case "fabric":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M7 3l5 2 5-2v6l-5 2-5-2V3Z"
            stroke={common}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M7 9v12l5 0 5 0V9"
            stroke={common}
            strokeWidth="2"
            strokeLinejoin="round"
            opacity="0.35"
          />
        </svg>
      );
    case "metal":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 2l8 4v12l-8 4-8-4V6l8-4Z"
            stroke={common}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M12 7v10" stroke={common} strokeWidth="2" strokeLinecap="round" opacity="0.35" />
        </svg>
      );
    case "wood":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 20c5-2 11-2 16 0"
            stroke={common}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M6 4c5 3 7 7 6 12"
            stroke={common}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.35"
          />
          <path
            d="M18 4c-5 3-7 7-6 12"
            stroke={common}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.55"
          />
        </svg>
      );
    case "acrylic":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M8 4h8l-2 16H10L8 4Z"
            stroke={common}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M10 10h4" stroke={common} strokeWidth="2" strokeLinecap="round" opacity="0.35" />
        </svg>
      );
    case "glass":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M7 4h10l-1.5 16H8.5L7 4Z"
            stroke={common}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M9 10h6" stroke={common} strokeWidth="2" strokeLinecap="round" opacity="0.35" />
          <path d="M12 7v10" stroke={common} strokeWidth="2" strokeLinecap="round" opacity="0.25" />
        </svg>
      );
    case "stone":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 2l4 8-4 12L8 10l4-8Z"
            stroke={common}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M8 10h8"
            stroke={common}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.35"
          />
        </svg>
      );
  }
}

function MaterialCard({ item }: { item: MaterialItem }) {
  const accent =
    item.kind === "natural"
      ? "rgba(143, 99, 42, 0.18)"
      : item.kind === "fabric"
        ? "rgba(17,79,117,0.18)"
        : item.kind === "metal"
          ? "rgba(17,79,117,0.16)"
          : item.kind === "wood"
            ? "rgba(143, 90, 30, 0.18)"
            : item.kind === "acrylic"
              ? "rgba(17,79,117,0.12)"
              : item.kind === "glass"
                ? "rgba(17,79,117,0.10)"
                : "rgba(17,79,117,0.14)";

  return (
    <div
      className="group relative h-full overflow-hidden rounded-2xl border border-foreground/10 bg-white/60 p-5 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_50px_-30px_rgba(17,79,117,0.45)]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-30" style={mosaicGlassStyle} />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(ellipse_at_top_left, ${accent} 0%, transparent 55%), radial-gradient(ellipse_at_bottom_right, rgba(17,79,117,0.10) 0%, transparent 55%)`,
        }}
      />
      <div className="relative">
        <div className="grid grid-cols-[1fr_auto] items-start gap-4">
          <p className="text-base font-semibold leading-snug text-foreground">
            {item.name}
          </p>
          <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-main/10 text-primary-main ring-1 ring-black/5 transition-colors group-hover:bg-primary-main/15">
            <KindIcon kind={item.kind} />
          </div>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-foreground/70">
          {item.subline}
        </p>
      </div>
    </div>
  );
}

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

          {/* Materials library */}
          <section className="mt-16 md:mt-20">
            <div className="rounded-[2rem] border border-foreground/10 bg-white/60 p-6 md:p-10 backdrop-blur-md relative overflow-hidden">
              <div className="pointer-events-none absolute inset-0 opacity-25" style={mosaicGlassStyle} />
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary-main/10 blur-3xl" />
              <div className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-primary-main/5 blur-3xl" />

              <div className="relative">
                <div className="mx-auto max-w-4xl">
                  <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                    Material Library for Custom Lighting
                  </h2>
                  <p className="mt-4 text-lg text-foreground/70">
                    We design and manufacture custom lighting using a wide range of materials, each
                    selected for diffusion, texture, durability, and architectural character.
                  </p>
                </div>

                <div className="mt-10 space-y-14">
                  {MATERIAL_CATEGORIES.map((cat) => (
                    <section key={cat.title} aria-label={cat.title}>
                      <h3 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                        {cat.title}
                      </h3>
                      <div className={`relative mt-5 grid auto-rows-fr gap-4 ${cat.gridClassName}`}>
                        {cat.items.map((item) => (
                          <MaterialCard key={item.name} item={item} />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
