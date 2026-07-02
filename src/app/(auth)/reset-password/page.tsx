import type { Metadata } from "next";
import { ResetPasswordForm } from "./_components/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password | Business Portal",
  description: "Set a new password for your Business Portal account.",
};

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token = "" } = await searchParams;
  return <ResetPasswordForm token={token} />;
}
