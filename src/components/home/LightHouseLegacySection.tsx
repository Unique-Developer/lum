"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const MILESTONES = [
  { year: "2001", title: "Founded", text: "Light House began its journey 23 years ago." },
  { year: "2008", title: "Economy Leader", text: "Became a leader in economy range lighting solutions." },
  { year: "2015", title: "Trusted Partner", text: "Trusted by architects, electricians, and builders nationwide." },
  { year: "2020", title: "Service Excellence", text: "Expanded after-sales service and support network." },
  { year: "2024", title: "Lumin Art", text: "Launching the luxury lighting studio experience.", highlight: true },
];

export function LightHouseLegacySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgOpacity = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 1, 0]);
  const pathReveal = useTransform(scrollYProgress, [0.1, 0.4, 0.7, 0.95], [0, 0.25, 0.6, 1]);

  return (
    <section ref={sectionRef} className="relative overflow-x-clip bg-background pt-4 md:min-h-[200vh] md:pt-0">
      <div className="md:sticky md:top-0 md:h-screen">
        {/* Ambient background - scroll-reactive */}
        <div className="absolute inset-0">
          <motion.div
            style={{ opacity: bgOpacity }}
            className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(17,79,117,0.15),transparent_65%)]"
          />
          <div
            className="absolute left-1/2 top-0 h-full w-[300px] -translate-x-1/2 md:w-[500px]"
            style={{
              background: "radial-gradient(ellipse 40% 80% at 50% 50%, rgba(17,79,117,0.25) 0%, transparent 70%)",
              filter: "blur(50px)",
            }}
          />
        </div>

        <div className="relative flex min-h-0 items-center justify-center overflow-x-visible overflow-y-auto px-6 py-16 sm:px-8 md:absolute md:inset-0 md:overflow-visible md:px-12 md:py-0">
          <div className="w-full max-w-4xl min-w-0">
            <motion.div
              className="mb-8 overflow-visible text-center sm:mb-10 md:mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl md:px-4">
                Light House Legacy
              </h2>
              <p className="mt-3 text-base text-foreground/75 sm:text-lg md:text-xl">
                23 years of illuminating spaces · Trusted by architects, electricians, builders
              </p>
            </motion.div>

            {/* Light path - beam that reveals as you scroll */}
            <div className="relative mx-auto max-w-2xl">
              {/* Vertical beam - full track (subtle) */}
              <div className="absolute left-4 top-0 bottom-0 w-px sm:left-6 md:left-8" aria-hidden>
                <div
                  className="absolute inset-0 w-16 -translate-x-1/2 sm:w-20 md:w-28"
                  style={{
                    background: "linear-gradient(180deg, transparent 0%, rgba(17,79,117,0.08) 10%, rgba(17,79,117,0.15) 50%, rgba(17,79,117,0.08) 90%, transparent 100%)",
                    filter: "blur(16px)",
                  }}
                />
                <div className="absolute inset-0 w-px bg-gradient-to-b from-transparent via-primary-main/30 to-transparent" />
                {/* Animated fill - light travels down the path as you scroll */}
                <motion.div
                  className="absolute left-0 top-0 w-px bg-gradient-to-b from-primary-main/60 via-primary-main to-primary-main/80"
                  style={{
                    height: "100%",
                    scaleY: pathReveal,
                    transformOrigin: "top",
                  }}
                />
                <motion.div
                  className="absolute left-1/2 top-0 w-8 -translate-x-1/2 sm:w-12 md:w-16"
                  style={{
                    height: "100%",
                    background: "linear-gradient(180deg, rgba(17,79,117,0.2) 0%, rgba(17,79,117,0.35) 50%, rgba(17,79,117,0.2) 100%)",
                    filter: "blur(12px)",
                    scaleY: pathReveal,
                    transformOrigin: "top",
                  }}
                />
              </div>

              <div className="flex flex-col gap-3 sm:gap-4">
                {MILESTONES.map((m, i) => (
                  <MilestoneRow key={m.year} m={m} i={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MilestoneRow({ m, i }: { m: (typeof MILESTONES)[0]; i: number }) {
  return (
    <motion.div
      className="relative flex min-h-0 items-center gap-4 sm:gap-6"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px", amount: 0.3 }}
      transition={{ delay: 0.05 * i, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative z-10 flex w-8 shrink-0 justify-center sm:w-12 md:w-16">
        <motion.div
          className="flex h-3 w-3 shrink-0 items-center justify-center rounded-full border-2 border-primary-main/80 bg-background shadow-[0_0_12px_rgba(17,79,117,0.5),0_0_24px_rgba(17,79,117,0.3)] sm:h-3.5 sm:w-3.5 md:h-4 md:w-4"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ delay: 0.08 * i, type: "spring", stiffness: 200 }}
        >
          <div className="h-1.5 w-1.5 rounded-full bg-primary-main sm:h-2 sm:w-2" />
        </motion.div>
      </div>
      <div className="min-w-0 flex-1">
        <div
          className={`group relative overflow-hidden rounded-xl border border-primary-main/25 bg-background/95 px-4 py-3 backdrop-blur-md transition-all duration-300 hover:border-primary-main/50 hover:shadow-[0_0_36px_rgba(17,79,117,0.2),0_0_72px_rgba(17,79,117,0.1)] sm:rounded-2xl sm:px-5 sm:py-4 ${
            m.highlight ? "ring-1 ring-primary-main/40" : ""
          }`}
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-main/[0.07] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative">
            <span className="font-display text-primary-main text-xs font-semibold tracking-wide">{m.year}</span>
            <h3 className="font-display mt-0.5 text-sm font-semibold text-foreground sm:mt-1 sm:text-base md:text-lg">{m.title}</h3>
            <p className="mt-0.5 text-xs leading-relaxed text-foreground/70 sm:mt-1 sm:text-sm">{m.text}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
