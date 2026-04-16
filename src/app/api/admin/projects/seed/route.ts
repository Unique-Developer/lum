import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { readProjects, writeProjects } from "@/lib/storage";
import type { Project } from "@/lib/project-types";
import { clearProjectsCache } from "@/lib/projects";

const SAMPLE_PROJECTS: Omit<Project, "order">[] = [
  {
    slug: "luxury-residence-lighting-surat",
    title: "Luxury Residence Lighting — Surat",
    category: "Residential",
    description:
      "Layered architectural and decorative lighting for a premium residence in Surat.",
    coverImage: "",
    photos: [],
    overview:
      "A premium residence where architectural and decorative lighting were planned together to highlight volumes, materials, and artwork.",
    concept:
      "The concept was to keep ceilings visually calm while using coves, profiles, and concealed fixtures to shape mood and depth. Decorative pieces were used sparingly as focal points, not as the main source of light.",
    fixtures: [
      "Recessed downlights with low-glare optics",
      "Linear profiles in coves and niches",
      "Accent spotlights for artwork and textures",
      "Selective decorative pendants in dining and lounge",
    ],
  },
  {
    slug: "villa-lighting-concept-ahmedabad",
    title: "Villa Lighting Concept — Ahmedabad",
    category: "Residential",
    description:
      "Concept-to-execution lighting for a modern villa with double-height spaces.",
    coverImage: "",
    photos: [],
    overview:
      "Concept and execution for a modern villa with double-height spaces, large glazing, and indoor–outdoor connections.",
    concept:
      "We used vertical lighting on columns and walls to balance the volume, with warm accents on seating areas and circulation paths. Outdoor terraces were treated as extensions of the living space.",
    fixtures: [
      "Wall washers for double-height surfaces",
      "Profiles integrated into handrails and steps",
      "Outdoor-rated wall and floor lights",
      "Suspended feature lights in the atrium",
    ],
  },
  {
    slug: "premium-apartment-lighting-mumbai",
    title: "Premium Apartment Lighting — Mumbai",
    category: "Residential",
    description:
      "Compact apartment lighting planned with zoning, dimming, and low-glare fixtures.",
    coverImage: "",
    photos: [],
    overview:
      "Lighting design for a compact but high-value apartment, planned with zoning, dimming, and low-glare fixtures.",
    concept:
      "The strategy focused on flexibility: bright, functional light for day-to-day use, and softer scenes for evenings. Linear profiles and coves were used to visually expand compact rooms.",
    fixtures: [
      "Compact recessed downlights with unified beam spreads",
      "Cove lighting in living and bedrooms",
      "Under-cabinet task lighting in kitchen",
      "Decorative bedside and dining pendants",
    ],
  },
  {
    slug: "restaurant-lighting-design-surat",
    title: "Restaurant Lighting Design — Surat",
    category: "Hospitality",
    description:
      "Warm, layered lighting for an all-day restaurant that shifts from day to night.",
    coverImage: "",
    photos: [],
    overview:
      "A warm, layered lighting scheme for an all-day restaurant that shifts smoothly from bright day service to intimate evening dining.",
    concept:
      "We balanced general light for service staff with accent lighting on tables, bar, and feature walls. Control zones and dimming curves were tuned to avoid harsh transitions between scenes.",
    fixtures: [
      "Track-mounted spotlights for table accenting",
      "Wall washers on textured feature walls",
      "Hidden linear profiles at banquettes and counters",
      "Decorative pendants over the bar",
    ],
  },
  {
    slug: "commercial-office-lighting",
    title: "Commercial Office Lighting",
    category: "Corporate",
    description:
      "Human-centric lighting with linear profiles, meeting room accents, and focused task zones.",
    coverImage: "",
    photos: [],
    overview:
      "Office lighting planned around visual comfort, productivity, and clear zoning between focus areas, collaboration zones, and circulation.",
    concept:
      "We specified human-centric lighting with appropriate vertical illuminance, controlled glare, and localised task lighting for workstations. Meeting rooms received layered schemes suitable for presentations and discussions.",
    fixtures: [
      "Continuous linear profiles in open work areas",
      "Recessed downlights in circulation",
      "Pendant profiles over collaboration tables",
      "Accent lighting for branding and reception",
    ],
  },
];

export async function POST() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await readProjects();
  if (existing.length > 0) {
    return NextResponse.json(
      { error: "Projects already exist. Seed only works when the list is empty." },
      { status: 400 }
    );
  }

  const projects: Project[] = SAMPLE_PROJECTS.map((p, i) => ({ ...p, order: i }));
  await writeProjects(projects);
  clearProjectsCache();
  return NextResponse.json({ success: true, count: projects.length });
}
