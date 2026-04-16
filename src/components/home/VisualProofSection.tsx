"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { HomepageImageItem } from "@/lib/homepage";
import type { HomepageContent } from "@/lib/homepage";
import type { BlogPost } from "@/lib/blog-types";
import type { Project } from "@/lib/project-types";
import type { Catalogue } from "@/lib/catalogue";

function ImageCard({
  img,
  className,
  clickable,
}: {
  img: HomepageImageItem;
  className?: string;
  clickable?: boolean;
}) {
  const url = clickable ? img.href : undefined;
  const card = (
    <div
      className={[
        "group relative h-full overflow-hidden rounded-[1.25rem] border border-white/60 bg-white/40 shadow-[0_10px_35px_-20px_rgba(17,79,117,0.55)] ring-1 ring-black/[0.02] backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_22px_45px_-24px_rgba(17,79,117,0.65)]",
        url ? "cursor-pointer" : "",
        className ?? "",
      ].join(" ")}
    >
      <img
        src={img.src}
        alt={img.alt}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"
        loading="lazy"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent opacity-95 transition-opacity duration-500 group-hover:opacity-100" />
      {img.label && (
        <div className="absolute left-4 top-4 inline-flex items-center rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs font-semibold tracking-wide text-white backdrop-blur-md shadow-sm">
          {img.label}
        </div>
      )}
    </div>
  );
  if (url) {
    return (
      <Link href={url} className="block">
        {card}
      </Link>
    );
  }
  return card;
}

function PostCarouselCard({ post }: { post: BlogPost }) {
  const cardImage = post.thumbnail ?? post.media?.find((m) => m.type === "image")?.url ?? null;
  const hasVideo = Boolean(post.media?.some((m) => m.type === "video"));
  const date = new Date(post.publishedAt).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });

  return (
    <Link href={`/posts/${post.slug}`} className="block h-full w-full">
      <div
        className={[
          "group relative h-full w-full overflow-hidden rounded-[1.25rem] border border-white/60 bg-white/30",
          "shadow-[0_10px_35px_-20px_rgba(17,79,117,0.55)] ring-1 ring-black/[0.02] backdrop-blur-sm",
          "transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_22px_45px_-24px_rgba(17,79,117,0.65)]",
        ].join(" ")}
      >
        {cardImage ? (
          <img
            src={cardImage}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary-100/80 to-primary-200/60" />
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent opacity-95 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="absolute left-4 right-4 bottom-4 space-y-1">
          <div className="flex items-start justify-between gap-3">
            <h4 className="line-clamp-1 text-sm font-semibold tracking-tight text-white">{post.title}</h4>
            {hasVideo && (
              <span className="inline-flex h-7 items-center rounded-md border border-white/20 bg-black/40 px-2 text-xs font-medium text-white backdrop-blur-sm">
                Video
              </span>
            )}
          </div>
          <div className="text-xs text-white/70">
            {date} · {post.author}
          </div>
          <p className="line-clamp-2 text-xs leading-relaxed text-white/85">{post.excerpt?.trim() ? post.excerpt : post.title}</p>
        </div>
      </div>
    </Link>
  );
}

export function VisualProofSection({
  content,
  posts,
  projects,
  catalogues,
}: {
  content: HomepageContent["visualProof"];
  posts: BlogPost[];
  projects: Project[];
  catalogues: Catalogue[];
}) {
  const { featuredInstallations, productHighlights } = content;
  const featuredTrackRef = useRef<HTMLDivElement>(null);
  const productTrackRef = useRef<HTMLDivElement>(null);
  const scenesTrackRef = useRef<HTMLDivElement>(null);
  const featuredProjectImages: HomepageImageItem[] =
    projects
      .filter((project) => Boolean(project.coverImage))
      .slice(0, 8)
      .map((project) => ({
        src: project.coverImage,
        alt: project.title,
        label: project.category,
        href: `/projects/${project.slug}`,
      }));
  const featuredImages = featuredProjectImages.length > 0
    ? featuredProjectImages
    : featuredInstallations.images;
  const productCatalogueImages: HomepageImageItem[] =
    catalogues
      .filter((catalogue) => Boolean(catalogue.coverImage) && catalogue.coverImage !== "/logo.png")
      .slice(0, 8)
      .map((catalogue) => ({
        src: catalogue.coverImage,
        alt: catalogue.title,
        label: catalogue.title,
        href: `/catalogue/${catalogue.id}`,
      }));
  const productImages = productCatalogueImages.length > 0
    ? productCatalogueImages
    : productHighlights.images;

  const scrollTrack = (ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right") => {
    const el = ref.current;
    if (!el) return;
    const amount = el.clientWidth * 0.82;
    el.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="px-5 py-10 md:px-6 md:py-14">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7 }}
          className="mb-8 md:mb-10"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-main">
            {content.eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {content.title}
          </h2>
          <p className="mt-4 max-w-2xl text-foreground/70">
            {content.description}
          </p>
        </motion.div>

        {/* Featured installations */}
        <div className="mb-10 overflow-hidden rounded-3xl border border-foreground/10 bg-gradient-to-br from-primary-soft/60 via-white to-white p-4 shadow-[0_25px_70px_-45px_rgba(17,79,117,0.75)] md:mb-12 md:p-6">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold tracking-tight text-foreground">
                {featuredInstallations.title}
              </h3>
              <p className="mt-2 text-sm text-foreground/70">
                {featuredInstallations.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollTrack(featuredTrackRef, "left")}
                className="hidden h-9 w-9 items-center justify-center rounded-full border border-foreground/15 bg-white/85 text-lg text-foreground/70 transition-colors hover:border-primary-main/35 hover:text-primary-main md:inline-flex"
                aria-label="Scroll featured installations left"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => scrollTrack(featuredTrackRef, "right")}
                className="hidden h-9 w-9 items-center justify-center rounded-full border border-foreground/15 bg-white/85 text-lg text-foreground/70 transition-colors hover:border-primary-main/35 hover:text-primary-main md:inline-flex"
                aria-label="Scroll featured installations right"
              >
                →
              </button>
              <Link
                href="/projects"
                className="hidden text-sm font-semibold text-primary-main hover:underline md:inline"
              >
                {content.linkExploreProjects} →
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-12 bg-gradient-to-r from-white via-white/85 to-transparent sm:block" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-12 bg-gradient-to-l from-white via-white/85 to-transparent sm:block" />
            <div className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-foreground/45 sm:hidden">
              Swipe to explore
            </div>
            <div
              ref={featuredTrackRef}
              className="grid snap-x snap-mandatory grid-flow-col auto-cols-[84%] gap-3 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:auto-cols-[calc((100%-1rem)/2)] sm:gap-4 lg:auto-cols-[calc((100%-3rem)/4)]"
            >
              {featuredImages.map((img, index) => (
                <motion.div
                  key={img.href ?? `${img.src}-${String(index)}`}
                  className="aspect-[4/3] snap-start"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.55, ease: "easeOut", delay: index * 0.05 }}
                >
                <ImageCard img={img} className="h-full w-full" clickable />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Product highlights */}
        <div className="mb-10 md:mb-12">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold tracking-tight text-foreground">
                {productHighlights.title}
              </h3>
              <p className="mt-2 text-sm text-foreground/70">
                {productHighlights.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollTrack(productTrackRef, "left")}
                className="hidden h-9 w-9 items-center justify-center rounded-full border border-foreground/15 bg-white/85 text-lg text-foreground/70 transition-colors hover:border-primary-main/35 hover:text-primary-main md:inline-flex"
                aria-label="Scroll product highlights left"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => scrollTrack(productTrackRef, "right")}
                className="hidden h-9 w-9 items-center justify-center rounded-full border border-foreground/15 bg-white/85 text-lg text-foreground/70 transition-colors hover:border-primary-main/35 hover:text-primary-main md:inline-flex"
                aria-label="Scroll product highlights right"
              >
                →
              </button>
              <Link
                href="/catalogue"
                className="hidden text-sm font-semibold text-primary-main hover:underline md:inline"
              >
                {content.linkViewCatalogue} →
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-12 bg-gradient-to-r from-white via-white/85 to-transparent sm:block" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-12 bg-gradient-to-l from-white via-white/85 to-transparent sm:block" />
            <div
              ref={productTrackRef}
              className="grid snap-x snap-mandatory grid-flow-col auto-cols-[84%] gap-3 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:auto-cols-[calc((100%-1rem)/2)] sm:gap-4 lg:auto-cols-[calc((100%-3rem)/4)]"
            >
              {productImages.map((img, i) => (
                <motion.div
                  key={img.href ?? `${img.src}-${String(i)}`}
                  className="aspect-[4/3] snap-start"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.55, ease: "easeOut", delay: i * 0.05 }}
                >
                  <ImageCard img={img} className="h-full w-full" clickable />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Architectural scenes */}
        <div>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold tracking-tight text-foreground">
                Studio Stories
              </h3>
              <p className="mt-2 text-sm text-foreground/70">
                Fresh posts from Lumin Art—design notes, project scenes, and behind-the-scenes insights.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollTrack(scenesTrackRef, "left")}
                className="hidden h-9 w-9 items-center justify-center rounded-full border border-foreground/15 bg-white/85 text-lg text-foreground/70 transition-colors hover:border-primary-main/35 hover:text-primary-main md:inline-flex"
                aria-label="Scroll architectural scenes left"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => scrollTrack(scenesTrackRef, "right")}
                className="hidden h-9 w-9 items-center justify-center rounded-full border border-foreground/15 bg-white/85 text-lg text-foreground/70 transition-colors hover:border-primary-main/35 hover:text-primary-main md:inline-flex"
                aria-label="Scroll architectural scenes right"
              >
                →
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-12 bg-gradient-to-r from-white via-white/85 to-transparent sm:block" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-12 bg-gradient-to-l from-white via-white/85 to-transparent sm:block" />
            <div
              ref={scenesTrackRef}
              className="grid snap-x snap-mandatory grid-flow-col auto-cols-[84%] gap-3 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:auto-cols-[calc((100%-1rem)/2)] sm:gap-4 lg:auto-cols-[calc((100%-2rem)/3)]"
            >
              {posts.length > 0 ? (
                posts.slice(0, 6).map((post, index) => (
                  <motion.div
                    key={post.id}
                    className="aspect-[16/11] snap-start"
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.55, ease: "easeOut", delay: index * 0.05 }}
                  >
                    <PostCarouselCard post={post} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-sm text-foreground/60">
                  No posts yet. Publish your first blog/post to see it here.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

