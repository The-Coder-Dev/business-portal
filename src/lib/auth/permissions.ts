/**
 * permissions.ts
 * ──────────────
 * Centralized, server-safe permission helpers.
 * Never hardcode role checks in components — import from here.
 *
 * All functions accept a nullable user so callers don't need to guard.
 */

import type { UserRole } from "./roles";

/** Minimal shape required for permission checks */
type PermissionUser = {
  role?: string | null;
  [key: string]: unknown;
} | null | undefined;

function getRole(user: PermissionUser): UserRole | null {
  if (!user?.role) return null;
  return user.role as UserRole;
}

// ─── Identity Checks ──────────────────────────────────────────────────────────

export function isAuthenticated(user: PermissionUser): boolean {
  return !!user;
}

export function hasRole(user: PermissionUser, role: UserRole): boolean {
  return getRole(user) === role;
}

export function hasAnyRole(user: PermissionUser, roles: UserRole[]): boolean {
  const userRole = getRole(user);
  if (!userRole) return false;
  return roles.includes(userRole);
}

// ─── Role Helpers ─────────────────────────────────────────────────────────────

export function isVisitor(user: PermissionUser): boolean {
  return hasRole(user, "visitor");
}

export function isBusinessOwner(user: PermissionUser): boolean {
  return hasRole(user, "business_owner");
}

/** Staff, Admin, and Super Admin all have staff-level access */
export function isStaff(user: PermissionUser): boolean {
  return hasAnyRole(user, ["staff", "admin", "super_admin"]);
}

/** Admin and Super Admin */
export function isAdmin(user: PermissionUser): boolean {
  return hasAnyRole(user, ["admin", "super_admin"]);
}

export function isSuperAdmin(user: PermissionUser): boolean {
  return hasRole(user, "super_admin");
}

// ─── Business Permissions ─────────────────────────────────────────────────────

/** Can manage their own business listing */
export function canManageBusiness(user: PermissionUser): boolean {
  return hasAnyRole(user, ["business_owner", "admin", "super_admin"]);
}

/** Can approve/reject submitted businesses */
export function canApproveBusiness(user: PermissionUser): boolean {
  return hasAnyRole(user, ["staff", "admin", "super_admin"]);
}

/** Can approve physical verification documents */
export function canApproveVerification(user: PermissionUser): boolean {
  return hasAnyRole(user, ["staff", "admin", "super_admin"]);
}

/** Can hide, approve or reject reviews */
export function canModerateReviews(user: PermissionUser): boolean {
  return hasAnyRole(user, ["staff", "admin", "super_admin"]);
}

/** Can create and manage advertisements */
export function canManageAdvertisements(user: PermissionUser): boolean {
  return hasAnyRole(user, ["admin", "super_admin"]);
}

/** Can manage user accounts (create staff, suspend users) */
export function canManageUsers(user: PermissionUser): boolean {
  return hasAnyRole(user, ["admin", "super_admin"]);
}

/** Can access the admin panel */
export function canAccessAdminPanel(user: PermissionUser): boolean {
  return hasAnyRole(user, ["staff", "admin", "super_admin"]);
}
