"use client";

import { motion } from "framer-motion";

// Replace with your actual brand URLs when available
const LIGHT_HOUSE_URL = "/catalogue";
const FANCY_LIGHT_URL = "/catalogue";

export function DualBrandSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      <div className="flex h-screen flex-col md:flex-row">
        {/* Light House - Left */}
        <motion.a
          href={LIGHT_HOUSE_URL}
          className="group relative flex flex-1 items-center justify-center overflow-hidden transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-primary-main focus:ring-inset"
          initial={{ opacity: 0.9 }}
          whileHover={{ flex: 1.15 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-sky-950/10 via-primary-main/8 to-primary-main/12" />
          {/* Hover reveal - radial glow + icon */}
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          >
            <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(14,165,233,0.12) 0%, rgba(17,79,117,0.06) 40%, transparent 70%)",
                filter: "blur(20px)",
              }}
            />
            <svg className="relative z-0 h-48 w-48 text-primary-main/10 md:h-64 md:w-64" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
          </div>
          {/* Animated portal - vignette/radial on hover */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(17,79,117,0.08) 100%)" }}
          />

          <div className="relative z-10 text-center">
            <motion.h2
              className="font-display text-primary-main text-2xl font-semibold tracking-tight sm:text-3xl md:text-5xl"
              whileHover={{ scale: 1.05 }}
            >
              Light House
            </motion.h2>
            <p className="mt-3 text-sm text-foreground/70 sm:text-base md:text-xl">Economy Range Lighting</p>
            <motion.span
              className="mt-6 inline-block text-sm uppercase tracking-widest text-primary-main/80 transition-colors duration-200 group-hover:text-primary-main"
            >
              Enter Portal →
            </motion.span>
          </div>
        </motion.a>

        {/* Beam divider - soft light beam */}
        <div className="relative flex w-2 shrink-0 items-center justify-center md:w-3" aria-hidden>
          <div
            className="absolute inset-0 w-full md:w-full"
            style={{
              background: "linear-gradient(180deg, transparent 0%, rgba(17,79,117,0.3) 15%, rgba(17,79,117,0.6) 50%, rgba(17,79,117,0.3) 85%, transparent 100%)",
              boxShadow: "0 0 32px rgba(17,79,117,0.5), 0 0 64px rgba(17,79,117,0.25)",
              filter: "blur(2px)",
            }}
          />
          <div
            className="absolute inset-0 w-px bg-gradient-to-b from-transparent via-primary-main/80 to-transparent"
            style={{ filter: "blur(0.5px)" }}
          />
        </div>

        {/* Fancy Light Store - Right */}
        <motion.a
          href={FANCY_LIGHT_URL}
          className="group relative flex flex-1 items-center justify-center overflow-hidden transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-amber-600/50 focus:ring-inset"
          initial={{ opacity: 0.9 }}
          whileHover={{ flex: 1.15 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute inset-0 bg-gradient-to-bl from-amber-950/12 via-amber-900/10 to-amber-800/8" />
          {/* Hover reveal - radial glow + fixture icon */}
          <div
            className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          >
            <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(245,158,11,0.1) 0%, rgba(217,119,6,0.05) 40%, transparent 70%)",
                filter: "blur(20px)",
              }}
            />
            <svg className="relative z-0 h-48 w-48 text-amber-700/10 md:h-64 md:w-64" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a6 6 0 00-6 6c0 2.5 1.5 4.5 3 5.5l3 3 3-3c1.5-1 3-3 3-5.5a6 6 0 00-6-6z" />
            </svg>
          </div>
          <div
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(217,119,6,0.06) 100%)" }}
          />

          <div className="relative z-10 text-center">
            <motion.h2
              className="font-display text-amber-800 text-2xl font-semibold tracking-tight sm:text-3xl md:text-5xl"
              whileHover={{ scale: 1.05 }}
            >
              Fancy Light Store
            </motion.h2>
            <p className="mt-3 text-sm text-foreground/70 sm:text-base md:text-xl">Online E‑Commerce</p>
            <motion.span
              className="mt-6 inline-block text-sm uppercase tracking-widest text-amber-700/80 transition-colors duration-200 group-hover:text-amber-700"
            >
              Enter Portal →
            </motion.span>
          </div>
        </motion.a>
      </div>
    </section>
  );
}
