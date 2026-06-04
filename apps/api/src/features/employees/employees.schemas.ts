import z from "zod";

export const CreateEmployeeSchema = z.object({
  first_name: z.string().min(1, "First Name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email"),
  phone: z.string().optional(),
  job_title: z.string().min(1, "Job title ios required"),
  department_id: z.uuid("Invalid Department").optional(),
  employment_type: z
    .enum(["FULL_TIME", "PART_TIME", "CONTRACT"])
    .default("FULL_TIME"),
  employment_status: z
    .enum(["ACTIVE", "INACTIVE", "ON_LEAVE"])
    .default("ACTIVE"),
  salary: z.number().min(0, "Salary must be positive"),
  joined_at: z.iso.datetime().optional(),
  user_id: z.uuid().nullable().optional(),
});

export const UpdateEmployeeSchema = CreateEmployeeSchema.partial();

//for paginations

export const EmployeeQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  employment_status: z.enum(["ACTIVE", "INACTIVE", "ON_LEAVE"]).optional(),
  department_id: z.uuid().optional(),
});

export type CreateEmployeeInput = z.infer<typeof CreateEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof UpdateEmployeeSchema>;
export type EmployeeQuery = z.infer<typeof EmployeeQuerySchema>;
