import { z } from "zod";

export const CreatePayrollRunSchema = z.object({
  period_start: z.string(),
  period_end: z.string(),
});

export const UpdatePayrollRecordSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "PAID"]).optional(),
  notes: z.string().optional().nullable(),
  other_deductions: z.number().min(0).optional(),
});

export const PayrollQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  status: z.enum(["DRAFT", "PROCESSING", "COMPLETED", "CANCELLED"]).optional(),
});

export type CreatePayrollRunInput = z.infer<typeof CreatePayrollRunSchema>;
export type UpdatePayrollRecordInput = z.infer<
  typeof UpdatePayrollRecordSchema
>;
export type PayrollQuery = z.infer<typeof PayrollQuerySchema>;
