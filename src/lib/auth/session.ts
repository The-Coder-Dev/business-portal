/**
 * session.ts
 * ──────────
 * Typed server-side session helpers.
 * Only callable from Server Components, Route Handlers, and Server Actions.
 */

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import type { UserRole } from "./roles";

export type AuthSession = Awaited<ReturnType<typeof auth.api.getSession>>;
export type AuthUser = NonNullable<AuthSession>["user"];

/** Returns the full session object, or null if unauthenticated. */
export async function getSession(): Promise<AuthSession | null> {
  return auth.api.getSession({
    headers: await headers(),
  });
}

/** Returns only the user, or null if unauthenticated. */
export async function getUser(): Promise<AuthUser | null> {
  const session = await getSession();
  return session?.user ?? null;
}

/**
 * Returns the user's role, or null if unauthenticated.
 * Casts from string to UserRole — valid because the DB enum enforces values.
 */
export async function getRole(): Promise<UserRole | null> {
  const user = await getUser();
  const role = (user as { role?: string } | null)?.role;
  return (role as UserRole) ?? null;
}
