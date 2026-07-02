/**
 * auth-server.ts
 * ──────────────
 * Re-exports from lib/auth/session.ts for backwards compatibility.
 * Prefer importing directly from "@/lib/auth" in new code.
 */
export { getSession, getUser, getRole } from "@/lib/auth/session";
export type { AuthSession, AuthUser } from "@/lib/auth/session";
