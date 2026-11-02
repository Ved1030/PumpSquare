import { NextResponse } from "next/server";

type ContactPayload = {
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  phone?: unknown;
  subject?: unknown;
  message?: unknown;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: Request) {
  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { ok: false, code: "BAD_REQUEST", message: "Invalid request body." },
      { status: 400 },
    );
  }

  const missing: string[] = [];
  if (!isNonEmptyString(payload.firstName)) missing.push("firstName");
  if (!isNonEmptyString(payload.lastName)) missing.push("lastName");
  if (!isNonEmptyString(payload.email)) missing.push("email");
  if (!isNonEmptyString(payload.message)) missing.push("message");

  if (missing.length > 0) {
    return NextResponse.json(
      {
        ok: false,
        code: "VALIDATION",
        message: "Missing required fields.",
        fields: missing,
      },
      { status: 422 },
    );
  }

  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      {
        ok: false,
        code: "VALIDATION",
        message: "A valid email address is required.",
        fields: ["email"],
      },
      { status: 422 },
    );
  }

  /*
   * Phase 1: email delivery is intentionally not configured.
   * To go live, integrate an email provider here (for example Resend,
   * SMTP via nodemailer, or a transactional email API) using the validated
   * payload above, then return { ok: true }.
   * See README.md → "Connecting the contact form".
   */
  return NextResponse.json({
    ok: false,
    code: "NOT_CONFIGURED",
    message:
      "Email delivery is not configured yet. Please contact info@pumpsquare.com directly.",
  });
}
