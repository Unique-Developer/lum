"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export function ParallaxSection({
  children,
  className = "",
  strength = 0.12,
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(true); // Default true to avoid hydration flash

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = () => setIsMobile(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [40 * strength, 0, -40 * strength]
  );

  if (isMobile) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}
