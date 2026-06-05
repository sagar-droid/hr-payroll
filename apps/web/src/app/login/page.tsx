"use client";

import { useState } from "react";
import { useLogin } from "../../features/auth/hooks";
import { LoginSchema } from "../../features/auth/schemas";

export default function LoginPage() {
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setErrors({});

    const result = LoginSchema.safeParse({ email, password });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    login.mutate(result.data);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-[1.25rem] bg-white p-8 shadow-lg">
        <h1 className="mb-1 text-3xl font-semibold">HR Payroll</h1>
        <p className="mb-6 text-sm text-slate-500">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-sm text-rose-600">{errors.password}</p>
            )}
          </div>

          {login.error && (
            <p className="text-sm text-rose-600">
              {login.error instanceof Error
                ? login.error.message
                : "Login failed"}
            </p>
          )}

          <button
            type="submit"
            disabled={login.isPending}
            className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {login.isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <a
            href="/register"
            className="text-blue-600 transition hover:text-blue-800"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
