"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  formatClock,
  formatProcessingTime,
} from "@/lib/formatting/latency";
import type { ScanHistoryItem } from "@/types/analytics";
import { Clock, History, X } from "lucide-react";

interface ScanHistoryProps {
  history: ScanHistoryItem[];
}

export function ScanHistory({ history }: ScanHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rows = [...history].reverse();
  const closeRef = useRef<HTMLButtonElement>(null);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // Keyboard: Escape to close
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeModal();
    }
    document.addEventListener("keydown", handleKeyDown);
    closeRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={openModal}
        aria-label="View scan history"
      >
        <History className="w-3 h-3" aria-hidden="true" />
        History
        {history.length > 0 && (
          <span className="ml-0.5 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold rounded-full bg-[var(--primary)] text-white">
            {history.length > 99 ? "99+" : history.length}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={closeModal}
            aria-hidden="true"
          />

          {/* Modal panel */}
          <div
            className="relative w-full max-w-3xl bg-white rounded-[var(--radius-md)] shadow-[var(--shadow-lg)] border border-[var(--border)] overflow-hidden flex flex-col max-h-[85vh]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="history-modal-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)] bg-[var(--surface-subtle)] flex-shrink-0">
              <div>
                <h2
                  id="history-modal-title"
                  className="text-[14px] font-semibold text-[var(--text-primary)]"
                >
                  Scan History
                </h2>
                {rows.length > 0 && (
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    {rows.length} completed scan{rows.length !== 1 ? "s" : ""} this session
                  </p>
                )}
              </div>
              <Button
                ref={closeRef}
                variant="ghost"
                size="sm"
                onClick={closeModal}
                aria-label="Close scan history"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1">
              {rows.length === 0 ? (
                <EmptyState
                  title="No scans recorded"
                  description="Completed scans will appear here."
                  icon={<Clock className="w-4 h-4" />}
                  className="py-16"
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] text-left">
                    <thead className="sticky top-0 bg-[var(--surface-subtle)] z-10 border-b border-[var(--border)]">
                      <tr>
                        {["#", "Time", "PII Detected", "Cache Path", "Processing Time"].map(
                          (col) => (
                            <th
                              key={col}
                              scope="col"
                              className="px-4 py-2.5 text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-[0.06em] whitespace-nowrap"
                            >
                              {col}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {rows.map((scan) => (
                        <tr
                          key={scan.id}
                          className="hover:bg-[var(--surface-subtle)] transition-colors"
                        >
                          <td className="px-4 py-3 text-[12px] font-mono text-[var(--text-muted)] tabular-nums">
                            {scan.index}
                          </td>
                          <td className="px-4 py-3 text-[12px] font-mono text-[var(--text-muted)] tabular-nums">
                            {formatClock(scan.timestamp)}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-[13px] font-bold tabular-nums ${
                                scan.piiDetected > 0
                                  ? "text-[var(--danger-text)]"
                                  : "text-[var(--success-text)]"
                              }`}
                            >
                              {scan.piiDetected}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {scan.path === "CACHE HIT" ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                ⚡ Cache Hit
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                Cold Request
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-[13px] font-medium tabular-nums text-[var(--text-primary)]">
                            {formatProcessingTime(scan.processingTimeMs)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
