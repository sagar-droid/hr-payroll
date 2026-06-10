export type PayrollRunStatus =
  | "DRAFT"
  | "PROCESSING"
  | "COMPLETED"
  | "CANCELLED";
export type PayrollRecordStatus = "PENDING" | "APPROVED" | "PAID";

export interface PayrollRun {
  id: string;
  period_start: string;
  period_end: string;
  status: PayrollRunStatus;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PayrollRecord {
  id: string;
  payroll_run_id: string;
  employee_id: string;
  employee?: {
    first_name: string;
    last_name: string;
    email: string;
    department?: { name: string };
  };
  basic_salary: number;
  working_days: number;
  days_present: number;
  days_absent: number;
  days_on_leave: number;
  overtime_hours: number;
  gross_pay: number;
  tax_deduction: number;
  other_deductions: number;
  net_pay: number;
  status: PayrollRecordStatus;
  notes?: string | null;
  created_at: string;
}

export type CreatePayrollRunInput = {
  period_start: string;
  period_end: string;
  created_by: string;
};
