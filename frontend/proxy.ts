import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "psq_admin_session";

/**
 * Optimistic gate only: it checks that a session cookie exists, then hides
 * admin responses from caches and search engines. Real authentication and
 * authorisation happen server-side in every admin page and API route.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === "/admin/login" || pathname === "/admin/login/") {
    return withPrivateHeaders(NextResponse.next());
  }

  if (!request.cookies.has(SESSION_COOKIE)) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname + search);
    return withPrivateHeaders(NextResponse.redirect(loginUrl));
  }

  return withPrivateHeaders(NextResponse.next());
}

function withPrivateHeaders(response: NextResponse) {
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}

// Admin APIs enforce their own auth (login/logout must stay reachable), so the
// proxy only guards pages.
export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
