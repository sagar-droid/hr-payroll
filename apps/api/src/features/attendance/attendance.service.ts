import { supabase } from "../../lib/supabase";
import type {
  CreateLeaveRequestInput,
  ReviewLeaveRequestInput,
  CreateAttendanceInput,
  AttendanceQuery,
  LeaveRequestQuery,
} from "./attendance.schemas";

// ── leave types ────────────────────────────────────────────

export async function getLeaveTypes() {
  const { data, error } = await supabase
    .from("leave_types")
    .select("*")
    .order("name");
  if (error) throw new Error(error.message);
  return data;
}

// ── leave requests ─────────────────────────────────────────

export async function getLeaveRequests(query: LeaveRequestQuery) {
  const { page, limit, employee_id, status } = query;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let q = supabase
    .from("leave_requests")
    .select(
      `*, 
      leave_type:leave_types(id, name, days_allowed),
      employee:employees!leave_requests_employee_id_fkey(first_name, last_name, email)`,
      { count: "exact" }
    )
    .range(from, to)
    .order("created_at", { ascending: false });

  if (employee_id) q = q.eq("employee_id", employee_id);
  if (status) q = q.eq("status", status);

  const { data, error, count } = await q;
  if (error) throw new Error(error.message);

  return {
    leave_requests: data,
    total: count ?? 0,
    page,
    limit,
    totalPages: Math.ceil((count ?? 0) / limit),
  };
}

export async function createLeaveRequest(input: CreateLeaveRequestInput) {
  // check for overlapping leave requests
  const { data: overlap } = await supabase
    .from("leave_requests")
    .select("id")
    .eq("employee_id", input.employee_id)
    .eq("status", "APPROVED")
    .lte("start_date", input.end_date)
    .gte("end_date", input.start_date)
    .single();

  if (overlap)
    throw new Error("Employee already has approved leave in this period");

  const { data, error } = await supabase
    .from("leave_requests")
    .insert(input)
    .select(`*, leave_type:leave_types(id, name, days_allowed)`)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function reviewLeaveRequest(
  id: string,
  input: ReviewLeaveRequestInput
) {
  const { data, error } = await supabase
    .from("leave_requests")
    .update({
      status: input.status,
      reviewed_by: input.reviewed_by,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select(`*, leave_type:leave_types(id, name, days_allowed)`)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteLeaveRequest(id: string) {
  const { error } = await supabase.from("leave_requests").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ── attendance ─────────────────────────────────────────────

export async function getAttendanceRecords(query: AttendanceQuery) {
  const { page, limit, employee_id, month, year } = query;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let q = supabase
    .from("attendance_records")
    .select(`*, employee:employees(first_name, last_name)`, { count: "exact" })
    .range(from, to)
    .order("date", { ascending: false });

  if (employee_id) q = q.eq("employee_id", employee_id);

  if (month && year) {
    const start = `${year}-${String(month).padStart(2, "0")}-01`;
    const end = new Date(year, month, 0).toISOString().split("T")[0];
    q = q.gte("date", start).lte("date", end);
  }

  const { data, error, count } = await q;
  if (error) throw new Error(error.message);

  return {
    records: data,
    total: count ?? 0,
    page,
    limit,
    totalPages: Math.ceil((count ?? 0) / limit),
  };
}

export async function upsertAttendance(input: CreateAttendanceInput) {
  // calculate hours worked if both check_in and check_out exist
  let hours_worked = input.hours_worked;
  if (input.check_in && input.check_out) {
    const diff =
      new Date(input.check_out).getTime() - new Date(input.check_in).getTime();
    hours_worked = Math.round((diff / (1000 * 60 * 60)) * 100) / 100;
  }

  const { data, error } = await supabase
    .from("attendance_records")
    .upsert({ ...input, hours_worked }, { onConflict: "employee_id,date" })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteAttendanceRecord(id: string) {
  const { error } = await supabase
    .from("attendance_records")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
}
