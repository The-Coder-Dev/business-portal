import { pgEnum } from "drizzle-orm/pg-core";

// ─── User & Role Enums ────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum("user_role", [
  "super_admin",
  "admin",
  "staff",
  "business_owner",
  "visitor",
]);

export const userStatusEnum = pgEnum("user_status", [
  "active",
  "inactive",
  "suspended",
  "pending_verification",
]);

// ─── Business Enums ───────────────────────────────────────────────────────────

export const businessTypeEnum = pgEnum("business_type", [
  "local_business",
  "service_provider",
  "manufacturer",
  "wholesaler",
  "distributor",
  "dealer",
  "hotel",
  "restaurant",
  "doctor",
  "clinic",
  "real_estate",
  "education",
  "travel",
  "event",
  "online_seller",
  "other",
]);

export const businessStatusEnum = pgEnum("business_status", [
  "draft",
  "pending_review",
  "active",
  "suspended",
  "rejected",
  "closed",
]);

export const verificationStatusEnum = pgEnum("verification_status", [
  "unverified",
  "pending",
  "under_review",
  "verified",
  "rejected",
  "expired",
]);

export const verificationDocTypeEnum = pgEnum("verification_doc_type", [
  "gst",
  "pan",
  "registration_certificate",
  "owner_id",
  "address_proof",
  "other",
]);

// ─── Day / Schedule Enums ─────────────────────────────────────────────────────

export const dayOfWeekEnum = pgEnum("day_of_week", [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]);

// ─── Review Enums ─────────────────────────────────────────────────────────────

export const reviewStatusEnum = pgEnum("review_status", [
  "pending",
  "approved",
  "rejected",
  "hidden",
]);

// ─── Lead Enums ───────────────────────────────────────────────────────────────

export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "contacted",
  "in_progress",
  "converted",
  "lost",
  "spam",
]);

export const preferredCallTimeEnum = pgEnum("preferred_call_time", [
  "morning",
  "afternoon",
  "evening",
  "anytime",
]);

// ─── Package Enums ────────────────────────────────────────────────────────────

export const packageTypeEnum = pgEnum("package_type", [
  "free",
  "premium",
  "featured",
  "top_search",
  "lead_package",
  "custom",
]);

export const packageDurationUnitEnum = pgEnum("package_duration_unit", [
  "days",
  "months",
  "years",
]);

// ─── Subscription / Payment Enums ────────────────────────────────────────────

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "expired",
  "cancelled",
  "suspended",
  "trial",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "initiated",
  "success",
  "failed",
  "refunded",
  "partially_refunded",
]);

export const paymentGatewayEnum = pgEnum("payment_gateway", [
  "razorpay",
  "stripe",
  "paytm",
  "manual",
  "free",
]);

export const currencyEnum = pgEnum("currency", ["INR", "USD", "EUR"]);

// ─── Advertisement Enums ──────────────────────────────────────────────────────

export const adTypeEnum = pgEnum("ad_type", [
  "banner",
  "sidebar",
  "featured_listing",
  "top_search_placement",
  "category_spotlight",
]);

export const adStatusEnum = pgEnum("ad_status", [
  "draft",
  "active",
  "paused",
  "expired",
  "rejected",
]);

export const adPositionEnum = pgEnum("ad_position", [
  "homepage_hero",
  "homepage_sidebar",
  "category_top",
  "category_sidebar",
  "search_results_top",
  "search_results_sidebar",
  "city_page_top",
  "detail_page_sidebar",
]);

// ─── Notification Enums ───────────────────────────────────────────────────────

export const notificationTypeEnum = pgEnum("notification_type", [
  "lead_received",
  "review_received",
  "review_reply",
  "subscription_expiring",
  "subscription_expired",
  "verification_status_change",
  "business_approved",
  "business_rejected",
  "payment_success",
  "payment_failed",
  "system_alert",
  "promotional",
]);

export const notificationChannelEnum = pgEnum("notification_channel", [
  "in_app",
  "email",
  "sms",
  "whatsapp",
  "push",
]);

// ─── Audit Enums ──────────────────────────────────────────────────────────────

export const auditActionEnum = pgEnum("audit_action", [
  "create",
  "update",
  "delete",
  "publish",
  "unpublish",
  "approve",
  "reject",
  "verify",
  "suspend",
  "login",
  "logout",
  "password_change",
  "export",
]);

// ─── Media Enums ──────────────────────────────────────────────────────────────

export const mediaTypeEnum = pgEnum("media_type", [
  "image",
  "video",
  "document",
]);
