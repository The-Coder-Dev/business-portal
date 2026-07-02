import type { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

/**
 * AuthCard — Shared wrapper for all auth forms.
 * Renders the page heading and description above the form slot.
 */
export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <div className="w-full">
      <div className="mb-7">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
        <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">{description}</p>
      </div>
      {children}
    </div>
  );
}
