"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center gap-1.5 font-medium rounded-[var(--radius-xs)] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed select-none active:translate-y-px";

    const variants = {
      primary:
        "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] border border-transparent shadow-[var(--shadow-sm)]",
      secondary:
        "bg-white text-[var(--text-primary)] hover:bg-[var(--surface-strong)] border border-[var(--border)] shadow-[var(--shadow-sm)]",
      ghost:
        "bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-strong)]",
      danger:
        "bg-[var(--danger)] text-white hover:bg-[var(--danger-text)] border border-transparent shadow-[var(--shadow-sm)]",
      outline:
        "border border-[var(--border)] text-[var(--text-secondary)] bg-white hover:bg-[var(--surface-strong)] hover:text-[var(--text-primary)]",
    };

    const sizes = {
      sm: "px-2.5 py-1.5 text-[12px] leading-none",
      md: "px-3.5 py-2 text-sm",
      lg: "px-5 py-2.5 text-sm",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && (
          <span
            className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
