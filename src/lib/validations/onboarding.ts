import { z } from "zod";
import { businessTypeEnum } from "@/db/schema/enums";

// Extract the tuple of enum values from the Drizzle pgEnum
const businessTypes = businessTypeEnum.enumValues;

export const businessTypeSchema = z.object({
  // @ts-expect-error Zod refine types
  businessType: z.string().min(1, "Please select a business type.").refine((val) => businessTypes.includes(val), {
    message: "Invalid business type.",
  }),
});

export const basicInfoSchema = z.object({
  name: z.string().min(2, "Business name must be at least 2 characters.").max(255),
  ownerName: z.string().min(2, "Owner name must be at least 2 characters.").max(255), // Some directories ask for contact name
  phone: z.string().min(10, "Phone number is required.").max(20),
  whatsapp: z.string().max(20).optional().or(z.literal("")),
  email: z.string().email("Invalid email address.").optional().or(z.literal("")),
  website: z.string().url("Invalid URL.").optional().or(z.literal("")),
  description: z.string().min(10, "Description should be at least 10 characters."),
  yearEstablished: z.string().optional().refine((val) => !val || (parseInt(val) >= 1800 && parseInt(val) <= new Date().getFullYear()), {
    message: "Year must be valid.",
  }),
});

export const categorySchema = z.object({
  categoryId: z.string().min(1, "Please select a primary category."),
  subcategoryId: z.string().optional().or(z.literal("")),
});

export const locationSchema = z.object({
  countryId: z.string().min(1, "Please select a country."),
  stateId: z.string().min(1, "Please select a state."),
  cityId: z.string().min(1, "Please select a city."),
  pincode: z.string().min(4, "Invalid pincode.").max(10),
  addressLine1: z.string().min(5, "Address must be at least 5 characters."),
  addressLine2: z.string().optional(),
  landmark: z.string().optional(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  serviceAreas: z.array(z.string()).optional(), // Array of City IDs
});

export const onboardingFormSchema = z.object({
  ...businessTypeSchema.shape,
  ...basicInfoSchema.shape,
  ...categorySchema.shape,
  ...locationSchema.shape,
});

export type BusinessTypeFormData = z.infer<typeof businessTypeSchema>;
export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type LocationFormData = z.infer<typeof locationSchema>;
export type OnboardingFormData = z.infer<typeof onboardingFormSchema>;
