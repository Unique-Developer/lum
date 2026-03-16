import { readProjects } from "./storage";
import type { Project } from "./project-types";

export type { Project };

const CACHE_TTL_MS = 60_000;
let cachedProjects: Project[] | null = null;
let cacheExpiresAt = 0;

export async function getProjects(): Promise<Project[]> {
  const now = Date.now();
  if (cachedProjects && now < cacheExpiresAt) {
    return cachedProjects;
  }
  const projects = (await readProjects()).sort((a, b) => a.order - b.order);
  cachedProjects = projects;
  cacheExpiresAt = now + CACHE_TTL_MS;
  return projects;
}

export function clearProjectsCache(): void {
  cachedProjects = null;
  cacheExpiresAt = 0;
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug);
}
