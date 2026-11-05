import "server-only";
import { NextResponse } from "next/server";
import { getSessionUser, type AdminUser } from "@/lib/auth/session";
import { hasPermission, type AdminPermission } from "@/lib/auth/roles";

export class AdminApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

/** Any signed-in, active admin (all roles). */
export async function requireAdmin(): Promise<AdminUser> {
  const user = await getSessionUser();
  if (!user) throw new AdminApiError(401, "UNAUTHENTICATED", "Sign in is required.");
  return user;
}

/**
 * Resolves the signed-in admin for an API route and enforces the permission.
 * Throws AdminApiError for unauthenticated (401) or unauthorised (403) callers.
 */
export async function requirePermission(permission: AdminPermission): Promise<AdminUser> {
  const user = await getSessionUser();
  if (!user) throw new AdminApiError(401, "UNAUTHENTICATED", "Sign in is required.");
  if (!hasPermission(user.role, permission)) {
    throw new AdminApiError(403, "FORBIDDEN", "You do not have permission to do this.");
  }
  return user;
}

export function guardResponse(error: unknown) {
  if (error instanceof AdminApiError) {
    return NextResponse.json(
      { ok: false, code: error.code, message: error.message },
      { status: error.status, headers: { "Cache-Control": "no-store" } },
    );
  }
  console.error("Admin API error:", error);
  return NextResponse.json(
    { ok: false, code: "SERVER_ERROR", message: "Something went wrong." },
    { status: 500, headers: { "Cache-Control": "no-store" } },
  );
}

/** Same-origin check so a malicious page cannot drive admin APIs with the session cookie. */
export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) {
    throw new AdminApiError(403, "FORBIDDEN", "Cross-site requests are not allowed.");
  }

  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    throw new AdminApiError(403, "FORBIDDEN", "Cross-site requests are not allowed.");
  }

  if (originHost !== host) {
    throw new AdminApiError(403, "FORBIDDEN", "Cross-site requests are not allowed.");
  }
}
