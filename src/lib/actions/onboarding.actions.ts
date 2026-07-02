"use server";

import { db } from "@/db";
import { subcategories, cities, businesses, serviceAreas } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { OnboardingFormData, onboardingFormSchema } from "@/lib/validations/onboarding";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

export async function getSubcategories(categoryId: string) {
  if (!categoryId) return [];
  const results = await db
    .select({
      id: subcategories.id,
      name: subcategories.name,
    })
    .from(subcategories)
    .where(eq(subcategories.categoryId, categoryId))
    .execute();
  return results;
}

export async function getCities(stateId: string) {
  if (!stateId) return [];
  const results = await db
    .select({
      id: cities.id,
      name: cities.name,
    })
    .from(cities)
    .where(eq(cities.stateId, stateId))
    .execute();
  return results;
}

export async function submitBusinessRegistration(data: OnboardingFormData) {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Validate on server
  const validated = onboardingFormSchema.parse(data);

  // Generate a unique slug
  const baseSlug = slugify(validated.name);
  const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;

  // Insert business
  const [newBusiness] = await db
    .insert(businesses)
    .values({
      ownerId: session.user.id,
      name: validated.name,
      slug: uniqueSlug,
      // @ts-expect-error DB Enum string mismatch
      businessType: validated.businessType,
      categoryId: validated.categoryId,
      subcategoryId: validated.subcategoryId || null,
      cityId: validated.cityId,
      stateId: validated.stateId,
      email: validated.email || null,
      phone: validated.phone,
      whatsapp: validated.whatsapp || null,
      website: validated.website || null,
      description: validated.description,
      yearEstablished: validated.yearEstablished ? parseInt(validated.yearEstablished) : null,
      addressLine1: validated.addressLine1,
      addressLine2: validated.addressLine2 || null,
      landmark: validated.landmark || null,
      pincode: validated.pincode,
      latitude: validated.latitude ? validated.latitude.toString() : null,
      longitude: validated.longitude ? validated.longitude.toString() : null,
      status: "pending_review", // Required by prompt
    })
    .returning({ id: businesses.id });

  // Insert service areas if any
  if (validated.serviceAreas && validated.serviceAreas.length > 0) {
    const serviceAreaValues = validated.serviceAreas.map((cityId) => ({
      businessId: newBusiness.id,
      cityId,
    }));
    await db.insert(serviceAreas).values(serviceAreaValues);
  }

  // Do NOT change user role automatically as per prompt instructions!
  
  revalidatePath("/dashboard");
  redirect("/dashboard");
}
