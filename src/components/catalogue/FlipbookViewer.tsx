"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SCALE = 1.0;
const JPEG_QUALITY = 0.75;
const SWIPE_THRESHOLD_PX = 100;
const HORIZONTAL_BIAS = 2;
const LANDSCAPE_ASPECT_RATIO = "4 / 3";
const PORTRAIT_ASPECT_RATIO = "3 / 4";
const PAGE_LIMIT = (() => {
  const raw = process.env.NEXT_PUBLIC_PDF_PAGE_LIMIT;
  const n = raw ? Number(raw) : 0;
  return Number.isFinite(n) && n > 0 ? n : null;
})();

/** Detect iOS (iPhone/iPad) - includes Safari, Chrome, and all WebKit browsers on iOS. */
function isIOS(): boolean {
  return (
    typeof navigator !== "undefined" &&
    /iP(ad|hone|od)/.test(navigator.userAgent)
  );
}

/**
 * Decide how to load the PDF:
 * - iOS (all browsers): always proxy R2/B2 via /api/catalogue/pdf (avoids
 *   cross-origin PDF streaming issues that cause "keeps loading" on iPhone).
 * - Desktop/tablet: load R2 directly for speed; B2 still proxied.
 * - Other external URLs: proxy by full url.
 * - Relative URLs: use as-is.
 */
function getEffectivePdfUrl(pdfUrl: string): string {
  if (pdfUrl.startsWith("http://") || pdfUrl.startsWith("https://")) {
    try {
      const u = new URL(pdfUrl);
      const host = u.hostname.toLowerCase();
      const isR2 = host.endsWith(".r2.dev") || host.includes("r2.dev");
      const isB2 = host.includes("backblazeb2.com");
      const pathParts = u.pathname.split("/").filter(Boolean);
      const key = (() => {
        if (pathParts.length === 0) return null;
        // Backblaze B2 public URLs are typically: /file/<bucket>/<key...>
        if (isB2 && pathParts[0] === "file" && pathParts.length >= 3) {
          return pathParts.slice(2).join("/");
        }
        // R2 public/custom domain: key is simply the path without leading slash.
        return pathParts.join("/");
      })();

      // 1) iOS (Safari, Chrome, etc.): always proxy to avoid PDF streaming/CORS quirks.
      // Prefer the shorter `key=` form when possible (requires R2_PUBLIC_BASE_URL).
      if (isIOS()) {
        if ((isR2 || isB2) && key) {
          return `/api/catalogue/pdf?key=${encodeURIComponent(key)}`;
        }
        return `/api/catalogue/pdf?url=${encodeURIComponent(pdfUrl)}`;
      }

      // 2) Desktop/tablet: load R2 directly for speed
      if (isR2) {
        return pdfUrl;
      }

      // 3) Legacy B2 (non-mobile): use proxy
      if (isB2 && key) {
        return `/api/catalogue/pdf?key=${encodeURIComponent(key)}`;
      }
    } catch {
      // ignore and fall through to proxy by full url
    }

    // 3) Fallback for other external URLs
    return `/api/catalogue/pdf?url=${encodeURIComponent(pdfUrl)}`;
  }

  // 4) Relative / same-origin URLs
  return pdfUrl;
}

type FlipbookViewerProps = {
  pdfUrl: string;
  title: string;
};

export function FlipbookViewer({ pdfUrl, title }: FlipbookViewerProps) {
  const effectivePdfUrl = getEffectivePdfUrl(pdfUrl);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageCache, setPageCache] = useState<Record<number, string>>({});
  const [docReady, setDocReady] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [navDirection, setNavDirection] = useState<1 | -1>(1);
  const [error, setError] = useState<string | null>(null);
  const [loadingPage, setLoadingPage] = useState<number | null>(1);
  const pdfDocRef = useRef<import("pdfjs-dist").PDFDocumentProxy | null>(null);
  const loadedPagesRef = useRef<Set<number>>(new Set());
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const isHorizontalSwipe = useRef(false);
  const viewerRef = useRef<HTMLDivElement>(null);

  const loadPage = useCallback(
    async (pageNum: number): Promise<string | null> => {
      if (pageNum < 1 || pageNum > totalPages) return null;

      const doc = pdfDocRef.current;
      if (!doc) return null;

      const page = await doc.getPage(pageNum);
      const viewport = page.getViewport({ scale: SCALE });
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext: ctx, viewport, canvas }).promise;
      const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
      return dataUrl;
    },
    [totalPages]
  );

  const ensurePage = useCallback(
    async (pageNum: number, isCurrentPage: boolean) => {
      if (loadedPagesRef.current.has(pageNum)) return;
      if (isCurrentPage) setLoadingPage(pageNum);
      const objectUrl = await loadPage(pageNum);
      if (objectUrl) {
        loadedPagesRef.current.add(pageNum);
        setPageCache((prev) => ({ ...prev, [pageNum]: objectUrl }));
      } else if (isCurrentPage) {
        setError("Catalogue PDF not available.");
      }
      if (isCurrentPage) setLoadingPage(null);
    },
    [loadPage]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Use legacy build on iOS - standard build uses Map.getOrInsertComputed,
        // Promise.withResolvers, etc. which Safari < 26 doesn't support.
        const pdfjsLib = isIOS()
          ? await import("pdfjs-dist/legacy/build/pdf.mjs")
          : await import("pdfjs-dist");
        if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
          pdfjsLib.GlobalWorkerOptions.workerSrc = isIOS()
            ? "/pdf.worker.legacy.min.mjs"
            : "/pdf.worker.min.mjs";
        }
        const doc = await pdfjsLib.getDocument(effectivePdfUrl).promise;
        if (cancelled) return;
        pdfDocRef.current = doc;
        try {
          const firstPage = await doc.getPage(1);
          if (!cancelled) {
            const firstPageViewport = firstPage.getViewport({ scale: 1 });
            setIsLandscape(firstPageViewport.width >= firstPageViewport.height);
          }
        } catch {
          if (!cancelled) setIsLandscape(false);
        }
        const numPages = PAGE_LIMIT ? Math.min(doc.numPages, PAGE_LIMIT) : doc.numPages;
        setTotalPages(numPages);
        setDocReady(true);
      } catch (e) {
        if (!cancelled) {
          console.warn("PDF load failed:", e);
          setError("Catalogue PDF not available.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [effectivePdfUrl]);

  useEffect(() => {
    if (!docReady || error) return;
    ensurePage(currentPage, true);
    if (currentPage > 1) ensurePage(currentPage - 1, false);
    if (currentPage < totalPages) ensurePage(currentPage + 1, false);
  }, [docReady, error, currentPage, totalPages, ensurePage]);

  const goPrev = () => {
    setNavDirection(-1);
    setCurrentPage((p) => Math.max(1, p - 1));
  };
  const goNext = () => {
    setNavDirection(1);
    setCurrentPage((p) => Math.min(totalPages, p + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!e.touches[0]) return;
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    isHorizontalSwipe.current = false;
  };

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStart.current || !e.touches[0]) return;
    const start = touchStart.current;
    const touch = e.touches[0];
    const deltaX = Math.abs(start.x - touch.clientX);
    const deltaY = Math.abs(start.y - touch.clientY);
    if (deltaX > 20 && deltaX >= HORIZONTAL_BIAS * deltaY) {
      isHorizontalSwipe.current = true;
    }
    if (isHorizontalSwipe.current) {
      e.preventDefault();
    }
  }, []);

  useEffect(() => {
    const el = viewerRef.current;
    if (!el) return;
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => el.removeEventListener("touchmove", handleTouchMove);
  }, [handleTouchMove]);

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current || !e.changedTouches[0]) return;
    const start = touchStart.current;
    const endTouch = e.changedTouches[0];
    const deltaX = start.x - endTouch.clientX;
    const deltaY = start.y - endTouch.clientY;
    touchStart.current = null;

    // Require longer horizontal swipe and horizontal >> vertical (avoids scroll-up triggering flip)
    if (
      Math.abs(deltaX) < SWIPE_THRESHOLD_PX ||
      Math.abs(deltaX) < HORIZONTAL_BIAS * Math.abs(deltaY)
    ) {
      return;
    }

    if (deltaX > 0) {
      goNext();
    } else {
      goPrev();
    }
  };

  const handleTouchCancel = () => {
    touchStart.current = null;
    isHorizontalSwipe.current = false;
  };

  const currentImage = pageCache[currentPage];
  const isPageLoading = loadingPage !== null && !currentImage;
  const containerAspectRatio = isLandscape ? LANDSCAPE_ASPECT_RATIO : PORTRAIT_ASPECT_RATIO;
  const containerMaxWidthClassName = isLandscape ? "max-w-6xl" : "max-w-4xl";

  return (
    <div className={`mx-auto w-full ${containerMaxWidthClassName} px-0 sm:px-2`}>
      <div
        ref={viewerRef}
        className="relative flex min-h-[260px] w-full max-w-full items-center justify-center overflow-hidden rounded-xl bg-foreground/5"
        style={{
          aspectRatio: containerAspectRatio,
          maxHeight: "min(76vh, calc(100svh - 220px))",
        }}
      >
        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center gap-4 p-6 text-center sm:p-12"
            >
              <p className="text-foreground/70">{error}</p>
              <p className="text-sm text-foreground/50">
                This catalogue will be available once the admin uploads the PDF.
              </p>
              <div className="mt-4 flex gap-4">
                {[...Array(6).keys()].map((i) => (
                  <div
                    key={i}
                    className="h-24 w-16 rounded border border-foreground/10 bg-foreground/5"
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: navDirection === 1 ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: navDirection === 1 ? -20 : 20 }}
              transition={{ duration: 0.3 }}
              className="flex h-full min-h-0 w-full items-center justify-center p-4 sm:p-6 md:p-8 cursor-grab active:cursor-grabbing"
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchCancel}
            >
              {currentImage ? (
                // eslint-disable-next-line @next/next/no-img-element -- data URL from PDF.js canvas
                <img
                  src={currentImage}
                  alt={`Page ${currentPage} of ${title}`}
                  className="max-h-full max-w-full object-contain shadow-lg"
                  onTouchStart={handleTouchStart}
                />
              ) : isPageLoading ? (
                <div className="flex h-3/4 w-3/4 items-center justify-center rounded-lg border border-foreground/10 bg-foreground/5">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-main border-t-transparent" />
                </div>
              ) : (
                <div className="flex h-3/4 w-3/4 items-center justify-center rounded-lg border border-foreground/10 bg-foreground/5 text-foreground/40">
                  Page {currentPage}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!error && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 sm:mt-6 sm:gap-4">
          <button
            onClick={goPrev}
            disabled={currentPage <= 1}
            className="rounded-lg border border-foreground/20 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-40 sm:px-6 sm:py-2 sm:text-base"
          >
            ← Previous
          </button>
          <span className="text-sm text-foreground/70">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={goNext}
            disabled={currentPage >= totalPages}
            className="rounded-lg border border-foreground/20 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-40 sm:px-6 sm:py-2 sm:text-base"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
