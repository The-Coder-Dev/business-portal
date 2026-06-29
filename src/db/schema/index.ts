/**
 * Schema barrel export
 * ────────────────────
 * Re-exports every schema module so consumers can import from a single path:
 *   import { businesses, reviews } from "@/db/schema"
 *
 * The order of exports does not matter for Drizzle, but grouping by domain
 * improves readability.
 */

// Enums — must be loaded first so other schemas can reference them
export * from "./enums";

// Geography
export * from "./locations";

// Taxonomy
export * from "./categories";

// Users & Staff
export * from "./users";

// Business Core
export * from "./businesses";

// Business Media & Hours
export * from "./business-media";

// Verification
export * from "./verifications";

// Reviews
export * from "./reviews";

// Leads
export * from "./leads";

// Packages, Subscriptions & Payments
export * from "./subscriptions";

// Advertisements
export * from "./advertisements";

// Platform (notifications, audit, favorites, search history)
export * from "./platform";

// Relations — must be last (depends on all other modules)
export * from "./relations";
