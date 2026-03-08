"use client";

import { motion } from "framer-motion";

const PILLARS = [
  {
    title: "Architectural Lighting",
    description: "Designed for spaces that demand precision and atmosphere.",
  },
  {
    title: "Technical Lighting",
    description: "Engineered solutions for performance and longevity.",
  },
  {
    title: "Customized Fancy Lights",
    description: "Bespoke fixtures tailored to your vision.",
  },
  {
    title: "Premium Consultation",
    description: "Expert guidance from concept to installation.",
  },
];

export function WhatIsLuminArtSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background py-24 md:py-32">
      {/* Subtle gradient background (replaces 3D canvas to avoid React/Three.js conflict) */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40 bg-gradient-to-b from-primary-main/10 via-transparent to-primary-main/5" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Section header - Brand name with light beam feel */}
        <motion.div
          className="mb-16 text-center md:mb-24"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="mb-4 text-4xl font-semibold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-b from-foreground to-foreground/80 bg-clip-text text-transparent">
              Lumin Art
            </span>
          </h2>
          <p className="text-primary-main text-xl font-medium md:text-2xl">
            Luxury Lighting Experience Studio
          </p>
        </motion.div>

        {/* Pillars grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              className="group relative rounded-2xl border border-primary-main/15 bg-background/70 p-6 backdrop-blur-sm transition-colors hover:border-primary-main/30 hover:bg-background/90"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="mb-3 h-px w-12 bg-primary-main/50 transition-all group-hover:w-16 group-hover:bg-primary-main" />
              <h3 className="text-lg font-semibold text-foreground md:text-xl">
                {pillar.title}
              </h3>
              <p className="mt-2 text-sm text-foreground/70 md:text-base">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
