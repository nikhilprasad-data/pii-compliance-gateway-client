import { httpClient } from "@/lib/api/client";
import { ScanResponseSchema } from "@/lib/api/scan.schema";
import type { ScanExecution, ScanRequest } from "@/types/scan";

/**
 * POST /scan — submit a text payload to the PII scanner.
 * Round-trip time is measured in the browser around the HTTP call.
 */
export async function scanText(payload: ScanRequest): Promise<ScanExecution> {
  const started = performance.now();
  const raw = await httpClient.post<unknown>("/scan", payload);
  const clientRoundTripMs = performance.now() - started;

  const parsed = ScanResponseSchema.safeParse(raw);

  if (!parsed.success) {
    console.error("[scan-api] Response validation failed:", parsed.error.format());
    throw new Error("Unexpected API response format. Please check the backend.");
  }

  return {
    response: parsed.data,
    clientRoundTripMs,
  };
}
