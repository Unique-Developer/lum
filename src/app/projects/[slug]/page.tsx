import { notFound } from "next/navigation";
import Image from "next/image";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getProjectBySlug } from "@/lib/projects";

type Props = { params: Promise<{ slug: string }> };

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <article className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <header className="mb-10 md:mb-14">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {project.title}
            </h1>
            <p className="mt-4 text-lg text-foreground/75">{project.overview}</p>
            {project.coverImage && (
              <div className="mt-8 overflow-hidden rounded-2xl border border-foreground/10">
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  width={1600}
                  height={1000}
                  priority
                  className="h-auto w-full object-cover"
                />
              </div>
            )}
          </header>

          <section className="mb-10 md:mb-12">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Lighting Concept</h2>
            <p className="mt-3 text-foreground/80">{project.concept}</p>
          </section>

          <section className="mb-10 md:mb-12">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Fixtures Used</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-foreground/85">
              {project.fixtures.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Installation Images</h2>
            <p className="mt-3 text-sm text-foreground/70">
              Photography and detailed installation images can be added here as the project gallery grows.
            </p>
          </section>
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}

