import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { reviewStatusEnum } from "./enums";
import { businesses } from "./businesses";
import { users } from "./users";

/**
 * reviews
 * ───────
 * Customer reviews for businesses. Admin-moderated (status field).
 * averageRating on businesses is updated after status → "approved".
 *
 * Soft-deleted so that the rating cache can be recalculated correctly
 * if an admin removes a review.
 */
export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    rating: integer("rating").notNull(), // 1–5

    // Dimension ratings (optional) for richer feedback
    serviceRating: integer("service_rating"),    // 1–5
    qualityRating: integer("quality_rating"),    // 1–5
    valueRating: integer("value_rating"),        // 1–5
    cleanlinessRating: integer("cleanliness_rating"), // 1–5 (hotels/restaurants)

    title: varchar("title", { length: 255 }),
    review: text("review"),
    visitDate: timestamp("visit_date", { withTimezone: true }),

    status: reviewStatusEnum("status").notNull().default("pending"),
    isAnonymous: boolean("is_anonymous").notNull().default(false),

    // Moderation
    approvedBy: uuid("approved_by").references(() => users.id, {
      onDelete: "set null",
    }),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
    rejectionReason: text("rejection_reason"),

    // Engagement
    helpfulCount: integer("helpful_count").notNull().default(0),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }), // soft-delete
  },
  (table) => [
    index("reviews_business_idx").on(table.businessId),
    index("reviews_user_idx").on(table.userId),
    index("reviews_status_idx").on(table.status),
    index("reviews_rating_idx").on(table.rating),
    // One review per user per business enforced at application level
    // (not unique constraint — allows re-review after deletion)
    index("reviews_business_status_idx").on(table.businessId, table.status),
  ]
);

/**
 * review_images
 * ─────────────
 * Photos attached to a review. Max enforced at application layer.
 */
export const reviewImages = pgTable(
  "review_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    reviewId: uuid("review_id")
      .notNull()
      .references(() => reviews.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    thumbnailUrl: text("thumbnail_url"),
    altText: varchar("alt_text", { length: 255 }),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("review_images_review_idx").on(table.reviewId)]
);

/**
 * review_replies
 * ──────────────
 * Business owner or admin reply to a review. One reply per review by design
 * (unique on review_id). Separate table to avoid nullable reply columns on
 * reviews and to support future threaded replies.
 */
export const reviewReplies = pgTable(
  "review_replies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    reviewId: uuid("review_id")
      .notNull()
      .unique() // one reply per review
      .references(() => reviews.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    reply: text("reply").notNull(),
    isEdited: boolean("is_edited").notNull().default(false),
    editedAt: timestamp("edited_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("review_replies_review_idx").on(table.reviewId)]
);

/**
 * review_helpful_votes
 * ────────────────────
 * Tracks "was this review helpful?" votes. Prevents double-voting at DB level.
 */
export const reviewHelpfulVotes = pgTable(
  "review_helpful_votes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    reviewId: uuid("review_id")
      .notNull()
      .references(() => reviews.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("review_helpful_votes_review_idx").on(table.reviewId),
    index("review_helpful_votes_user_idx").on(table.userId),
  ]
);
