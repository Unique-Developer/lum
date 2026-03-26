import { NextRequest, NextResponse } from "next/server";

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

    const scriptUrl = process.env.GOOGLE_SHEET_SCRIPT_URL;
    if (!scriptUrl) {
      return NextResponse.json(
        { ok: false, errors: ["Google script is not configured."] },
        { status: 503 }
      );
    }

    // Match your Apps Script mapping:
    // position <- projectType
    // requirement <- message
    const payload = {
      name: String(body.name).trim(),
      phone: String(body.phone).trim(),
      position: String(body.projectType).trim(),
      requirement: String(body.message).trim(),
      // optional extras (if you want them in the email/sheet)
      firmName: String(body.firmName).trim(),
      email: String(body.email).trim(),
      projectType: String(body.projectType).trim(),
      message: String(body.message).trim(),
      location: String(body.location ?? "").trim(),
      projectSize: String(body.projectSize ?? "").trim(),
      budgetRange: String(body.budgetRange ?? "").trim(),
    };

    const resp = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await resp.text();
    let json: unknown = null;
    try {
      json = JSON.parse(text);
    } catch {
      // ignore
    }

    const responseObj = typeof json === "object" && json !== null ? (json as Record<string, unknown>) : {};
    const status = responseObj["status"];
    const scriptErrors = Array.isArray(responseObj["errors"])
      ? responseObj["errors"].filter((e): e is string => typeof e === "string")
      : null;

    // Apps Script often returns HTTP 200 even for logical errors, so trust payload status first.
    if (status !== "success") {
      const fallback = "Failed to submit form. Please try again later.";
      return NextResponse.json(
        { ok: false, errors: scriptErrors?.length ? scriptErrors : [fallback] },
        { status: 503 }
      );
    }

    if (!resp.ok) {
      console.error("Apps Script non-OK response with success payload:", { status: resp.status, body: json ?? text });
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