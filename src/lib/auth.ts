import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { users, account, session, verification } from "@/db/schema";
import { createUserProfile } from "@/lib/auth/service";

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

  // ─── Authentication Methods ──────────────────────────────────────────────

  emailAndPassword: {
    enabled: true,
    /**
     * Email verification disabled for Phase 2 (UX-first).
     * Enable in Phase 3 once email provider is configured.
     */
    requireEmailVerification: false,
  },

  // ─── ID Generation ───────────────────────────────────────────────────────

  advanced: {
    /**
     * Tell Better Auth to generate UUIDs for all IDs.
     * Required because our users.id / session.id / account.id columns
     * are postgres uuid type. Better Auth v1.6+ reads this from
     * advanced.database.generateId, NOT advanced.generateId.
     */
    database: {
      generateId: "uuid",
    },
  },

  // ─── User Model ──────────────────────────────────────────────────────────

  user: {
    /**
     * Expose additional columns from the users table to the session.
     * These map to JavaScript property names in the Drizzle schema.
     *
     * input: false → not settable by the user during sign-up
     * input: true  → user can provide this during sign-up
     */
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "visitor",
        input: false, // assigned by backend only
      },
      status: {
        type: "string",
        defaultValue: "active",
        input: false,
      },
      phone: {
        type: "string",
        required: false,
        input: true, // collected during sign-up
      },
      phoneVerified: {
        type: "boolean",
        defaultValue: false,
        input: false,
      },
    },
  },

  // ─── Database Adapter ────────────────────────────────────────────────────

  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      /**
       * Explicitly map Better Auth's internal model names to our Drizzle
       * table objects. Better Auth uses "user", "account", "session",
       * "verification" as its model keys — mapped to our actual tables here.
       *
       * NOTE: usePlural is intentionally omitted. When an explicit schema
       * mapping is provided, Better Auth uses it directly and does not need
       * the plural-name auto-lookup, which caused "model users not found".
       */
      user: users,
      account,
      session,
      verification,
    },
  }),

  // ─── Session Configuration ───────────────────────────────────────────────

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh within 1 day of expiry
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5-minute client-side cache
    },
  },

  // ─── Security ────────────────────────────────────────────────────────────

  /**
   * Trusted origins — CSRF protection.
   * Add production domain via BETTER_AUTH_TRUSTED_ORIGINS env var.
   */
  trustedOrigins: process.env.BETTER_AUTH_TRUSTED_ORIGINS
    ? process.env.BETTER_AUTH_TRUSTED_ORIGINS.split(",").map((o) => o.trim())
    : [],

  // ─── Database Hooks ──────────────────────────────────────────────────────

  databaseHooks: {
    user: {
      create: {
        /**
         * After every user creation, create a matching user_profile row.
         * This keeps the users table lean and ensures profile always exists.
         */
        after: async (user) => {
          await createUserProfile(user.id);
        },
      },
    },
  },
});

// ─── Type Exports ─────────────────────────────────────────────────────────────

export type Auth = typeof auth;
export type Session = typeof auth.$Infer.Session;
export type User = Session["user"];