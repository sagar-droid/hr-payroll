"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePayrollRuns, useRunPayroll } from "@/src/features/payroll/hooks";
import { useAuthStore } from "@/src/features/auth/store";
import Link from "next/link";

const statusStyles: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-600",
  PROCESSING: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function PayrollPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = usePayrollRuns(page);
  const runPayroll = useRunPayroll();

  const [form, setForm] = useState({ period_start: "", period_end: "" });
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");

  const canRun = user?.role === "ADMIN" || user?.role === "HR_MANAGER";

  function handleRun(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    if (!form.period_start || !form.period_end) {
      setFormError("Both dates are required");
      return;
    }
    if (form.period_end < form.period_start) {
      setFormError("End date must be after start date");
      return;
    }
    runPayroll.mutate(form, {
      onSuccess: (run) => {
        setShowForm(false);
        setForm({ period_start: "", period_end: "" });
        router.push(`/dashboard/payroll/${run.id}`);
      },
    });
  }

  return (
    <div className="p-8 font-sans">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Payroll</h1>
          <p className="text-sm text-gray-500">Manage payroll runs</p>
        </div>
        {canRun && (
          <button
            onClick={() => setShowForm((v) => !v)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            {showForm ? "Cancel" : "Run payroll"}
          </button>
        )}
      </div>

      {/* run payroll form */}
      {showForm && (
        <div className="mb-6 p-5 border border-gray-200 rounded-xl bg-gray-50">
          <h2 className="text-base font-medium text-gray-900 mb-4">
            New payroll run
          </h2>
          <form onSubmit={handleRun} className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Period start
              </label>
              <input
                type="date"
                value={form.period_start}
                onChange={(e) =>
                  setForm((p) => ({ ...p, period_start: e.target.value }))
                }
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Period end
              </label>
              <input
                type="date"
                value={form.period_end}
                onChange={(e) =>
                  setForm((p) => ({ ...p, period_end: e.target.value }))
                }
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={runPayroll.isPending}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {runPayroll.isPending ? "Running..." : "Run now"}
            </button>
          </form>
          {formError && (
            <p className="text-sm text-red-500 mt-2">{formError}</p>
          )}
          {runPayroll.error && (
            <p className="text-sm text-red-500 mt-2">
              {runPayroll.error instanceof Error
                ? runPayroll.error.message
                : "Failed to run payroll"}
            </p>
          )}
        </div>
      )}

      {isLoading && <p className="text-sm text-gray-500">Loading...</p>}
      {isError && (
        <p className="text-sm text-red-500">Failed to load payroll runs.</p>
      )}

      {data && (
        <>
          <p className="text-sm text-gray-500 mb-3">
            {data.total} run{data.total !== 1 ? "s" : ""}
          </p>

          {data.payroll_runs.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl">
              <p className="text-gray-400 text-sm">No payroll runs yet.</p>
              {canRun && (
                <p className="text-gray-400 text-sm mt-1">
                  Click "Run payroll" to get started.
                </p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      Period
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      Created
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.payroll_runs.map((run) => (
                    <tr
                      key={run.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-900 font-medium">
                        {new Date(run.period_start).toLocaleDateString()} —{" "}
                        {new Date(run.period_end).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[run.status]}`}
                        >
                          {run.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(run.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/dashboard/payroll/${run.id}`}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          View details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {data.totalPages > 1 && (
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">
                Page {page} of {data.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === data.totalPages}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
