import { readSiteSetting, writeSiteSetting } from "./storage";

export type HomepageImageItem = {
  src: string;
  alt: string;
  label?: string;
  /** Link URL — when set, the image becomes clickable */
  href?: string;
};

export type HomepageContent = {
  hero: {
    headline: string;
    subtext: string;
    heroImage: string;
    heroImageAlt: string;
    ctaExploreProjects: string;
    ctaStartProject: string;
    scrollLabel: string;
  };
  visualProof: {
    eyebrow: string;
    title: string;
    description: string;
    featuredInstallations: { title: string; description: string; images: HomepageImageItem[] };
    productHighlights: { title: string; description: string; images: HomepageImageItem[] };
    architecturalScenes: { title: string; description: string; images: HomepageImageItem[] };
    linkExploreProjects: string;
    linkViewCatalogue: string;
  };
  lightHouseLegacy: {
    title: string;
    subtitle: string;
    milestones: Array<{ year: string; title: string; text: string }>;
  };
  dualBrand: {
    lightHouse: { name: string; tagline: string; url: string; cta: string };
    fancyLight: { name: string; tagline: string; url: string; cta: string };
  };
  whatIsLuminArt: {
    brandName: string;
    tagline: string;
    pillars: Array<{ title: string; description: string }>;
  };
  cta: {
    headline: string;
    subtext: string;
    buttonText: string;
  };
};

const KEY = "homepage";

const DEFAULTS: HomepageContent = {
  hero: {
    headline: "Architectural & Bespoke Lighting Studio",
    subtext: "Design-driven lighting solutions for architects, designers and premium residences.",
    heroImage: "/hero-fixture2.jpg",
    heroImageAlt: "Architectural lighting installation",
    ctaExploreProjects: "Explore Projects",
    ctaStartProject: "Start Your Lighting Project",
    scrollLabel: "Scroll",
  },
  visualProof: {
    eyebrow: "Visual Proof",
    title: "Real spaces. Real lighting outcomes.",
    description:
      "Architects judge lighting partners on project thinking and execution. Here are scenes that represent our direction: layered lighting, architectural highlighting, and visual comfort.",
    featuredInstallations: {
      title: "Featured lighting installations",
      description: "A curated set of residential, hospitality, and commercial moods.",
      images: [
        { src: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80", alt: "Warm architectural lighting in a premium interior", label: "Residential" },
        { src: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80", alt: "Soft ambient lighting across a modern bedroom", label: "Layered light" },
        { src: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80", alt: "Accent lighting and textures in a contemporary space", label: "Accents" },
        { src: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1600&q=80", alt: "Cove lighting detail in an architectural ceiling", label: "Cove / profile" },
        { src: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=80", alt: "Decorative pendant lighting over a dining setup", label: "Decorative" },
        { src: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80", alt: "Office lighting scene with linear profiles", label: "Commercial" },
        { src: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1600&q=80", alt: "Lighting highlighting materials and surfaces", label: "Materials" },
        { src: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80", alt: "Hospitality lighting with warm mood", label: "Hospitality" },
      ],
    },
    productHighlights: {
      title: "Product highlights",
      description: "Architectural, technical, and decorative systems used across premium projects.",
      images: [
        { src: "/images/categories/decorative-lighting.jpg", alt: "Decorative lighting category", label: "Decorative" },
        { src: "https://images.unsplash.com/photo-1520974735194-6b0c9a948b64?auto=format&fit=crop&w=1600&q=80", alt: "Track lighting and spotlights detail", label: "Tracks / spots" },
        { src: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1600&q=80", alt: "Linear profile lighting in a modern interior", label: "Linear profiles" },
        { src: "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?auto=format&fit=crop&w=1600&q=80", alt: "Recessed lighting detail with clean ceiling", label: "Recessed" },
      ],
    },
    architecturalScenes: {
      title: "Architectural lighting scenes",
      description: "Surface, volume, and circulation — scenes that show how light supports architecture.",
      images: [
        { src: "https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&w=1600&q=80", alt: "Architectural facade lighting at night" },
        { src: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1600&q=80", alt: "Minimal interior lighting with strong lines" },
        { src: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80", alt: "Warm lighting in a premium living space" },
        { src: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1600&q=80", alt: "Modern kitchen lighting with task focus" },
        { src: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1600&q=80", alt: "Architectural lighting detail in a workspace" },
        { src: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?auto=format&fit=crop&w=1600&q=80", alt: "Moody hospitality lighting scene" },
      ],
    },
    linkExploreProjects: "Explore projects",
    linkViewCatalogue: "View catalogue",
  },
  lightHouseLegacy: {
    title: "From the House of Light House",
    subtitle: "23+ years of illuminating spaces across India.\nTrusted by architects, electricians, and builders.",
    milestones: [
      { year: "2001", title: "Founded", text: "Light House began its journey in architectural and decorative lighting." },
      { year: "2010", title: "Expanded Portfolio", text: "Broadened product ecosystem across residential and commercial segments." },
      { year: "2015", title: "Service Excellence", text: "Expanded after-sales service and support network." },
      { year: "2020", title: "Trusted Partner", text: "Trusted by architects, electricians, and builders nationwide." },
      { year: "2025", title: "Lumin Art", text: "A Light House studio focused on professional and bespoke lighting solutions." },
    ],
  },
  dualBrand: {
    lightHouse: {
      name: "Light House",
      tagline: "From the House of Light House — since 2001",
      url: "https://lighthouse.example.com",
      cta: "Enter Portal",
    },
    fancyLight: {
      name: "Fancy Light Store",
      tagline: "Online E‑Commerce",
      url: "https://fancylight.example.com",
      cta: "Enter Portal",
    },
  },
  whatIsLuminArt: {
    brandName: "Lumin Art",
    tagline: "Design-Driven Lighting Studio",
    pillars: [
      { title: "Architectural Lighting", description: "Designed for spaces that demand precision and atmosphere." },
      { title: "Technical Lighting", description: "Engineered solutions for performance and longevity." },
      { title: "Customized Fancy Lights", description: "Bespoke fixtures tailored to your vision." },
      { title: "Project Consultation", description: "Expert guidance from concept to installation." },
    ],
  },
  cta: {
    headline: "Architects & Designers\nLet's Collaborate",
    subtext: "Bring your vision to light. Connect with our project consultation team.",
    buttonText: "Get in Touch",
  },
};

function deepMerge<T extends object>(target: T, source: Partial<T> | null | undefined): T {
  if (!source || typeof source !== "object") return target;
  const result = { ...target };
  for (const key of Object.keys(source) as (keyof T)[]) {
    const srcVal = source[key];
    if (srcVal !== undefined && srcVal !== null) {
      const tgtVal = result[key];
      if (typeof tgtVal === "object" && tgtVal !== null && !Array.isArray(tgtVal) && typeof srcVal === "object" && !Array.isArray(srcVal)) {
        (result as Record<string, unknown>)[key as string] = deepMerge(
          tgtVal as object,
          srcVal as Record<string, unknown>
        );
      } else {
        (result as Record<string, unknown>)[key as string] = srcVal;
      }
    }
  }
  return result;
}

export async function getHomepageContent(): Promise<HomepageContent> {
  const saved = await readSiteSetting<Partial<HomepageContent>>(KEY);
  return deepMerge(DEFAULTS, saved);
}

export async function saveHomepageContent(updates: Partial<HomepageContent>): Promise<void> {
  const current = await getHomepageContent();
  const merged = deepMerge(current, updates);
  await writeSiteSetting(KEY, merged);
}
