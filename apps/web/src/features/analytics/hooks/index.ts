"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/src/features/auth/store";
import {
  getHeadcountApi,
  getPayrollSummaryApi,
  getAttendanceSummaryApi,
} from "../api";

export function useHeadcount() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["analytics", "headcount"],
    queryFn: () => getHeadcountApi(accessToken!),
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePayrollSummary() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["analytics", "payroll"],
    queryFn: () => getPayrollSummaryApi(accessToken!),
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAttendanceSummary(month: number, year: number) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["analytics", "attendance", month, year],
    queryFn: () => getAttendanceSummaryApi(accessToken!, month, year),
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
  });
}
