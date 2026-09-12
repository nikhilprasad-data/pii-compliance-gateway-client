export type CachePath = "COLD" | "CACHE HIT";

export interface ScanHistoryItem {
  id: string;
  index: number;
  timestamp: number;
  status: "completed";
  piiDetected: number;
  path: CachePath;
  processingTimeMs: number;
  roundTripMs: number | null;
}

export interface PerformanceMetrics {
  totalScans: number;
  piiEntitiesDetected: number;
  avgProcessingTimeMs: number | null;
}

export interface CacheMetrics {
  coldRequests: number;
  cachedRequests: number;
  cacheHitRate: number | null;
  avgColdLatencyMs: number | null;
  avgCachedLatencyMs: number | null;
  speedup: number | null;
}

export interface PIICategory {
  category: string;
  count: number;
  percentage: number;
}

export interface SessionAnalytics {
  history: ScanHistoryItem[];
  performance: PerformanceMetrics;
  cache: CacheMetrics;
  piiCategories: PIICategory[];
}

export interface LatestScanView {
  status: "idle" | "scanning" | "completed" | "failed";
  piiDetected: number | null;
  processingTimeMs: number | null;
  roundTripMs: number | null;
  path: CachePath | null;
  cacheLabel: "HIT" | "MISS" | null;
  errorMessage: string | null;
}
