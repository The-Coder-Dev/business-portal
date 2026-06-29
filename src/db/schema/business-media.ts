import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  time,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { dayOfWeekEnum, mediaTypeEnum } from "./enums";
import { businesses } from "./businesses";

/**
 * business_hours
 * ──────────────
 * One row per day per business. Stored as TIME columns (HH:MM:SS) which
 * allows native DB comparisons for "Open Now" queries.
 * is24Hours collapses the row into a 24/7 flag.
 */
export const businessHours = pgTable(
  "business_hours",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    dayOfWeek: dayOfWeekEnum("day_of_week").notNull(),
    openTime: time("open_time"),
    closeTime: time("close_time"),
    isClosed: boolean("is_closed").notNull().default(false),
    is24Hours: boolean("is_24_hours").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("business_hours_business_idx").on(table.businessId),
    index("business_hours_day_idx").on(table.dayOfWeek),
  ]
);

/**
 * business_gallery
 * ────────────────
 * Photo gallery for a business. sortOrder allows drag-and-drop reordering.
 * Separating this prevents the businesses row from bloating with arrays.
 */
export const businessGallery = pgTable(
  "business_gallery",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    mediaType: mediaTypeEnum("media_type").notNull().default("image"),
    url: text("url").notNull(),
    thumbnailUrl: text("thumbnail_url"),
    caption: varchar("caption", { length: 500 }),
    altText: varchar("alt_text", { length: 255 }),
    sortOrder: integer("sort_order").notNull().default(0),
    isApproved: boolean("is_approved").notNull().default(false),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    approvedBy: uuid("approved_by"), // FK to users via relations
    fileSizeBytes: integer("file_size_bytes"),
    mimeType: varchar("mime_type", { length: 100 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("business_gallery_business_idx").on(table.businessId),
    index("business_gallery_type_idx").on(table.mediaType),
  ]
);

/**
 * business_videos
 * ───────────────
 * Separate table for video links (YouTube embeds, Vimeo, or uploaded).
 * Keeping videos apart from gallery avoids media-type sprawl in one table.
 */
export const businessVideos = pgTable(
  "business_videos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }),
    videoUrl: text("video_url").notNull(),   // YouTube/Vimeo URL or CDN path
    thumbnailUrl: text("thumbnail_url"),
    platform: varchar("platform", { length: 50 }), // youtube|vimeo|upload
    durationSeconds: integer("duration_seconds"),
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("business_videos_business_idx").on(table.businessId)]
);

/**
 * business_social_links
 * ─────────────────────
 * Social media profiles linked to a business. Normalized to avoid 10+
 * nullable social columns on the businesses table.
 */
export const businessSocialLinks = pgTable(
  "business_social_links",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    platform: varchar("platform", { length: 50 }).notNull(), // facebook|instagram|linkedin|twitter|youtube
    url: text("url").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("business_social_links_business_idx").on(table.businessId)]
);
