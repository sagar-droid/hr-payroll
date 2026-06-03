export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT";
export type EmploymentStatus = "ACTIVE" | "INACTIVE" | "ON_LEAVE";

export type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  departmentId: string;
  employmentType: EmploymentType;
  status: EmploymentStatus;
  createdAt: string;
};
