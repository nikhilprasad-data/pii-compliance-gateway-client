"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { CHAR_LIMIT, PAYLOAD_PRESETS } from "@/components/scanner/presets";
import { ScanControls } from "@/components/scanner/ScanControls";

interface RawPayloadPanelProps {
  value: string;
  onChange: (value: string) => void;
  onScan: () => void;
  onClear: () => void;
  isScanning: boolean;
  showPresets: boolean;
  onTogglePresets: () => void;
  onSelectPreset: (text: string) => void;
  errorMessage?: string | null;
}

export function RawPayloadPanel({
  value,
  onChange,
  onScan,
  onClear,
  isScanning,
  showPresets,
  onTogglePresets,
  onSelectPreset,
  errorMessage,
}: RawPayloadPanelProps) {
  const isOverLimit = value.length > CHAR_LIMIT;
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close popover on outside click
  useEffect(() => {
    if (!showPresets) return;
    function handleMouseDown(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        onTogglePresets();
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [showPresets, onTogglePresets]);

  // Close popover on Escape key
  useEffect(() => {
    if (!showPresets) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onTogglePresets();
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown as unknown as EventListener);
    return () =>
      document.removeEventListener("keydown", handleKeyDown as unknown as EventListener);
  }, [showPresets, onTogglePresets]);

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      if (value.trim() && !isOverLimit && !isScanning) {
        onScan();
      }
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div>
          <p className="text-[0.875rem] font-semibold text-[var(--text-primary)]">
            Raw Input
          </p>
          <p className="mt-0.5 text-[0.75rem] text-[var(--text-muted)]">
            Submit text to the FastAPI scanner
          </p>
        </div>

        {/* Presets button + popover container */}
        <div className="relative">
          <Button
            ref={buttonRef}
            type="button"
            variant="outline"
            size="sm"
            onClick={onTogglePresets}
            aria-expanded={showPresets}
            aria-haspopup="listbox"
            aria-controls="payload-presets-popup"
          >
            Presets
            {showPresets ? (
              <ChevronUp className="w-3 h-3" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-3 h-3" aria-hidden="true" />
            )}
          </Button>

          {/* Popover — floats above page flow, does NOT push card content */}
          {showPresets && (
            <div
              ref={popoverRef}
              id="payload-presets-popup"
              role="listbox"
              aria-label="Select a payload preset"
              className="absolute top-full right-0 mt-1 z-20 w-48 bg-white border border-[var(--border)] rounded-[var(--radius-sm)] shadow-[var(--shadow-lg)] p-1 flex flex-col gap-px"
            >
              {PAYLOAD_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  role="option"
                  aria-selected={false}
                  onClick={() => onSelectPreset(preset.text)}
                  className="w-full px-3 py-2 rounded-[var(--radius-xs)] text-left text-[12px] font-medium text-[var(--text-secondary)] hover:bg-[var(--primary-subtle)] hover:text-[var(--primary)] transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-inset"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </CardHeader>

      <CardBody className="flex-1 flex flex-col gap-3">
        <Textarea
          id="pii-input"
          aria-label="Raw input payload"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Paste raw text here…\n\nName: Jane Doe\nEmail: jane@example.com\nPhone: +1-555-123-4567`}
          className="flex-1 min-h-[200px]"
          error={isOverLimit ? "Character limit exceeded" : undefined}
        />

        <ScanControls
          charCount={value.length}
          charLimit={CHAR_LIMIT}
          canScan={Boolean(value.trim()) && !isOverLimit}
          isScanning={isScanning}
          onScan={onScan}
          onClear={onClear}
          canClear={Boolean(value)}
        />

        {errorMessage && (
          <div
            className="flex items-start gap-2 text-[11px] text-[var(--danger-text)] font-medium bg-[var(--danger-subtle)] border border-[var(--danger-border)] rounded-[var(--radius-xs)] px-3 py-2"
            role="alert"
          >
            <span className="font-bold">Error:</span>
            <span>{errorMessage}</span>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
