/**
 * roles.ts
 * ────────
 * Single source of truth for all user role definitions.
 * Imported by both server (permissions, guards) and client (hooks).
 * No runtime dependencies — pure constants.
 */

export const USER_ROLES = [
  "super_admin",
  "admin",
  "staff",
  "business_owner",
  "visitor",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

/**
 * Numeric hierarchy — higher number = more privileges.
 * Used for "hasAtLeastRole" style checks.
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  super_admin: 5,
  admin: 4,
  staff: 3,
  business_owner: 2,
  visitor: 1,
};

/** Human-readable labels for UI display. */
export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  staff: "Staff",
  business_owner: "Business Owner",
  visitor: "Visitor",
};

/** Default role assigned on registration. */
export const DEFAULT_ROLE: UserRole = "visitor";

/**
 * Post-login redirect map.
 * After sign-in, users are redirected based on their role.
 */
export const ROLE_REDIRECTS: Record<UserRole, string> = {
  super_admin: "/admin",
  admin: "/admin",
  staff: "/staff",
  business_owner: "/dashboard",
  visitor: "/dashboard",
};
