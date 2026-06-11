"use client";

import { useAuthStore } from "@/src/features/auth/store";
import Link from "next/link";

const cardStyle =
  "p-5 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors no-underline block";

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          Welcome back
        </h1>
        <p className="text-sm text-gray-500">
          {user?.email} — {user?.role}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/dashboard/employees" className={cardStyle}>
          <p className="text-xs text-gray-400 mb-1">Manage</p>
          <p className="text-lg font-semibold text-gray-900">Employees</p>
        </Link>
        <Link href="/dashboard/attendance" className={cardStyle}>
          <p className="text-xs text-gray-400 mb-1">Track</p>
          <p className="text-lg font-semibold text-gray-900">Attendance</p>
        </Link>
        <Link href="/dashboard/leave" className={cardStyle}>
          <p className="text-xs text-gray-400 mb-1">Manage</p>
          <p className="text-lg font-semibold text-gray-900">Leave</p>
        </Link>
        <Link href="/dashboard/payroll" className={cardStyle}>
          <p className="text-xs text-gray-400 mb-1">Process</p>
          <p className="text-lg font-semibold text-gray-900">Payroll</p>
        </Link>
      </div>
    </div>
  );
}
