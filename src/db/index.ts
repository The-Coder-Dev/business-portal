import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index";

/**
 * Database client
 * ───────────────
 * Uses postgres.js driver (no connection pooling — suitable for serverless/
 * edge with prepare:false which is required for Supabase transaction mode pooler).
 *
 * For long-running Node servers add a connection pool via pgBouncer or
 * switch to pg + drizzle-orm/node-postgres.
 */

const client = postgres(process.env.DATABASE_URL!, {
  prepare: false,
  // Keep the connection alive in development (hot module reloading guard)
  max: process.env.NODE_ENV === "development" ? 1 : 10,
});

export const db = drizzle(client, { schema });

// Re-export schema types for convenience
export * from "./schema/index";