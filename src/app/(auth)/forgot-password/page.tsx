import type { Metadata } from "next";
import { ForgotPasswordForm } from "./_components/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password | Business Portal",
  description:
    "Reset your Business Portal password. Enter your email to receive a secure reset link.",
};

/**
 * Forgot Password page — Server Component wrapper.
 * Metadata lives here; all interactive logic is in ForgotPasswordForm.
 */
export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
