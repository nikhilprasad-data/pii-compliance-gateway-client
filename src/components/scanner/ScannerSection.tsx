"use client";

import { useCallback, useState } from "react";
import { RawPayloadPanel } from "@/components/scanner/RawPayloadPanel";
import { SanitizedOutputPanel } from "@/components/scanner/SanitizedOutputPanel";
import { useScan } from "@/hooks/useScan";
import { ScanRequestSchema } from "@/lib/api/scan.schema";
import type { ScanExecution, ScanResponse } from "@/types/scan";

interface ScannerSectionProps {
  onScanStart: () => void;
  onScanComplete: (execution: ScanExecution) => void;
  onScanError: (message: string) => void;
}

export function ScannerSection({
  onScanStart,
  onScanComplete,
  onScanError,
}: ScannerSectionProps) {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<ScanResponse | null>(null);
  const [showPresets, setShowPresets] = useState(false);

  const scanMutation = useScan(
    (execution) => {
      setResult(execution.response);
      onScanComplete(execution);
    },
    (error) => {
      onScanError(error.message);
    }
  );

  const handleScan = useCallback(() => {
    const parsed = ScanRequestSchema.safeParse({ text: inputText.trim() });
    if (!parsed.success) {
      onScanError(parsed.error.issues[0]?.message ?? "Invalid payload");
      return;
    }
    onScanStart();
    scanMutation.mutate(parsed.data);
  }, [inputText, onScanError, onScanStart, scanMutation]);

  const handlePreset = useCallback((text: string) => {
    setInputText(text);
    setShowPresets(false);
    setResult(null);
  }, []);

  const handleClear = useCallback(() => {
    setInputText("");
    setResult(null);
  }, []);

  return (
    <section aria-labelledby="scanner-heading">
      {/* Section header */}
      <div className="mb-4">
        <h2
          id="scanner-heading"
          className="text-[1.25rem] font-bold text-[var(--text-primary)] tracking-tight"
        >
          PII Scanner
        </h2>
        <p className="mt-1 text-[0.875rem] text-[var(--text-muted)]">
          Detect and redact sensitive information before it reaches downstream systems.
          Use{" "}
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-[var(--surface-strong)] border border-[var(--border)] rounded text-[var(--text-secondary)]">
            ⌘ Enter
          </kbd>{" "}
          to scan.
        </p>
      </div>

      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch"
        aria-busy={scanMutation.isPending}
      >
        <RawPayloadPanel
          value={inputText}
          onChange={setInputText}
          onScan={handleScan}
          onClear={handleClear}
          isScanning={scanMutation.isPending}
          showPresets={showPresets}
          onTogglePresets={() => setShowPresets((open) => !open)}
          onSelectPreset={handlePreset}
          errorMessage={scanMutation.isError ? scanMutation.error.message : null}
        />
        <SanitizedOutputPanel
          result={result}
          isLoading={scanMutation.isPending}
        />
      </div>
    </section>
  );
}
