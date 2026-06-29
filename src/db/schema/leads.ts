import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { leadStatusEnum, preferredCallTimeEnum } from "./enums";
import { businesses } from "./businesses";
import { users } from "./users";

/**
 * leads
 * ─────
 * A lead is an inquiry sent by a visitor/user to a business.
 * Customer details are captured directly on the lead row (not FK'd to users)
 * because visitors can submit leads without registering.
 *
 * assignedTo links to a staff member for CRM workflows.
 */
export const leads = pgTable(
  "leads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),

    // Visitor details (denormalized — may not be a registered user)
    submittedByUserId: uuid("submitted_by_user_id").references(
      () => users.id,
      { onDelete: "set null" }
    ),
    customerName: varchar("customer_name", { length: 255 }).notNull(),
    customerEmail: varchar("customer_email", { length: 255 }),
    customerPhone: varchar("customer_phone", { length: 20 }).notNull(),
    customerCity: varchar("customer_city", { length: 100 }),

    // Requirement
    subject: varchar("subject", { length: 300 }),
    message: text("message").notNull(),
    requirement: text("requirement"), // detailed requirement field
    budget: varchar("budget", { length: 100 }),
    preferredCallTime: preferredCallTimeEnum("preferred_call_time"),

    // CRM
    status: leadStatusEnum("status").notNull().default("new"),
    assignedTo: uuid("assigned_to").references(() => users.id, {
      onDelete: "set null",
    }),
    assignedAt: timestamp("assigned_at", { withTimezone: true }),

    // Source tracking
    sourceUrl: text("source_url"),
    utmSource: varchar("utm_source", { length: 100 }),
    utmMedium: varchar("utm_medium", { length: 100 }),
    utmCampaign: varchar("utm_campaign", { length: 100 }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("leads_business_idx").on(table.businessId),
    index("leads_status_idx").on(table.status),
    index("leads_assigned_idx").on(table.assignedTo),
    index("leads_user_idx").on(table.submittedByUserId),
    index("leads_business_status_idx").on(table.businessId, table.status),
  ]
);

/**
 * lead_status_history
 * ───────────────────
 * Append-only log of every status transition on a lead.
 * Enables full CRM audit trail and time-to-conversion analytics.
 */
export const leadStatusHistory = pgTable(
  "lead_status_history",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    leadId: uuid("lead_id")
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),
    previousStatus: leadStatusEnum("previous_status"),
    newStatus: leadStatusEnum("new_status").notNull(),
    changedBy: uuid("changed_by").references(() => users.id, {
      onDelete: "set null",
    }),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("lead_status_history_lead_idx").on(table.leadId)]
);

/**
 * lead_notes
 * ──────────
 * Internal CRM notes on a lead (staff-only). Kept separate from
 * lead_status_history to distinguish operational notes from state changes.
 */
export const leadNotes = pgTable(
  "lead_notes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    leadId: uuid("lead_id")
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    note: text("note").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("lead_notes_lead_idx").on(table.leadId)]
);
