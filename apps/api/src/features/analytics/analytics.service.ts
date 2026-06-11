import { supabase } from "../../lib/supabase";

export async function getHeadcountSummary() {
  // total employees
  const { count: total } = await supabase
    .from("employees")
    .select("*", { count: "exact", head: true });

  // by status
  const { data: byStatus } = await supabase
    .from("employees")
    .select("employment_status")
    .then(({ data }) => {
      const counts: Record<string, number> = {};
      data?.forEach((e) => {
        counts[e.employment_status] = (counts[e.employment_status] ?? 0) + 1;
      });
      return {
        data: Object.entries(counts).map(([status, count]) => ({
          status,
          count,
        })),
      };
    });

  // by department
  const { data: byDept } = await supabase
    .from("employees")
    .select("department:departments(name)")
    .then(({ data }) => {
      const counts: Record<string, number> = {};
      data?.forEach((e: any) => {
        const name = e.department?.name ?? "No department";
        counts[name] = (counts[name] ?? 0) + 1;
      });
      return {
        data: Object.entries(counts).map(([department, count]) => ({
          department,
          count,
        })),
      };
    });

  return { total: total ?? 0, by_status: byStatus, by_department: byDept };
}

export async function getPayrollSummary() {
  // last 6 payroll runs cost
  const { data: runs } = await supabase
    .from("payroll_runs")
    .select("id, period_start, period_end, status")
    .eq("status", "COMPLETED")
    .order("period_start", { ascending: false })
    .limit(6);

  if (!runs || runs.length === 0) return { runs: [], by_department: [] };

  // get total cost per run
  const runsWithCost = await Promise.all(
    runs.map(async (run) => {
      const { data } = await supabase
        .from("payroll_records")
        .select("gross_pay, net_pay, tax_deduction")
        .eq("payroll_run_id", run.id);

      const total_gross =
        data?.reduce((s, r) => s + Number(r.gross_pay), 0) ?? 0;
      const total_net = data?.reduce((s, r) => s + Number(r.net_pay), 0) ?? 0;
      const total_tax =
        data?.reduce((s, r) => s + Number(r.tax_deduction), 0) ?? 0;

      return {
        ...run,
        total_gross: Math.round(total_gross * 100) / 100,
        total_net: Math.round(total_net * 100) / 100,
        total_tax: Math.round(total_tax * 100) / 100,
      };
    })
  );

  // cost by department for the latest run
  const latestRunId = runs[0].id;
  const { data: deptRecords } = await supabase
    .from("payroll_records")
    .select(
      `
      net_pay,
      employee:employees(
        department:departments(name)
      )
    `
    )
    .eq("payroll_run_id", latestRunId);

  const deptCosts: Record<string, number> = {};
  deptRecords?.forEach((r: any) => {
    const name = r.employee?.department?.name ?? "No department";
    deptCosts[name] = (deptCosts[name] ?? 0) + Number(r.net_pay);
  });

  const by_department = Object.entries(deptCosts).map(([department, cost]) => ({
    department,
    cost: Math.round(cost * 100) / 100,
  }));

  return { runs: runsWithCost.reverse(), by_department };
}

export async function getAttendanceSummary(month: number, year: number) {
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const end = new Date(year, month, 0).toISOString().split("T")[0];

  const { data } = await supabase
    .from("attendance_records")
    .select("employee_id, hours_worked")
    .gte("date", start)
    .lte("date", end);

  if (!data || data.length === 0) {
    return { total_records: 0, avg_hours: 0, by_employee: [] };
  }

  // group by employee
  const empMap = new Map<string, { days: number; hours: number }>();
  data.forEach((r) => {
    const existing = empMap.get(r.employee_id) ?? { days: 0, hours: 0 };
    empMap.set(r.employee_id, {
      days: existing.days + 1,
      hours: existing.hours + Number(r.hours_worked ?? 0),
    });
  });

  const avg_hours =
    data.reduce((s, r) => s + Number(r.hours_worked ?? 0), 0) / data.length;

  return {
    total_records: data.length,
    avg_hours: Math.round(avg_hours * 100) / 100,
    unique_employees: empMap.size,
  };
}
