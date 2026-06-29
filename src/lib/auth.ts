import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { users, account, session, verification } from "@/db/schema/auth";

export const auth = betterAuth({
  /**
   * Secret key — read from environment, never hardcoded.
   * Must be at least 32 characters of high entropy.
   */
  secret: process.env.BETTER_AUTH_SECRET!,

  /**
   * Base URL — used for redirect URLs and cookie domain.
   */
  baseURL: process.env.BETTER_AUTH_URL!,

  /**
   * Drizzle adapter
   * ───────────────
   * Reuses the existing db instance. No second connection.
   *
   * usePlural: true  — tells Better Auth to look for plural table names
   *                    (sessions, accounts, verifications) instead of the
   *                    default singular names it generates internally.
   *
   * schema mapping    — explicitly maps Better Auth's internal "user" model
   *                    to our existing `users` table so it does NOT attempt
   *                    to create or reference a separate `user` table.
   */
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema: {
      user: users,
      account,
      session,
      verification,
    },
  }),

  /**
   * Session configuration
   * ─────────────────────
   * expiresIn: 7 days (seconds). Refresh within 1 day of expiry.
   */
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes client-side cache
    },
  },

  /**
   * Trusted origins — add production domain in BETTER_AUTH_TRUSTED_ORIGINS
   * env variable (comma-separated) when deploying.
   */
  trustedOrigins: process.env.BETTER_AUTH_TRUSTED_ORIGINS
    ? process.env.BETTER_AUTH_TRUSTED_ORIGINS.split(",").map((o) => o.trim())
    : [],
});

export type Auth = typeof auth;
export type Session = typeof auth.$Infer.Session;