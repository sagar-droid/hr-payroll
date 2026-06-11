"use client";

import { usePathname } from "next/navigation";
import { useAuthStore } from "@/src/features/auth/store";
import { useLogout } from "@/src/features/auth/hooks";
import Link from "next/link";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "⊞" },
  { label: "Employees", href: "/dashboard/employees", icon: "👥" },
  { label: "Attendance", href: "/dashboard/attendance", icon: "📅" },
  { label: "Leave", href: "/dashboard/leave", icon: "🌴" },
  { label: "Payroll", href: "/dashboard/payroll", icon: "💰" },
  { label: "Analytics", href: "/dashboard/analytics", icon: "📊" },
];

export function DashboardSidebar() {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const logout = useLogout();

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col shrink-0">
      {/* logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <h1 className="text-base font-semibold text-gray-900">HR Payroll</h1>
        <p className="text-xs text-gray-400 mt-0.5">Management platform</p>
      </div>

      {/* nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* user */}
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-medium shrink-0">
            {user?.email?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.email}
            </p>
            <p className="text-xs text-gray-400">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left disabled:opacity-50"
        >
          {logout.isPending ? "Logging out..." : "Log out"}
        </button>
      </div>
    </aside>
  );
}
