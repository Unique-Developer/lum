"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { HomepageContent } from "@/lib/homepage";

export function LightHouseLegacySection({ content }: { content: HomepageContent["lightHouseLegacy"] }) {
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
            {content.title}
          </h2>
          <p className="mb-16 text-lg text-foreground/80 md:text-xl">
            {content.subtitle.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i < content.subtitle.split("\n").length - 1 && <br />}
              </span>
            ))}
          </p>

          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {content.milestones.map((m, i) => (
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
