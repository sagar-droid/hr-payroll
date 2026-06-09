import type {
  ApiResponse,
  AttendanceRecord,
  LeaveRequest,
  LeaveType,
} from "@hr-payroll/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

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

// ── leave types ────────────────────────────────────────────

export async function getLeaveTypesApi(
  accessToken: string
): Promise<LeaveType[]> {
  const res = await authFetch(
    `${API_URL}/api/attendance/leave-types`,
    accessToken
  );
  const json: ApiResponse<{ leave_types: LeaveType[] }> = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data.leave_types;
}

// ── leave requests ─────────────────────────────────────────

export type LeaveRequestsResponse = {
  leave_requests: LeaveRequest[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type LeaveRequestQuery = {
  employee_id?: string;
  status?: string;
  page?: number;
  limit?: number;
};

export async function getLeaveRequestsApi(
  query: LeaveRequestQuery,
  accessToken: string
): Promise<LeaveRequestsResponse> {
  const params = new URLSearchParams();
  if (query.employee_id) params.set("employee_id", query.employee_id);
  if (query.status) params.set("status", query.status);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));

  const res = await authFetch(
    `${API_URL}/api/attendance/leave-requests?${params.toString()}`,
    accessToken
  );
  const json: ApiResponse<LeaveRequestsResponse> = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function createLeaveRequestApi(
  input: {
    employee_id: string;
    leave_type_id: string;
    start_date: string;
    end_date: string;
    days_requested: number;
    reason?: string;
  },
  accessToken: string
): Promise<LeaveRequest> {
  const res = await authFetch(
    `${API_URL}/api/attendance/leave-requests`,
    accessToken,
    { method: "POST", body: JSON.stringify(input) }
  );
  const json: ApiResponse<{ leave_request: LeaveRequest }> = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data.leave_request;
}

export async function reviewLeaveRequestApi(
  id: string,
  input: { status: "APPROVED" | "REJECTED"; reviewed_by: string },
  accessToken: string
): Promise<LeaveRequest> {
  const res = await authFetch(
    `${API_URL}/api/attendance/leave-requests/${id}/review`,
    accessToken,
    { method: "PATCH", body: JSON.stringify(input) }
  );
  const json: ApiResponse<{ leave_request: LeaveRequest }> = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data.leave_request;
}

// ── attendance ─────────────────────────────────────────────

export type AttendanceResponse = {
  records: AttendanceRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type AttendanceQuery = {
  employee_id?: string;
  month?: number;
  year?: number;
  page?: number;
  limit?: number;
};

export async function getAttendanceApi(
  query: AttendanceQuery,
  accessToken: string
): Promise<AttendanceResponse> {
  const params = new URLSearchParams();
  if (query.employee_id) params.set("employee_id", query.employee_id);
  if (query.month) params.set("month", String(query.month));
  if (query.year) params.set("year", String(query.year));
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));

  const res = await authFetch(
    `${API_URL}/api/attendance?${params.toString()}`,
    accessToken
  );
  const json: ApiResponse<AttendanceResponse> = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}
