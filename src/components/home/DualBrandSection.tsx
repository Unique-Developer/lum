"use client";

import { motion } from "framer-motion";

const LIGHT_HOUSE_URL = "https://lighthouse.example.com"; // Placeholder - update with real URL
const FANCY_LIGHT_URL = "https://fancylight.example.com"; // Placeholder - update with real URL

export function DualBrandSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      <div className="flex h-screen flex-col md:flex-row">
        {/* Light House - Economy Range (Left) */}
        <motion.a
          href={LIGHT_HOUSE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex flex-1 items-center justify-center overflow-hidden border-r border-foreground/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-main"
          initial={{ opacity: 0.9 }}
          whileHover={{ flex: 1.1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Illuminated portal background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-main/5 via-primary-main/10 to-primary-main/5 transition-colors duration-500 group-hover:via-primary-main/20" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(17,79,117,0.08)_0%,transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="relative z-10 text-center">
            <motion.h2
              className="text-primary-main text-3xl font-semibold tracking-tight md:text-5xl"
              whileHover={{ scale: 1.05 }}
            >
              Light House
            </motion.h2>
            <p className="mt-4 text-foreground/70 md:text-xl">
              Economy Range Lighting
            </p>
            <motion.span
              className="mt-6 inline-block text-sm uppercase tracking-widest text-primary-main opacity-70"
              whileHover={{ opacity: 1 }}
            >
              Enter Portal →
            </motion.span>
          </div>
        </motion.a>

        {/* Online Fancy Light Store (Right) */}
        <motion.a
          href={FANCY_LIGHT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex flex-1 items-center justify-center overflow-hidden transition-colors focus:outline-none focus:ring-2 focus:ring-primary-main"
          initial={{ opacity: 0.9 }}
          whileHover={{ flex: 1.1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Illuminated portal background */}
          <div className="absolute inset-0 bg-gradient-to-bl from-primary-main/5 via-primary-main/10 to-primary-main/5 transition-colors duration-500 group-hover:via-primary-main/20" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(17,79,117,0.08)_0%,transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="relative z-10 text-center">
            <motion.h2
              className="text-primary-main text-3xl font-semibold tracking-tight md:text-5xl"
              whileHover={{ scale: 1.05 }}
            >
              Fancy Light Store
            </motion.h2>
            <p className="mt-4 text-foreground/70 md:text-xl">
              Online E‑Commerce
            </p>
            <motion.span
              className="mt-6 inline-block text-sm uppercase tracking-widest text-primary-main opacity-70"
              whileHover={{ opacity: 1 }}
            >
              Enter Portal →
            </motion.span>
          </div>
        </motion.a>
      </div>
    </section>
  );
}
