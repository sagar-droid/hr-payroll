"use client";

import { useState } from "react";
import {
  useLeaveRequests,
  useReviewLeaveRequest,
} from "@/src/features/attendance/hooks";
import { useAuthStore } from "@/src/features/auth/store";
import Link from "next/link";

const statusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default function LeavePage() {
  const { user } = useAuthStore();
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useLeaveRequests({
    status: statusFilter || undefined,
    page,
    limit: 10,
  });

  const reviewLeave = useReviewLeaveRequest();

  function handleReview(id: string, status: "APPROVED" | "REJECTED") {
    if (!user?.id) return;
    reviewLeave.mutate({ id, input: { status, reviewed_by: user.id } });
  }

  const canReview = user?.role === "ADMIN" || user?.role === "HR_MANAGER";

  return (
    <div className="p-8 font-sans">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Leave requests
          </h1>
          <p className="text-sm text-gray-500">Manage employee leave</p>
        </div>
        <Link
          href="/dashboard/leave/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          New request
        </Link>
      </div>

      <div className="mb-5">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {isLoading && <p className="text-sm text-gray-500">Loading...</p>}
      {isError && (
        <p className="text-sm text-red-500">Failed to load leave requests.</p>
      )}

      {data && (
        <>
          <p className="text-sm text-gray-500 mb-3">
            {data.total} request{data.total !== 1 ? "s" : ""}
          </p>

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Employee
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Leave type
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    From
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    To
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Days
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Status
                  </th>
                  {canReview && (
                    <th className="text-left px-4 py-3 font-medium text-gray-600">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.leave_requests.map((lr) => (
                  <tr
                    key={lr.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-900">
                      {(lr as any).employee?.first_name}{" "}
                      {(lr as any).employee?.last_name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {(lr as any).leave_type?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(lr.start_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(lr.end_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {lr.days_requested}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[lr.status]}`}
                      >
                        {lr.status}
                      </span>
                    </td>
                    {canReview && (
                      <td className="px-4 py-3">
                        {lr.status === "PENDING" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleReview(lr.id, "APPROVED")}
                              disabled={reviewLeave.isPending}
                              className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium hover:bg-green-200 disabled:opacity-50 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReview(lr.id, "REJECTED")}
                              disabled={reviewLeave.isPending}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium hover:bg-red-200 disabled:opacity-50 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">
                            Reviewed
                          </span>
                        )}
                      </td>
                    )}
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
