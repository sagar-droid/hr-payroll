import { Router } from "express";
import {
  listLeaveTypes,
  listLeaveRequests,
  addLeaveRequest,
  reviewLeave,
  removeLeaveRequest,
  listAttendance,
  saveAttendance,
  removeAttendance,
} from "./attendance.controller";
import { authenticate, authorize } from "../auth/auth.middleware";

const router = Router();

router.use(authenticate);

// leave types
router.get("/leave-types", listLeaveTypes);

// leave requests
router.get("/leave-requests", listLeaveRequests);
router.post("/leave-requests", addLeaveRequest);
router.patch(
  "/leave-requests/:id/review",
  authorize("ADMIN", "HR_MANAGER"),
  reviewLeave
);
router.delete(
  "/leave-requests/:id",
  authorize("ADMIN", "HR_MANAGER"),
  removeLeaveRequest
);

// attendance
router.get("/", listAttendance);
router.post("/", authorize("ADMIN", "HR_MANAGER"), saveAttendance);
router.delete("/:id", authorize("ADMIN", "HR_MANAGER"), removeAttendance);

export default router;
