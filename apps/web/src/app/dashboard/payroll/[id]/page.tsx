"use client";

import { use } from "react";
import {
  usePayrollRun,
  useUpdatePayrollRecord,
} from "@/src/features/payroll/hooks";
import { useAuthStore } from "@/src/features/auth/store";
import Link from "next/link";

const recordStatusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-blue-100 text-blue-700",
  PAID: "bg-green-100 text-green-700",
};

const runStatusStyles: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-600",
  PROCESSING: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function PayrollRunPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, isError } = usePayrollRun(id);
  const updateRecord = useUpdatePayrollRecord();
  const { user } = useAuthStore();

  const canUpdate = user?.role === "ADMIN" || user?.role === "HR_MANAGER";

  if (isLoading) return <p className="p-8 text-sm text-gray-500">Loading...</p>;
  if (isError || !data)
    return <p className="p-8 text-sm text-red-500">Payroll run not found.</p>;

  const { run, records } = data;

  const totalGross = records.reduce((sum, r) => sum + Number(r.gross_pay), 0);
  const totalNet = records.reduce((sum, r) => sum + Number(r.net_pay), 0);
  const totalTax = records.reduce((sum, r) => sum + Number(r.tax_deduction), 0);

  return (
    <div className="p-8 font-sans">
      {/* header */}
      <div className="mb-6">
        <Link
          href="/dashboard/payroll"
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← Back to payroll
        </Link>
        <div className="flex justify-between items-start mt-2">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              Payroll run
            </h1>
            <p className="text-sm text-gray-500">
              {new Date(run.period_start).toLocaleDateString()} —{" "}
              {new Date(run.period_end).toLocaleDateString()}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${runStatusStyles[run.status]}`}
          >
            {run.status}
          </span>
        </div>
      </div>

      {/* summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total gross pay", value: totalGross },
          { label: "Total tax", value: totalTax },
          { label: "Total net pay", value: totalNet },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="p-4 bg-white border border-gray-200 rounded-xl"
          >
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className="text-xl font-semibold text-gray-900">
              ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        ))}
      </div>

      {/* records table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Employee
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Days present
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Days absent
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Overtime hrs
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Gross pay
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Tax
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Net pay
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Status
              </th>
              {canUpdate && (
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {records.map((record) => (
              <tr
                key={record.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 text-gray-900 font-medium">
                  {(record as any).employee?.first_name}{" "}
                  {(record as any).employee?.last_name}
                  <p className="text-xs text-gray-400 font-normal">
                    {(record as any).employee?.department?.name ?? "—"}
                  </p>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {record.days_present}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {record.days_absent}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {record.overtime_hours}h
                </td>
                <td className="px-4 py-3 text-gray-600">
                  $
                  {Number(record.gross_pay).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="px-4 py-3 text-red-500">
                  -$
                  {Number(record.tax_deduction).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="px-4 py-3 text-green-600 font-medium">
                  $
                  {Number(record.net_pay).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${recordStatusStyles[record.status]}`}
                  >
                    {record.status}
                  </span>
                </td>
                {canUpdate && (
                  <td className="px-4 py-3">
                    {record.status === "PENDING" && (
                      <button
                        onClick={() =>
                          updateRecord.mutate({
                            id: record.id,
                            input: { status: "APPROVED" },
                          })
                        }
                        disabled={updateRecord.isPending}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium hover:bg-blue-200 disabled:opacity-50 transition-colors"
                      >
                        Approve
                      </button>
                    )}
                    {record.status === "APPROVED" && (
                      <button
                        onClick={() =>
                          updateRecord.mutate({
                            id: record.id,
                            input: { status: "PAID" },
                          })
                        }
                        disabled={updateRecord.isPending}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium hover:bg-green-200 disabled:opacity-50 transition-colors"
                      >
                        Mark paid
                      </button>
                    )}
                    {record.status === "PAID" && (
                      <span className="text-xs text-gray-400">Paid</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
