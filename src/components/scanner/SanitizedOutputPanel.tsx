"use client";

import { useEffect, useState } from "react";
import { Copy, Check, ShieldCheck, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { LoadingState } from "@/components/ui/LoadingState";
import type { ScanResponse } from "@/types/scan";

interface SanitizedOutputPanelProps {
  result: ScanResponse | null;
  isLoading: boolean;
}

function ScanLoadingState() {
  const [label, setLabel] = useState("Scanning payload…");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLabel("Analyzing PII…");
    }, 800);
    return () => window.clearTimeout(timer);
  }, []);

  return <LoadingState title={label} className="h-full py-8" />;
}

export function SanitizedOutputPanel({
  result,
  isLoading,
}: SanitizedOutputPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!result?.sanitized_text) return;
    try {
      await navigator.clipboard.writeText(result.sanitized_text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Copy failed — swallow silently (browser may have denied permission)
    }
  };

  const entityCount = result?.detected_pii.length ?? 0;
  const isClean = result !== null && entityCount === 0;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div>
          <p className="text-[0.875rem] font-semibold text-[var(--text-primary)]">
            Sanitized Output
          </p>
          <p className="mt-0.5 text-[0.75rem] text-[var(--text-muted)]">
            Redacted payload returned by the scanner
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          disabled={!result || isLoading}
          aria-label="Copy sanitized output to clipboard"
        >
          {copied ? (
            <Check className="w-3 h-3 text-[var(--success)]" aria-hidden="true" />
          ) : (
            <Copy className="w-3 h-3" aria-hidden="true" />
          )}
          {copied ? "Copied" : "Copy"}
        </Button>
      </CardHeader>

      <CardBody className="flex-1 flex flex-col gap-3">
        {/* Output area */}
        <div className="relative flex-1 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface-subtle)] overflow-hidden">
          {isLoading ? (
            <ScanLoadingState />
          ) : result ? (
            <pre className="text-[0.8125rem] text-[var(--text-secondary)] font-mono leading-relaxed whitespace-pre-wrap break-words p-3.5 h-full overflow-auto">
              {result.sanitized_text || "(empty response)"}
            </pre>
          ) : (
            /* Compact empty state */
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center px-4">
              <div className="w-8 h-8 rounded-full bg-[var(--surface-strong)] flex items-center justify-center text-[var(--text-muted)]">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              </div>
              <p className="text-[12px] font-semibold text-[var(--text-secondary)]">
                No scan yet
              </p>
              <p className="text-[11px] text-[var(--text-muted)]">
                Sanitized output and detected entities appear here.
              </p>
            </div>
          )}
        </div>

        {/* Compact entity summary — one line only; detailed breakdown is in PIIBreakdown */}
        {result && (
          <div className="border-t border-[var(--border)] pt-3">
            {isClean ? (
              <div className="flex items-center gap-2">
                <ShieldCheck
                  className="w-3.5 h-3.5 text-[var(--success)] flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="text-[0.8125rem] font-semibold text-[var(--success-text)]">
                  No PII detected — payload is clean
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ShieldAlert
                  className="w-3.5 h-3.5 text-[var(--danger)] flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="text-[0.8125rem] font-semibold text-[var(--danger-text)]">
                  {entityCount} PII entit{entityCount === 1 ? "y" : "ies"} redacted
                </span>
              </div>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
