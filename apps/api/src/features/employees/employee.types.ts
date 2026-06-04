export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT";
export type EmploymentStatus = "ACTIVE" | "INACTIVE" | "ON_LEAVE";

export interface Department {
  id: string;
  name: string;
  created_at: string;
}

export type Employee = {
  id: string;
  user_id?: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  job_title: string;
  department_id?: string | null;
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

// export type CreateEmployeeInput = Omit <Employee, "id" | "createdAt" | "department">
export type UpdateEmployeeInput = Partial<CreateEmployeeInput>;
