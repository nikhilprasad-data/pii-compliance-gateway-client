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
    "bg-slate-50 text-slate-600 border-slate-200",
  success:
    "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning:
    "bg-amber-50 text-amber-700 border-amber-200",
  error:
    "bg-red-50 text-red-700 border-red-200",
  info:
    "bg-blue-50 text-blue-700 border-blue-200",
  neutral:
    "bg-slate-50 text-slate-500 border-slate-200",
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
