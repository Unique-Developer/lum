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

    const range = request.headers.get("range");
    const upstreamHeaders: Record<string, string> = {
      "User-Agent": "LuminArt-Catalogue-Viewer/1.0",
    };
    if (range) upstreamHeaders["Range"] = range;

    // Non-range (initial) requests may take longer (cold storage, large PDFs).
    // If we abort too aggressively, Next will throw "failed to pipe response".
    const timeoutMs = range ? 30_000 : 120_000;
    const res = await fetch(targetUrl, {
      headers: upstreamHeaders,
      signal: AbortSignal.timeout(timeoutMs),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream returned ${res.status}` },
        { status: res.status }
      );
    }

    const contentType = res.headers.get("content-type") ?? "application/pdf";
    const headers: Record<string, string> = {
      "Content-Type": contentType,
      // PDF.js + iOS Safari behave better when Range requests are supported end-to-end.
      "Accept-Ranges": "bytes",
      // Cache for a bit; catalogue updates are infrequent but not immutable.
      "Cache-Control": "public, max-age=3600",
    };

    const upstreamContentRange = res.headers.get("content-range");
    const upstreamContentLength = res.headers.get("content-length");
    if (upstreamContentRange) headers["Content-Range"] = upstreamContentRange;
    if (upstreamContentLength) headers["Content-Length"] = upstreamContentLength;

    // Stream the response through (important for large PDFs and iOS).
    const status = res.status;

    if (!res.body) {
      const buffer = await res.arrayBuffer();
      if (!buffer || buffer.byteLength === 0) {
        return NextResponse.json({ error: "No body" }, { status: 502 });
      }
      return new NextResponse(buffer, { status, headers });
    }

    return new NextResponse(res.body, {
      status,
      headers,
    });
  } catch (e) {
    console.warn("PDF proxy error:", e);
    return NextResponse.json(
      { error: "Failed to fetch PDF" },
      { status: 502 }
    );
  }
}
