import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie");
    const response = await fetch(`${BACKEND_URL}/api/admin/auth/me`, {
      headers: {
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
      },
      credentials: "include",
      cache: "no-store",
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Proxy auth/me error:", error);
    return NextResponse.json({ ok: false, user: null }, { status: 500 });
  }
}