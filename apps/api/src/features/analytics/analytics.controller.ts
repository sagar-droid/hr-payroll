import type { Request, Response } from "express";
import {
  getHeadcountSummary,
  getPayrollSummary,
  getAttendanceSummary,
} from "./analytics.service";

export async function headcount(req: Request, res: Response) {
  try {
    const data = await getHeadcountSummary();
    res.status(200).json({ success: true, message: "OK", data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed";
    res.status(500).json({ success: false, message, data: null });
  }
}

export async function payrollSummary(req: Request, res: Response) {
  try {
    const data = await getPayrollSummary();
    res.status(200).json({ success: true, message: "OK", data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed";
    res.status(500).json({ success: false, message, data: null });
  }
}

export async function attendanceSummary(req: Request, res: Response) {
  const month = Number(req.query.month) || new Date().getMonth() + 1;
  const year = Number(req.query.year) || new Date().getFullYear();
  try {
    const data = await getAttendanceSummary(month, year);
    res.status(200).json({ success: true, message: "OK", data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed";
    res.status(500).json({ success: false, message, data: null });
  }
}
