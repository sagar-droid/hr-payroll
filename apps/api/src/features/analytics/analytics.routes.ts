import { Router } from "express";
import {
  headcount,
  payrollSummary,
  attendanceSummary,
} from "./analytics.controller";
import { authenticate } from "../auth/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/headcount", headcount);
router.get("/payroll", payrollSummary);
router.get("/attendance", attendanceSummary);

export default router;
