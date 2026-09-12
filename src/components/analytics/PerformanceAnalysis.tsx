"use client";

import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import {
  formatPercent,
  formatProcessingTime,
  formatSpeedup,
} from "@/lib/formatting/latency";
import type { CacheMetrics } from "@/types/analytics";

interface PerformanceAnalysisProps {
  cache: CacheMetrics;
}

interface StatRowProps {
  label: string;
  value: string;
  valueColor?: string;
  /** Set to true to increase value weight — used for the most important metrics */
  prominent?: boolean;
}

function StatRow({ label, value, valueColor, prominent }: StatRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 border-b border-[var(--border)] last:border-b-0">
      <dt className="text-[13px] text-[var(--text-secondary)] min-w-0 flex-1">
        {label}
      </dt>
      <dd
        className={`flex-shrink-0 text-right tabular-nums ${
          prominent ? "text-[15px] font-bold" : "text-[14px] font-semibold"
        } ${valueColor ?? "text-[var(--text-primary)]"}`}
      >
        {value}
      </dd>
    </div>
  );
}

export function PerformanceAnalysis({ cache }: PerformanceAnalysisProps) {
  const hitRatePct =
    cache.cacheHitRate !== null ? Math.round(cache.cacheHitRate * 100) : null;

  const hasData = cache.coldRequests > 0 || cache.cachedRequests > 0;

  return (
    <section aria-labelledby="performance-heading" className="flex flex-col h-full">
      <div className="mb-3">
        <h2
          id="performance-heading"
          className="text-[1.125rem] font-semibold text-[var(--text-primary)] tracking-tight"
        >
          Cache Performance
        </h2>
        <p className="mt-0.5 text-[0.8125rem] text-[var(--text-muted)]">
          Redis cache efficiency metrics for this session.
        </p>
      </div>

      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <p className="text-[0.8125rem] font-medium text-[var(--text-secondary)]">
            Cold vs. cached request breakdown
          </p>
          {cache.speedup !== null && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-[var(--radius-xs)] text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex-shrink-0">
              ⚡ {formatSpeedup(cache.speedup)} faster
            </span>
          )}
        </CardHeader>

        <CardBody className="flex-1 flex flex-col">
          {!hasData ? (
            /* No data state */
            <div className="flex-1 flex flex-col items-start justify-center gap-1.5">
              <p className="text-[13px] font-semibold text-[var(--text-secondary)]">
                No cache data yet
              </p>
              <p className="text-[12px] text-[var(--text-muted)] max-w-xs leading-relaxed">
                Run scans to populate cold request metrics, then repeat a
                payload to see Redis cache performance.
              </p>
            </div>
          ) : (
            <div className="flex flex-col flex-1 justify-between">
              <dl>
                <StatRow
                  label="Cold requests"
                  value={String(cache.coldRequests)}
                  valueColor="text-[var(--warning-text)]"
                />
                <StatRow
                  label="Cache hits"
                  value={String(cache.cachedRequests)}
                  valueColor="text-[var(--info-text)]"
                />
                <StatRow
                  label="Cache hit rate"
                  value={formatPercent(cache.cacheHitRate)}
                  valueColor={
                    cache.cacheHitRate !== null && cache.cacheHitRate >= 0.5
                      ? "text-[var(--success-text)]"
                      : undefined
                  }
                />
                <StatRow
                  label="Avg cold latency"
                  value={
                    cache.avgColdLatencyMs === null
                      ? "—"
                      : formatProcessingTime(cache.avgColdLatencyMs)
                  }
                  valueColor={
                    cache.avgColdLatencyMs !== null
                      ? "text-[var(--warning-text)]"
                      : undefined
                  }
                  prominent={cache.avgColdLatencyMs !== null}
                />
                <StatRow
                  label="Avg cached latency"
                  value={
                    cache.avgCachedLatencyMs === null
                      ? "—"
                      : formatProcessingTime(cache.avgCachedLatencyMs)
                  }
                  valueColor={
                    cache.avgCachedLatencyMs !== null
                      ? "text-[var(--info-text)]"
                      : undefined
                  }
                  prominent={cache.avgCachedLatencyMs !== null}
                />
              </dl>

              {/* Cache hit rate bar — shown whenever hit rate is available, even 0% */}
              {hitRatePct !== null && (
                <div className="mt-4 pt-4 border-t border-[var(--border)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[0.75rem] text-[var(--text-muted)]">
                      Cache hit rate
                    </span>
                    <span
                      className={`text-[12px] font-bold ${
                        hitRatePct >= 50
                          ? "text-[var(--success-text)]"
                          : "text-[var(--text-secondary)]"
                      }`}
                    >
                      {hitRatePct}%
                    </span>
                  </div>
                  <div className="h-1 rounded-full bg-[var(--surface-strong)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--success)] transition-[width] duration-500"
                      style={{ width: `${hitRatePct}%` }}
                      role="meter"
                      aria-valuenow={hitRatePct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Cache hit rate: ${hitRatePct}%`}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </CardBody>
      </Card>
    </section>
  );
}
