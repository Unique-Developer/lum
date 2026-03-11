import { readCatalogues } from "./storage";

export type Catalogue = {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  pdfUrl: string;
  pageCount: number;
  order: number;
  subcategoryId?: string;
};

// Simple in-memory cache to avoid hitting MongoDB on every request.
// This significantly speeds up catalogue page loads while allowing
// a small amount of staleness, which is acceptable for this content.
const CATALOGUE_CACHE_TTL_MS = 60_000; // 1 minute

let cachedCatalogues: Catalogue[] | null = null;
let cachedCataloguesExpiresAt = 0;

export async function getCatalogues(): Promise<Catalogue[]> {
  const now = Date.now();

  if (cachedCatalogues && now < cachedCataloguesExpiresAt) {
    return cachedCatalogues;
  }

  const catalogues = (await readCatalogues()).sort((a, b) => a.order - b.order);

  cachedCatalogues = catalogues;
  cachedCataloguesExpiresAt = now + CATALOGUE_CACHE_TTL_MS;

  return catalogues;
}

export function clearCatalogueCache() {
  cachedCatalogues = null;
  cachedCataloguesExpiresAt = 0;
}

export async function getCatalogueById(id: string): Promise<Catalogue | undefined> {
  const catalogues = await getCatalogues();
  return catalogues.find((c) => c.id === id);
}

export async function getCataloguesBySubcategory(subcategoryId: string): Promise<Catalogue[]> {
  const catalogues = await getCatalogues();
  return catalogues.filter((c) => c.subcategoryId === subcategoryId);
}
