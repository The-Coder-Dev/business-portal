/**
 * middleware.ts (auth layer)
 * ──────────────────────────
 * Route configuration consumed by src/proxy.ts.
 * Centralizes all route → role mappings in one place.
 */

import type { UserRole } from "./roles";

// ─── Public Routes ────────────────────────────────────────────────────────────

/** Exact public paths — no auth required */
export const PUBLIC_PATHS = new Set([
  "/",
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/403",
]);

/** Path prefixes that are always public */
export const PUBLIC_PREFIXES = [
  "/business/",
  "/businesses/",
  "/categories/",
  "/cities/",
  "/search/",
  "/api/auth/",
  "/_next/",
];

// ─── Protected Routes ─────────────────────────────────────────────────────────

/**
 * Maps path prefixes → required roles.
 * First match wins. More specific routes should come first.
 */
export const ROLE_PROTECTED_PREFIXES: Array<{
  prefix: string;
  roles: readonly UserRole[];
}> = [
  { prefix: "/admin", roles: ["admin", "super_admin"] },
  { prefix: "/staff", roles: ["staff", "admin", "super_admin"] },
  { prefix: "/dashboard", roles: ["business_owner", "admin", "super_admin"] },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_PATHS.has(pathname)) return true;
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function getRequiredRoles(pathname: string): readonly UserRole[] | null {
  for (const { prefix, roles } of ROLE_PROTECTED_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      return roles;
    }
  }
  return null;
}
