/**
 * service.ts
 * ──────────
 * User lifecycle operations (server-only).
 * Contains all DB writes related to the auth/user domain.
 *
 * No Better Auth client calls here — only direct Drizzle operations.
 */

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, userProfiles } from "@/db/schema";
import type { UserRole } from "./roles";

/** Called by the Better Auth databaseHook after user creation. */
export async function createUserProfile(userId: string): Promise<void> {
  await db
    .insert(userProfiles)
    .values({ userId })
    .onConflictDoNothing();
}

/**
 * Upgrades a visitor to business_owner.
 * Called when their first business is approved by staff.
 */
export async function upgradeToBusinessOwner(userId: string): Promise<void> {
  await db
    .update(users)
    .set({ role: "business_owner", updatedAt: new Date() })
    .where(eq(users.id, userId));
}

/** Assigns an arbitrary role — admin/super_admin only operation. */
export async function assignRole(userId: string, role: UserRole): Promise<void> {
  await db
    .update(users)
    .set({ role, updatedAt: new Date() })
    .where(eq(users.id, userId));
}

/** Suspends a user account (sets status to suspended). */
export async function suspendUser(userId: string): Promise<void> {
  await db
    .update(users)
    .set({ status: "suspended", updatedAt: new Date() })
    .where(eq(users.id, userId));
}

/** Reactivates a suspended user. */
export async function reactivateUser(userId: string): Promise<void> {
  await db
    .update(users)
    .set({ status: "active", updatedAt: new Date() })
    .where(eq(users.id, userId));
}

/** Looks up a user by ID. Returns null if not found. */
export async function getUserById(userId: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return result[0] ?? null;
}

/** Soft-deletes a user (GDPR-safe). */
export async function softDeleteUser(userId: string): Promise<void> {
  await db
    .update(users)
    .set({ deletedAt: new Date(), status: "inactive", updatedAt: new Date() })
    .where(eq(users.id, userId));
}

// ─── Invitation Architecture (Phase 3 stubs) ─────────────────────────────────
//
// These functions prepare the architecture for the Super Admin invitation flow:
//
//   Super Admin → creates invitation → email sent → user sets password → login
//
// Email delivery is NOT implemented yet. Hook up an email provider in Phase 3
// (e.g., Resend, SendGrid, Nodemailer) and replace the TODO bodies below.
//
// The invitation token is generated here and stored in Better Auth's
// `verifications` table (or a dedicated `invitations` table in Phase 3).

/**
 * Creates a pending staff account invitation.
 * Called ONLY by Super Admin from the admin panel.
 *
 * @param email - Email address to send the invitation to
 * @param invitedById - ID of the Super Admin creating the invitation
 *
 * TODO Phase 3: generate a secure invitation token, persist it, and
 *              send the invitation email via your email provider.
 */
export async function createStaffInvitation(
  email: string,
  invitedById: string
): Promise<{ email: string; invitedById: string; token: string }> {
  const token = crypto.randomUUID();
  // TODO Phase 3: persist invitation (email, token, role="staff", invitedById, expiresAt)
  // TODO Phase 3: send invitation email with link: /accept-invitation?token=<token>
  console.info("[createStaffInvitation] TODO: send invitation to", email, "by", invitedById);
  return { email, invitedById, token };
}

/**
 * Creates a pending admin account invitation.
 * Called ONLY by Super Admin from the admin panel.
 *
 * @param email - Email address to send the invitation to
 * @param invitedById - ID of the Super Admin creating the invitation
 *
 * TODO Phase 3: generate a secure invitation token, persist it, and
 *              send the invitation email via your email provider.
 */
export async function createAdminInvitation(
  email: string,
  invitedById: string
): Promise<{ email: string; invitedById: string; token: string }> {
  const token = crypto.randomUUID();
  // TODO Phase 3: persist invitation (email, token, role="admin", invitedById, expiresAt)
  // TODO Phase 3: send invitation email with link: /accept-invitation?token=<token>
  console.info("[createAdminInvitation] TODO: send invitation to", email, "by", invitedById);
  return { email, invitedById, token };
}

