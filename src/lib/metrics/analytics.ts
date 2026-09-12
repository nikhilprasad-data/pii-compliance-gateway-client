import type {
  CacheMetrics,
  PIICategory,
  PerformanceMetrics,
  ScanHistoryItem,
  SessionAnalytics,
} from "@/types/analytics";
import type { ScanExecution } from "@/types/scan";
import { resolveCacheHit } from "@/lib/metrics/cache-path";

export const emptyAnalytics: SessionAnalytics = {
  history: [],
  performance: {
    totalScans: 0,
    piiEntitiesDetected: 0,
    avgProcessingTimeMs: null,
  },
  cache: {
    coldRequests: 0,
    cachedRequests: 0,
    cacheHitRate: null,
    avgColdLatencyMs: null,
    avgCachedLatencyMs: null,
    speedup: null,
  },
  piiCategories: [],
};

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  const sum = values.reduce((acc, value) => acc + value, 0);
  return sum / values.length;
}

export function computeCacheMetrics(history: ScanHistoryItem[]): CacheMetrics {
  const cold = history.filter((item) => item.path === "COLD");
  const cached = history.filter((item) => item.path === "CACHE HIT");
  const avgColdLatencyMs = average(cold.map((item) => item.processingTimeMs));
  const avgCachedLatencyMs = average(cached.map((item) => item.processingTimeMs));

  const coldRequests = cold.length;
  const cachedRequests = cached.length;
  const total = history.length;

  let speedup: number | null = null;
  if (
    avgColdLatencyMs !== null &&
    avgCachedLatencyMs !== null &&
    avgCachedLatencyMs > 0
  ) {
    speedup = avgColdLatencyMs / avgCachedLatencyMs;
  }

  return {
    coldRequests,
    cachedRequests,
    cacheHitRate: total > 0 ? cachedRequests / total : null,
    avgColdLatencyMs,
    avgCachedLatencyMs,
    speedup,
  };
}

export function computePerformanceMetrics(
  history: ScanHistoryItem[]
): PerformanceMetrics {
  const totalScans = history.length;
  const piiEntitiesDetected = history.reduce(
    (sum, item) => sum + item.piiDetected,
    0
  );
  const avgProcessingTimeMs = average(
    history.map((item) => item.processingTimeMs)
  );

  return {
    totalScans,
    piiEntitiesDetected,
    avgProcessingTimeMs,
  };
}

export function computePiiCategories(
  counts: Record<string, number>
): PIICategory[] {
  const entries = Object.entries(counts);
  const total = entries.reduce((sum, [, count]) => sum + count, 0);

  return entries
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => ({
      category,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }));
}

export function appendScan(
  state: SessionAnalytics,
  categoryCounts: Record<string, number>,
  execution: ScanExecution
): { analytics: SessionAnalytics; categoryCounts: Record<string, number> } {
  const { response, clientRoundTripMs } = execution;
  const cacheHit = resolveCacheHit(response);
  const nextCounts = { ...categoryCounts };

  for (const entity of response.detected_pii) {
    nextCounts[entity.entity_type] = (nextCounts[entity.entity_type] ?? 0) + 1;
  }

  const item: ScanHistoryItem = {
    id: `scan-${Date.now()}-${state.history.length + 1}`,
    index: state.history.length + 1,
    timestamp: Date.now(),
    status: "completed",
    piiDetected: response.detected_pii.length,
    path: cacheHit ? "CACHE HIT" : "COLD",
    processingTimeMs: response.processing_time_ms,
    roundTripMs: clientRoundTripMs,
  };

  const history = [...state.history, item];
  const performance = computePerformanceMetrics(history);
  const cache = computeCacheMetrics(history);
  const piiCategories = computePiiCategories(nextCounts);

  return {
    categoryCounts: nextCounts,
    analytics: {
      history,
      performance,
      cache,
      piiCategories,
    },
  };
}
