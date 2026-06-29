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
  packageDurationUnitEnum,
  packageTypeEnum,
  paymentGatewayEnum,
  paymentStatusEnum,
  subscriptionStatusEnum,
  currencyEnum,
} from "./enums";
import { businesses } from "./businesses";
import { users } from "./users";

/**
 * packages
 * ────────
 * Product catalog for subscription plans. Separating packages from
 * subscriptions means plan details can change without affecting historical
 * subscription records (subscriptions snapshot price at time of purchase).
 *
 * featureFlags is a JSON object (e.g. {"verified_badge":true,"lead_limit":50})
 * allowing flexible feature gating without schema changes per feature.
 */
export const packages = pgTable(
  "packages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 150 }).notNull(),
    slug: varchar("slug", { length: 180 }).notNull(),
    type: packageTypeEnum("type").notNull(),
    description: text("description"),

    // Pricing
    price: numeric("price", { precision: 10, scale: 2 }).notNull().default("0"),
    currency: currencyEnum("currency").notNull().default("INR"),
    discountedPrice: numeric("discounted_price", { precision: 10, scale: 2 }),

    // Duration
    durationValue: integer("duration_value").notNull().default(1),
    durationUnit: packageDurationUnitEnum("duration_unit")
      .notNull()
      .default("months"),

    // Limits
    leadLimit: integer("lead_limit"), // null = unlimited
    galleryLimit: integer("gallery_limit"),
    videoLimit: integer("video_limit"),

    // Feature flags (JSON)
    featureFlags: text("feature_flags"), // JSON string — e.g. {"verified_badge":true}

    // Display
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    isPopular: boolean("is_popular").notNull().default(false),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("packages_type_idx").on(table.type),
    index("packages_active_idx").on(table.isActive),
  ]
);

/**
 * subscriptions
 * ─────────────
 * Links a business to a package for a fixed term. Snapshotting package price
 * and features at purchase time allows packages to change without affecting
 * active/expired subscriptions.
 */
export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "cascade" }),
    packageId: uuid("package_id")
      .notNull()
      .references(() => packages.id, { onDelete: "restrict" }),

    // Snapshot at time of purchase
    packageName: varchar("package_name", { length: 150 }).notNull(),
    packageType: packageTypeEnum("package_type").notNull(),
    pricePaid: numeric("price_paid", { precision: 10, scale: 2 }).notNull(),
    currency: currencyEnum("currency").notNull().default("INR"),
    featureFlagsSnapshot: text("feature_flags_snapshot"), // JSON

    // Limits (snapshot)
    leadLimit: integer("lead_limit"),
    leadsUsed: integer("leads_used").notNull().default(0),

    // Dates
    startDate: timestamp("start_date", { withTimezone: true }).notNull(),
    endDate: timestamp("end_date", { withTimezone: true }).notNull(),
    trialEndDate: timestamp("trial_end_date", { withTimezone: true }),

    status: subscriptionStatusEnum("status").notNull().default("active"),

    // Auto-renewal
    autoRenew: boolean("auto_renew").notNull().default(false),
    renewedFromId: uuid("renewed_from_id"), // self-ref for renewal chain — no FK needed

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("subscriptions_business_idx").on(table.businessId),
    index("subscriptions_package_idx").on(table.packageId),
    index("subscriptions_status_idx").on(table.status),
    index("subscriptions_end_date_idx").on(table.endDate),
    // Used for expiry jobs
    index("subscriptions_business_status_idx").on(
      table.businessId,
      table.status
    ),
  ]
);

/**
 * payments
 * ────────
 * Financial records. Designed for Razorpay but gateway-agnostic.
 * Never stores card/bank details — only gateway-side IDs.
 *
 * invoiceUrl can point to a generated PDF stored in Supabase Storage.
 */
export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    subscriptionId: uuid("subscription_id").references(
      () => subscriptions.id,
      { onDelete: "set null" }
    ),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    businessId: uuid("business_id")
      .notNull()
      .references(() => businesses.id, { onDelete: "restrict" }),

    // Gateway identifiers
    gateway: paymentGatewayEnum("gateway").notNull().default("razorpay"),
    gatewayOrderId: varchar("gateway_order_id", { length: 255 }),   // Razorpay order_id
    gatewayPaymentId: varchar("gateway_payment_id", { length: 255 }), // Razorpay payment_id
    gatewaySignature: varchar("gateway_signature", { length: 500 }), // for verification

    // Amounts
    amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
    taxAmount: numeric("tax_amount", { precision: 10, scale: 2 })
      .notNull()
      .default("0"),
    discountAmount: numeric("discount_amount", { precision: 10, scale: 2 })
      .notNull()
      .default("0"),
    totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
    currency: currencyEnum("currency").notNull().default("INR"),

    // Status
    status: paymentStatusEnum("status").notNull().default("pending"),
    failureReason: text("failure_reason"),

    // Refunds
    refundedAmount: numeric("refunded_amount", { precision: 10, scale: 2 })
      .notNull()
      .default("0"),
    refundedAt: timestamp("refunded_at", { withTimezone: true }),

    // Invoice
    invoiceNumber: varchar("invoice_number", { length: 100 }),
    invoiceUrl: text("invoice_url"),

    // Metadata
    notes: text("notes"), // JSON — arbitrary k/v from gateway webhook
    paidAt: timestamp("paid_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("payments_subscription_idx").on(table.subscriptionId),
    index("payments_user_idx").on(table.userId),
    index("payments_business_idx").on(table.businessId),
    index("payments_status_idx").on(table.status),
    index("payments_gateway_order_idx").on(table.gatewayOrderId),
    index("payments_gateway_payment_idx").on(table.gatewayPaymentId),
  ]
);
