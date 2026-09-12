/**
 * Display helpers for backend processing time.
 * Values are never invented — callers must pass the measured number.
 */

function trimTrailingZeros(value: string): string {
  return value.replace(/\.?0+$/, "");
}

/**
 * Format a measured duration for UI copy.
 * Uses seconds when the value is >= 1000 ms; otherwise milliseconds.
 */
export function formatProcessingTime(ms: number): string {
  if (!Number.isFinite(ms)) return "—";

  if (ms >= 1000) {
    const seconds = ms / 1000;
    return `${seconds.toFixed(2)} s`;
  }

  if (ms >= 10) {
    const rounded = Number(ms.toFixed(1));
    return `${trimTrailingZeros(rounded.toFixed(1))} ms`;
  }

  if (ms >= 1) {
    return `${ms.toFixed(2)} ms`;
  }

  if (ms > 0) {
    return `${ms.toFixed(2)} ms`;
  }

  // Exactly 0 — show two decimal places so it is clear the value was measured
  return "0.00 ms";
}

/**
 * Chart / tooltip formatter — always milliseconds, preserving measured precision.
 */
export function formatMilliseconds(ms: number): string {
  if (!Number.isFinite(ms)) return "—";

  if (ms >= 100) {
    return `${trimTrailingZeros(ms.toFixed(1))} ms`;
  }
  if (ms >= 10) {
    return `${trimTrailingZeros(ms.toFixed(1))} ms`;
  }
  if (ms > 0) {
    return `${ms.toFixed(2)} ms`;
  }
  return "0.00 ms";
}

export function formatSpeedup(ratio: number | null): string {
  if (ratio === null || !Number.isFinite(ratio) || ratio <= 0) return "—";
  if (ratio >= 100) return `${Math.round(ratio)}×`;
  if (ratio >= 10) return `${Math.round(ratio)}×`;
  return `${ratio.toFixed(1)}×`;
}

export function formatPercent(rate: number | null): string {
  if (rate === null || !Number.isFinite(rate)) return "—";
  return `${Math.round(rate * 100)}%`;
}

export function formatClock(timestamp: number): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(timestamp));
}
