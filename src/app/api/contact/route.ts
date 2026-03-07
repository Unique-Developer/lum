import { NextRequest, NextResponse } from "next/server";
import { sendCollaborationEmail } from "@/lib/mail";

function validate(data: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const obj = data as Record<string, unknown>;

  if (!obj?.name || typeof obj.name !== "string" || obj.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  }
  if (!obj?.firmName || typeof obj.firmName !== "string" || obj.firmName.trim().length < 1) {
    errors.push("Firm name is required");
  }
  const email = obj?.email;
  if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Valid email is required");
  }
  if (!obj?.phone || typeof obj.phone !== "string" || obj.phone.trim().length < 6) {
    errors.push("Phone must be at least 6 characters");
  }
  if (!obj?.projectType || typeof obj.projectType !== "string" || obj.projectType.trim().length < 1) {
    errors.push("Project type is required");
  }
  if (!obj?.message || typeof obj.message !== "string" || obj.message.trim().length < 10) {
    errors.push("Message must be at least 10 characters");
  }

  return { valid: errors.length === 0, errors };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { valid, errors } = validate(body);

    if (!valid) {
      return NextResponse.json({ ok: false, errors }, { status: 400 });
    }

    const sent = await sendCollaborationEmail({
      name: String(body.name).trim(),
      firmName: String(body.firmName).trim(),
      email: String(body.email).trim(),
      phone: String(body.phone).trim(),
      projectType: String(body.projectType).trim(),
      message: String(body.message).trim(),
    });

    if (!sent) {
      return NextResponse.json(
        { ok: false, errors: ["Email service not configured. Please try again later."] },
        { status: 503 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Contact API error:", e);
    return NextResponse.json(
      { ok: false, errors: ["Something went wrong. Please try again."] },
      { status: 500 }
    );
  }
}
