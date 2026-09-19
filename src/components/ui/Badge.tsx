"use client";

import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantMap: Record<BadgeVariant, string> = {
  default:
    "bg-[var(--surface-strong)] text-[var(--text-secondary)] border-[var(--border-strong)]",
  success:
    "bg-[var(--success-subtle)] text-[var(--success-text)] border-[var(--success-border)]",
  warning:
    "bg-[var(--warning-subtle)] text-[var(--warning-text)] border-[var(--warning-border)]",
  error:
    "bg-[var(--danger-subtle)] text-[var(--danger-text)] border-[var(--danger-border)]",
  info:
    "bg-[var(--info-subtle)] text-[var(--info-text)] border-[var(--info-border)]",
  neutral:
    "bg-[var(--surface-strong)] text-[var(--text-muted)] border-[var(--border)]",
};

export function Badge({
  variant = "default",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--radius-xs)] text-[11px] font-semibold border tracking-[0.01em]",
        variantMap[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
