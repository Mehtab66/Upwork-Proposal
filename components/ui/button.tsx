"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const variants = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-hover shadow-md shadow-primary/20",
  secondary:
    "bg-primary-light text-primary hover:bg-primary/10 border border-primary/20",
  outline:
    "border border-border bg-transparent hover:bg-primary-light hover:border-primary/30 text-foreground",
  ghost: "bg-transparent hover:bg-primary-light text-foreground",
  danger:
    "bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/20",
};

const sizes = {
  sm: "h-9 px-4 text-sm rounded-xl",
  md: "h-11 px-6 text-sm rounded-xl",
  lg: "h-12 px-8 text-base rounded-2xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200",
          "hover:scale-[1.02] active:scale-[0.98]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
          "disabled:opacity-50 disabled:pointer-events-none disabled:hover:scale-100 cursor-pointer",
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
