"use client";

import { useState } from "react";
import { useRegister } from "../../features/auth/hooks";
import { RegisterSchema } from "../../features/auth/schemas";
import Link from "next/link";

export default function RegisterPage() {
  const register = useRegister();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setErrors({});

    const result = RegisterSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    register.mutate({
      email: result.data.email,
      password: result.data.password,
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-[1.25rem] bg-white p-8 shadow-lg">
        <h1 className="mb-1 text-3xl font-semibold">HR Payroll</h1>
        <p className="mb-6 text-sm text-slate-500">Create your account</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="you@company.com"
            />
            {errors.email && (
              <p className="text-sm text-rose-600">{errors.email}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-sm text-rose-600">{errors.password}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">
              Confirm Password
            </label>
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-rose-600">{errors.confirmPassword}</p>
            )}
          </div>

          {register.error && (
            <p className="text-sm text-rose-600">
              {register.error instanceof Error
                ? register.error.message
                : "Registration failed"}
            </p>
          )}

          <button
            type="submit"
            disabled={register.isPending}
            className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {register.isPending ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 transition hover:text-blue-800"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
