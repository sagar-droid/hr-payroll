"use client";

import { use } from "react";
import Link from "next/link";
import { useAuthStore } from "@/src/features/auth/store";
import { useEmployee } from "@/src/features/employees/hooks";

export default function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: employee, isLoading, isError } = useEmployee(id);
  const { user } = useAuthStore();

  if (isLoading)
    return <p className="p-8 text-sm text-slate-500">Loading...</p>;
  if (isError || !employee)
    return <p className="p-8 text-sm text-rose-600">Employee not found.</p>;

  return (
    <div className="p-8 font-sans max-w-4xl">
      <Link
        href="/dashboard/employees"
        className="text-sm text-slate-500 transition hover:text-slate-700"
      >
        ← Back to employees
      </Link>

      <div className="mt-4 mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {employee.first_name} {employee.last_name}
          </h1>
          <p className="text-sm text-slate-500">{employee.job_title}</p>
        </div>
        {(user?.role === "ADMIN" || user?.role === "HR_MANAGER") && (
          <Link
            href={`/dashboard/employees/${id}/edit`}
            className="inline-flex rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
          >
            Edit
          </Link>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          ["Email", employee.email],
          ["Phone", employee.phone ?? "—"],
          ["Department", employee.department?.name ?? "—"],
          ["Employment type", employee.employment_type.replace("_", " ")],
          ["Employment status", employee.employment_status],
          ["Salary", `$${Number(employee.salary).toLocaleString()}`],
          ["Joined", new Date(employee.joined_at).toLocaleDateString()],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-slate-50 p-4">
            <p className="mb-1 text-xs uppercase tracking-[0.12em] text-slate-500">
              {label}
            </p>
            <p className="text-sm font-semibold text-slate-900">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
