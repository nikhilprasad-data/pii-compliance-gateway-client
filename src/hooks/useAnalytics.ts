"use client";

import { useCallback, useReducer } from "react";
import {
  appendScan,
  emptyAnalytics,
} from "@/lib/metrics/analytics";
import type { LatestScanView, SessionAnalytics } from "@/types/analytics";
import type { ScanExecution } from "@/types/scan";
import { resolveCacheHit } from "@/lib/metrics/cache-path";

interface AnalyticsState {
  analytics: SessionAnalytics;
  categoryCounts: Record<string, number>;
  latest: LatestScanView;
}

const idleLatest: LatestScanView = {
  status: "idle",
  piiDetected: null,
  processingTimeMs: null,
  roundTripMs: null,
  path: null,
  cacheLabel: null,
  errorMessage: null,
};

const initialState: AnalyticsState = {
  analytics: emptyAnalytics,
  categoryCounts: {},
  latest: idleLatest,
};

type Action =
  | { type: "SCANNING" }
  | { type: "SUCCESS"; execution: ScanExecution }
  | { type: "FAILURE"; message: string }
  | { type: "RESET" };

function reducer(state: AnalyticsState, action: Action): AnalyticsState {
  switch (action.type) {
    case "SCANNING":
      return {
        ...state,
        latest: { ...state.latest, status: "scanning", errorMessage: null },
      };
    case "SUCCESS": {
      const cacheHit = resolveCacheHit(action.execution.response);
      const next = appendScan(
        state.analytics,
        state.categoryCounts,
        action.execution
      );
      return {
        analytics: next.analytics,
        categoryCounts: next.categoryCounts,
        latest: {
          status: "completed",
          piiDetected: action.execution.response.detected_pii.length,
          processingTimeMs: action.execution.response.processing_time_ms,
          roundTripMs: action.execution.clientRoundTripMs,
          path: cacheHit ? "CACHE HIT" : "COLD",
          cacheLabel: cacheHit ? "HIT" : "MISS",
          errorMessage: null,
        },
      };
    }
    case "FAILURE":
      return {
        ...state,
        latest: {
          status: "failed",
          piiDetected: null,
          processingTimeMs: null,
          roundTripMs: null,
          path: null,
          cacheLabel: null,
          errorMessage: action.message,
        },
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export function useAnalytics() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const markScanning = useCallback(() => {
    dispatch({ type: "SCANNING" });
  }, []);

  const recordScan = useCallback((execution: ScanExecution) => {
    dispatch({ type: "SUCCESS", execution });
  }, []);

  const recordFailure = useCallback((message: string) => {
    dispatch({ type: "FAILURE", message });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return {
    analytics: state.analytics,
    latest: state.latest,
    recordScan,
    recordFailure,
    markScanning,
    reset,
  };
}
