// ── constants ──────────────────────────────────────────────
const TAX_RATE = 0.15; // 15% flat tax
const OVERTIME_RATE = 1.5; // 1.5x hourly for overtime
const STANDARD_HOURS = 8; // standard work hours per day

// ── types ──────────────────────────────────────────────────
export type EmployeePayInput = {
  employee_id: string;
  basic_salary: number; // monthly salary
  days_present: number;
  days_absent: number;
  days_on_leave: number;
  working_days: number; // total working days in period
  total_hours_worked: number;
};

export type PayrollCalculation = {
  employee_id: string;
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
};

// ── engine ─────────────────────────────────────────────────

export function calculatePayroll(input: EmployeePayInput): PayrollCalculation {
  const {
    employee_id,
    basic_salary,
    working_days,
    days_present,
    days_absent,
    days_on_leave,
    total_hours_worked,
  } = input;

  // daily rate
  const daily_rate = basic_salary / working_days;

  // effective days = days present + days on approved leave
  const effective_days = days_present + days_on_leave;

  // pro-rated gross based on effective days
  const prorated_salary = daily_rate * effective_days;

  // overtime = hours beyond standard per day worked
  const expected_hours = days_present * STANDARD_HOURS;
  const overtime_hours = Math.max(0, total_hours_worked - expected_hours);
  const hourly_rate = basic_salary / (working_days * STANDARD_HOURS);
  const overtime_pay = overtime_hours * hourly_rate * OVERTIME_RATE;

  const gross_pay = prorated_salary + overtime_pay;

  // deductions
  const tax_deduction = gross_pay * TAX_RATE;
  const other_deductions = 0; // placeholder for future deductions

  const net_pay = gross_pay - tax_deduction - other_deductions;

  return {
    employee_id,
    basic_salary,
    working_days,
    days_present,
    days_absent,
    days_on_leave,
    overtime_hours: Math.round(overtime_hours * 100) / 100,
    gross_pay: Math.round(gross_pay * 100) / 100,
    tax_deduction: Math.round(tax_deduction * 100) / 100,
    other_deductions: Math.round(other_deductions * 100) / 100,
    net_pay: Math.round(net_pay * 100) / 100,
  };
}

// count working days in a period (Mon–Fri only)
export function countWorkingDays(start: Date, end: Date): number {
  let count = 0;
  const current = new Date(start);
  while (current <= end) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
}
