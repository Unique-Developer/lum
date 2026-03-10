import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  listR2Objects,
  urlToR2Key,
  isR2Configured,
} from "@/lib/r2";
import { readCatalogues, readBlogPosts } from "@/lib/storage";

const PREFIXES = ["catalogue/", "posts/"];

/** Extract img src URLs from HTML content */
function extractImgUrls(html: string): string[] {
  const urls: string[] = [];
  const regex = /<img[^>]+src=["']([^"']+)["']/gi;
  let m;
  while ((m = regex.exec(html)) !== null) {
    urls.push(m[1]);
  }
  return urls;
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!isR2Configured()) {
    return NextResponse.json(
      { error: "R2 storage not configured. Set R2_* env variables." },
      { status: 503 }
    );
  }

  try {
    const [catalogues, posts] = await Promise.all([
      readCatalogues(),
      readBlogPosts(),
    ]);

    const usedKeys = new Set<string>();

    for (const c of catalogues) {
      if (c.coverImage) {
        const k = urlToR2Key(c.coverImage);
        if (k) usedKeys.add(k);
      }
      if (c.pdfUrl) {
        const k = urlToR2Key(c.pdfUrl);
        if (k) usedKeys.add(k);
      }
    }

    for (const p of posts) {
      if (p.thumbnail) {
        const k = urlToR2Key(p.thumbnail);
        if (k) usedKeys.add(k);
      }
      for (const m of p.media ?? []) {
        const k = urlToR2Key(m.url);
        if (k) usedKeys.add(k);
      }
      for (const url of extractImgUrls(p.content ?? "")) {
        const k = urlToR2Key(url);
        if (k) usedKeys.add(k);
      }
    }

    const allObjects: { key: string; size: number; lastModified?: string }[] = [];

    for (const prefix of PREFIXES) {
      const objs = await listR2Objects(prefix);
      for (const o of objs) {
        allObjects.push({
          key: o.key,
          size: o.size,
          lastModified: o.lastModified?.toISOString(),
        });
      }
    }

    const unused = allObjects.filter((o) => !usedKeys.has(o.key));
    const usedCount = allObjects.length - unused.length;
    const totalSize = allObjects.reduce((s, o) => s + o.size, 0);
    const unusedSize = unused.reduce((s, o) => s + o.size, 0);

    return NextResponse.json({
      used: usedCount,
      unused: unused.length,
      totalSize,
      unusedSize,
      unusedFiles: unused.sort((a, b) => a.key.localeCompare(b.key)),
    });
  } catch (e) {
    console.error("Storage unused analysis error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Analysis failed" },
      { status: 500 }
    );
  }
}
