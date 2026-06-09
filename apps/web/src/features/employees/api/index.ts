import type { Employee, Department } from "@hr-payroll/types";
import type { ApiResponse } from "@hr-payroll/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export type EmployeesResponse = {
  employees: Employee[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type EmployeeQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  department_id?: string;
};

async function authFetch(
  url: string,
  accessToken: string,
  options?: RequestInit
) {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...options?.headers,
    },
  });
  return res;
}

export async function getEmployeesApi(
  query: EmployeeQuery,
  accessToken: string
): Promise<EmployeesResponse> {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.search) params.set("search", query.search);
  if (query.status) params.set("status", query.status);
  if (query.department_id) params.set("departmentId", query.department_id);

  const res = await authFetch(
    `${API_URL}/api/employees?${params.toString()}`,
    accessToken
  );
  const json: ApiResponse<EmployeesResponse> = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function getEmployeeApi(
  id: string,
  accessToken: string
): Promise<Employee> {
  const res = await authFetch(`${API_URL}/api/employees/${id}`, accessToken);
  const json: ApiResponse<{ employee: Employee }> = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data.employee;
}

export async function createEmployeeApi(
  input: Partial<Employee>,
  accessToken: string
): Promise<Employee> {
  const res = await authFetch(`${API_URL}/api/employees`, accessToken, {
    method: "POST",
    body: JSON.stringify(input),
  });
  const json: ApiResponse<{ employee: Employee }> = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data.employee;
}

export async function updateEmployeeApi(
  id: string,
  input: Partial<Employee>,
  accessToken: string
): Promise<Employee> {
  const res = await authFetch(`${API_URL}/api/employees/${id}`, accessToken, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
  const json: ApiResponse<{ employee: Employee }> = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data.employee;
}

export async function deleteEmployeeApi(
  id: string,
  accessToken: string
): Promise<void> {
  const res = await authFetch(`${API_URL}/api/employees/${id}`, accessToken, {
    method: "DELETE",
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
}

export async function getDepartmentsApi(
  accessToken: string
): Promise<Department[]> {
  const res = await authFetch(
    `${API_URL}/api/employees/departments`,
    accessToken
  );
  const json: ApiResponse<{ departments: Department[] }> = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data.departments;
}
