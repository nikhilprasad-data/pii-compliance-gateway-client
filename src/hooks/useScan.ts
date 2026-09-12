"use client";

import { useMutation } from "@tanstack/react-query";
import { scanText } from "@/lib/api/scan";
import type { ScanExecution, ScanRequest } from "@/types/scan";

export function useScan(
  onSuccess?: (data: ScanExecution, variables: ScanRequest) => void,
  onError?: (error: Error) => void
) {
  return useMutation<ScanExecution, Error, ScanRequest>({
    mutationFn: scanText,
    onSuccess,
    onError,
  });
}
