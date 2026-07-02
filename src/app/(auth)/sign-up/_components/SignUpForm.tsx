"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, User, Phone } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { signUpSchema, type SignUpFormData } from "@/lib/auth/validators";
import { AuthCard } from "@/components/auth/AuthCard";
import { FormField } from "@/components/auth/FormField";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { Separator } from "@/components/ui/separator";

/**
 * SignUpForm — Client Component.
 * Handles the full registration form logic. Extracted here so
 * the parent page.tsx can remain a Server Component (for metadata).
 *
 * After successful registration the user is always a visitor and
 * is redirected to the home page. Role is assigned by the backend only.
 */
export function SignUpForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { phone: "" },
  });

  async function onSubmit(data: SignUpFormData) {
    setServerError(null);

    await authClient.signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone || undefined,
      },
      {
        onSuccess: () => {
          // New users are always assigned role=visitor — redirect to dashboard
          router.push("/dashboard");
          router.refresh();
        },
        onError: (ctx) => {
          setServerError(
            ctx.error.message ?? "Registration failed. Please try again."
          );
        },
      }
    );
  }

  return (
    <AuthCard
      title="Create your account"
      description="Join thousands of businesses on Business Portal"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField
          label="Full name"
          type="text"
          placeholder="John Doe"
          autoComplete="name"
          icon={<User />}
          error={errors.name?.message}
          {...register("name")}
        />

        <FormField
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          icon={<Mail />}
          error={errors.email?.message}
          {...register("email")}
        />

        <FormField
          label="Phone number"
          type="tel"
          placeholder="+91 98765 43210"
          autoComplete="tel"
          icon={<Phone />}
          error={errors.phone?.message}
          {...register("phone")}
        />

        <Separator className="my-1" />

        <PasswordInput
          label="Password"
          placeholder="Min. 8 chars, 1 uppercase, 1 number"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />

        <PasswordInput
          label="Confirm password"
          placeholder="Re-enter your password"
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

        <SubmitButton isLoading={isSubmitting} loadingText="Creating account…">
          Create account
        </SubmitButton>

        <p className="text-center text-xs text-muted-foreground">
          By creating an account, you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </form>

      <p className="mt-7 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
