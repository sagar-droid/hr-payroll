"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../auth/store";
import {
  getLeaveTypesApi,
  getLeaveRequestsApi,
  createLeaveRequestApi,
  reviewLeaveRequestApi,
  getAttendanceApi,
  type LeaveRequestQuery,
  type AttendanceQuery,
} from "../api";

export function useLeaveTypes() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["leave-types"],
    queryFn: () => getLeaveTypesApi(accessToken!),
    enabled: !!accessToken,
    staleTime: 10 * 60 * 1000,
  });
}

export function useLeaveRequests(query: LeaveRequestQuery = {}) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["leave-requests", query],
    queryFn: () => getLeaveRequestsApi(query, accessToken!),
    enabled: !!accessToken,
  });
}

export function useCreateLeaveRequest() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Parameters<typeof createLeaveRequestApi>[0]) =>
      createLeaveRequestApi(input, accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leave-requests"] });
    },
  });
}

export function useReviewLeaveRequest() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: { status: "APPROVED" | "REJECTED"; reviewed_by: string };
    }) => reviewLeaveRequestApi(id, input, accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leave-requests"] });
    },
  });
}

export function useAttendance(query: AttendanceQuery = {}) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["attendance", query],
    queryFn: () => getAttendanceApi(query, accessToken!),
    enabled: !!accessToken,
  });
}
