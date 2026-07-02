import type { Metadata } from "next";
import { SignInForm } from "./_components/SignInForm";

export const metadata: Metadata = {
  title: "Sign In | Business Portal",
  description: "Sign in to your Business Portal account.",
};

type Props = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

/**
 * Sign In page — Server Component wrapper.
 * Reads callbackUrl from searchParams (Next.js 15 async API) and
 * passes it down to the client form so post-login redirect works.
 */
export default async function SignInPage({ searchParams }: Props) {
  const { callbackUrl } = await searchParams;
  return <SignInForm callbackUrl={callbackUrl} />;
}
