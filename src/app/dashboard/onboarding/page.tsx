import { db } from "@/db";
import { categories, countries, states } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { OnboardingWizard } from "@/components/onboarding/wizard"

export default async function OnboardingPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }

  // Fetch initial data required for the wizard
  const activeCategories = await db
    .select({
      id: categories.id,
      name: categories.name,
      icon: categories.icon,
    })
    .from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(asc(categories.sortOrder), asc(categories.name));

  const activeCountries = await db
    .select({
      id: countries.id,
      name: countries.name,
    })
    .from(countries)
    .where(eq(countries.isActive, true))
    .orderBy(asc(countries.name));

  const activeStates = await db
    .select({
      id: states.id,
      name: states.name,
      countryId: states.countryId,
    })
    .from(states)
    .where(eq(states.isActive, true))
    .orderBy(asc(states.name));

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Register Your Business</h1>
        <p className="text-muted-foreground mt-2">
          Complete your business profile to start receiving leads and reviews.
        </p>
      </div>

      <OnboardingWizard
        categories={activeCategories}
        countries={activeCountries}
        states={activeStates}
      />
    </div>
  );
}
