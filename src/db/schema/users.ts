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
import { userRoleEnum, userStatusEnum } from "./enums";

/**
 * users
 * ─────
 * Central identity table. Better Auth will manage sessions & OAuth tokens
 * separately. This table stores the canonical user profile used across the
 * platform.
 *
 * Soft-delete: deletedAt is set instead of physical row removal so that
 * foreign keys (reviews, leads, etc.) remain intact.
 */
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: boolean("email_verified").notNull().default(false),
    phone: varchar("phone", { length: 20 }),
    phoneVerified: boolean("phone_verified").notNull().default(false),
    avatarUrl: text("avatar_url"),
    role: userRoleEnum("role").notNull().default("visitor"),
    status: userStatusEnum("status").notNull().default("active"),

    // Better Auth compatibility columns
    // Better Auth stores its own session/account rows but references users.id
    authProviderId: text("auth_provider_id"), // e.g. google sub, github id

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }), // soft-delete
  },
  (table) => [
    uniqueIndex("users_email_unique_idx").on(table.email),
    index("users_role_idx").on(table.role),
    index("users_status_idx").on(table.status),
  ]
);

/**
 * user_profiles
 * ─────────────
 * Extended / optional profile fields separated from the core users table
 * to keep the primary table lean. Primarily used for business-owner profiles.
 */
export const userProfiles = pgTable("user_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  bio: text("bio"),
  website: text("website"),
  linkedinUrl: text("linkedin_url"),
  facebookUrl: text("facebook_url"),
  twitterUrl: text("twitter_url"),
  dateOfBirth: timestamp("date_of_birth", { withTimezone: true }),
  gender: varchar("gender", { length: 10 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * staff_assignments
 * ─────────────────
 * Tracks which staff members are assigned to which cities/categories for
 * verification workloads. Allows fine-grained workload distribution without
 * adding columns to users.
 */

export const staffAssignments = pgTable(
  "staff_assignments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    staffId: uuid("staff_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    cityId: uuid("city_id"), // FK added in cities.ts via relations
    categoryId: uuid("category_id"), // FK added in categories.ts via relations
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("staff_assignments_staff_idx").on(table.staffId)]
);
