"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useLeaveTypes,
  useCreateLeaveRequest,
} from "@/src/features/attendance/hooks";
import { useEmployees } from "@/src/features/employees/hooks";
import Link from "next/link";

export default function NewLeavePage() {
  const router = useRouter();
  const { data: leaveTypes = [] } = useLeaveTypes();
  const { data: employeesData } = useEmployees({ limit: 100 });
  const createLeave = useCreateLeaveRequest();

  const [form, setForm] = useState({
    employee_id: "",
    leave_type_id: "",
    start_date: "",
    end_date: "",
    reason: "",
  });
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function calculateDays() {
    if (!form.start_date || !form.end_date) return 0;
    const diff =
      Math.ceil(
        (new Date(form.end_date).getTime() -
          new Date(form.start_date).getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1;
    return Math.max(0, diff);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (
      !form.employee_id ||
      !form.leave_type_id ||
      !form.start_date ||
      !form.end_date
    ) {
      setError("All fields are required");
      return;
    }

    const days_requested = calculateDays();
    if (days_requested <= 0) {
      setError("End date must be after start date");
      return;
    }

    createLeave.mutate(
      { ...form, days_requested },
      { onSuccess: () => router.push("/dashboard/leave") }
    );
  }

  return (
    <div className="p-8 font-sans max-w-xl">
      <div className="mb-6">
        <Link
          href="/dashboard/leave"
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← Back to leave requests
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 mt-2 mb-1">
          New leave request
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Employee</label>
          <select
            name="employee_id"
            value={form.employee_id}
            onChange={handleChange}
            className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select employee</option>
            {employeesData?.employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.first_name} {emp.last_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Leave type
          </label>
          <select
            name="leave_type_id"
            value={form.leave_type_id}
            onChange={handleChange}
            className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select leave type</option>
            {leaveTypes.map((lt) => (
              <option key={lt.id} value={lt.id}>
                {lt.name} ({lt.days_allowed} days allowed)
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Start date
            </label>
            <input
              name="start_date"
              type="date"
              value={form.start_date}
              onChange={handleChange}
              className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              End date
            </label>
            <input
              name="end_date"
              type="date"
              value={form.end_date}
              onChange={handleChange}
              className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {form.start_date && form.end_date && calculateDays() > 0 && (
          <p className="text-sm text-gray-500">
            {calculateDays()} day{calculateDays() !== 1 ? "s" : ""} requested
          </p>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Reason <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            rows={3}
            placeholder="Reason for leave..."
            className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {(error || createLeave.error) && (
          <p className="text-sm text-red-500">
            {error ||
              (createLeave.error instanceof Error
                ? createLeave.error.message
                : "Failed")}
          </p>
        )}

        <button
          type="submit"
          disabled={createLeave.isPending}
          className="self-start px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {createLeave.isPending ? "Submitting..." : "Submit request"}
        </button>
      </form>
    </div>
  );
}
