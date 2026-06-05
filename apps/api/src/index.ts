import "./lib/env";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./features/auth/auth.routes";
import employeeRoutes from "./features/employees/employees.routes";
import type { ApiResponse } from "@hr-payroll/types";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);

app.get("/health", (req, res) => {
  const response: ApiResponse<{ status: string }> = {
    status: true,
    message: "API is running",
    data: { status: "ok" },
  };
  res.json(response);
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
