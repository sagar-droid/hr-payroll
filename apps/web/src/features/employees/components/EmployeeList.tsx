"use client";

import { useState } from "react";
import { useEmployees, useDeleteEmployee } from "../hooks";
import { useAuthStore } from "../../auth/store";
import Skeleton from "../../../components/Skeleton";

export function EmployeeList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const { user } = useAuthStore();

  const { data, isLoading, isError } = useEmployees({
    page,
    limit: 10,
    search,
  });
  const deleteEmployee = useDeleteEmployee();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  function handleDelete(id: string, name: string) {
    if (confirm(`Delete ${name}? This cannot be undone.`)) {
      deleteEmployee.mutate(id);
    }
  }

  if (isLoading) return <Skeleton variant="table" rows={6} />;
  if (isError)
    return (
      <p className="mb-4 text-sm text-rose-600">Failed to load employees.</p>
    );

  const { employees, total, totalPages } = data!;

  return (
    <div>
      <form
        className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center"
        onSubmit={handleSearch}
      >
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name or email..."
          className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
        <button
          type="submit"
          className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Search
        </button>
        {search && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSearchInput("");
              setPage(1);
            }}
            className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
          >
            Clear
          </button>
        )}
      </form>

      <p className="mb-3 text-sm text-slate-500">
        {total} employee{total !== 1 ? "s" : ""} found
      </p>

      {employees.length === 0 ? (
        <p className="text-sm text-slate-500">No employees found.</p>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Job Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Department
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {employees.map((emp) => {
                const statusClasses =
                  emp.employment_status === "ACTIVE"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-rose-100 text-rose-700";

                return (
                  <tr key={emp.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4 align-middle text-slate-900">
                      {emp.first_name} {emp.last_name}
                    </td>
                    <td className="px-4 py-4 align-middle text-slate-900">
                      {emp.email}
                    </td>
                    <td className="px-4 py-4 align-middle text-slate-900">
                      {emp.job_title}
                    </td>
                    <td className="px-4 py-4 align-middle text-slate-900">
                      {emp.department?.name ?? "—"}
                    </td>
                    <td className="px-4 py-4 align-middle">
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {emp.employment_type.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-4 align-middle">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses}`}
                      >
                        {emp.employment_status}
                      </span>
                    </td>
                    <td className="px-4 py-4 align-middle space-x-3 text-sm">
                      <a
                        href={`/dashboard/employees/${emp.id}`}
                        className="text-blue-600 transition hover:text-blue-800"
                      >
                        View
                      </a>
                      {(user?.role === "ADMIN" ||
                        user?.role === "HR_MANAGER") && (
                        <a
                          href={`/dashboard/employees/${emp.id}/edit`}
                          className="text-blue-600 transition hover:text-blue-800"
                        >
                          Edit
                        </a>
                      )}
                      {user?.role === "ADMIN" && (
                        <button
                          onClick={() =>
                            handleDelete(
                              emp.id,
                              `${emp.first_name} ${emp.last_name}`
                            )
                          }
                          disabled={deleteEmployee.isPending}
                          className="text-sm font-medium text-rose-600 transition hover:text-rose-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-slate-500">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
