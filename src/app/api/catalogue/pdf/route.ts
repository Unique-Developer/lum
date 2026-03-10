import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy API for catalogue PDFs.
 * Fetches PDF from storage (R2/B2, cross-origin) server-side and streams it to the client.
 * This avoids CORS issues on mobile Safari and other strict browsers.
 *
 * Accepts either:
 * - url: full storage URL (can be truncated on some mobile proxies)
 * - key: object key only (shorter; uses R2_PUBLIC_BASE_URL)
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  let targetUrl: string | null = null;

  const urlParam = params.get("url");
  const keyParam = params.get("key");
  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL;

  if (urlParam && typeof urlParam === "string" && urlParam.startsWith("http")) {
    targetUrl = urlParam;
  } else if (keyParam && typeof keyParam === "string" && publicBaseUrl) {
    const base = publicBaseUrl.replace(/\/$/, "");
    const key = keyParam.replace(/^\//, "");
    targetUrl = `${base}/${key}`;
  }

  if (!targetUrl) {
    return NextResponse.json(
      { error: "Missing url or key parameter. For key, set R2_PUBLIC_BASE_URL." },
      { status: 400 }
    );
  }

  try {
    const parsed = new URL(targetUrl);
    const host = parsed.hostname.toLowerCase();

    // Only allow R2 (r2.dev, custom domain) or legacy B2 URLs
    const isR2 = host.endsWith(".r2.dev") || host.includes("r2.dev");
    const isB2 = host.endsWith(".backblazeb2.com") || host === "backblazeb2.com";
    let isCustomDomain = false;
    const baseUrl = process.env.R2_PUBLIC_BASE_URL;
    if (baseUrl) {
      try {
        isCustomDomain = new URL(baseUrl).hostname === host;
      } catch {
        /* ignore */
      }
    }
    if (!isR2 && !isB2 && !isCustomDomain) {
      return NextResponse.json({ error: "Invalid url" }, { status: 403 });
    }

    const res = await fetch(targetUrl, {
      headers: { "User-Agent": "LuminArt-Catalogue-Viewer/1.0" },
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream returned ${res.status}` },
        { status: res.status }
      );
    }

    const contentType = res.headers.get("content-type") ?? "application/pdf";
    const buffer = await res.arrayBuffer();
    if (!buffer || buffer.byteLength === 0) {
      return NextResponse.json({ error: "No body" }, { status: 502 });
    }

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (e) {
    console.warn("PDF proxy error:", e);
    return NextResponse.json(
      { error: "Failed to fetch PDF" },
      { status: 502 }
    );
  }
}
