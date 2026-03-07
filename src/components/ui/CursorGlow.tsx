"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CursorGlow() {
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isHoverable, setIsHoverable] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Only enable on devices that support hover (not touch-primary)
    const hoverMedia = window.matchMedia("(hover: hover)");
    setIsHoverable(hoverMedia.matches);

    const handleMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  if (!mounted || !isHoverable) return null;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[60]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.8, duration: 0.5 }}
    >
      <motion.div
        className="absolute h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          left: pos.x,
          top: pos.y,
          background:
            "radial-gradient(circle, rgba(17, 79, 117, 0.09) 0%, rgba(17, 79, 117, 0.04) 35%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />
    </motion.div>
  );
}
