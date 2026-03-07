"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function CTASection() {
  return (
    <section className="relative flex min-h-screen snap-center snap-always items-center justify-center overflow-hidden bg-background">
      {/* Subtle gradient - light from above */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-main/5 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(17,79,117,0.06)_0%,transparent_70%)]" />

      <div className="relative z-10 px-6 text-center">
        <motion.div
          className="mx-auto max-w-2xl"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="mb-8 text-3xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Architects & Designers
            <br />
            <span className="text-primary-main">Let&apos;s Collaborate</span>
          </h2>
          <p className="mb-12 text-lg text-foreground/70 md:text-xl">
            Bring your vision to light. Connect with our premium consultation
            team.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href="/architect-collaboration">
              <motion.span
                className="inline-flex items-center gap-3 rounded-full border-2 border-primary-main bg-primary-main px-10 py-4 text-base font-medium text-white transition-colors hover:bg-primary-main/90 focus:outline-none focus:ring-2 focus:ring-primary-main focus:ring-offset-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <span>Get in Touch</span>
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut",
                  }}
                >
                  →
                </motion.span>
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
