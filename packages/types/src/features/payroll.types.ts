export type PayrollStatus = "DRAFT" | "PROCESSING" | "COMPLETED";

export type PayrollRecord = {
  id: string;
  employeeId: string;
  periodStart: string;
  periodEnd: string;
  grossPay: number;
  deductions: number;
  netPay: number;
  status: PayrollStatus;
};
