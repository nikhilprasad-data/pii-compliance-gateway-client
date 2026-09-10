"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-md)]">
        <h1 className="text-lg font-semibold text-[var(--text-primary)]">Something went wrong</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          The dashboard hit an unexpected error. You can retry or return to the scanner.
        </p>
        {process.env.NODE_ENV === "development" && (
          <pre className="text-left text-xs text-[var(--danger)] bg-[var(--surface-strong)] border border-[var(--border)] rounded-md p-3 overflow-auto max-h-32">
            {error.message}
          </pre>
        )}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="md" onClick={() => router.push("/")}>
            Home
          </Button>
          <Button variant="primary" size="md" onClick={reset}>
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
