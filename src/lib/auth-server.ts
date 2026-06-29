import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * getSession
 * ──────────
 * Retrieves the current session from the request headers.
 * Call this from Server Components or Route Handlers.
 *
 * Returns null if no session exists.
 *
 * Example:
 *   const session = await getSession()
 *   if (!session) redirect("/login")
 */
export async function getSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

/**
 * getUser
 * ───────
 * Convenience helper that returns only the user object from the session.
 * Returns null if the user is not authenticated.
 *
 * Example:
 *   const user = await getUser()
 */
export async function getUser() {
  const session = await getSession();
  return session?.user ?? null;
}
