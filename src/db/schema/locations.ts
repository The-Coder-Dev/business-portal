import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * countries
 * ─────────
 * Future-proofing for multi-country support. Currently India-focused but
 * added to avoid a painful migration later.
 */
export const countries = pgTable("countries", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  isoCode: varchar("iso_code", { length: 3 }).notNull().unique(),
  dialCode: varchar("dial_code", { length: 10 }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * states
 * ──────
 * Indian states / union territories. Linked to countries for future
 * multi-country support.
 */
export const states = pgTable(
  "states",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    countryId: uuid("country_id")
      .notNull()
      .references(() => countries.id, { onDelete: "restrict" }),
    name: varchar("name", { length: 100 }).notNull(),
    stateCode: varchar("state_code", { length: 10 }),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("states_country_idx").on(table.countryId),
    uniqueIndex("states_name_country_unique_idx").on(
      table.name,
      table.countryId
    ),
  ]
);

/**
 * cities
 * ──────
 * City-level geography. The platform is search-heavy on city; indexing
 * this is critical. slug is used in SEO URLs (/city/mumbai/).
 */
export const cities = pgTable(
  "cities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    stateId: uuid("state_id")
      .notNull()
      .references(() => states.id, { onDelete: "restrict" }),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 120 }).notNull(),
    pincode: varchar("pincode", { length: 10 }),
    latitude: text("latitude"),
    longitude: text("longitude"),
    isMetro: boolean("is_metro").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("cities_state_idx").on(table.stateId),
    uniqueIndex("cities_slug_unique_idx").on(table.slug),
  ]
);

/**
 * pincodes
 * ────────
 * Granular pincode lookup for radius-based "Near Me" searches. Normalized
 * away from businesses to avoid huge nullable columns.
 */
export const pincodes = pgTable(
  "pincodes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    cityId: uuid("city_id")
      .notNull()
      .references(() => cities.id, { onDelete: "restrict" }),
    code: varchar("code", { length: 10 }).notNull(),
    area: varchar("area", { length: 200 }),
    latitude: text("latitude"),
    longitude: text("longitude"),
  },
  (table) => [
    index("pincodes_city_idx").on(table.cityId),
    uniqueIndex("pincodes_code_unique_idx").on(table.code),
  ]
);
