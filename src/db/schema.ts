/**
 * src/db/schema.ts
 * ────────────────
 * Re-exports the full schema from the schema/ directory.
 *
 * This file exists so that both "@/db/schema" and "@/db/schema/index"
 * resolve correctly regardless of TypeScript module resolution order.
 * The real schema lives in src/db/schema/ (one file per domain).
 */
export * from "./schema/index";
