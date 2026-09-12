"use client";

import { Card, CardBody } from "@/components/ui/Card";
import { formatEntityCount } from "@/lib/formatting/pii";
import { formatProcessingTime } from "@/lib/formatting/latency";
import type { LatestScanView } from "@/types/analytics";

interface LatestScanProps {
  latest: LatestScanView;
}

// ── Individual mini metric card ───────────────────────────────────────────────
interface ScanMetricCardProps {
  label: string;
  children: React.ReactNode;
}

function ScanMetricCard({ label, children }: ScanMetricCardProps) {
  return (
    <div className="border border-[var(--border)] rounded-[var(--radius-sm)] bg-[var(--surface-subtle)] p-4 flex flex-col gap-1 min-w-0">
      <dt className="text-[0.75rem] font-semibold text-[var(--text-muted)] uppercase tracking-[0.07em] leading-none">
        {label}
      </dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  );
}

export function LatestScan({ latest }: LatestScanProps) {
  return (
    <section aria-labelledby="latest-scan-heading">
      {/* Section heading — no redundant "Awaiting scan" pill when idle */}
      <div className="flex items-baseline justify-between gap-3 mb-3">
        <h2
          id="latest-scan-heading"
          className="text-[1.125rem] font-semibold text-[var(--text-primary)] tracking-tight"
        >
          Latest Scan
        </h2>

        {/* Show status pill only when actively scanning or completed/failed */}
        {latest.status === "scanning" && (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border flex-shrink-0 bg-blue-50 text-blue-600 border-blue-200"
            aria-live="polite"
            aria-atomic="true"
          >
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-blue-500 animate-pulse" aria-hidden="true" />
            Scanning
          </span>
        )}
        {latest.status === "completed" && (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border flex-shrink-0 bg-emerald-50 text-emerald-700 border-emerald-200"
            aria-live="polite"
            aria-atomic="true"
          >
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-emerald-500" aria-hidden="true" />
            Completed
          </span>
        )}
        {latest.status === "failed" && (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border flex-shrink-0 bg-red-50 text-red-700 border-red-200"
            aria-live="polite"
            aria-atomic="true"
          >
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-red-500" aria-hidden="true" />
            Failed
          </span>
        )}
      </div>

      <Card>
        <CardBody>
          {latest.status === "idle" ? (
            /* Compact idle state — no pill, just a quiet hint */
            <p className="text-[0.8125rem] text-[var(--text-muted)]">
              Run a scan to see PII count, processing time, and cache path.
            </p>
          ) : latest.status === "scanning" ? (
            <p className="text-[0.8125rem] text-[var(--text-muted)]">
              Analyzing payload for PII…
            </p>
          ) : latest.status === "failed" ? (
            <div>
              <p className="text-[0.75rem] font-semibold text-[var(--danger-text)]">
                Scan failed
              </p>
              {latest.errorMessage && (
                <p className="text-[0.6875rem] text-[var(--text-muted)] mt-0.5">
                  {latest.errorMessage}
                </p>
              )}
            </div>
          ) : (
            /* Completed — four individual metric cards */
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* 1. PII Detected */}
              <ScanMetricCard label="PII Detected">
                <span
                  className={`text-[1.375rem] font-extrabold leading-tight tracking-tight tabular-nums ${
                    latest.piiDetected !== null && latest.piiDetected > 0
                      ? "text-[var(--danger-text)]"
                      : "text-[var(--success-text)]"
                  }`}
                >
                  {latest.piiDetected === null
                    ? "—"
                    : formatEntityCount(latest.piiDetected)}
                </span>
              </ScanMetricCard>

              {/* 2. Processing Time */}
              <ScanMetricCard label="Processing Time">
                <span className="text-[1.375rem] font-extrabold leading-tight tracking-tight tabular-nums font-mono text-[var(--text-primary)]">
                  {latest.processingTimeMs === null
                    ? "—"
                    : formatProcessingTime(latest.processingTimeMs)}
                </span>
              </ScanMetricCard>

              {/* 3. Cache Path */}
              <ScanMetricCard label="Cache Path">
                {latest.path === null ? (
                  <span className="text-[1.375rem] font-extrabold leading-tight text-[var(--text-muted)]">—</span>
                ) : latest.path === "CACHE HIT" ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 mt-1 rounded-[var(--radius-xs)] text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ⚡ Cache Hit (Redis)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 mt-1 rounded-[var(--radius-xs)] text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    🧠 Cold Request
                  </span>
                )}
              </ScanMetricCard>

              {/* 4. Round Trip */}
              <ScanMetricCard label="Round Trip">
                <span className="text-[1.375rem] font-extrabold leading-tight tracking-tight tabular-nums font-mono text-[var(--text-primary)]">
                  {latest.roundTripMs === null
                    ? "—"
                    : formatProcessingTime(latest.roundTripMs)}
                </span>
              </ScanMetricCard>
            </dl>
          )}
        </CardBody>
      </Card>
    </section>
  );
}
