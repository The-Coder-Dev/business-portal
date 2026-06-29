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
import {
  verificationDocTypeEnum,
  verificationStatusEnum,
} from "./enums";
import { businesses } from "./businesses";
import { users } from "./users";

/**
 * business_verifications
 * ──────────────────────
 * One verification record per business (singleton). Tracks the overall
 * verification state and which staff member processed it.
 *
 * Individual documents live in verification_documents to support
 * multiple document submissions and independent approval of each.
 */
export const businessVerifications = pgTable(
  "business_verifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    businessId: uuid("business_id")
      .notNull()
      .unique()
      .references(() => businesses.id, { onDelete: "cascade" }),
    status: verificationStatusEnum("status").notNull().default("pending"),
    verifiedBadge: boolean("verified_badge").notNull().default(false),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    verifiedBy: uuid("verified_by").references(() => users.id, {
      onDelete: "set null",
    }),
    rejectionReason: text("rejection_reason"),
    expiresAt: timestamp("expires_at", { withTimezone: true }), // for re-verification cycles
    notes: text("notes"), // internal staff notes
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("business_verifications_business_idx").on(table.businessId),
    index("business_verifications_status_idx").on(table.status),
    index("business_verifications_staff_idx").on(table.verifiedBy),
  ]
);

/**
 * verification_documents
 * ──────────────────────
 * Individual documents submitted for verification. Multiple documents
 * (GST, PAN, owner ID, etc.) per verification record.
 * fileUrl points to secure storage (Supabase Storage / S3).
 */
export const verificationDocuments = pgTable(
  "verification_documents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    verificationId: uuid("verification_id")
      .notNull()
      .references(() => businessVerifications.id, { onDelete: "cascade" }),
    docType: verificationDocTypeEnum("doc_type").notNull(),
    docNumber: varchar("doc_number", { length: 100 }), // GST number, PAN number etc.
    fileUrl: text("file_url").notNull(), // Stored in secure/private bucket
    fileName: varchar("file_name", { length: 255 }),
    fileSizeBytes: integer("file_size_bytes"),
    mimeType: varchar("mime_type", { length: 100 }),
    isVerified: boolean("is_verified").notNull().default(false),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    verifiedBy: uuid("verified_by").references(() => users.id, {
      onDelete: "set null",
    }),
    rejectionReason: text("rejection_reason"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("verification_docs_verification_idx").on(table.verificationId),
    index("verification_docs_type_idx").on(table.docType),
  ]
);

/**
 * verification_status_history
 * ───────────────────────────
 * Append-only audit trail for verification status changes.
 * Critical for dispute resolution and regulatory compliance.
 */
export const verificationStatusHistory = pgTable(
  "verification_status_history",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    verificationId: uuid("verification_id")
      .notNull()
      .references(() => businessVerifications.id, { onDelete: "cascade" }),
    previousStatus: verificationStatusEnum("previous_status"),
    newStatus: verificationStatusEnum("new_status").notNull(),
    changedBy: uuid("changed_by").references(() => users.id, {
      onDelete: "set null",
    }),
    reason: text("reason"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("verification_history_verification_idx").on(table.verificationId),
  ]
);
