/**
 * Environment configuration — validated at build time.
 * All NEXT_PUBLIC_* vars are inlined by the Next.js bundler.
 */
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl && typeof window === "undefined") {
  // Only warn server-side; client has bundled value
  console.warn("[env] NEXT_PUBLIC_API_URL is not set — falling back to default.");
}

export const env = {
  apiUrl: apiUrl ?? "http://127.0.0.1:8000/api/v1",
} as const;
