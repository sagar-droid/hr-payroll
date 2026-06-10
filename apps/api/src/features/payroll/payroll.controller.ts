import type { Request, Response } from "express";
import {
  CreatePayrollRunSchema,
  UpdatePayrollRecordSchema,
  PayrollQuerySchema,
} from "./payroll.schemas";
import {
  getPayrollRuns,
  getPayrollRunById,
  getPayrollRecords,
  createAndRunPayroll,
  updatePayrollRecord,
} from "./payroll.service";

export async function listPayrollRuns(req: Request, res: Response) {
  const result = PayrollQuerySchema.safeParse(req.query);
  if (!result.success) {
    res
      .status(400)
      .json({
        success: false,
        message: "Invalid query",
        data: result.error.flatten().fieldErrors,
      });
    return;
  }
  try {
    const data = await getPayrollRuns(result.data);
    res.status(200).json({ success: true, message: "OK", data });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch payroll runs";
    res.status(500).json({ success: false, message, data: null });
  }
}

export async function getPayrollRun(req: Request, res: Response) {
  try {
    const run = await getPayrollRunById(req.params.id);
    const records = await getPayrollRecords(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "OK", data: { run, records } });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Payroll run not found";
    res.status(404).json({ success: false, message, data: null });
  }
}

export async function runPayroll(req: Request, res: Response) {
  const result = CreatePayrollRunSchema.safeParse(req.body);
  if (!result.success) {
    res
      .status(400)
      .json({
        success: false,
        message: "Validation failed",
        data: result.error.flatten().fieldErrors,
      });
    return;
  }
  try {
    const run = await createAndRunPayroll(result.data, req.user!.userId);
    res
      .status(201)
      .json({ success: true, message: "Payroll run completed", data: { run } });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to run payroll";
    res.status(400).json({ success: false, message, data: null });
  }
}

export async function updateRecord(req: Request, res: Response) {
  const result = UpdatePayrollRecordSchema.safeParse(req.body);
  if (!result.success) {
    res
      .status(400)
      .json({
        success: false,
        message: "Validation failed",
        data: result.error.flatten().fieldErrors,
      });
    return;
  }
  try {
    const record = await updatePayrollRecord(req.params.id, result.data);
    res
      .status(200)
      .json({ success: true, message: "Record updated", data: { record } });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to update record";
    res.status(400).json({ success: false, message, data: null });
  }
}
