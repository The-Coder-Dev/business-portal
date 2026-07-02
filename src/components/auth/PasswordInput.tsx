"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
}

/**
 * PasswordInput — Password field with show/hide toggle.
 * Derives field id from `name` prop if `id` is not provided.
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, className, id, name, ...props }, ref) => {
    const [show, setShow] = useState(false);
    const fieldId = id ?? name;

    return (
      <div className="space-y-1.5">
        <Label htmlFor={fieldId} className="text-sm font-medium leading-none">
          {label}
        </Label>
        <div className="relative">
          <Input
            id={fieldId}
            name={name}
            ref={ref}
            type={show ? "text" : "password"}
            aria-invalid={!!error}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            className={cn(
              "pr-10",
              error && "border-destructive focus-visible:ring-destructive/40",
              className
            )}
            {...props}
          />
          <button
            type="button"
            aria-label={show ? "Hide password" : "Show password"}
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {show ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
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
PasswordInput.displayName = "PasswordInput";
