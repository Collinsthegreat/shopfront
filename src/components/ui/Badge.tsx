import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "accent" | "danger" | "success" | "outline";
}

export function Badge({
  className,
  variant = "neutral",
  children,
  ...props
}: BadgeProps): React.JSX.Element {
  const variantStyles = {
    neutral: "bg-border-subtle text-text-secondary border-border",
    accent: "bg-accent text-accent-contrast border-transparent",
    danger: "bg-danger-bg text-danger border-transparent",
    success: "bg-border-subtle text-text-primary border-border",
    outline: "bg-transparent text-text-secondary border-border",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium tracking-wide uppercase border",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
