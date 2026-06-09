import { z } from "zod";

export const CreateLeaveRequestSchema = z.object({
  employee_id: z.uuid("Invalid employee"),
  leave_type_id: z.uuid("Invalid leave type"),
  start_date: z.string(),
  end_date: z.string(),
  days_requested: z.number().min(1, "Must request at least 1 day"),
  reason: z.string().optional().nullable(),
});

export const ReviewLeaveRequestSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  reviewed_by: z.uuid(),
});

export const CreateAttendanceSchema = z.object({
  employee_id: z.uuid(),
  date: z.string(),
  check_in: z.string().optional().nullable(),
  check_out: z.string().optional().nullable(),
  hours_worked: z.number().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const AttendanceQuerySchema = z.object({
  employee_id: z.uuid().optional(),
  month: z.coerce.number().min(1).max(12).optional(),
  year: z.coerce.number().min(2000).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(30),
});

export const LeaveRequestQuerySchema = z.object({
  employee_id: z.uuid().optional(),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export type CreateLeaveRequestInput = z.infer<typeof CreateLeaveRequestSchema>;
export type ReviewLeaveRequestInput = z.infer<typeof ReviewLeaveRequestSchema>;
export type CreateAttendanceInput = z.infer<typeof CreateAttendanceSchema>;
export type AttendanceQuery = z.infer<typeof AttendanceQuerySchema>;
export type LeaveRequestQuery = z.infer<typeof LeaveRequestQuerySchema>;
