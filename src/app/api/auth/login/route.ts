import { NextResponse } from "next/server";
import { getAdminCredentials, verifyPassword, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;
    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const creds = getAdminCredentials();
    if (!creds) {
      return NextResponse.json(
        { error: "Admin not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD_HASH." },
        { status: 503 }
      );
    }

    if (creds.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    let valid: boolean;
    if ("plainPassword" in creds) {
      valid = password === creds.plainPassword;
    } else {
      valid = await verifyPassword(password, creds.passwordHash);
    }
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await signToken(creds.email);
    return NextResponse.json({ token, email: creds.email });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
