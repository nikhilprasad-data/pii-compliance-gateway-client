"use client";

import { cn } from "@/lib/utils/cn";

interface LoadingStateProps {
  title: string;
  description?: string;
  className?: string;
}

export function LoadingState({
  title,
  description,
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-10 px-4",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div
        className="w-5 h-5 border-2 border-[var(--border-strong)] border-t-[var(--primary)] rounded-full animate-spin"
        aria-hidden="true"
      />
      <p className="text-sm font-medium text-[var(--text-secondary)]">{title}</p>
      {description && (
        <p className="text-xs text-[var(--text-muted)]">{description}</p>
      )}
    </div>
  );
}
