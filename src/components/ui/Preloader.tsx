"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PRELOADER_KEY = "luminart-preloader-shown";

export function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Skip preloader if already shown this session (for in-app navigation)
    if (typeof window !== "undefined" && sessionStorage.getItem(PRELOADER_KEY)) {
      setVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem(PRELOADER_KEY, "1");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Light pulse - expanding/contracting glow */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [0.8, 1.4, 1.2],
              opacity: [0.3, 0.6, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          >
            <div
              className="h-64 w-64 rounded-full md:h-96 md:w-96"
              style={{
                background:
                  "radial-gradient(circle, rgba(17, 79, 117, 0.2) 0%, rgba(17, 79, 117, 0.05) 40%, transparent 70%)",
                filter: "blur(40px)",
              }}
            />
          </motion.div>

          {/* Secondary softer pulse */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{
              scale: [1, 1.6, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: 0.3,
            }}
          >
            <div
              className="h-48 w-48 rounded-full md:h-72 md:w-72"
              style={{
                background:
                  "radial-gradient(circle, rgba(17, 79, 117, 0.15) 0%, transparent 60%)",
                filter: "blur(30px)",
              }}
            />
          </motion.div>

          {/* Brand text */}
          <motion.div
            className="relative z-10 text-center"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h1
              className="text-2xl font-semibold tracking-tight text-foreground md:text-4xl"
              style={{ color: "#114f75" }}
            >
              Lumin Art
            </h1>
            <motion.p
              className="mt-2 text-sm text-foreground/60 md:text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Luxury Lighting Studio
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
