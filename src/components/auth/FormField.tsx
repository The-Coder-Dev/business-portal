"use client";

import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FormFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  /** Optional icon rendered on the left inside the input */
  icon?: React.ReactNode;
}

/**
 * FormField — Labeled input with optional icon and inline error message.
 * Fully accessible: aria-invalid, aria-describedby wired automatically.
 */
export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, icon, className, id, name, ...props }, ref) => {
    const fieldId = id ?? name;

    return (
      <div className="space-y-1.5">
        <Label htmlFor={fieldId} className="text-sm font-medium leading-none">
          {label}
        </Label>
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground [&_svg]:h-4 [&_svg]:w-4">
              {icon}
            </span>
          )}
          <Input
            id={fieldId}
            name={name}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            className={cn(
              icon && "pl-10",
              error && "border-destructive focus-visible:ring-destructive/40",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p
            id={`${fieldId}-error`}
            role="alert"
            className="text-xs text-destructive"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);
FormField.displayName = "FormField";
