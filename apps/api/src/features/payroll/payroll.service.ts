import { supabase } from "../../lib/supabase";
import { calculatePayroll, countWorkingDays } from "./payroll.engine";
import type {
  CreatePayrollRunInput,
  UpdatePayrollRecordInput,
  PayrollQuery,
} from "./payroll.schemas";

// ── payroll runs ───────────────────────────────────────────

export async function getPayrollRuns(query: PayrollQuery) {
  const { page, limit, status } = query;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let q = supabase
    .from("payroll_runs")
    .select("*", { count: "exact" })
    .range(from, to)
    .order("created_at", { ascending: false });

  if (status) q = q.eq("status", status);

  const { data, error, count } = await q;
  if (error) throw new Error(error.message);

  return {
    payroll_runs: data,
    total: count ?? 0,
    page,
    limit,
    totalPages: Math.ceil((count ?? 0) / limit),
  };
}

export async function getPayrollRunById(id: string) {
  const { data, error } = await supabase
    .from("payroll_runs")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) throw new Error("Payroll run not found");
  return data;
}

export async function getPayrollRecords(payroll_run_id: string) {
  const { data, error } = await supabase
    .from("payroll_records")
    .select(
      `
      *,
      employee:employees(
        first_name, last_name, email,
        department:departments(name)
      )
    `
    )
    .eq("payroll_run_id", payroll_run_id)
    .order("created_at");

  if (error) throw new Error(error.message);
  return data;
}

// ── run payroll ────────────────────────────────────────────

export async function createAndRunPayroll(
  input: CreatePayrollRunInput,
  created_by: string
) {
  const period_start = new Date(input.period_start);
  const period_end = new Date(input.period_end);
  const working_days = countWorkingDays(period_start, period_end);

  // 1 — create the payroll run
  const { data: run, error: runError } = await supabase
    .from("payroll_runs")
    .insert({
      period_start: input.period_start,
      period_end: input.period_end,
      status: "PROCESSING",
      created_by,
    })
    .select()
    .single();

  if (runError) throw new Error(runError.message);

  // 2 — fetch all active employees
  const { data: employees, error: empError } = await supabase
    .from("employees")
    .select("id, salary")
    .eq("employment_status", "ACTIVE");

  if (empError) throw new Error(empError.message);

  // 3 — fetch attendance for this period
  const { data: attendance, error: attError } = await supabase
    .from("attendance_records")
    .select("employee_id, hours_worked")
    .gte("date", input.period_start)
    .lte("date", input.period_end);

  if (attError) throw new Error(attError.message);

  // 4 — fetch approved leaves for this period
  const { data: leaves, error: leaveError } = await supabase
    .from("leave_requests")
    .select("employee_id, days_requested")
    .eq("status", "APPROVED")
    .lte("start_date", input.period_end)
    .gte("end_date", input.period_start);

  if (leaveError) throw new Error(leaveError.message);

  // 5 — build lookup maps
  const attendanceMap = new Map<string, { days: number; hours: number }>();
  for (const rec of attendance ?? []) {
    const existing = attendanceMap.get(rec.employee_id) ?? {
      days: 0,
      hours: 0,
    };
    attendanceMap.set(rec.employee_id, {
      days: existing.days + 1,
      hours: existing.hours + (rec.hours_worked ?? 0),
    });
  }

  const leaveMap = new Map<string, number>();
  for (const leave of leaves ?? []) {
    const existing = leaveMap.get(leave.employee_id) ?? 0;
    leaveMap.set(leave.employee_id, existing + leave.days_requested);
  }

  // 6 — calculate payroll for each employee
  const payrollRecords = employees.map((emp) => {
    const att = attendanceMap.get(emp.id) ?? { days: 0, hours: 0 };
    const leave_days = leaveMap.get(emp.id) ?? 0;
    const days_absent = Math.max(0, working_days - att.days - leave_days);

    const calc = calculatePayroll({
      employee_id: emp.id,
      basic_salary: emp.salary,
      working_days,
      days_present: att.days,
      days_absent,
      days_on_leave: leave_days,
      total_hours_worked: att.hours,
    });

    return {
      payroll_run_id: run.id,
      ...calc,
    };
  });

  // 7 — insert all payroll records
  const { error: insertError } = await supabase
    .from("payroll_records")
    .insert(payrollRecords);

  if (insertError) throw new Error(insertError.message);

  // 8 — mark run as completed
  const { data: completed, error: updateError } = await supabase
    .from("payroll_runs")
    .update({ status: "COMPLETED" })
    .eq("id", run.id)
    .select()
    .single();

  if (updateError) throw new Error(updateError.message);

  return completed;
}

export async function updatePayrollRecord(
  id: string,
  input: UpdatePayrollRecordInput
) {
  const { data, error } = await supabase
    .from("payroll_records")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
