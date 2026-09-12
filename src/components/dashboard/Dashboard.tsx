"use client";

import { ShieldCheck } from "lucide-react";
import { LatestScan } from "@/components/analytics/LatestScan";
import { PerformanceAnalysis } from "@/components/analytics/PerformanceAnalysis";
import { PerformanceChart } from "@/components/analytics/PerformanceChart";
import { PIIBreakdown } from "@/components/analytics/PIIBreakdown";
import { SessionMetrics } from "@/components/analytics/SessionMetrics";
import { Container } from "@/components/layout/Container";
import { ScannerSection } from "@/components/scanner/ScannerSection";
import { ToastContainer, useToast } from "@/components/ui/Toast";
import { useAnalytics } from "@/hooks/useAnalytics";
import { formatProcessingTime } from "@/lib/formatting/latency";
import { useCallback } from "react";
import type { ScanExecution } from "@/types/scan";

export function Dashboard() {
  const { analytics, latest, recordScan, recordFailure, markScanning } =
    useAnalytics();
  const { toasts, toast, dismiss } = useToast();

  const handleComplete = useCallback(
    (execution: ScanExecution) => {
      recordScan(execution);
      const count = execution.response.detected_pii.length;
      toast(
        count > 0 ? "warning" : "success",
        count > 0
          ? `${count} PII entit${count === 1 ? "y" : "ies"} detected`
          : "Payload is clean",
        `Processing time ${formatProcessingTime(execution.response.processing_time_ms)}`
      );
    },
    [recordScan, toast]
  );

  const handleError = useCallback(
    (message: string) => {
      recordFailure(message);
      toast("error", "Scan failed", message);
    },
    [recordFailure, toast]
  );

  return (
    <div className="min-h-screen">
      {/* ── Compact Header ────────────────────────────── */}
      <header className="border-b border-[var(--border)] bg-white sticky top-0 z-30">
        <Container>
          <div className="flex items-center h-12 gap-4">
            {/* Brand — left-aligned: icon + stacked product name/subtitle */}
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <div
                className="w-6 h-6 rounded-[var(--radius-xs)] bg-[var(--primary)] flex items-center justify-center flex-shrink-0"
                aria-hidden="true"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-[1rem] font-semibold text-[var(--text-primary)] tracking-tight leading-tight">
                  PII Compliance Gateway
                </div>
                <div
                  className="hidden sm:block text-[0.75rem] text-[var(--text-muted)] leading-tight"
                  aria-hidden="true"
                >
                  Security &amp; Compliance Dashboard
                </div>
              </div>
            </div>


          </div>
        </Container>
      </header>

      {/* ── Main Content ───────────────────────────────── */}
      <main className="py-6 md:py-8">
        <Container className="space-y-6 md:space-y-8">
          {/* 1. Scanner — primary interaction zone */}
          <ScannerSection
            onScanStart={markScanning}
            onScanComplete={handleComplete}
            onScanError={handleError}
          />

          {/* 2. Latest Scan Result — immediate feedback */}
          <LatestScan latest={latest} />

          {/* 3. PII Detection Breakdown — security insight */}
          <PIIBreakdown
            categories={analytics.piiCategories}
            totalScans={analytics.performance.totalScans}
          />

          {/* 4. Key Metrics — session summary */}
          <SessionMetrics analytics={analytics} />

          {/* 5. Cache Performance + Latency Chart — technical storytelling */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
            <PerformanceAnalysis cache={analytics.cache} />
            <PerformanceChart history={analytics.history} />
          </div>
        </Container>
      </main>

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}
