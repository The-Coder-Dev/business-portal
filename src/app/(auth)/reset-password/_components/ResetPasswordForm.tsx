"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/lib/auth/validators";
import { AuthCard } from "@/components/auth/AuthCard";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { SubmitButton } from "@/components/auth/SubmitButton";

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  if (!token) {
    return (
      <AuthCard
        title="Invalid reset link"
        description="This password reset link is invalid or has expired."
      >
        <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
          Request a new link →
        </Link>
      </AuthCard>
    );
  }

  if (success) {
    return (
      <AuthCard
        title="Password updated"
        description="Your password has been reset successfully."
      >
        <div className="flex flex-col items-center py-6 text-center">
          <CheckCircle2 className="mb-4 h-14 w-14 text-emerald-500" />
          <Link href="/sign-in" className="text-sm font-medium text-primary hover:underline">
            Sign in with your new password →
          </Link>
        </div>
      </AuthCard>
    );
  }

  async function onSubmit(data: ResetPasswordFormData) {
    setServerError(null);
    await authClient.resetPassword(
      { newPassword: data.password, token },
      {
        onSuccess: () => setSuccess(true),
        onError: (ctx: any) =>
          setServerError(
            ctx.error.message ?? "Reset failed. Please request a new link."
          ),
      }
    );
  }

  return (
    <AuthCard
      title="Set a new password"
      description="Choose a strong password for your account."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <PasswordInput
          label="New password"
          placeholder="Min. 8 chars, 1 uppercase, 1 number"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <PasswordInput
          label="Confirm new password"
          placeholder="Re-enter your new password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        {serverError && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/20 bg-destructive/8 px-4 py-3 text-sm text-destructive"
          >
            {serverError}
          </div>
        )}

        <SubmitButton isLoading={isSubmitting} loadingText="Updating password…">
          Update password
        </SubmitButton>
      </form>
    </AuthCard>
  );
}
