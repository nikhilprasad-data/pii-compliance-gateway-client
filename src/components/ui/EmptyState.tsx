"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center gap-2 py-10 px-4",
        className
      )}
    >
      {icon && (
        <div className="w-9 h-9 rounded-full bg-[var(--surface-strong)] flex items-center justify-center mb-0.5 text-[var(--text-muted)]">
          {icon}
        </div>
      )}
      <p className="text-sm font-semibold text-[var(--text-secondary)]">
        {title}
      </p>
      {description && (
        <p className="text-xs text-[var(--text-muted)] max-w-xs leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
