import { Router } from "express";
import {
  listEmployees,
  getEmployee,
  addEmployee,
  editEmployee,
  removeEmployee,
  listDepartments,
} from "./employees.controller";
import { authenticate, authorize } from "../auth/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/departments", listDepartments);

router.get("/", listEmployees);
router.get("/:id", getEmployee);
router.post("/", authorize("ADMIN", "HR_MANAGER"), addEmployee);
router.patch("/:id", authorize("ADMIN", "HR_MANAGER"), editEmployee);
router.delete("/:id", authorize("ADMIN"), removeEmployee);

export default router;
