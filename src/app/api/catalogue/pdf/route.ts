import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy API for catalogue PDFs.
 * Fetches PDF from B2 (cross-origin) server-side and streams it to the client.
 * This avoids CORS issues on mobile Safari and other strict browsers.
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    const parsed = new URL(url, "https://dummy");
    const host = parsed.hostname.toLowerCase();

    // Only allow B2 URLs (backblazeb2.com)
    if (!host.endsWith(".backblazeb2.com") && host !== "backblazeb2.com") {
      return NextResponse.json({ error: "Invalid url" }, { status: 403 });
    }

    const res = await fetch(url, {
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
    const body = res.body;
    if (!body) {
      return NextResponse.json({ error: "No body" }, { status: 502 });
    }

    return new NextResponse(body, {
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
