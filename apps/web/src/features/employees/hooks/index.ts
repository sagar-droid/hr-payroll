"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEmployeesApi,
  getEmployeeApi,
  createEmployeeApi,
  updateEmployeeApi,
  deleteEmployeeApi,
  getDepartmentsApi,
  type EmployeeQuery,
} from "../api";
import type { Employee } from "@hr-payroll/types";
import { useAuthStore } from "../../auth/store";

export function useEmployees(query: EmployeeQuery = {}) {
  const accessToken = useAuthStore((s) => s.accessToken);

  return useQuery({
    queryKey: ["employees", query],
    queryFn: () => getEmployeesApi(query, accessToken!),
    enabled: !!accessToken,
  });
}

export function useEmployee(id: string) {
  const accessToken = useAuthStore((s) => s.accessToken);

  return useQuery({
    queryKey: ["employees", id],
    queryFn: () => getEmployeeApi(id, accessToken!),
    enabled: !!accessToken && !!id,
  });
}

export function useDepartments() {
  const accessToken = useAuthStore((s) => s.accessToken);

  return useQuery({
    queryKey: ["departments"],
    queryFn: () => getDepartmentsApi(accessToken!),
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateEmployee() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Partial<Employee>) =>
      createEmployeeApi(input, accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

export function useUpdateEmployee(id: string) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Partial<Employee>) =>
      updateEmployeeApi(id, input, accessToken!),
    onSuccess: (updated) => {
      // update the cache directly — no refetch needed
      queryClient.setQueryData(["employees", id], updated);
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

export function useDeleteEmployee() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteEmployeeApi(id, accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}
