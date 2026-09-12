import type { ScanResponse } from "@/types/scan";

/**
 * When the API does not return an explicit cache flag, a processing time
 * under this threshold is treated as a Redis cache hit. This matches the
 * existing client heuristic and is not a fabricated latency value.
 */
export const CACHE_HIT_PROCESSING_THRESHOLD_MS = 100;

export function resolveCacheHit(response: ScanResponse): boolean {
  if (typeof response.cache_hit === "boolean") return response.cache_hit;
  if (typeof response.from_cache === "boolean") return response.from_cache;
  return response.processing_time_ms < CACHE_HIT_PROCESSING_THRESHOLD_MS;
}
