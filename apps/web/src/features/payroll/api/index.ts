import type { ApiResponse, PayrollRun, PayrollRecord } from "@hr-payroll/types";

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

export type PayrollRunsResponse = {
  payroll_runs: PayrollRun[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export async function getPayrollRunsApi(
  accessToken: string,
  page = 1
): Promise<PayrollRunsResponse> {
  const res = await authFetch(
    `${API_URL}/api/payroll?page=${page}`,
    accessToken
  );
  const json: ApiResponse<PayrollRunsResponse> = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function getPayrollRunApi(
  id: string,
  accessToken: string
): Promise<{ run: PayrollRun; records: PayrollRecord[] }> {
  const res = await authFetch(`${API_URL}/api/payroll/${id}`, accessToken);
  const json: ApiResponse<{ run: PayrollRun; records: PayrollRecord[] }> =
    await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

export async function runPayrollApi(
  input: { period_start: string; period_end: string },
  accessToken: string
): Promise<PayrollRun> {
  const res = await authFetch(`${API_URL}/api/payroll/run`, accessToken, {
    method: "POST",
    body: JSON.stringify(input),
  });
  const json: ApiResponse<{ run: PayrollRun }> = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data.run;
}

export async function updatePayrollRecordApi(
  id: string,
  input: { status?: string; notes?: string; other_deductions?: number },
  accessToken: string
): Promise<PayrollRecord> {
  const res = await authFetch(
    `${API_URL}/api/payroll/records/${id}`,
    accessToken,
    { method: "PATCH", body: JSON.stringify(input) }
  );
  const json: ApiResponse<{ record: PayrollRecord }> = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data.record;
}
