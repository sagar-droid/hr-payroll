"use client";

import { useAttendance } from "@/src/features/attendance/hooks";
import { useState } from "react";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function AttendancePage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useAttendance({
    month,
    year,
    page,
    limit: 20,
  });

  return (
    <div className="p-8 font-sans">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          Attendance
        </h1>
        <p className="text-sm text-gray-500">Monthly attendance records</p>
      </div>

      {/* filters */}
      <div className="flex gap-3 mb-6">
        <select
          value={month}
          onChange={(e) => {
            setMonth(Number(e.target.value));
            setPage(1);
          }}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {MONTHS.map((m, i) => (
            <option key={m} value={i + 1}>
              {m}
            </option>
          ))}
        </select>
        <select
          value={year}
          onChange={(e) => {
            setYear(Number(e.target.value));
            setPage(1);
          }}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {[2024, 2025, 2026].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <p className="text-sm text-gray-500">Loading...</p>}
      {isError && (
        <p className="text-sm text-red-500">Failed to load attendance.</p>
      )}

      {data && (
        <>
          <p className="text-sm text-gray-500 mb-3">
            {data.total} records found
          </p>

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Employee
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Date
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Check in
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Check out
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Hours worked
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.records.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-900">
                      {(r as any).employee?.first_name}{" "}
                      {(r as any).employee?.last_name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(r.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {r.check_in
                        ? new Date(r.check_in).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {r.check_out
                        ? new Date(r.check_out).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {r.hours_worked ? (
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            Number(r.hours_worked) >= 8
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {r.hours_worked}h
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
