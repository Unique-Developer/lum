 "use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { HomepageContent } from "@/lib/homepage";

export function HeroSection({ content }: { content: HomepageContent["hero"] }) {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      {/* Hero project image */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          src={content.heroImage}
          alt={content.heroImageAlt}
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(17,79,117,0.25),_transparent_55%)]" />
      </div>

      {/* Text + CTAs */}
      <div className="relative z-10 px-6 text-center">
        <motion.h1
          className="mb-4 text-center text-4xl font-semibold tracking-tight text-white md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {content.headline}
        </motion.h1>
        <motion.p
          className="mx-auto max-w-2xl text-lg text-white/80 md:text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {content.subtext}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link href="/lighting-solutions">
            <motion.span
              className="inline-flex items-center gap-2 rounded-full border-2 border-primary-main bg-primary-main px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-main/90 focus:outline-none focus:ring-2 focus:ring-primary-main focus:ring-offset-2 focus:ring-offset-background"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              {content.ctaExploreProjects}
              <span>→</span>
            </motion.span>
          </Link>
          <Link href="/architect-collaboration">
            <motion.span
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/35 bg-white/5 px-8 py-3 text-sm font-medium text-white transition-colors hover:border-white/60 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary-main focus:ring-offset-2 focus:ring-offset-background"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              {content.ctaStartProject}
            </motion.span>
          </Link>
        </motion.div>
      </div>

      {/* Smooth scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut",
          }}
        >
          <span className="text-xs uppercase tracking-widest text-foreground/85">
            {content.scrollLabel}
          </span>
          <div className="h-10 w-px bg-gradient-to-b from-primary-main to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
