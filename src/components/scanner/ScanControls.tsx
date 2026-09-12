"use client";

import { Button } from "@/components/ui/Button";

interface ScanControlsProps {
  charCount: number;
  charLimit: number;
  canScan: boolean;
  isScanning: boolean;
  canClear: boolean;
  onScan: () => void;
  onClear: () => void;
}

export function ScanControls({
  charCount,
  charLimit,
  canScan,
  isScanning,
  canClear,
  onScan,
  onClear,
}: ScanControlsProps) {
  const overLimit = charCount > charLimit;
  const pct = Math.min((charCount / charLimit) * 100, 100);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-0.5">
          <span
            className={`text-[12px] tabular-nums font-medium ${
              overLimit
                ? "text-[var(--danger-text)]"
                : charCount > charLimit * 0.8
                  ? "text-[var(--warning-text)]"
                  : "text-[var(--text-muted)]"
            }`}
            aria-live="polite"
          >
            {charCount.toLocaleString()} / {charLimit.toLocaleString()}
          </span>
          {/* Progress bar */}
          <div className="w-20 h-1 rounded-full bg-[var(--border)] overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-150 ${
                overLimit
                  ? "bg-[var(--danger)]"
                  : pct > 80
                    ? "bg-[var(--warning)]"
                    : "bg-[var(--primary)]"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClear}
          disabled={!canClear || isScanning}
          aria-label="Clear payload"
        >
          Clear
        </Button>
      </div>

      <Button
        id="scan-button"
        type="button"
        variant="primary"
        size="md"
        onClick={onScan}
        loading={isScanning}
        disabled={!canScan}
        aria-label="Scan payload for PII"
        className="min-w-[140px]"
      >
        {isScanning ? "Scanning…" : "Scan Payload"}
      </Button>
    </div>
  );
}
