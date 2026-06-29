/**
 * Seed: Geographic reference data
 * ────────────────────────────────
 * Run with:  npx tsx src/db/seed/01-locations.ts
 *
 * Inserts India as the default country, a sample of states, and major cities.
 * Extend this file or add new seed files for production data.
 */

import { db } from "../index";
import { countries, states, cities } from "../schema/index";

async function seedLocations() {
  console.log("🌏 Seeding locations...");

  // Country
  const [india] = await db
    .insert(countries)
    .values({ name: "India", isoCode: "IND", dialCode: "+91" })
    .onConflictDoNothing()
    .returning();

  if (!india) {
    console.log("India already seeded — skipping.");
    return;
  }

  // States
  const stateRows = await db
    .insert(states)
    .values([
      { countryId: india.id, name: "Maharashtra", stateCode: "MH" },
      { countryId: india.id, name: "Karnataka", stateCode: "KA" },
      { countryId: india.id, name: "Tamil Nadu", stateCode: "TN" },
      { countryId: india.id, name: "Delhi", stateCode: "DL" },
      { countryId: india.id, name: "Gujarat", stateCode: "GJ" },
      { countryId: india.id, name: "Rajasthan", stateCode: "RJ" },
      { countryId: india.id, name: "Uttar Pradesh", stateCode: "UP" },
      { countryId: india.id, name: "West Bengal", stateCode: "WB" },
      { countryId: india.id, name: "Telangana", stateCode: "TS" },
      { countryId: india.id, name: "Kerala", stateCode: "KL" },
    ])
    .onConflictDoNothing()
    .returning();

  const mh = stateRows.find((s: typeof stateRows[number]) => s.stateCode === "MH")!;
  const ka = stateRows.find((s: typeof stateRows[number]) => s.stateCode === "KA")!;
  const dl = stateRows.find((s: typeof stateRows[number]) => s.stateCode === "DL")!;
  const tn = stateRows.find((s: typeof stateRows[number]) => s.stateCode === "TN")!;

  // Cities
  await db
    .insert(cities)
    .values([
      {
        stateId: mh.id,
        name: "Mumbai",
        slug: "mumbai",
        isMetro: true,
        latitude: "19.0760",
        longitude: "72.8777",
      },
      {
        stateId: mh.id,
        name: "Pune",
        slug: "pune",
        isMetro: false,
        latitude: "18.5204",
        longitude: "73.8567",
      },
      {
        stateId: ka.id,
        name: "Bengaluru",
        slug: "bengaluru",
        isMetro: true,
        latitude: "12.9716",
        longitude: "77.5946",
      },
      {
        stateId: dl.id,
        name: "New Delhi",
        slug: "new-delhi",
        isMetro: true,
        latitude: "28.6139",
        longitude: "77.2090",
      },
      {
        stateId: tn.id,
        name: "Chennai",
        slug: "chennai",
        isMetro: true,
        latitude: "13.0827",
        longitude: "80.2707",
      },
    ])
    .onConflictDoNothing();

  console.log("✅ Locations seeded.");
}

seedLocations().catch(console.error);
