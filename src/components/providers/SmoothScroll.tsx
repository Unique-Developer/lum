"use client";

import { useEffect, useRef, ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

interface SmoothScrollProps {
  children: ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const isTouchOrMobile =
      typeof window !== "undefined" &&
      (window.matchMedia("(pointer: coarse)").matches ||
        window.matchMedia("(max-width: 768px)").matches);

    if (isTouchOrMobile) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const pathname = usePathname();
  useEffect(() => {
    if (typeof window !== "undefined") {
      history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    const scrollToTop = () => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true, force: true });
      } else {
        window.scrollTo(0, 0);
      }
    };
    scrollToTop();
  }, [pathname]);

  return <>{children}</>;
}
