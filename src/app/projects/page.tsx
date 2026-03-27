"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { motion } from "framer-motion";

type Project = {
  slug: string;
  title: string;
  category: string;
  description: string;
  coverImage: string;
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => (r.ok ? r.json() : []))
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              Projects Showcase
            </h1>
            <p className="mt-4 text-lg text-foreground/70">
              Selected installations across residential, commercial, and hospitality spaces.
            </p>
          </div>

          {loading ? (
            <div className="flex min-h-[200px] items-center justify-center text-foreground/50">
              Loading…
            </div>
          ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {projects.map((project) => (
              <motion.article
                key={project.slug}
                variants={item}
                className="group overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/[0.02] transition-all duration-300 hover:border-primary-200 hover:shadow-xl"
              >
                <Link href={`/projects/${project.slug}`} className="block h-full">
                  <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100">
                    {project.coverImage ? (
                      <Image
                        src={project.coverImage}
                        alt={project.title}
                        width={960}
                        height={720}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-primary-main/40 text-4xl font-medium tracking-tight transition-transform duration-500 group-hover:scale-110">
                        {project.category}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <span className="text-xs uppercase tracking-widest text-primary-main">
                      {project.category}
                    </span>
                    <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground group-hover:text-primary-main transition-colors">
                      {project.title}
                    </h2>
                    <p className="mt-2 text-sm text-foreground/70 leading-relaxed">
                      {project.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary-main">
                      View project
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
