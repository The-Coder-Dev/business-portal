"use client";

import { createAuthClient } from "better-auth/react";

/**
 * Better Auth React client
 * ────────────────────────
 * Use this in Client Components to access the current session,
 * sign in, sign out, etc.
 *
 * Example:
 *   import { authClient } from "@/lib/auth-client"
 *   const { data: session } = authClient.useSession()
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? "http://localhost:3000",
});

export type AuthClient = typeof authClient;
