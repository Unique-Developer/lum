"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const Hero3DCanvas = dynamic(
  () =>
    import("@/components/scenes/Hero3DCanvas").then((mod) => mod.Hero3DCanvas),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-background" />,
  }
);

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      {/* 3D Canvas - full screen background */}
      <div className="absolute inset-0 z-0">
        <Hero3DCanvas />
      </div>

      {/* Text overlay */}
      <div className="relative z-10 px-6 text-center">
        <motion.h1
          className="mb-4 text-center text-4xl font-semibold tracking-tight text-foreground md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          Light is not a product.
          <br />
          <span className="text-primary-main">It is an experience.</span>
        </motion.h1>
        <motion.p
          className="text-primary-main text-xl font-medium md:text-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Lumin Art — Luxury Lighting Studio
        </motion.p>
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
          <span className="text-xs uppercase tracking-widest text-foreground/60">
            Scroll
          </span>
          <div className="h-10 w-px bg-gradient-to-b from-primary-main to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
