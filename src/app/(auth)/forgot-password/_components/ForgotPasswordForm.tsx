"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/lib/auth/validators";
import { AuthCard } from "@/components/auth/AuthCard";
import { FormField } from "@/components/auth/FormField";
import { SubmitButton } from "@/components/auth/SubmitButton";

/**
 * ForgotPasswordForm — Client Component.
 * Handles the forgot-password form logic. Extracted from page.tsx
 * so that page.tsx can remain a Server Component for metadata.
 */
export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordFormData) {
    setServerError(null);
    // @ts-expect-error better-auth v1.6 types sometimes omit forgetPassword from inference
    await authClient.forgetPassword(
      { email: data.email, redirectTo: "/reset-password" },
      {
        onSuccess: () => setSent(true),
        onError: (ctx: any) =>
          setServerError(ctx.error.message ?? "Something went wrong. Please try again."),
      }
    );
  }

  if (sent) {
    return (
      <AuthCard
        title="Check your email"
        description="We've sent a password reset link to your inbox."
      >
        <div className="flex flex-col items-center py-8 text-center">
          <CheckCircle2 className="mb-4 h-14 w-14 text-emerald-500" />
          <p className="text-sm text-muted-foreground mb-6 max-w-xs">
            If an account with that email exists, you&apos;ll receive a reset link
            within a few minutes. Check your spam folder if you don&apos;t see it.
          </p>
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline underline-offset-4"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Forgot your password?"
      description="Enter your email and we'll send you a reset link."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          icon={<Mail />}
          error={errors.email?.message}
          {...register("email")}
        />

        {serverError && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/20 bg-destructive/8 px-4 py-3 text-sm text-destructive"
          >
            {serverError}
          </div>
        )}

        <SubmitButton isLoading={isSubmitting} loadingText="Sending link…">
          Send reset link
        </SubmitButton>
      </form>

      <p className="mt-7 text-center">
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to sign in
        </Link>
      </p>
    </AuthCard>
  );
}
