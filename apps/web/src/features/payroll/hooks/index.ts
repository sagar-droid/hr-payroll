"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/src/features/auth/store";
import {
  getPayrollRunsApi,
  getPayrollRunApi,
  runPayrollApi,
  updatePayrollRecordApi,
} from "../api";

export function usePayrollRuns(page = 1) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["payroll-runs", page],
    queryFn: () => getPayrollRunsApi(accessToken!, page),
    enabled: !!accessToken,
  });
}

export function usePayrollRun(id: string) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["payroll-run", id],
    queryFn: () => getPayrollRunApi(id, accessToken!),
    enabled: !!accessToken && !!id,
  });
}

export function useRunPayroll() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { period_start: string; period_end: string }) =>
      runPayrollApi(input, accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payroll-runs"] });
    },
  });
}

export function useUpdatePayrollRecord() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: { status?: string; notes?: string; other_deductions?: number };
    }) => updatePayrollRecordApi(id, input, accessToken!),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["payroll-run"] });
    },
  });
}
