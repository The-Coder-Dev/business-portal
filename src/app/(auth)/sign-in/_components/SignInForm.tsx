"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { signInSchema, type SignInFormData } from "@/lib/auth/validators";
import { ROLE_REDIRECTS } from "@/lib/auth/roles";
import { AuthCard } from "@/components/auth/AuthCard";
import { FormField } from "@/components/auth/FormField";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { SubmitButton } from "@/components/auth/SubmitButton";

interface SignInFormProps {
  callbackUrl?: string;
}

export function SignInForm({ callbackUrl }: SignInFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  async function onSubmit(data: SignInFormData) {
    setServerError(null);

    await authClient.signIn.email(
      { email: data.email, password: data.password },
      {
        onSuccess: (ctx) => {
          const role = ctx.data?.user?.role as keyof typeof ROLE_REDIRECTS | undefined;
          const destination =
            callbackUrl ?? (role ? ROLE_REDIRECTS[role] : null) ?? "/";
          router.push(destination);
          router.refresh();
        },
        onError: (ctx) => {
          setServerError(
            ctx.error.message ?? "Invalid email or password. Please try again."
          );
        },
      }
    );
  }

  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to your Business Portal account"
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

        <div className="space-y-1">
          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <div className="flex justify-end pt-0.5">
            <Link
              href="/forgot-password"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {serverError && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/20 bg-destructive/8 px-4 py-3 text-sm text-destructive"
          >
            {serverError}
          </div>
        )}

        <SubmitButton isLoading={isSubmitting} loadingText="Signing in…">
          Sign in
        </SubmitButton>
      </form>

      <p className="mt-7 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Create one free
        </Link>
      </p>
    </AuthCard>
  );
}
