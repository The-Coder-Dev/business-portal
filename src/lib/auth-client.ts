"use client";

import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "@/lib/auth";

/**
 * Better Auth React client
 * ────────────────────────
 * Use this in Client Components to access the current session,
 * sign in, sign out, etc.
 *
 * inferAdditionalFields<typeof auth> gives TypeScript full knowledge of
 * our custom user fields (role, status, phone, phoneVerified) so
 * session.user.role is properly typed everywhere.
 *
 * Example:
 *   import { authClient } from "@/lib/auth-client"
 *   const { data: session } = authClient.useSession()
 *   console.log(session?.user.role) // typed as UserRole
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? "http://localhost:3000",
  plugins: [
    inferAdditionalFields<typeof auth>(),
  ],
});

export type AuthClient = typeof authClient;
