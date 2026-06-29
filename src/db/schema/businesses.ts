import {
  boolean,
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import {
  businessStatusEnum,
  businessTypeEnum,
  verificationStatusEnum,
} from "./enums";
import { users } from "./users";
import { categories } from "./categories";
import { subcategories } from "./categories";
import { cities } from "./locations";
import { states } from "./locations";

/**
 * businesses
 * ──────────
 * The core listing entity. Keeps only universally applicable fields.
 * Type-specific fields live in business_meta (EAV pattern) or dedicated
 * extension tables to avoid hundreds of nullable columns.
 *
 * averageRating is a denormalized cache updated by a trigger / server action
 * after each review approval to avoid aggregate queries on hot paths.
 */

export const businesses = pgTable(
  "businesses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    subcategoryId: uuid("subcategory_id").references(() => subcategories.id, {
      onDelete: "set null",
    }),
    cityId: uuid("city_id")
      .notNull()
      .references(() => cities.id, { onDelete: "restrict" }),
    stateId: uuid("state_id")
      .notNull()
      .references(() => states.id, { onDelete: "restrict" }),

    // Identity
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 300 }).notNull(),
    businessType: businessTypeEnum("business_type").notNull(),
    description: text("description"),
    tagline: varchar("tagline", { length: 300 }),

    // Contact
    email: varchar("email", { length: 255 }),
    phone: varchar("phone", { length: 20 }),
    alternatePhone: varchar("alternate_phone", { length: 20 }),
    whatsapp: varchar("whatsapp", { length: 20 }),
    website: text("website"),

    // Address
    addressLine1: text("address_line1"),
    addressLine2: text("address_line2"),
    landmark: varchar("landmark", { length: 255 }),
    pincode: varchar("pincode", { length: 10 }),
    latitude: numeric("latitude", { precision: 10, scale: 7 }),
    longitude: numeric("longitude", { precision: 10, scale: 7 }),

    // Media
    logoUrl: text("logo_url"),
    coverImageUrl: text("cover_image_url"),

    // Stats (denormalized for performance)
    averageRating: numeric("average_rating", { precision: 3, scale: 2 })
      .notNull()
      .default("0.00"),
    totalReviews: integer("total_reviews").notNull().default(0),
    totalLeads: integer("total_leads").notNull().default(0),
    totalViews: integer("total_views").notNull().default(0),

    // Establishment
    yearEstablished: integer("year_established"),

    // Flags
    status: businessStatusEnum("status").notNull().default("draft"),
    verificationStatus: verificationStatusEnum("verification_status")
      .notNull()
      .default("unverified"),
    isVerified: boolean("is_verified").notNull().default(false),
    isFeatured: boolean("is_featured").notNull().default(false),
    isPremium: boolean("is_premium").notNull().default(false),
    isTopSearch: boolean("is_top_search").notNull().default(false),

    // SEO
    metaTitle: varchar("meta_title", { length: 255 }),
    metaDescription: text("meta_description"),
    metaKeywords: text("meta_keywords"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }), // soft-delete
  },
  (table) => [
    uniqueIndex("businesses_slug_unique_idx").on(table.slug),
    index("businesses_owner_idx").on(table.ownerId),
    index("businesses_category_idx").on(table.categoryId),
    index("businesses_subcategory_idx").on(table.subcategoryId),
    index("businesses_city_idx").on(table.cityId),
    index("businesses_state_idx").on(table.stateId),
    index("businesses_type_idx").on(table.businessType),
    index("businesses_status_idx").on(table.status),
    index("businesses_verified_idx").on(table.isVerified),
    index("businesses_featured_idx").on(table.isFeatured),
    index("businesses_premium_idx").on(table.isPremium),
    index("businesses_rating_idx").on(table.averageRating),
    // Compound index for the most common search filter combo
    index("businesses_city_category_status_idx").on(
      table.cityId,
      table.categoryId,
      table.status
    ),
    // Geospatial (lat/lng range queries)
    index("businesses_location_idx").on(table.latitude, table.longitude),
  ]
);

/**
 * business_meta
 * ─────────────
 * Entity-Attribute-Value (EAV) table for type-specific fields.
 * Why EAV here vs. separate tables?
 * - Business types can be 15+ with 5–20 extra fields each → 300+ nullable cols
 * - EAV lets admins add meta keys without migrations
 * - metaKey is namespaced: "hotel:star_rating", "doctor:specialization"
 *
 * For structured/relational meta (e.g. hotel amenities list) use the
 * business_attributes (many-to-many) table below.
 */
export const businessMeta = pgTable(
  "business_meta",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    metaKey: varchar("meta_key", { length: 100 }).notNull(),
    metaValue: text("meta_value"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("business_meta_business_idx").on(table.businessId),
    uniqueIndex("business_meta_business_key_unique_idx").on(
      table.businessId,
      table.metaKey
    ),
  ]
);

/**
 * attribute_definitions
 * ─────────────────────
 * Defines valid EAV keys per business type. Used for validation, UI rendering,
 * and documentation — prevents garbage keys in business_meta.
 *
 * Examples:
 *   businessType: "hotel",       metaKey: "hotel:star_rating",   dataType: "integer"
 *   businessType: "doctor",      metaKey: "doctor:specialization", dataType: "string"
 *   businessType: "restaurant",  metaKey: "restaurant:cuisine",  dataType: "array"
 */
export const attributeDefinitions = pgTable(
  "attribute_definitions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    businessType: businessTypeEnum("business_type").notNull(),
    metaKey: varchar("meta_key", { length: 100 }).notNull(),
    label: varchar("label", { length: 150 }).notNull(),
    dataType: varchar("data_type", { length: 30 }).notNull().default("string"), // string|integer|decimal|boolean|array|json
    isRequired: boolean("is_required").notNull().default(false),
    isFilterable: boolean("is_filterable").notNull().default(false),
    options: text("options"), // JSON array for enum-like values
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("attr_def_type_key_unique_idx").on(
      table.businessType,
      table.metaKey
    ),
    index("attr_def_type_idx").on(table.businessType),
    index("attr_def_filterable_idx").on(table.isFilterable),
  ]
);

/**
 * service_areas
 * ─────────────
 * Many-to-many: a business can serve multiple cities.
 * Distinct from the primary city_id (where they are physically located).
 */
export const serviceAreas = pgTable(
  "service_areas",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    cityId: uuid("city_id")
      .notNull()
      .references(() => cities.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("service_areas_business_idx").on(table.businessId),
    index("service_areas_city_idx").on(table.cityId),
    uniqueIndex("service_areas_unique_idx").on(
      table.businessId,
      table.cityId
    ),
  ]
);

/**
 * business_tags
 * ─────────────
 * Free-form tags / keywords for search relevance. Stored normalised
 * (separate rows per tag, deduplicated by a tags dictionary).
 */
export const tags = pgTable(
  "tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 80 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("tags_slug_unique_idx").on(table.slug)]
);

export const businessTags = pgTable(
  "business_tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("business_tags_business_idx").on(table.businessId),
    index("business_tags_tag_idx").on(table.tagId),
    uniqueIndex("business_tags_unique_idx").on(table.businessId, table.tagId),
  ]
);
