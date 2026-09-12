import { z } from "zod";

export const ScanRequestSchema = z.object({
  text: z
    .string()
    .min(1, "Input text cannot be empty")
    .max(50_000, "Input too long (max 50,000 characters)"),
});

export const DetectedEntitySchema = z.object({
  entity_type: z.string(),
  entity_value: z.string(),
  start_index: z.number().int().nonnegative(),
  end_index: z.number().int().nonnegative(),
});

export const ScanResponseSchema = z.object({
  original_text: z.string(),
  sanitized_text: z.string(),
  detected_pii: z.array(DetectedEntitySchema),
  processing_time_ms: z.number().nonnegative(),
  cache_hit: z.boolean().optional(),
  from_cache: z.boolean().optional(),
});
