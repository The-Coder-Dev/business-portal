"use client";

/**
 * usePermissions.ts
 * ─────────────────
 * Client-side hook that exposes all permission helpers as booleans.
 * Reads the session from Better Auth's client cache — no network call.
 *
 * ⚠️  Never trust these values for security-sensitive operations.
 *     Client-side permission checks are for UI only (show/hide, disable).
 *     Always enforce permissions server-side via guards.ts or middleware.ts.
 *
 * Usage:
 *   const { isAdmin, canManageBusiness } = usePermissions()
 *   if (isAdmin) return <AdminActions />
 */

import { useAuth } from "./useAuth";
import {
  isAuthenticated,
  isVisitor,
  isBusinessOwner,
  isStaff,
  isAdmin,
  isSuperAdmin,
  canManageBusiness,
  canApproveBusiness,
  canApproveVerification,
  canModerateReviews,
  canManageAdvertisements,
  canManageUsers,
  canAccessAdminPanel,
} from "@/lib/auth/permissions";

export interface UsePermissionsReturn {
  // ── Identity ─────────────────────────────────────────
  isAuthenticated: boolean;
  isVisitor: boolean;
  isBusinessOwner: boolean;
  /** True for staff, admin, and super_admin */
  isStaff: boolean;
  /** True for admin and super_admin */
  isAdmin: boolean;
  isSuperAdmin: boolean;

  // ── Business Permissions ──────────────────────────────
  canManageBusiness: boolean;
  canApproveBusiness: boolean;
  canApproveVerification: boolean;
  canModerateReviews: boolean;
  canManageAdvertisements: boolean;
  canManageUsers: boolean;
  canAccessAdminPanel: boolean;
}

export function usePermissions(): UsePermissionsReturn {
  const { user, isLoading } = useAuth();

  // While loading, treat as unauthenticated (safest default)
  const u = isLoading ? null : user;

  return {
    isAuthenticated: isAuthenticated(u),
    isVisitor: isVisitor(u),
    isBusinessOwner: isBusinessOwner(u),
    isStaff: isStaff(u),
    isAdmin: isAdmin(u),
    isSuperAdmin: isSuperAdmin(u),

    canManageBusiness: canManageBusiness(u),
    canApproveBusiness: canApproveBusiness(u),
    canApproveVerification: canApproveVerification(u),
    canModerateReviews: canModerateReviews(u),
    canManageAdvertisements: canManageAdvertisements(u),
    canManageUsers: canManageUsers(u),
    canAccessAdminPanel: canAccessAdminPanel(u),
  };
}
