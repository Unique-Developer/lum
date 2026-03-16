import { readSiteSetting, writeSiteSetting } from "./storage";

export type LightingSolutionsPageContent = {
  pageTitle?: string;
  pageSubtitle?: string;
  customStudioTitle?: string;
  customStudioIntro?: string;
  whatWeDevelop?: string[];
  collaborationSteps?: Array<{ title: string; body: string }>;
};

const KEY = "lighting_solutions_page";

const DEFAULTS: LightingSolutionsPageContent = {
  pageTitle: "Lighting Solutions",
  pageSubtitle:
    "Browse solutions as catalogue categories. Each solution redirects to the relevant catalogue section for products, subcategories, and PDFs.",
  customStudioTitle: "Custom Lighting Studio",
  customStudioIntro:
    "Many architectural projects require lighting fixtures that do not exist in standard catalogues. Lumin Art develops custom lighting solutions including bespoke chandeliers, fabric lighting installations, sculptural floor lamps, and large-scale statement lighting pieces tailored to interior concepts.",
  whatWeDevelop: [
    "Sculptural chandeliers",
    "Fabric lighting structures",
    "Custom floor lamps",
    "Architectural installations",
  ],
  collaborationSteps: [
    { title: "1. Concept & brief", body: "We review sketches, references, and materials to understand the design intent." },
    { title: "2. Technical study", body: "Structure, hanging details, light distribution, and maintenance are considered from the start." },
    { title: "3. Prototyping", body: "Mock-ups, finishes, and sample modules are developed for approval." },
    { title: "4. Production & installation support", body: "We oversee fabrication details and provide on-site coordination guidance." },
  ],
};

export async function getLightingSolutionsPageContent(): Promise<LightingSolutionsPageContent> {
  const saved = await readSiteSetting<LightingSolutionsPageContent>(KEY);
  return { ...DEFAULTS, ...saved };
}

export async function saveLightingSolutionsPageContent(
  content: Partial<LightingSolutionsPageContent>
): Promise<void> {
  const current = await readSiteSetting<LightingSolutionsPageContent>(KEY);
  await writeSiteSetting(KEY, { ...DEFAULTS, ...current, ...content });
}
