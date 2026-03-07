"use client";

import { useScroll, useTransform, motion } from "framer-motion";

export function LightRays() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [0.4, 0.6, 0.5, 0.3, 0.2]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[50] overflow-hidden"
      style={{ opacity }}
    >
      <motion.div
        className="absolute -left-1/2 -top-1/2 h-[150vh] w-[200vw] origin-top"
        style={{ y, scale }}
      >
        <svg
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMin slice"
          viewBox="0 0 800 400"
        >
          <defs>
            <linearGradient
              id="rayGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="rgba(17, 79, 117, 0.08)" />
              <stop offset="50%" stopColor="rgba(17, 79, 117, 0.03)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          {[...Array(12)].map((_, i) => {
            const angle = (i / 12) * 180 - 90;
            const x1 = 400 + Math.cos((angle * Math.PI) / 180) * 0;
            const y1 = 0;
            const x2 = 400 + Math.cos((angle * Math.PI) / 180) * 600;
            const y2 = 400 + Math.sin((angle * Math.PI) / 180) * 600;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="url(#rayGradient)"
                strokeWidth="1"
              />
            );
          })}
        </svg>
      </motion.div>
    </motion.div>
  );
}
