import type { Metadata } from "next";
import Link from "next/link";
import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "403 — Access Denied | Business Portal",
  description: "You do not have permission to access this page.",
};

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-destructive/20 bg-destructive/8 mb-6">
        <ShieldX className="h-10 w-10 text-destructive" />
      </div>

      <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-2">
        Error 403
      </p>
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
        Access Denied
      </h1>
      <p className="max-w-sm text-muted-foreground leading-relaxed mb-10">
        You don&apos;t have permission to view this page. If you believe this is a
        mistake, contact your administrator.
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        <Button asChild>
          <Link href="/">Go to Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/sign-in">Sign in with another account</Link>
        </Button>
      </div>
    </div>
  );
}
