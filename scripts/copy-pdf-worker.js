#!/usr/bin/env node
/**
 * Copies PDF.js workers from node_modules to public/ for same-origin serving.
 * - Standard worker: desktop/Android
 * - Legacy worker: iOS (avoids Map.getOrInsertComputed, Promise.withResolvers, etc.)
 * Runs automatically after npm install.
 */
const fs = require("fs");
const path = require("path");

const base = path.join(__dirname, "..", "node_modules", "pdfjs-dist");
const publicDir = path.join(__dirname, "..", "public");

const workers = [
  { src: path.join(base, "build", "pdf.worker.min.mjs"), dest: "pdf.worker.min.mjs" },
  { src: path.join(base, "legacy", "build", "pdf.worker.min.mjs"), dest: "pdf.worker.legacy.min.mjs" },
];

fs.mkdirSync(publicDir, { recursive: true });
for (const { src, dest } of workers) {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(publicDir, dest));
    console.log(`copy-pdf-worker: copied ${dest} to public/`);
  } else {
    console.warn(`copy-pdf-worker: ${path.basename(src)} not found, skipping`);
  }
}
