"use client";

import { useScroll, useTransform, motion } from "framer-motion";

export function ScrollDimming() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.4, 0.65, 0.9, 1], [0, 0.02, 0.05, 0.04, 0.03, 0.02]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[45]"
      style={{ opacity }}
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, transparent 0%, rgba(17,79,117,0.04) 30%, rgba(17,79,117,0.06) 60%, rgba(17,79,117,0.03) 100%)",
        }}
      />
    </motion.div>
  );
}
