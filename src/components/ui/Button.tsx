import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors select-none focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-md";

    const variantStyles = {
      primary:
        "bg-accent text-accent-contrast hover:bg-accent-hover focus-visible:outline-accent",
      secondary:
        "bg-surface text-text-primary border border-border hover:bg-canvas focus-visible:outline-border",
      outline:
        "bg-transparent text-text-primary border border-border hover:bg-surface focus-visible:outline-border",
      ghost:
        "bg-transparent text-text-primary hover:bg-surface focus-visible:outline-border",
      danger:
        "bg-danger text-white hover:opacity-90 focus-visible:outline-danger",
    };

    const sizeStyles = {
      sm: "h-9 min-h-[36px] px-3 text-xs gap-1.5",
      md: "h-11 min-h-[44px] px-4 text-sm gap-2",
      lg: "h-12 min-h-[48px] px-6 text-base gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
