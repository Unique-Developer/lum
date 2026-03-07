import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createPresignedUploadUrl, isB2Configured } from "@/lib/b2";

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!isB2Configured()) {
    return NextResponse.json(
      { error: "B2 storage not configured. Set B2_* env variables." },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(req.url);
  const filename = searchParams.get("filename");
  const contentType = searchParams.get("contentType");
  const prefix = searchParams.get("prefix") || "catalogue";

  if (!filename || !contentType) {
    return NextResponse.json(
      { error: "filename and contentType are required" },
      { status: 400 }
    );
  }

  if (!ALLOWED_TYPES.includes(contentType)) {
    return NextResponse.json(
      { error: `Invalid content type. Allowed: PDF, JPEG, PNG, WebP, MP4, WebM` },
      { status: 400 }
    );
  }

  try {
    const safeName = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
    const key = `${prefix}/${Date.now()}-${safeName}`;
    const { uploadUrl, publicUrl } = await createPresignedUploadUrl(key, contentType);
    return NextResponse.json({ uploadUrl, publicUrl, key });
  } catch (e) {
    console.error("Presign error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Presign failed" },
      { status: 500 }
    );
  }
}
