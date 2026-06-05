"use client";

import { useAuthStore } from "@/src/features/auth/store";
import { EmployeeList } from "@/src/features/employees/components/EmployeeList";
import Link from "next/link";

export default function EmployeesPage() {
  const { user } = useAuthStore();

  return (
    <div className="p-8 font-sans">
      <div className="mb-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Employees</h1>
          <p className="text-sm text-slate-500">Manage your team</p>
        </div>

        {(user?.role === "ADMIN" || user?.role === "HR_MANAGER") && (
          <Link
            href="/dashboard/employees/new"
            className="inline-flex items-center rounded-2xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Add employee
          </Link>
        )}
      </div>
      <EmployeeList />
    </div>
  );
}
