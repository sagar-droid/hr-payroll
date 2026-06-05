"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/features/auth/store";
import { useLogout } from "@/src/features/auth/hooks";

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const logout = useLogout();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="p-8 font-sans">
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-sm text-slate-500">
            {user?.email} — {user?.role}
          </p>
        </div>

        <button
          onClick={() => logout.mutate()}
          className="inline-flex rounded-2xl bg-rose-100 px-4 py-2 font-medium text-rose-800 transition hover:bg-rose-200"
        >
          {logout.isPending ? "Logging out..." : "Logout"}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <a
          href="/dashboard/employees"
          className="block rounded-[1rem] border border-slate-200 bg-white p-5 text-slate-900 shadow-sm transition hover:shadow-md"
        >
          <p className="mb-1 text-xs text-slate-500">Manage</p>
          <p className="text-lg font-semibold">Employees</p>
        </a>
      </div>
    </div>
  );
}
