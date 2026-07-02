"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { AuthCard } from "@/components/auth/AuthCard";

interface VerifyEmailContentProps {
  token: string;
}

export function VerifyEmailContent({ token }: VerifyEmailContentProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error"
  );

  useEffect(() => {
    if (!token) return;

    authClient
      .verifyEmail({ query: { token } })
      .then(() => {
        setStatus("success");
        setTimeout(() => router.push("/"), 2500);
      })
      .catch(() => setStatus("error"));
  }, [token, router]);

  const content = {
    loading: {
      title: "Verifying your email",
      description: "Please wait while we verify your email address…",
      icon: <Loader2 className="h-14 w-14 animate-spin text-primary" />,
      body: null,
    },
    success: {
      title: "Email verified!",
      description: "Your email has been verified successfully.",
      icon: <CheckCircle2 className="h-14 w-14 text-emerald-500" />,
      body: (
        <p className="text-sm text-muted-foreground">
          Redirecting you to the home page…
        </p>
      ),
    },
    error: {
      title: "Verification failed",
      description: "This link is invalid or has expired.",
      icon: <XCircle className="h-14 w-14 text-destructive" />,
      body: (
        <Link
          href="/sign-in"
          className="text-sm font-medium text-primary hover:underline"
        >
          Back to sign in →
        </Link>
      ),
    },
  }[status];

  return (
    <AuthCard title={content.title} description={content.description}>
      <div className="flex flex-col items-center py-8 text-center gap-4">
        {content.icon}
        {content.body}
      </div>
    </AuthCard>
  );
}
