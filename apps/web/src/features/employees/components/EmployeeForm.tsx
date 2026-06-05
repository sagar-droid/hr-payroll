"use client";

import { useState } from "react";
import { useDepartments } from "../hooks";
import type { Employee } from "@hr-payroll/types";

type Props = {
  initial?: Partial<Employee>;
  onSubmit: (data: Partial<Employee>) => void;
  isLoading: boolean;
  error?: string;
};

export function EmployeeForm({
  initial = {},
  onSubmit,
  isLoading,
  error,
}: Props) {
  const { data: departments = [] } = useDepartments();

  const [form, setForm] = useState({
    first_name: initial.first_name ?? "",
    last_name: initial.last_name ?? "",
    email: initial.email ?? "",
    phone: initial.phone ?? "",
    job_title: initial.job_title ?? "",
    department_id: initial.department_id ?? "",
    employment_type: initial.employment_type ?? "FULL_TIME",
    status: initial.employment_status ?? "ACTIVE",
    salary: initial.salary ?? 0,
    joined_at: initial.joined_at ?? new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.first_name) errs.first_name = "Required";
    if (!form.last_name) errs.last_name = "Required";
    if (!form.email) errs.email = "Required";
    if (!form.job_title) errs.job_title = "Required";
    if (form.salary < 0) errs.salary = "Must be positive";
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    onSubmit({
      ...form,
      salary: Number(form.salary),
      department_id: form.department_id || null,
      phone: form.phone || null,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">
            First name
          </label>
          <input
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          {errors.first_name && (
            <p className="text-sm text-rose-600">{errors.first_name}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">
            Last name
          </label>
          <input
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          {errors.last_name && (
            <p className="text-sm text-rose-600">{errors.last_name}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          {errors.email && (
            <p className="text-sm text-rose-600">{errors.email}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">Phone</label>
          <input
            name="phone"
            value={form.phone ?? ""}
            onChange={handleChange}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">
            Job title
          </label>
          <input
            name="job_title"
            value={form.job_title}
            onChange={handleChange}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          {errors.job_title && (
            <p className="text-sm text-rose-600">{errors.job_title}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">
            Department
          </label>
          <select
            name="department_id"
            value={form.department_id ?? ""}
            onChange={handleChange}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="">No department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">
            Employment type
          </label>
          <select
            name="employment_type"
            value={form.employment_type}
            onChange={handleChange}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="FULL_TIME">Full time</option>
            <option value="PART_TIME">Part time</option>
            <option value="CONTRACT">Contract</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="ON_LEAVE">On leave</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">Salary</label>
          <input
            name="salary"
            type="number"
            value={form.salary}
            onChange={handleChange}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          {errors.salary && (
            <p className="text-sm text-rose-600">{errors.salary}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">
            Joined date
          </label>
          <input
            name="joined_at"
            type="date"
            value={form.joined_at}
            onChange={handleChange}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="self-start rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? "Saving..." : "Save employee"}
      </button>
    </form>
  );
}
