/**
 * guards.ts
 * ─────────
 * Server-side route guards for Server Components and Route Handlers.
 * Call these at the top of protected server pages — they redirect automatically.
 *
 * Example:
 *   export default async function AdminPage() {
 *     const session = await requireAdmin();
 *     // user is guaranteed to be admin or super_admin here
 *   }
 */

import { redirect } from "next/navigation";
import { getSession } from "./session";
import { hasAnyRole } from "./permissions";
import type { UserRole } from "./roles";

/** Requires an authenticated session. Redirects to /sign-in if missing. */
export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/sign-in");
  }
  return session;
}

/**
 * Requires the user to have one of the specified roles.
 * Redirects to /sign-in if unauthenticated, /403 if unauthorized.
 */
export async function requireRole(roles: UserRole[]) {
  const session = await requireAuth();
  const user = session.user as { role?: string };
  if (!hasAnyRole(user, roles)) {
    redirect("/403");
  }
  return session;
}

/** Business owner, admin, or super_admin. */
export async function requireBusinessOwner() {
  return requireRole(["business_owner", "admin", "super_admin"]);
}

/** Staff, admin, or super_admin. */
export async function requireStaff() {
  return requireRole(["staff", "admin", "super_admin"]);
}

/** Admin or super_admin only. */
export async function requireAdmin() {
  return requireRole(["admin", "super_admin"]);
}

/** Super admin only. */
export async function requireSuperAdmin() {
  return requireRole(["super_admin"]);
}
