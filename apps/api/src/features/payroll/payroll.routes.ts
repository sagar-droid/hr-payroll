import { Router } from "express";
import {
  listPayrollRuns,
  getPayrollRun,
  runPayroll,
  updateRecord,
} from "./payroll.controller";
import { authenticate, authorize } from "../auth/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/", listPayrollRuns);
router.get("/:id", getPayrollRun);
router.post("/run", authorize("ADMIN", "HR_MANAGER"), runPayroll);
router.patch("/records/:id", authorize("ADMIN", "HR_MANAGER"), updateRecord);

export default router;
