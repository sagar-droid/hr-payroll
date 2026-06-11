"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  useHeadcount,
  usePayrollSummary,
  useAttendanceSummary,
} from "@/src/features/analytics/hooks";
import Skeleton from "@/src/components/Skeleton";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AnalyticsPage() {
  const now = new Date();
  const [month] = useState(now.getMonth() + 1);
  const [year] = useState(now.getFullYear());

  const headcount = useHeadcount();
  const payroll = usePayrollSummary();
  const attendance = useAttendanceSummary(month, year);

  const latestRun = payroll.data?.runs?.at(-1);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Analytics</h1>
        <p className="text-sm text-gray-500">Overview of your organization</p>
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {headcount.isLoading ? (
          <>
            <Skeleton variant="card" />
          </>
        ) : (
          <>
            <Skeleton
              variant="stats"
              label="Total employees"
              value={headcount.data?.total ?? 0}
            />
            <Skeleton
              variant="stats"
              label="Active employees"
              value={
                headcount.data?.by_status?.find((s) => s.status === "ACTIVE")
                  ?.count ?? 0
              }
            />
          </>
        )}

        {attendance.isLoading ? (
          <>
            <Skeleton variant="card" />
            <Skeleton variant="card" />
          </>
        ) : (
          <>
            <Skeleton
              variant="stats"
              label="Avg hours this month"
              value={`${attendance.data?.avg_hours ?? 0}h`}
            />
            <Skeleton
              variant="stats"
              label="Attendance records"
              value={attendance.data?.total_records ?? 0}
              sub={`${attendance.data?.unique_employees ?? 0} employees`}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* headcount by department */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-medium text-gray-700 mb-4">
            Headcount by department
          </h2>
          {headcount.isLoading ? (
            <div className="h-48 flex items-center justify-center">
              <p className="text-sm text-gray-400">Loading...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={headcount.data?.by_department ?? []}>
                <XAxis
                  dataKey="department"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* headcount by status */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-medium text-gray-700 mb-4">
            Employees by status
          </h2>
          {headcount.isLoading ? (
            <div className="h-48 flex items-center justify-center">
              <p className="text-sm text-gray-400">Loading...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={headcount.data?.by_status ?? []}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label={({
                    status,
                    count,
                  }: {
                    status: string;
                    count: number;
                  }) => `${status} (${count})`}
                  labelLine={false}
                >
                  {headcount.data?.by_status?.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* payroll cost trend */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-medium text-gray-700 mb-4">
            Payroll cost trend
          </h2>
          {payroll.isLoading ? (
            <div className="h-48 flex items-center justify-center">
              <p className="text-sm text-gray-400">Loading...</p>
            </div>
          ) : payroll.data?.runs?.length === 0 ? (
            <div className="h-48 flex items-center justify-center">
              <p className="text-sm text-gray-400">No payroll runs yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={payroll.data?.runs?.map((r) => ({
                  period: new Date(r.period_start).toLocaleDateString("en", {
                    month: "short",
                    year: "2-digit",
                  }),
                  gross: r.total_gross,
                  net: r.total_net,
                }))}
              >
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                  }}
                  formatter={(v) => {
                    const num = typeof v === "number" ? v : Number(v);
                    return isNaN(num) ? String(v) : `$${num.toLocaleString()}`;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar
                  dataKey="gross"
                  name="Gross"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="net"
                  name="Net"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* payroll cost by department */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-medium text-gray-700 mb-1">
            Cost by department
          </h2>
          <p className="text-xs text-gray-400 mb-4">Latest payroll run</p>
          {payroll.isLoading ? (
            <div className="h-48 flex items-center justify-center">
              <p className="text-sm text-gray-400">Loading...</p>
            </div>
          ) : payroll.data?.by_department?.length === 0 ? (
            <div className="h-48 flex items-center justify-center">
              <p className="text-sm text-gray-400">No data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={payroll.data?.by_department ?? []}>
                <XAxis
                  dataKey="department"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                  }}
                  formatter={(v) => {
                    const num = typeof v === "number" ? v : Number(v);
                    return isNaN(num) ? String(v) : `$${num.toLocaleString()}`;
                  }}
                />
                <Bar dataKey="cost" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* latest payroll run summary */}
      {latestRun && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-medium text-gray-700 mb-4">
            Latest payroll run
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Period</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date(latestRun.period_start).toLocaleDateString()} —{" "}
                {new Date(latestRun.period_end).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Total gross</p>
              <p className="text-sm font-medium text-gray-900">
                ${latestRun.total_gross.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Total net</p>
              <p className="text-sm font-medium text-green-600">
                ${latestRun.total_net.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
