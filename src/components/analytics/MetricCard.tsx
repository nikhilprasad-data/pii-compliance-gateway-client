"use client";

import { Card, CardBody } from "@/components/ui/Card";

interface MetricCardProps {
  label: string;
  value: string;
  valueColor?: string;
  subtitle?: string;
  /** Shown as a small inline tag below the value */
  badge?: string;
  /** Secondary line below badge — monospaced breakdown detail */
  detail?: string;
  hint?: string;
  accent?: "blue" | "green" | "amber" | "red";
}

const accentColors: Record<NonNullable<MetricCardProps["accent"]>, string> = {
  blue: "bg-[var(--primary)]",
  green: "bg-[var(--success)]",
  amber: "bg-[var(--warning)]",
  red: "bg-[var(--danger)]",
};

const accentBadgeColors: Record<NonNullable<MetricCardProps["accent"]>, string> = {
  blue: "bg-[var(--primary-subtle)] text-[var(--primary)] border-[var(--primary-border)]",
  green: "bg-[var(--success-subtle)] text-[var(--success-text)] border-[var(--success-border)]",
  amber: "bg-[var(--warning-subtle)] text-[var(--warning-text)] border-[var(--warning-border)]",
  red: "bg-[var(--danger-subtle)] text-[var(--danger-text)] border-[var(--danger-border)]",
};

export function MetricCard({
  label,
  value,
  valueColor,
  subtitle,
  badge,
  hint,
  detail,
  accent = "blue",
}: MetricCardProps) {
  const isEmpty = value === "—";

  return (
    <Card className="h-full overflow-hidden">
      {/* Top accent bar */}
      <div
        className={`h-0.5 w-full ${accentColors[accent]}`}
        aria-hidden="true"
      />
      <CardBody className="flex flex-col min-w-0 gap-1">
        {/* Label */}
        <p className="text-[0.75rem] font-semibold text-[var(--text-muted)] uppercase tracking-[0.06em]">
          {label}
        </p>

        {/* Primary value */}
        <p
          className={`text-[1.75rem] leading-none font-extrabold tracking-tight tabular-nums ${
            isEmpty
              ? "text-[var(--text-muted)]"
              : (valueColor ?? "text-[var(--text-primary)]")
          }`}
        >
          {value}
        </p>

        {/* Badge — rendered as a subtle tag */}
        {badge && !isEmpty && (
          <span
            className={`self-start mt-0.5 inline-flex items-center px-1.5 py-px rounded text-[0.6875rem] font-semibold border ${accentBadgeColors[accent]}`}
          >
            {badge}
          </span>
        )}

        {/* Detail — monospaced breakdown (e.g. "Cold 3.36 s → Cached 1.00 ms") */}
        {detail && !isEmpty && (
          <p className="text-[0.75rem] font-mono text-[var(--text-secondary)] leading-snug">
            {detail}
          </p>
        )}

        {/* Subtitle override */}
        {subtitle && (
          <p className="text-[0.75rem] font-medium text-[var(--text-secondary)]">
            {subtitle}
          </p>
        )}

        {/* Hint — always shown, changes based on empty state */}
        {hint && (
          <p className="text-[0.75rem] text-[var(--text-muted)] leading-snug line-clamp-2 mt-auto pt-1">
            {hint}
          </p>
        )}
      </CardBody>
    </Card>
  );
}
