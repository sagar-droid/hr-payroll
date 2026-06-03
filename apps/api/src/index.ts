import express from "express";
import cors from "cors";
import type { ApiResponse } from "@hr-payroll/types";

const app = express();
const PORT = 4000;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.get("/health", (req, res) => {
  const response: ApiResponse<{ status: string }> = {
    success: true,
    message: "API is running",
    data: { status: "ok" },
  };
  res.json(response);
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});