import type { Metadata } from "next";
import { SignUpForm } from "./_components/SignUpForm";

export const metadata: Metadata = {
  title: "Create Account | Business Portal",
  description:
    "Create your free Business Portal account and start growing your business today.",
};

/**
 * Sign Up page — Server Component wrapper.
 * Keeps metadata export (impossible in Client Components) here and
 * delegates all interactive form logic to SignUpForm.
 */
export default function SignUpPage() {
  return <SignUpForm />;
}
