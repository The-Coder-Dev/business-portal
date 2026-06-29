import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * categories
 * ──────────
 * Top-level taxonomy (e.g. "Restaurants", "Doctors", "Real Estate").
 * icon is a Lucide icon name or a CDN URL — kept as text for flexibility.
 * sortOrder allows manual homepage curation.
 */
export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 150 }).notNull(),
    slug: varchar("slug", { length: 180 }).notNull(),
    description: text("description"),
    icon: text("icon"),
    imageUrl: text("image_url"),
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    isFeatured: boolean("is_featured").notNull().default(false),
    metaTitle: varchar("meta_title", { length: 255 }),
    metaDescription: text("meta_description"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("categories_slug_unique_idx").on(table.slug),
    index("categories_active_idx").on(table.isActive),
    index("categories_featured_idx").on(table.isFeatured),
  ]
);

/**
 * subcategories
 * ─────────────
 * Two-level taxonomy is sufficient for most directories. A self-referential
 * parentId on subcategories would allow deeper trees if needed later.
 */
export const subcategories = pgTable(
  "subcategories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    name: varchar("name", { length: 150 }).notNull(),
    slug: varchar("slug", { length: 180 }).notNull(),
    description: text("description"),
    icon: text("icon"),
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    metaTitle: varchar("meta_title", { length: 255 }),
    metaDescription: text("meta_description"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("subcategories_category_idx").on(table.categoryId),
    uniqueIndex("subcategories_slug_unique_idx").on(table.slug),
  ]
);

/**
 * business_type_category_map
 * ──────────────────────────
 * Many-to-many: a business type can belong to many categories and vice versa.
 * E.g. "Doctor" maps to "Healthcare" category. Avoids a rigid single FK.
 */
export const businessTypeCategoryMap = pgTable(
  "business_type_category_map",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    businessType: varchar("business_type", { length: 60 }).notNull(),
  },
  (table) => [
    index("btcm_category_idx").on(table.categoryId),
    index("btcm_type_idx").on(table.businessType),
  ]
);
