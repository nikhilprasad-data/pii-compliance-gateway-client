"use client";

import { formatEntityLabel } from "@/lib/formatting/pii";
import type { PIICategory } from "@/types/analytics";
import { Card, CardBody } from "@/components/ui/Card";

interface PIIBreakdownProps {
  categories: PIICategory[];
  /** Total completed scans — used to distinguish "no scans yet" vs "scans ran but no PII found" */
  totalScans: number;
}

/**
 * Severity-based color mapping for PII entity types.
 * Critical identifiers (financial, government IDs) → red
 * Contact / communication channels → amber
 * Location / address data → blue
 * Everything else (names, etc.) → violet
 */
const CRITICAL = new Set([
  "CREDIT_CARD", "US_SSN", "SSN", "US_BANK_NUMBER", "IBAN_CODE",
  "CRYPTO", "MEDICAL_LICENSE", "US_PASSPORT", "UK_NHS",
]);
const CONTACT = new Set([
  "EMAIL_ADDRESS", "EMAIL", "PHONE_NUMBER", "PHONE", "IP_ADDRESS", "URL",
]);
const LOCATION = new Set(["LOCATION", "ADDRESS", "US_DRIVER_LICENSE", "NRP"]);

function getSeverityClasses(category: string): {
  row: string;
  dot: string;
} {
  const n = category.toUpperCase().replace(/\s+/g, "_");
  if (CRITICAL.has(n))
    return { row: "text-red-700", dot: "bg-red-400" };
  if (CONTACT.has(n))
    return { row: "text-amber-700", dot: "bg-amber-400" };
  if (LOCATION.has(n))
    return { row: "text-blue-700", dot: "bg-blue-400" };
  return { row: "text-violet-700", dot: "bg-violet-400" };
}

export function PIIBreakdown({ categories, totalScans }: PIIBreakdownProps) {
  const totalEntities = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <section aria-labelledby="pii-breakdown-heading">
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <h2
          id="pii-breakdown-heading"
          className="text-[1.125rem] font-semibold text-[var(--text-primary)] tracking-tight"
        >
          PII Detection Breakdown
        </h2>
        {totalEntities > 0 && (
          <span className="text-[0.8125rem] text-[var(--text-muted)] flex-shrink-0">
            {totalEntities} total entit{totalEntities === 1 ? "y" : "ies"}
          </span>
        )}
      </div>

      <Card>
        <CardBody>
          {categories.length === 0 ? (
            totalScans === 0 ? (
              /* No scans have run yet */
              <p className="text-[12px] text-[var(--text-muted)]">
                Entity categories detected across all scans will appear here.
              </p>
            ) : (
              /* Scans ran but nothing detected */
              <p className="text-[12px] text-[var(--success-text)] font-medium">
                No PII detected across {totalScans} scan{totalScans === 1 ? "" : "s"} — all payloads are clean.
              </p>
            )
          ) : (
            <div className="flex flex-col">
              {/* Category rows — compact analytical list */}
              <div className="flex flex-col divide-y divide-[var(--border)]">
                {categories
                  .slice()
                  .sort((a, b) => b.count - a.count)
                  .map((item) => {
                    const { row, dot } = getSeverityClasses(item.category);
                    const barPct =
                      totalEntities > 0
                        ? Math.round((item.count / totalEntities) * 100)
                        : 0;
                    return (
                      <div
                        key={item.category}
                        className="flex items-center gap-3 py-2 first:pt-0 last:pb-0"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`}
                          aria-hidden="true"
                        />
                        <span className={`text-[0.8125rem] font-semibold flex-1 min-w-0 truncate ${row}`}>
                          {formatEntityLabel(item.category)}
                        </span>
                        {/* Compact bar */}
                        <div className="w-20 h-1 rounded-full bg-[var(--surface-strong)] overflow-hidden flex-shrink-0">
                          <div
                            className={`h-full rounded-full ${dot}`}
                            style={{ width: `${barPct}%` }}
                            aria-hidden="true"
                          />
                        </div>
                        <span className="text-[0.8125rem] font-bold text-[var(--text-primary)] tabular-nums w-6 text-right flex-shrink-0">
                          {item.count}
                        </span>
                      </div>
                    );
                  })}
              </div>

              {/* Legend — only when categories exist */}
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-x-4 gap-y-1 pt-3 mt-2 border-t border-[var(--border)]">
                  {[
                    { dot: "bg-red-400", label: "Critical / Financial" },
                    { dot: "bg-amber-400", label: "Contact / Communication" },
                    { dot: "bg-blue-400", label: "Location / Identity" },
                    { dot: "bg-violet-400", label: "Personal / Other" },
                  ].map(({ dot, label }) => (
                    <span
                      key={label}
                      className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                      {label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardBody>
      </Card>
    </section>
  );
}
