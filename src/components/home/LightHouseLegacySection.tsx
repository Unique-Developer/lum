"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const MILESTONES = [
  {
    year: "2001",
    title: "Founded",
    text: "Light House began its journey 23 years ago.",
  },
  {
    year: "2010",
    title: "Economy Leader",
    text: "Became a leader in economy range lighting solutions.",
  },
  {
    year: "2015",
    title: "Service Excellence",
    text: "Expanded after-sales service and support network.",
    
  },
  {
    year: "2020",
    title: "Trusted Partner",
    text: "Trusted by architects, electricians, and builders nationwide.",
  },
  {
    year: "2025",
    title: "Lumin Art",
    text: "Launching professional lighting solutions and bespoke design.",
  },
];

export function LightHouseLegacySection() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgOpacity = useTransform(
    scrollYProgress,
    [0.2, 0.5, 0.8],
    [0, 1, 0]
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[200vh] overflow-hidden bg-background"
    >
      {/* Sticky background (replaces 3D canvas to avoid React/Three.js conflict) */}
      <div className="sticky top-0 h-screen">
        <div className="absolute inset-0">
          <motion.div
            style={{ opacity: bgOpacity }}
            className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(17,79,117,0.15),transparent_70%)]"
          />
        </div>
      </div>

      {/* Content overlay - milestones revealed on scroll */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <motion.div
          className="max-w-2xl px-6 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mb-12 text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
            Light House Legacy
          </h2>
          <p className="mb-16 text-lg text-foreground/80 md:text-xl">
            23 years of illuminating spaces. Economy range lighting leader.
            <br />
            Trusted by architects, electricians, builders.
          </p>

          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {MILESTONES.map((m, i) => (
              <motion.div
                key={m.year}
                className="rounded-2xl border border-primary-main/20 bg-background/80 px-6 py-4 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="text-primary-main text-sm font-medium">
                  {m.year}
                </span>
                <h3 className="mt-1 font-semibold text-foreground">{m.title}</h3>
                <p className="mt-1 text-sm text-foreground/70">{m.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
