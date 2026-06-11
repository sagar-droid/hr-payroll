"use client";

import { useAuthStore } from "@/src/features/auth/store";
import { EmployeeList } from "@/src/features/employees/components/EmployeeList";
import { ErrorBoundary } from "@/src/components/ErrorBoundary";
import Link from "next/link";

export default function EmployeesPage() {
  const { user } = useAuthStore();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Employees
          </h1>
          <p className="text-sm text-gray-500">Manage your team</p>
        </div>
        {(user?.role === "ADMIN" || user?.role === "HR_MANAGER") && (
          <Link
            href="/dashboard/employees/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Add employee
          </Link>
        )}
      </div>
      <ErrorBoundary>
        <EmployeeList />
      </ErrorBoundary>
    </div>
  );
}
