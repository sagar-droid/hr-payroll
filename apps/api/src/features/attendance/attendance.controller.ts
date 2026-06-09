import type { Request, Response } from "express";
import {
  CreateLeaveRequestSchema,
  ReviewLeaveRequestSchema,
  CreateAttendanceSchema,
  AttendanceQuerySchema,
  LeaveRequestQuerySchema,
} from "./attendance.schemas";
import {
  getLeaveTypes,
  getLeaveRequests,
  createLeaveRequest,
  reviewLeaveRequest,
  deleteLeaveRequest,
  getAttendanceRecords,
  upsertAttendance,
  deleteAttendanceRecord,
} from "./attendance.service";

// ── leave types ────────────────────────────────────────────

export async function listLeaveTypes(req: Request, res: Response) {
  try {
    const leave_types = await getLeaveTypes();
    res
      .status(200)
      .json({ success: true, message: "OK", data: { leave_types } });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch leave types";
    res.status(500).json({ success: false, message, data: null });
  }
}

// ── leave requests ─────────────────────────────────────────

export async function listLeaveRequests(req: Request, res: Response) {
  const result = LeaveRequestQuerySchema.safeParse(req.query);
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
    const data = await getLeaveRequests(result.data);
    res.status(200).json({ success: true, message: "OK", data });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch leave requests";
    res.status(500).json({ success: false, message, data: null });
  }
}

export async function addLeaveRequest(req: Request, res: Response) {
  const result = CreateLeaveRequestSchema.safeParse(req.body);
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
    const leave_request = await createLeaveRequest(result.data);
    res
      .status(201)
      .json({
        success: true,
        message: "Leave request submitted",
        data: { leave_request },
      });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to submit leave request";
    res.status(400).json({ success: false, message, data: null });
  }
}

export async function reviewLeave(req: Request, res: Response) {
  const result = ReviewLeaveRequestSchema.safeParse(req.body);
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
    const leave_request = await reviewLeaveRequest(req.params.id, result.data);
    res
      .status(200)
      .json({
        success: true,
        message: `Leave request ${result.data.status.toLowerCase()}`,
        data: { leave_request },
      });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to review leave request";
    res.status(400).json({ success: false, message, data: null });
  }
}

export async function removeLeaveRequest(req: Request, res: Response) {
  try {
    await deleteLeaveRequest(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Leave request deleted", data: null });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to delete leave request";
    res.status(400).json({ success: false, message, data: null });
  }
}

// ── attendance ─────────────────────────────────────────────

export async function listAttendance(req: Request, res: Response) {
  const result = AttendanceQuerySchema.safeParse(req.query);
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
    const data = await getAttendanceRecords(result.data);
    res.status(200).json({ success: true, message: "OK", data });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch attendance";
    res.status(500).json({ success: false, message, data: null });
  }
}

export async function saveAttendance(req: Request, res: Response) {
  const result = CreateAttendanceSchema.safeParse(req.body);
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
    const record = await upsertAttendance(result.data);
    res
      .status(200)
      .json({ success: true, message: "Attendance saved", data: { record } });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to save attendance";
    res.status(400).json({ success: false, message, data: null });
  }
}

export async function removeAttendance(req: Request, res: Response) {
  try {
    await deleteAttendanceRecord(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Record deleted", data: null });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to delete record";
    res.status(400).json({ success: false, message, data: null });
  }
}
