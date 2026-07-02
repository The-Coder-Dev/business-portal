"use client";

/**
 * useAuth.ts
 * ──────────
 * Client-side hook for accessing the current session and user.
 * Built on top of Better Auth's React client.
 *
 * Usage:
 *   const { user, session, isLoading, signOut } = useAuth()
 */

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import type { UserRole } from "@/lib/auth/roles";

export type AuthUser = NonNullable<
  ReturnType<typeof authClient.useSession>["data"]
>["user"];

export interface UseAuthReturn {
  /** Full session object — null if unauthenticated or loading */
  session: ReturnType<typeof authClient.useSession>["data"];
  /** Convenience alias for session.user */
  user: AuthUser | null;
  /** User's role — null if unauthenticated */
  role: UserRole | null;
  /** True while the session is being fetched */
  isLoading: boolean;
  /** True when the user is authenticated */
  isAuthenticated: boolean;
  /** Signs the user out and redirects to /sign-in */
  signOut: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const { data: session, isPending: isLoading } = authClient.useSession();

  const user = session?.user ?? null;
  const role = (user as { role?: string } | null)?.role as UserRole | null;

  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
          router.refresh();
        },
      },
    });
  }

  return {
    session,
    user,
    role,
    isLoading,
    isAuthenticated: !!user,
    signOut,
  };
}
