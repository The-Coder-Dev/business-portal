import {
  boolean,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import {
  auditActionEnum,
  notificationChannelEnum,
  notificationTypeEnum,
} from "./enums";
import { users } from "./users";
import { businesses } from "./businesses";

/**
 * notifications
 * ─────────────
 * In-app and multi-channel notification records.
 * relatedEntityType + relatedEntityId is a polymorphic reference to avoid
 * 20+ nullable FK columns (review_id, lead_id, payment_id…). The application
 * resolves the entity using the type discriminator.
 *
 * data is a JSON payload for deep-linking and rich rendering.
 */
export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: notificationTypeEnum("type").notNull(),
    channel: notificationChannelEnum("channel").notNull().default("in_app"),
    title: varchar("title", { length: 255 }).notNull(),
    body: text("body").notNull(),

    // Polymorphic reference
    relatedEntityType: varchar("related_entity_type", { length: 50 }), // "review"|"lead"|"payment"…
    relatedEntityId: uuid("related_entity_id"),

    data: jsonb("data"), // extra context for rich notifications

    isRead: boolean("is_read").notNull().default(false),
    readAt: timestamp("read_at", { withTimezone: true }),

    // Delivery tracking
    sentAt: timestamp("sent_at", { withTimezone: true }),
    deliveryStatus: varchar("delivery_status", { length: 50 }), // sent|delivered|failed

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("notifications_user_idx").on(table.userId),
    index("notifications_type_idx").on(table.type),
    index("notifications_read_idx").on(table.isRead),
    // Unread notification count query
    index("notifications_user_read_idx").on(table.userId, table.isRead),
    index("notifications_entity_idx").on(
      table.relatedEntityType,
      table.relatedEntityId
    ),
  ]
);

/**
 * audit_logs
 * ──────────
 * Immutable write-once audit trail for all significant system actions.
 * Covers admin/staff operations, business changes, payment events etc.
 * NEVER update or delete rows in this table.
 *
 * changesSnapshot stores the before/after JSON for data changes.
 */
export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    actorId: uuid("actor_id").references(() => users.id, {
      onDelete: "set null",
    }),
    actorRole: varchar("actor_role", { length: 50 }),
    action: auditActionEnum("action").notNull(),

    // Target entity (polymorphic)
    entityType: varchar("entity_type", { length: 100 }).notNull(), // "business"|"user"|"review"…
    entityId: uuid("entity_id"),

    // Snapshot of changes (before → after)
    changesSnapshot: jsonb("changes_snapshot"),

    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("audit_logs_actor_idx").on(table.actorId),
    index("audit_logs_entity_idx").on(table.entityType, table.entityId),
    index("audit_logs_action_idx").on(table.action),
    index("audit_logs_created_idx").on(table.createdAt),
  ]
);

/**
 * favorites
 * ─────────
 * Saved/bookmarked businesses by a user.
 */
export const favorites = pgTable(
  "favorites",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("favorites_user_idx").on(table.userId),
    index("favorites_business_idx").on(table.businessId),
    // Prevent duplicate favorites
    index("favorites_user_business_unique_idx").on(
      table.userId,
      table.businessId
    ),
  ]
);

/**
 * search_history
 * ──────────────
 * Tracks search queries per user/session for personalization and analytics.
 * Anonymous sessions use sessionId; registered users get userId.
 * resultCount helps identify zero-result queries for content gap analysis.
 */
export const searchHistory = pgTable(
  "search_history",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    sessionId: varchar("session_id", { length: 100 }),
    query: varchar("query", { length: 500 }).notNull(),
    categoryId: uuid("category_id"),
    cityId: uuid("city_id"),
    filters: jsonb("filters"), // Applied filter state as JSON
    resultCount: uuid("result_count"), // null = not recorded
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("search_history_user_idx").on(table.userId),
    index("search_history_created_idx").on(table.createdAt),
    index("search_history_query_idx").on(table.query),
  ]
);

/**
 * recently_viewed
 * ───────────────
 * Per-user recently viewed business list. Deduplication and capping
 * (e.g. last 20) are handled at the application layer.
 */
export const recentlyViewed = pgTable(
  "recently_viewed",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    sessionId: varchar("session_id", { length: 100 }), // for anonymous users
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    viewedAt: timestamp("viewed_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("recently_viewed_user_idx").on(table.userId),
    index("recently_viewed_session_idx").on(table.sessionId),
    index("recently_viewed_business_idx").on(table.businessId),
    index("recently_viewed_viewed_at_idx").on(table.viewedAt),
  ]
);
