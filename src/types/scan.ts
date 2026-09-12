/**
 * API contracts for the PII scanner.
 * Field names match the backend response exactly.
 */

export interface DetectedEntity {
  entity_type: string;
  entity_value: string;
  start_index: number;
  end_index: number;
}

export interface ScanRequest {
  text: string;
}

export interface ScanResponse {
  original_text: string;
  sanitized_text: string;
  detected_pii: DetectedEntity[];
  processing_time_ms: number;
  /** Present only if the backend explicitly reports cache status. */
  cache_hit?: boolean;
  from_cache?: boolean;
}

/**
 * Client-side wrap around a successful scan.
 * `clientRoundTripMs` is measured in the browser and is not backend processing time.
 */
export interface ScanExecution {
  response: ScanResponse;
  clientRoundTripMs: number;
}

export type ScanStatus = "idle" | "scanning" | "completed" | "failed";
