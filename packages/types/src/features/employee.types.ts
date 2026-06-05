export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT";
export type EmploymentStatus = "ACTIVE" | "INACTIVE" | "ON_LEAVE";

export type Department = {
  id: string;
  name: string;
  createdAt: string;
};

export type Employee = {
  id: string;
  userId: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  job_title: string;
  department_id: string | null;
  department?: Department;
  employment_type: EmploymentType;
  employment_status: EmploymentStatus;
  salary: number;
  joined_at: string;
  created_at: string;
};

export type CreateEmployeeInput = {
  user_id?: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  job_title: string;
  department_id?: string | null;
  employment_type: EmploymentType;
  employment_status: EmploymentStatus;
  salary: number;
  joined_at?: string;
};

export type UpdateEmployeeInput = Partial<CreateEmployeeInput>;
