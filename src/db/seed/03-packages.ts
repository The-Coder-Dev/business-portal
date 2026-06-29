/**
 * Seed: Subscription Packages
 * ───────────────────────────
 * Run with:  npx tsx src/db/seed/03-packages.ts
 */

import { db } from "../index";
import { packages } from "../schema/index";

async function seedPackages() {
  console.log("📦 Seeding packages...");

  await db
    .insert(packages)
    .values([
      {
        name: "Free Listing",
        slug: "free",
        type: "free",
        description: "Basic listing with essential information",
        price: "0",
        currency: "INR",
        durationValue: 365,
        durationUnit: "days",
        leadLimit: 5,
        galleryLimit: 5,
        videoLimit: 0,
        featureFlags: JSON.stringify({
          verified_badge: false,
          featured_listing: false,
          top_search: false,
          banner_ad: false,
          priority_support: false,
        }),
        sortOrder: 0,
        isActive: true,
        isPopular: false,
      },
      {
        name: "Premium",
        slug: "premium",
        type: "premium",
        description: "Enhanced visibility with priority listing and more leads",
        price: "1999",
        currency: "INR",
        durationValue: 1,
        durationUnit: "months",
        leadLimit: 50,
        galleryLimit: 30,
        videoLimit: 3,
        featureFlags: JSON.stringify({
          verified_badge: true,
          featured_listing: false,
          top_search: false,
          banner_ad: false,
          priority_support: true,
        }),
        sortOrder: 1,
        isActive: true,
        isPopular: true,
      },
      {
        name: "Featured",
        slug: "featured",
        type: "featured",
        description: "Featured placement across search results and category pages",
        price: "4999",
        currency: "INR",
        durationValue: 1,
        durationUnit: "months",
        leadLimit: 200,
        galleryLimit: 60,
        videoLimit: 10,
        featureFlags: JSON.stringify({
          verified_badge: true,
          featured_listing: true,
          top_search: false,
          banner_ad: true,
          priority_support: true,
        }),
        sortOrder: 2,
        isActive: true,
        isPopular: false,
      },
      {
        name: "Top Search",
        slug: "top-search",
        type: "top_search",
        description:
          "Maximum visibility: top placement in search + homepage banner",
        price: "9999",
        currency: "INR",
        durationValue: 1,
        durationUnit: "months",
        leadLimit: null, // unlimited
        galleryLimit: null,
        videoLimit: null,
        featureFlags: JSON.stringify({
          verified_badge: true,
          featured_listing: true,
          top_search: true,
          banner_ad: true,
          priority_support: true,
          dedicated_account_manager: true,
        }),
        sortOrder: 3,
        isActive: true,
        isPopular: false,
      },
    ])
    .onConflictDoNothing();

  console.log("✅ Packages seeded.");
}

seedPackages().catch(console.error);
