import { supabase } from "../../lib/supabase";
import { CreateEmployeeInput, UpdateEmployeeInput } from "./employee.types";
import { EmployeeQuery } from "./employees.schemas";

export async function getEmployees(query: EmployeeQuery) {
  const { page, limit, search, employment_status, department_id } = query;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let q = supabase
    .from("employees")
    .select("*, department:departments(id, name)", { count: "exact" })
    .range(from, to)
    .order("created_at", { ascending: false });

  if (search) {
    q = q.or(
      `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`
    );
  }
  if (employment_status) {
    q = q.eq("employment_status", employment_status);
  }
  if (department_id) {
    q = q.eq("department_id", department_id);
  }

  const { data, error, count } = await q;

  if (error) throw new Error(error.message);

  return {
    employees: data,
    total: count ?? 0,
    page,
    limit,
    totalPages: Math.ceil((count ?? 0) / limit),
  };
}

export async function getEmployeeById(id: string) {
  const { data, error } = await supabase
    .from("employees")
    .select("*, department:departments(id,name)")
    .eq("id", id)
    .single();

  if (error || !data) throw new Error("Employee not found");
  return data;
}

export async function createEmployee(input: CreateEmployeeInput) {
  const { data: existing } = await supabase
    .from("employees")
    .select("id")
    .eq("email", input.email)
    .single();

  if (existing) throw new Error("Email already in use");

  const { data, error } = await supabase
    .from("employees")
    .insert({
      first_name: input.first_name,
      last_name: input.last_name,
      email: input.email,
      phone: input.phone ?? null,
      job_title: input.job_title,
      department_id: input.department_id ?? null,
      employment_status: input.employment_status,
      salary: input.salary,
      joined_at: input.joined_at || new Date().toISOString(),
      user_id: input.user_id ?? null,
    })
    .select("*, department:departments(id,name)")
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function updateEmployee(id: string, input: UpdateEmployeeInput) {
  const updateData: Record<string, unknown> = {};

  if (input.first_name !== undefined) updateData.first_name = input.first_name;
  if (input.last_name !== undefined) updateData.last_name = input.last_name;
  if (input.email !== undefined) updateData.email = input.email;
  if (input.phone !== undefined) updateData.phone = input.phone;
  if (input.job_title !== undefined) updateData.job_title = input.job_title;
  if (input.department_id !== undefined)
    updateData.department_id = input.department_id;
  if (input.employment_type !== undefined)
    updateData.employment_type = input.employment_type;
  if (input.employment_status !== undefined)
    updateData.employment_status = input.employment_status;
  if (input.salary !== undefined) updateData.salary = input.salary;
  if (input.joined_at !== undefined) updateData.joined_at = input.joined_at;

  const { data, error } = await supabase
    .from("employees")
    .update(updateData)
    .eq("id", id)
    .select("*, department:departments(id, name)")
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function deleteEmployee(id: string) {
  const { error } = await supabase.from("employees").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function getDepartments() {
  const { data, error } = await supabase
    .from("deparments")
    .select("*")
    .order("name");

  if (error) throw new Error(error.message);

  return data;
}
