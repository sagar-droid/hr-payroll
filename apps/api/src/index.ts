import "./lib/env";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./features/auth/auth.routes";
import employeeRoutes from "./features/employees/employees.routes";
import attendanceRoutes from "./features/attendance/attendance.routes";
import payrollRoutes from "./features/payroll/payroll.routes";
import type { ApiResponse } from "@hr-payroll/types";
import analyticsRoutes from "./features/analytics/analytics.routes";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/health", (req, res) => {
  const response: ApiResponse<{ success: string }> = {
    success: true,
    message: "API is running",
    data: { success: "ok" },
  };
  res.json(response);
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
