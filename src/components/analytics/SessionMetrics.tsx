"use client";

import { MetricCard } from "@/components/analytics/MetricCard";
import {
  formatProcessingTime,
  formatSpeedup,
} from "@/lib/formatting/latency";
import { ScanHistory } from "@/components/analytics/ScanHistory";
import type { SessionAnalytics } from "@/types/analytics";

interface SessionMetricsProps {
  analytics: SessionAnalytics;
}

export function SessionMetrics({ analytics }: SessionMetricsProps) {
  const { performance, cache } = analytics;

  // Build cache speedup detail line showing cold vs cached latency
  let cacheDetail: string | undefined;
  if (
    cache.speedup !== null &&
    cache.avgColdLatencyMs !== null &&
    cache.avgCachedLatencyMs !== null
  ) {
    cacheDetail = `Cold ${formatProcessingTime(cache.avgColdLatencyMs)} → Cached ${formatProcessingTime(cache.avgCachedLatencyMs)}`;
  }

  // Microcopy for the cache speedup hint
  const cacheHint =
    cache.speedup === null
      ? cache.cachedRequests === 0
        ? "Repeat a payload to measure Redis cache performance"
        : "Calculating — need at least one cold and one cached request"
      : "Avg cold processing time ÷ avg cached processing time";

  return (
    <section aria-labelledby="session-metrics-heading">
      {/* Section heading row */}
      <div className="mb-3 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2
            id="session-metrics-heading"
            className="text-[1.125rem] font-semibold text-[var(--text-primary)] tracking-tight"
          >
            Session Metrics
          </h2>
          <p className="mt-0.5 text-[0.8125rem] text-[var(--text-muted)]">
            Aggregated performance and security data for this session.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ScanHistory history={analytics.history} />
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          label="Total Scans"
          value={performance.totalScans.toLocaleString()}
          hint="Completed scans this session"
          accent="blue"
        />
        <MetricCard
          label="PII Detected"
          value={performance.piiEntitiesDetected.toLocaleString()}
          hint="Entities found across all scans"
          accent="red"
        />
        <MetricCard
          label="Avg Processing Time"
          value={
            performance.avgProcessingTimeMs === null
              ? "—"
              : formatProcessingTime(performance.avgProcessingTimeMs)
          }
          hint="Average backend latency per scan"
          accent="amber"
        />
        <MetricCard
          label="Cache Speedup"
          value={formatSpeedup(cache.speedup)}
          valueColor="text-emerald-600"
          badge="Redis In-Memory Cache"
          hint={cacheHint}
          detail={cacheDetail}
          accent="green"
        />
      </div>
    </section>
  );
}
