import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isPublicRoute, getRequiredRoles } from "@/lib/auth/middleware";

/**
 * proxy.ts (formerly middleware.ts)
 * ──────────────────────────────────
 * Next.js 16 renamed the file convention from middleware.ts → proxy.ts
 * and the export from `middleware` → `proxy`.
 *
 * This runs on the Edge Runtime on every matched request and enforces:
 *   1. Public route pass-through
 *   2. Session validation (redirect to /sign-in if unauthenticated)
 *   3. Role-based access control (redirect to /403 if unauthorized)
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Pass through all public routes and static assets immediately
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Validate session via Better Auth's server API
  let session: Awaited<ReturnType<typeof auth.api.getSession>> | null = null;
  try {
    session = await auth.api.getSession({
      headers: request.headers as Headers,
    });
  } catch {
    // Network/DB failure — fail open to avoid locking out users on transient errors.
    // The page itself will do a second server-side guard if needed.
    console.warn("[proxy] Session check failed for:", pathname);
  }

  // Not authenticated → redirect to sign-in with callback
  if (!session?.user) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Check role-based access
  const requiredRoles = getRequiredRoles(pathname);
  if (requiredRoles) {
    const userRole = (session.user as { role?: string }).role;
    if (!userRole || !requiredRoles.includes(userRole as never)) {
      return NextResponse.redirect(new URL("/403", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  /*
   * Match all routes except:
   * - _next/static  (Next.js build files)
   * - _next/image   (image optimization)
   * - favicon.ico
   * - common static file extensions
   */
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?)$).*)",
  ],
};
