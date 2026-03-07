import { readCatalogues } from "./storage";

export type Catalogue = {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  pdfUrl: string;
  pageCount: number;
  order: number;
};

export async function getCatalogues(): Promise<Catalogue[]> {
  const catalogues = await readCatalogues();
  return catalogues.sort((a, b) => a.order - b.order);
}

export async function getCatalogueById(id: string): Promise<Catalogue | undefined> {
  const catalogues = await getCatalogues();
  return catalogues.find((c) => c.id === id);
}
