export type UserRole = "ADMIN" | "HR_MANAGER" | "EMPLOYEE";

export type User = {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
};
