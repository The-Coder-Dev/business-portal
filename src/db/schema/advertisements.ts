import {
  boolean,
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import {
  adPositionEnum,
  adStatusEnum,
  adTypeEnum,
} from "./enums";
import { businesses } from "./businesses";
import { categories } from "./categories";
import { cities } from "./locations";
import { users } from "./users";
import { subscriptions } from "./subscriptions";

/**
 * advertisements
 * ──────────────
 * Base advertisement record. Linked to a business and optionally to a
 * subscription (so ad validity is coupled to payment status).
 *
 * targetCategoryId / targetCityId allow contextual targeting.
 * Budget tracking (impressions/clicks) is stored here for billing/reporting.
 */
export const advertisements = pgTable(
  "advertisements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    subscriptionId: uuid("subscription_id").references(
      () => subscriptions.id,
      { onDelete: "set null" }
    ),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),

    title: varchar("title", { length: 255 }).notNull(),
    adType: adTypeEnum("ad_type").notNull(),
    status: adStatusEnum("status").notNull().default("draft"),

    // Targeting
    targetCategoryId: uuid("target_category_id").references(
      () => categories.id,
      { onDelete: "set null" }
    ),
    targetCityId: uuid("target_city_id").references(() => cities.id, {
      onDelete: "set null",
    }),

    // Scheduling
    startDate: timestamp("start_date", { withTimezone: true }).notNull(),
    endDate: timestamp("end_date", { withTimezone: true }).notNull(),

    // Stats (updated by background job)
    impressions: integer("impressions").notNull().default(0),
    clicks: integer("clicks").notNull().default(0),
    ctr: numeric("ctr", { precision: 5, scale: 4 })
      .notNull()
      .default("0.0000"), // click-through rate

    // Approval
    approvedBy: uuid("approved_by").references(() => users.id, {
      onDelete: "set null",
    }),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    rejectionReason: text("rejection_reason"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("advertisements_business_idx").on(table.businessId),
    index("advertisements_status_idx").on(table.status),
    index("advertisements_type_idx").on(table.adType),
    index("advertisements_dates_idx").on(table.startDate, table.endDate),
    index("advertisements_target_category_idx").on(table.targetCategoryId),
    index("advertisements_target_city_idx").on(table.targetCityId),
  ]
);

/**
 * banner_ads
 * ──────────
 * Banner-specific creative assets. Separated from advertisements because
 * different ad types have very different creative requirements.
 * Multiple banners per advertisement allows A/B testing or responsive sizes.
 */
export const bannerAds = pgTable(
  "banner_ads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    advertisementId: uuid("advertisement_id")
      .notNull()
      .references(() => advertisements.id, { onDelete: "cascade" }),

    position: adPositionEnum("position").notNull(),
    imageUrl: text("image_url").notNull(),
    mobileImageUrl: text("mobile_image_url"), // responsive variant
    altText: varchar("alt_text", { length: 255 }),
    linkUrl: text("link_url"),
    linkTarget: varchar("link_target", { length: 10 }).default("_blank"),

    // Dimensions for layout reservation (avoids CLS)
    width: integer("width"),
    height: integer("height"),

    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("banner_ads_ad_idx").on(table.advertisementId),
    index("banner_ads_position_idx").on(table.position),
    // Query for active banners at a given position
    index("banner_ads_position_active_idx").on(table.position, table.isActive),
  ]
);

/**
 * ad_impressions_log
 * ──────────────────
 * Granular impression events for analytics and fraud detection.
 * In production this should be a time-series table (e.g. TimescaleDB) or
 * pushed to a data warehouse. For MVP, postgres is fine.
 */
export const adImpressionsLog = pgTable(
  "ad_impressions_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    advertisementId: uuid("advertisement_id")
      .notNull()
      .references(() => advertisements.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    sessionId: varchar("session_id", { length: 100 }),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    isClick: boolean("is_click").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("ad_impressions_ad_idx").on(table.advertisementId),
    index("ad_impressions_created_idx").on(table.createdAt),
  ]
);
