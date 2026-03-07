"use client";

import { motion } from "framer-motion";

const PILLARS = [
  {
    title: "Architectural Lighting",
    description: "Designed for spaces that demand precision and atmosphere.",
    icon: "architectural",
  },
  {
    title: "Technical Lighting",
    description: "Engineered solutions for performance and longevity.",
    icon: "technical",
  },
  {
    title: "Customized Fancy Lights",
    description: "Bespoke fixtures tailored to your vision.",
    icon: "customized",
  },
  {
    title: "Premium Consultation",
    description: "Expert guidance from concept to installation.",
    icon: "consultation",
  },
];

function PillarIcon({ type }: { type: string }) {
  const className = "h-8 w-8 shrink-0 text-primary-main/70 transition-colors group-hover:text-primary-main sm:h-10 sm:w-10";
  switch (type) {
    case "architectural":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      );
    case "technical":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      );
    case "customized":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>
      );
    case "consultation":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
      );
    default:
      return null;
  }
}

export function WhatIsLuminArtSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background py-16 sm:py-24 md:py-32">
      {/* Subtle beam rays from center - diverging lines */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-20">
        <svg className="absolute left-1/2 top-0 h-full w-full -translate-x-1/2" preserveAspectRatio="xMidYMin slice" viewBox="0 0 800 600">
          <defs>
            <linearGradient id="pillarRay" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="rgba(17,79,117,0.15)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          {[...Array(12)].map((_, i) => {
            const angle = (i / 12) * 180 - 90;
            const rad = (angle * Math.PI) / 180;
            return (
              <line
                key={i}
                x1="400"
                y1="100"
                x2={400 + Math.cos(rad) * 600}
                y2={600 + Math.sin(rad) * 600}
                stroke="url(#pillarRay)"
                strokeWidth="0.5"
              />
            );
          })}
        </svg>
      </div>

      <div className="pointer-events-none absolute inset-0 z-0 opacity-40 bg-gradient-to-b from-primary-main/10 via-transparent to-primary-main/5" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          className="mb-16 text-center md:mb-24"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-display mb-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-b from-foreground to-foreground/80 bg-clip-text text-transparent">Lumin Art</span>
          </h2>
          <p className="font-display text-primary-main text-xl font-medium md:text-2xl">Luxury Lighting Experience Studio</p>
        </motion.div>

        {/* Bento layout: 1 large (2x2), 2 medium, 1 wide */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 lg:gap-5">
          {PILLARS.map((pillar, i) => {
            const isLarge = i === 0;
            const isWide = i === 3;
            return (
              <motion.div
                key={pillar.title}
                className={`group relative flex overflow-hidden rounded-2xl border border-primary-main/15 bg-background/70 backdrop-blur-sm transition-all duration-300 hover:border-primary-main/35 hover:shadow-[0_0_40px_rgba(17,79,117,0.12),0_0_80px_rgba(17,79,117,0.06)] ${
                  isLarge ? "lg:col-span-2 lg:row-span-2 lg:flex-col lg:justify-center" : ""
                } ${isWide ? "lg:col-span-2" : ""}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-main/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className={`relative flex w-full flex-col p-6 md:p-8`}>
                  <div className="mb-4">
                    <PillarIcon type={pillar.icon} />
                  </div>
                  <div>
                    <div className="mb-3 h-px w-12 bg-primary-main/50 transition-all duration-300 group-hover:w-16 group-hover:bg-primary-main group-hover:shadow-[0_0_8px_rgba(17,79,117,0.4)]" />
                    <h3 className={`font-display font-semibold text-foreground ${isLarge ? "text-xl md:text-2xl lg:text-3xl" : "text-lg md:text-xl"}`}>
                      {pillar.title}
                    </h3>
                    <p className={`mt-3 text-foreground/70 ${isLarge ? "text-base md:text-lg" : "text-sm md:text-base"}`}>
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
