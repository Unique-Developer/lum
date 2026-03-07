"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const HERO_FIXTURE_PATH = "/hero-fixture2.jpg"; // Add your fixture image to public/

export function HeroSection() {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleMove = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      {/* Hero-specific subtle light rays */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <svg className="absolute inset-0 h-full w-full opacity-30" preserveAspectRatio="xMidYMin slice" viewBox="0 0 800 600">
          <defs>
            <linearGradient id="heroRayGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(17, 79, 117, 0.12)" />
              <stop offset="60%" stopColor="rgba(17, 79, 117, 0.04)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          {[...Array(14)].map((_, i) => {
            const angle = (i / 14) * 160 - 80;
            const rad = (angle * Math.PI) / 180;
            return (
              <line key={i} x1="400" y1="0" x2={400 + Math.cos(rad) * 800} y2={600 + Math.sin(rad) * 600} stroke="url(#heroRayGrad)" strokeWidth="1" />
            );
          })}
        </svg>
      </div>

      {/* Cursor-reactive glow (hero only) */}
      {mounted && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="absolute h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[60px]"
            style={{
              left: cursor.x,
              top: cursor.y,
              background: "radial-gradient(circle, rgba(17, 79, 117, 0.08) 0%, rgba(17, 79, 117, 0.03) 40%, transparent 70%)",
            }}
          />
        </motion.div>
      )}

      {/* Subtle animated background */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,_rgba(17,79,117,0.25),_transparent_55%)]" />

      {/* Main content - flex-1, scrollable if needed on small screens */}
      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-12 pb-20 sm:px-6 sm:py-16 sm:pb-24 md:py-20 md:pb-28">
        <div className="flex w-full max-w-4xl flex-col items-center text-center">
          <motion.h1
            className="font-display mb-3 text-3xl font-semibold tracking-tight text-foreground sm:mb-4 sm:text-5xl md:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            Light is not a product.
            <br />
            <span className="text-primary-main">It is an experience.</span>
          </motion.h1>
          <motion.p
            className="font-display text-primary-main text-base font-medium sm:text-xl md:text-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Lumin Art — Luxury Lighting Studio
          </motion.p>

          {/* Product teaser - hero fixture with ambient glow */}
          <HeroFixtureTeaser />
        </div>
      </div>

      {/* Scroll indicator - fixed at bottom, never overlaps content */}
      <motion.div
        className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 sm:bottom-6 md:bottom-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2 rounded-full bg-background/60 px-4 py-2 backdrop-blur-sm"
          animate={{ y: [0, 6, 0] }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut",
          }}
        >
          <span className="text-[10px] font-medium uppercase tracking-widest text-foreground/70 sm:text-xs">
            Scroll
          </span>
          <div className="h-8 w-px bg-gradient-to-b from-primary-main/80 to-transparent sm:h-10" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function HeroFixtureTeaser() {
  const [imgError, setImgError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <motion.div
      className="relative z-[5] mx-auto mt-6 max-w-[min(calc(100vw-2rem),380px)] sm:mt-8 sm:max-w-[420px] md:mt-10 md:mb-4 md:max-w-[480px]"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Outer ambient glow */}
      <div
        className="absolute -inset-8 rounded-full opacity-60"
        style={{
          background: "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(17,79,117,0.2) 0%, rgba(17,79,117,0.06) 40%, transparent 70%)",
          filter: "blur(24px)",
        }}
        aria-hidden
      />
      {/* Inner soft glow ring */}
      <div
        className="absolute -inset-4 rounded-2xl opacity-80"
        style={{
          background: "radial-gradient(ellipse 90% 90% at 50% 50%, rgba(17,79,117,0.15) 0%, transparent 60%)",
          filter: "blur(16px)",
        }}
        aria-hidden
      />
      <Link href="/catalogue" className="group block">
        <div className="relative overflow-hidden rounded-2xl border border-primary-main/10 bg-background/40 shadow-[0_0_60px_rgba(17,79,117,0.15),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-sm transition-all duration-500 group-hover:border-primary-main/25 group-hover:shadow-[0_0_80px_rgba(17,79,117,0.2),inset_0_1px_0_rgba(255,255,255,0.08)]">
        {!imgError ? (
            <Image
            src={HERO_FIXTURE_PATH}
            alt="Luxury lighting fixture — view catalogue"
            width={480}
            height={360}
            className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            priority
            sizes="(max-width: 768px) 90vw, 480px"
            onError={() => setImgError(true)}
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgwIiBoZWlnaHQ9IjM2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+"
          />
        ) : (
          <div
            className="aspect-[4/3] w-full bg-gradient-to-b from-primary-main/10 to-primary-main/5"
            aria-hidden
          >
            <div className="flex h-full items-center justify-center">
              <svg className="h-24 w-24 text-primary-main/20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.75} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        )}
        </div>
      </Link>
    </motion.div>
  );
}
