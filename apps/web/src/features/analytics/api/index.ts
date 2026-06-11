import type { ApiResponse } from "@hr-payroll/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function authFetch(url: string, accessToken: string) {
  const res = await fetch(url, {
    credentials: "include",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res;
}

export type HeadcountData = {
  total: number;
  by_status: { status: string; count: number }[];
  by_department: { department: string; count: number }[];
};

export type PayrollSummaryData = {
  runs: {
    id: string;
    period_start: string;
    period_end: string;
    total_gross: number;
    total_net: number;
    total_tax: number;
  }[];
  by_department: { department: string; cost: number }[];
};

export type AttendanceSummaryData = {
  total_records: number;
  avg_hours: number;
  unique_employees: number;
};

export async function getHeadcountApi(
  accessToken: string
): Promise<HeadcountData> {
  const res = await authFetch(
    `${API_URL}/api/analytics/headcount`,
    accessToken
  );
  const json: ApiResponse<HeadcountData> = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function getPayrollSummaryApi(
  accessToken: string
): Promise<PayrollSummaryData> {
  const res = await authFetch(`${API_URL}/api/analytics/payroll`, accessToken);
  const json: ApiResponse<PayrollSummaryData> = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function getAttendanceSummaryApi(
  accessToken: string,
  month: number,
  year: number
): Promise<AttendanceSummaryData> {
  const res = await authFetch(
    `${API_URL}/api/analytics/attendance?month=${month}&year=${year}`,
    accessToken
  );
  const json: ApiResponse<AttendanceSummaryData> = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}
