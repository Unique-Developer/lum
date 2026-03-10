import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { deleteR2Object, isR2Configured } from "@/lib/r2";

const ALLOWED_PREFIXES = ["catalogue/", "posts/"];

function isAllowedKey(key: string): boolean {
  return ALLOWED_PREFIXES.some((p) => key.startsWith(p));
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!isR2Configured()) {
    return NextResponse.json(
      { error: "R2 storage not configured. Set R2_* env variables." },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const keys = Array.isArray(body.keys) ? body.keys : [];
    if (keys.length === 0) {
      return NextResponse.json({ error: "keys array required" }, { status: 400 });
    }

    const invalid = keys.filter(
      (k: unknown) => typeof k !== "string" || !isAllowedKey(k)
    );
    if (invalid.length > 0) {
      return NextResponse.json(
        { error: "Invalid keys. Only catalogue/ and posts/ prefixes allowed." },
        { status: 400 }
      );
    }

    const results: { key: string; ok: boolean; error?: string }[] = [];

    for (const key of keys) {
      try {
        await deleteR2Object(key);
        results.push({ key, ok: true });
      } catch (e) {
        results.push({
          key,
          ok: false,
          error: e instanceof Error ? e.message : "Unknown error",
        });
      }
    }

    const deleted = results.filter((r) => r.ok).length;
    return NextResponse.json({
      deleted,
      total: keys.length,
      results,
    });
  } catch (e) {
    console.error("Storage delete error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Delete failed" },
      { status: 500 }
    );
  }
}
