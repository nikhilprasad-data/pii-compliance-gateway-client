"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DotProps } from "recharts";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { formatProcessingTime } from "@/lib/formatting/latency";
import type { ScanHistoryItem } from "@/types/analytics";
import { BarChart2 } from "lucide-react";

interface PerformanceChartProps {
  history: ScanHistoryItem[];
}

/**
 * Chart data point.
 * `time` is clamped to ≥ 0.1 ms so log(time) is always a finite number.
 * `displayMs` preserves the original measured value for tooltip display.
 */
interface ChartDataPoint extends ScanHistoryItem {
  scanNumber: string;
  /** Clamped value used by Recharts — never 0 or negative on a log scale */
  time: number;
  /** Original measured value used for tooltip display */
  displayMs: number;
}

interface TooltipPayloadItem {
  payload: ChartDataPoint;
  value: number;
}

const COLD_COLOR = "#d97706";   // amber-600 — cold requests
const CACHE_COLOR = "#2563eb";  // blue-600 — cache hits

/** Minimum value shown on log Y-axis — prevents log(0) = -Infinity → NaN cy */
const LOG_MIN_MS = 0.1;

/** Colors each dot by its request path (cold vs cache hit) */
function CustomDot(props: DotProps & { payload?: ChartDataPoint }) {
  const { cx, cy, payload } = props;
  // Guard against non-finite coordinates — these would produce an invalid SVG circle
  if (!Number.isFinite(cx) || !Number.isFinite(cy) || !payload) return null;
  const isCacheHit = payload.path === "CACHE HIT";
  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill={isCacheHit ? CACHE_COLOR : COLD_COLOR}
      stroke="white"
      strokeWidth={1.5}
    />
  );
}

/** Larger dot on hover */
function CustomActiveDot(props: DotProps & { payload?: ChartDataPoint }) {
  const { cx, cy, payload } = props;
  // Guard against non-finite coordinates
  if (!Number.isFinite(cx) || !Number.isFinite(cy) || !payload) return null;
  const isCacheHit = payload.path === "CACHE HIT";
  return (
    <circle
      cx={cx}
      cy={cy}
      r={6}
      fill={isCacheHit ? CACHE_COLOR : COLD_COLOR}
      stroke="white"
      strokeWidth={2}
    />
  );
}

/** Y-axis tick: show seconds for large values, ms for small ones */
function formatYAxisTick(value: number): string {
  if (!Number.isFinite(value)) return "";
  if (value >= 1000) {
    const s = value / 1000;
    return `${s % 1 === 0 ? s.toFixed(0) : s.toFixed(1)}s`;
  }
  if (value >= 1) return `${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}ms`;
  return `${value.toFixed(1)}ms`;
}

function LatencyTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}) {
  if (!active || !payload?.[0]) return null;
  const point = payload[0].payload;
  const isCacheHit = point.path === "CACHE HIT";
  return (
    <div className="rounded-[var(--radius-xs)] border border-[var(--border)] bg-white px-3 py-2.5 shadow-[var(--shadow-md)] min-w-[160px]">
      <p className="text-[11px] text-[var(--text-muted)] mb-1.5 font-medium">
        Scan #{point.index}
      </p>
      <div className="flex items-center gap-1.5 mb-1">
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: isCacheHit ? CACHE_COLOR : COLD_COLOR }}
        />
        <span className="text-[12px] font-semibold text-[var(--text-secondary)]">
          {isCacheHit ? "Cache Hit (Redis)" : "Cold Request"}
        </span>
      </div>
      {/* Use displayMs (original measured value) — not the clamped `time` */}
      <p className="text-[14px] font-bold text-[var(--text-primary)] tabular-nums">
        {formatProcessingTime(point.displayMs)}
      </p>
    </div>
  );
}

function ChartLegend() {
  return (
    <div className="flex items-center justify-center gap-5">
      <span className="flex items-center gap-1.5 text-[0.75rem] text-[var(--text-muted)]">
        <span
          className="w-2 h-2 rounded-full"
          style={{ background: COLD_COLOR }}
          aria-hidden="true"
        />
        Cold Request
      </span>
      <span className="flex items-center gap-1.5 text-[0.75rem] text-[var(--text-muted)]">
        <span
          className="w-2 h-2 rounded-full"
          style={{ background: CACHE_COLOR }}
          aria-hidden="true"
        />
        Cache Hit (Redis)
      </span>
    </div>
  );
}

/** Context-aware empty state — only shown when history is truly empty */
function LatencyEmptyState() {
  return (
    <div className="flex-1 flex flex-col items-start justify-center gap-1.5 py-4">
      <div className="w-7 h-7 rounded-full bg-[var(--surface-strong)] flex items-center justify-center text-[var(--text-muted)] mb-0.5">
        <BarChart2 className="w-3.5 h-3.5" aria-hidden="true" />
      </div>
      <p className="text-[13px] font-semibold text-[var(--text-secondary)]">
        No latency data yet
      </p>
      <p className="text-[12px] text-[var(--text-muted)] leading-relaxed">
        Run a scan to populate the performance timeline.
      </p>
    </div>
  );
}

export function PerformanceChart({ history }: PerformanceChartProps) {
  /**
   * Transform history into chart data points.
   *
   * Key fix: `time` is clamped to LOG_MIN_MS (0.1 ms) so that a log Y-axis
   * always receives a positive finite number. log(0) = -Infinity produces
   * NaN SVG coordinates. The original value is kept in `displayMs` for
   * the tooltip so the user always sees the real measured latency.
   */
  const data: ChartDataPoint[] = [...history]
    .sort((a, b) => a.index - b.index)
    .map((item) => ({
      ...item,
      scanNumber: `#${item.index}`,
      displayMs: item.processingTimeMs,
      time: Math.max(LOG_MIN_MS, item.processingTimeMs),
    }));

  // Show the chart whenever there is at least one valid data point.
  // A single point renders as a standalone dot (no line segment), which is
  // informative and avoids the "need 2 points" empty-state for the first scan.
  const hasData = data.length >= 1;

  // Compute a sensible Y-axis domain so the chart is not over-scaled.
  // Lower bound: slightly below the minimum clamped value.
  // Upper bound: "auto" lets Recharts decide.
  const minTime = hasData ? Math.min(...data.map((d) => d.time)) : LOG_MIN_MS;
  const yDomainMin = Math.max(LOG_MIN_MS, minTime * 0.5);

  return (
    <section aria-labelledby="latency-chart-heading" className="flex flex-col h-full">
      <div className="mb-3">
        <h2
          id="latency-chart-heading"
          className="text-[1.125rem] font-semibold text-[var(--text-primary)] tracking-tight"
        >
          Request Latency
        </h2>
        <p className="mt-0.5 text-[0.8125rem] text-[var(--text-muted)]">
          Backend processing time per scan — logarithmic scale.
        </p>
      </div>

      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <p className="text-[0.8125rem] font-medium text-[var(--text-secondary)]">
            Processing time by scan sequence
          </p>
        </CardHeader>
        <CardBody className="flex-1 flex flex-col gap-3">
          {!hasData ? (
            <LatencyEmptyState />
          ) : (
            <>
              <div className="h-52 md:h-60 min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={data}
                    margin={{ top: 6, right: 8, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      stroke="#e2e8f0"
                      vertical={false}
                      strokeDasharray="3 5"
                      strokeOpacity={0.7}
                    />
                    <XAxis
                      dataKey="scanNumber"
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      axisLine={{ stroke: "#e2e8f0" }}
                      tickLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#64748b" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={formatYAxisTick}
                      width={52}
                      scale="log"
                      domain={[yDomainMin, "auto"]}
                      allowDataOverflow
                    />
                    <Tooltip
                      content={<LatencyTooltip />}
                      cursor={{ stroke: "rgba(15,23,42,0.05)", strokeWidth: 1 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="time"
                      stroke="#cbd5e1"
                      strokeWidth={1.5}
                      dot={<CustomDot />}
                      activeDot={<CustomActiveDot />}
                      isAnimationActive={true}
                      legendType="none"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <ChartLegend />
            </>
          )}
        </CardBody>
      </Card>
    </section>
  );
}
