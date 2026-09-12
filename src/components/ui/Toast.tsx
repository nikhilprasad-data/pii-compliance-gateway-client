"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const toastStyles = {
  success: {
    wrapper: "border-emerald-200 bg-white",
    icon: "text-emerald-500",
    accent: "bg-emerald-500",
  },
  error: {
    wrapper: "border-red-200 bg-white",
    icon: "text-red-500",
    accent: "bg-red-500",
  },
  warning: {
    wrapper: "border-amber-200 bg-white",
    icon: "text-amber-500",
    accent: "bg-amber-500",
  },
  info: {
    wrapper: "border-blue-200 bg-white",
    icon: "text-blue-500",
    accent: "bg-blue-500",
  },
};

function ToastItem({ toast, onDismiss }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 10);
    const t2 = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(toast.id), 200);
    }, 4500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [toast.id, onDismiss]);

  const style = toastStyles[toast.type];
  const Icon = icons[toast.type];

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-start gap-0 rounded-[var(--radius-xs)] border overflow-hidden shadow-[var(--shadow-md)] w-full",
        "transition-all duration-200",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        style.wrapper
      )}
    >
      {/* Colored left accent bar */}
      <div className={cn("w-0.5 self-stretch flex-shrink-0", style.accent)} />

      <div className="flex items-start gap-2.5 px-3 py-2.5 flex-1 min-w-0">
        <Icon
          className={cn("w-3.5 h-3.5 mt-0.5 flex-shrink-0", style.icon)}
          aria-hidden="true"
        />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-[var(--text-primary)] leading-snug">
            {toast.title}
          </p>
          {toast.description && (
            <p className="text-[11px] mt-0.5 text-[var(--text-muted)] leading-snug">
              {toast.description}
            </p>
          )}
        </div>
        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={() => {
            setVisible(false);
            setTimeout(() => onDismiss(toast.id), 200);
          }}
          className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors flex-shrink-0 mt-0.5"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    /* bottom-right on desktop, bottom-center on mobile — never overlaps content */
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-5 sm:bottom-5 z-50 flex flex-col gap-2 w-[calc(100vw-2rem)] max-w-xs sm:w-72 pointer-events-none"
      aria-label="Notifications"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastItem toast={t} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (type: ToastType, title: string, description?: string) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((prev) => [...prev.slice(-3), { id, type, title, description }]);
    },
    []
  );

  return { toasts, toast, dismiss };
}
