"use client";

import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { motion } from "framer-motion";

const projects = [
  {
    id: 1,
    title: "Residential Pavilion",
    category: "Residential",
    description: "Integrated ambient and accent lighting for a private residential pavilion.",
  },
  {
    id: 2,
    title: "Commercial Lobby",
    category: "Corporate",
    description: "Architectural linear lighting and control system for a corporate lobby.",
  },
  {
    id: 3,
    title: "Restaurant Terrace",
    category: "Hospitality",
    description: "Outdoor dining illumination with adjustable mood and weather considerations.",
  },
  {
    id: 4,
    title: "Art Gallery",
    category: "Cultural",
    description: "Precision lighting for artwork display with minimal spill and glare.",
  },
  {
    id: 5,
    title: "Hotel Corridor",
    category: "Hospitality",
    description: "Linear and recessed solutions for corridors with smooth transitions.",
  },
  {
    id: 6,
    title: "Office Floor",
    category: "Corporate",
    description: "Human-centric lighting with circadian support for open-plan offices.",
  },
];

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

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {projects.map((project) => (
              <motion.article
                key={project.id}
                variants={item}
                className="group overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/[0.02] transition-all duration-300 hover:border-primary-200 hover:shadow-xl"
              >
                <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100">
                  <div className="flex h-full items-center justify-center text-primary-main/40 text-8xl font-light transition-transform duration-500 group-hover:scale-110">
                    {String.fromCharCode(64 + project.id)}
                  </div>
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
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
