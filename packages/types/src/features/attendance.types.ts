export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface LeaveType {
  id: string;
  name: string;
  days_allowed: number;
  created_at: string;
}

export interface LeaveRequest {
  id: string;
  employee_id: string;
  leave_type_id: string;
  leave_type?: LeaveType;
  start_date: string;
  end_date: string;
  days_requested: number;
  reason?: string | null;
  status: LeaveStatus;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  created_at: string;
  employee?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  date: string;
  check_in?: string | null;
  check_out?: string | null;
  hours_worked?: number | null;
  notes?: string | null;
  created_at: string;
}

export type CreateLeaveRequestInput = {
  employee_id: string;
  leave_type_id: string;
  start_date: string;
  end_date: string;
  days_requested: number;
  reason?: string | null;
};

export type ReviewLeaveRequestInput = {
  status: "APPROVED" | "REJECTED";
  reviewed_by: string;
};

export type CreateAttendanceInput = {
  employee_id: string;
  date: string;
  check_in?: string | null;
  check_out?: string | null;
  hours_worked?: number | null;
  notes?: string | null;
};
