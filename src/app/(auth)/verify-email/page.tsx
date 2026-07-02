import type { Metadata } from "next";
import { VerifyEmailContent } from "./_components/VerifyEmailContent";

export const metadata: Metadata = {
  title: "Verify Email | Business Portal",
  description: "Verify your email address for Business Portal.",
};

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export default async function VerifyEmailPage({ searchParams }: Props) {
  const { token = "" } = await searchParams;
  return <VerifyEmailContent token={token} />;
}
