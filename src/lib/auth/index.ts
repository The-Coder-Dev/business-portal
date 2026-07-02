/**
 * src/lib/auth/index.ts
 * ─────────────────────
 * Barrel export for the entire auth logic layer.
 *
 * Usage:
 *   import { requireAdmin, canManageBusiness, ROLE_REDIRECTS } from "@/lib/auth"
 */

export * from "./roles";
export * from "./permissions";
export * from "./guards";
export * from "./session";
export * from "./service";
export * from "./validators";
// Note: middleware.ts is NOT re-exported here — it's only used by src/middleware.ts
// to avoid importing Next.js server internals into client bundles.
