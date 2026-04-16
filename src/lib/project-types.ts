export type Project = {
  slug: string;
  title: string;
  category: string;
  description: string;
  coverImage: string;
  photos: string[];
  overview: string;
  concept: string;
  fixtures: string[];
  order: number;
};

export function normalizeProject(project: Partial<Project> & Pick<Project, "slug" | "title">): Project {
  const photos = Array.isArray(project.photos)
    ? project.photos.map((photo) => String(photo).trim()).filter(Boolean)
    : [];
  const coverImage = String(project.coverImage ?? "").trim();

  return {
    slug: String(project.slug).trim(),
    title: String(project.title).trim(),
    category: String(project.category ?? "").trim(),
    description: String(project.description ?? "").trim(),
    coverImage,
    photos: photos.length > 0 ? photos : coverImage ? [coverImage] : [],
    overview: String(project.overview ?? "").trim(),
    concept: String(project.concept ?? "").trim(),
    fixtures: Array.isArray(project.fixtures)
      ? project.fixtures.map((fixture) => String(fixture).trim()).filter(Boolean)
      : [],
    order: Number.isFinite(project.order) ? Number(project.order) : 0,
  };
}
