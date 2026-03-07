"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SCALE = 1.2;
const JPEG_QUALITY = 0.8;

type FlipbookViewerProps = {
  pdfUrl: string;
  pageCount: number;
  title: string;
};

/**
 * Use same-origin proxy for external PDF URLs to avoid CORS on mobile.
 * B2 URLs fail on mobile Safari due to strict CORS; proxying fixes this.
 */
function getEffectivePdfUrl(pdfUrl: string): string {
  if (pdfUrl.startsWith("http://") || pdfUrl.startsWith("https://")) {
    return `/api/catalogue/pdf?url=${encodeURIComponent(pdfUrl)}`;
  }
  return pdfUrl;
}

export function FlipbookViewer({ pdfUrl, pageCount, title }: FlipbookViewerProps) {
  const effectivePdfUrl = getEffectivePdfUrl(pdfUrl);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCache, setPageCache] = useState<Record<number, string>>({});
  const [docReady, setDocReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingPage, setLoadingPage] = useState<number | null>(1);
  const pdfDocRef = useRef<import("pdfjs-dist").PDFDocumentProxy | null>(null);
  const loadedPagesRef = useRef<Set<number>>(new Set());

  const totalPages = Math.min(pageCount, 50);

  const loadPage = useCallback(
    async (pageNum: number): Promise<string | null> => {
      if (pageNum < 1 || pageNum > totalPages) return null;

      const pdfjsLib = await import("pdfjs-dist");
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        // Use jsDelivr which mirrors the installed npm version of pdfjs-dist
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
      }

      let doc = pdfDocRef.current;
      if (!doc) {
        try {
          doc = await pdfjsLib.getDocument(effectivePdfUrl).promise;
          pdfDocRef.current = doc;
        } catch (e) {
          console.warn("PDF load failed:", e);
          setError("Catalogue PDF not available.");
          return null;
        }
      }

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
    [effectivePdfUrl, totalPages]
  );

  const ensurePage = useCallback(
    async (pageNum: number, isCurrentPage: boolean) => {
      if (loadedPagesRef.current.has(pageNum)) return;
      if (isCurrentPage) setLoadingPage(pageNum);
      const dataUrl = await loadPage(pageNum);
      if (dataUrl) {
        loadedPagesRef.current.add(pageNum);
        setPageCache((prev) => ({ ...prev, [pageNum]: dataUrl }));
      }
      if (isCurrentPage) setLoadingPage(null);
    },
    [loadPage]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
        const doc = await pdfjsLib.getDocument(effectivePdfUrl).promise;
        if (cancelled) return;
        pdfDocRef.current = doc;
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

  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  const currentImage = pageCache[currentPage];
  const isLoading = !docReady && !error;
  const isPageLoading = loadingPage !== null && !currentImage;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary-main border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-0 sm:px-2">
      <div
        className="relative flex min-h-[280px] w-full max-w-full items-center justify-center overflow-hidden rounded-xl bg-foreground/5"
        style={{
          aspectRatio: "3/4",
          maxHeight: "min(70vh, calc(100svh - 280px))",
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
                {[...Array(Math.min(pageCount, 6)).keys()].map((i) => (
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex h-full min-h-0 w-full items-center justify-center p-4 sm:p-6 md:p-8"
            >
              {currentImage ? (
                // eslint-disable-next-line @next/next/no-img-element -- data URL from PDF.js canvas
                <img
                  src={currentImage}
                  alt={`Page ${currentPage} of ${title}`}
                  className="max-h-full max-w-full object-contain shadow-lg"
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
            className="rounded-lg border border-foreground/20 px-6 py-2 font-medium text-foreground transition-colors hover:bg-foreground/5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <span className="text-sm text-foreground/70">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={goNext}
            disabled={currentPage >= totalPages}
            className="rounded-lg border border-foreground/20 px-6 py-2 font-medium text-foreground transition-colors hover:bg-foreground/5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
