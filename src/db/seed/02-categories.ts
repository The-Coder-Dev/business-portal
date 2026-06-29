/**
 * Seed: Category & Subcategory taxonomy
 * ──────────────────────────────────────
 * Run with:  npx tsx src/db/seed/02-categories.ts
 */

import { db } from "../index";
import { categories, subcategories } from "../schema/index";

const categoryData = [
  {
    name: "Restaurants & Food",
    slug: "restaurants-food",
    icon: "UtensilsCrossed",
    isFeatured: true,
    subcategories: [
      "Fine Dining",
      "Fast Food",
      "Cafes & Coffee Shops",
      "Bakeries",
      "Street Food",
      "Cloud Kitchens",
    ],
  },
  {
    name: "Hotels & Stays",
    slug: "hotels-stays",
    icon: "Hotel",
    isFeatured: true,
    subcategories: [
      "Luxury Hotels",
      "Budget Hotels",
      "Guest Houses",
      "Serviced Apartments",
      "Resorts",
      "Homestays",
    ],
  },
  {
    name: "Doctors & Healthcare",
    slug: "doctors-healthcare",
    icon: "Stethoscope",
    isFeatured: true,
    subcategories: [
      "General Physicians",
      "Dentists",
      "Gynecologists",
      "Cardiologists",
      "Dermatologists",
      "Orthopedic Surgeons",
      "ENT Specialists",
      "Eye Specialists",
    ],
  },
  {
    name: "Real Estate",
    slug: "real-estate",
    icon: "Building2",
    isFeatured: true,
    subcategories: [
      "Residential Properties",
      "Commercial Properties",
      "Plots & Land",
      "PG & Co-living",
      "Property Dealers",
    ],
  },
  {
    name: "Education",
    slug: "education",
    icon: "GraduationCap",
    isFeatured: false,
    subcategories: [
      "Schools",
      "Colleges",
      "Coaching Classes",
      "Skill Development",
      "Online Learning",
    ],
  },
  {
    name: "Travel & Tourism",
    slug: "travel-tourism",
    icon: "Plane",
    isFeatured: false,
    subcategories: [
      "Tour Operators",
      "Travel Agents",
      "Car Rentals",
      "Taxi Services",
      "Bus Services",
    ],
  },
  {
    name: "Events & Entertainment",
    slug: "events-entertainment",
    icon: "PartyPopper",
    isFeatured: false,
    subcategories: [
      "Event Planners",
      "Wedding Venues",
      "Photography & Videography",
      "Caterers",
      "DJ & Sound",
    ],
  },
  {
    name: "Manufacturers & Suppliers",
    slug: "manufacturers-suppliers",
    icon: "Factory",
    isFeatured: false,
    subcategories: [
      "Industrial Equipment",
      "Textiles",
      "Electronics",
      "Food & Beverages",
      "Building Materials",
    ],
  },
];

async function seedCategories() {
  console.log("📂 Seeding categories...");

  for (const cat of categoryData) {
    const { subcategories: subs, ...catData } = cat;

    const [inserted] = await db
      .insert(categories)
      .values({ ...catData, sortOrder: 0 })
      .onConflictDoNothing()
      .returning();

    if (!inserted) continue;

    if (subs.length > 0) {
      await db
        .insert(subcategories)
        .values(
          subs.map((name, i) => ({
            categoryId: inserted.id,
            name,
            slug: `${inserted.slug}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
            sortOrder: i,
          }))
        )
        .onConflictDoNothing();
    }
  }

  console.log("✅ Categories seeded.");
}

seedCategories().catch(console.error);
