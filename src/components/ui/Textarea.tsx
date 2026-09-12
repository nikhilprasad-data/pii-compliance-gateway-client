"use client";

import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-white text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
          "px-3.5 py-3 text-sm font-mono leading-relaxed resize-none",
          "transition-colors duration-150",
          "focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15",
          error &&
            "border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger)]/15",
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
