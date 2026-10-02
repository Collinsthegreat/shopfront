import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, rows = 3, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium uppercase tracking-wider text-text-secondary"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={cn(
            "w-full p-3 rounded-md border text-sm bg-surface text-text-primary transition-colors placeholder:text-text-tertiary resize-y",
            "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent",
            error
              ? "border-danger focus-visible:outline-danger"
              : "border-border hover:border-text-tertiary",
            className
          )}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error ? (
          <p id={`${inputId}-error`} className="text-xs text-danger font-medium">
            {error}
          </p>
        ) : helperText ? (
          <p className="text-xs text-text-tertiary">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
