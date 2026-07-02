/**
 * src/components/auth/index.ts
 * ────────────────────────────
 * Barrel export for all reusable authentication UI components.
 *
 * Usage:
 *   import { AuthCard, FormField, PasswordInput, SubmitButton } from "@/components/auth"
 */

export { AuthCard } from "./AuthCard";
export type { } from "./AuthCard"; // re-export any named types if added later
export { FormField } from "./FormField";
export type { FormFieldProps } from "./FormField";
export { PasswordInput } from "./PasswordInput";
export type { PasswordInputProps } from "./PasswordInput";
export { SubmitButton } from "./SubmitButton";
