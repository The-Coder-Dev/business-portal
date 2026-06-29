import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

/**
 * Better Auth API Route
 * ─────────────────────
 * Catches all requests under /api/auth/[...] and hands them off to
 * Better Auth. Do not add any custom logic here — use Better Auth
 * hooks/plugins instead.
 */
export const { GET, POST } = toNextJsHandler(auth);
