"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { HomepageImageItem } from "@/lib/homepage";
import type { HomepageContent } from "@/lib/homepage";

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
        "group relative overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/[0.02]",
        url ? "cursor-pointer" : "",
        className ?? "",
      ].join(" ")}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={img.src}
        alt={img.alt}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        loading="lazy"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/10 opacity-90" />
      {img.label && (
        <div className="absolute left-4 top-4 inline-flex items-center rounded-full bg-black/35 px-3 py-1 text-xs font-semibold tracking-wide text-white backdrop-blur">
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

export function VisualProofSection({ content }: { content: HomepageContent["visualProof"] }) {
  const { featuredInstallations, productHighlights, architecturalScenes } = content;

  return (
    <section className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7 }}
          className="mb-10 md:mb-14"
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
        <div className="mb-14 md:mb-16">
          <div className="mb-6 flex items-end justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold tracking-tight text-foreground">
                {featuredInstallations.title}
              </h3>
              <p className="mt-2 text-sm text-foreground/70">
                {featuredInstallations.description}
              </p>
            </div>
            <Link
              href="/projects"
              className="hidden text-sm font-semibold text-primary-main hover:underline md:inline"
            >
              {content.linkExploreProjects} →
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredInstallations.images.map((img) => (
              <div key={img.src} className="aspect-[4/3]">
                <ImageCard img={img} className="h-full w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Product highlights */}
        <div className="mb-14 md:mb-16">
          <div className="mb-6 flex items-end justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold tracking-tight text-foreground">
                {productHighlights.title}
              </h3>
              <p className="mt-2 text-sm text-foreground/70">
                {productHighlights.description}
              </p>
            </div>
            <Link
              href="/catalogue"
              className="hidden text-sm font-semibold text-primary-main hover:underline md:inline"
            >
              {content.linkViewCatalogue} →
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-4 sm:grid-cols-2">
              {productHighlights.images.slice(0, 2).map((img, i) => (
                <div key={img.src + String(i)} className="aspect-[4/3]">
                  <ImageCard img={img} className="h-full w-full" clickable />
                </div>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {productHighlights.images.slice(2, 4).map((img, i) => (
                <div key={img.src + String(i)} className="aspect-[4/3]">
                  <ImageCard img={img} className="h-full w-full" clickable />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Architectural scenes */}
        <div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold tracking-tight text-foreground">
              {architecturalScenes.title}
            </h3>
            <p className="mt-2 text-sm text-foreground/70">
              {architecturalScenes.description}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {architecturalScenes.images.map((img) => (
              <div key={img.src} className="aspect-[16/11]">
                <ImageCard img={img} className="h-full w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

