import type { Request, Response } from "express";
import {
  CreateEmployeeSchema,
  EmployeeQuerySchema,
  UpdateEmployeeSchema,
} from "./employees.schemas";
import {
  createEmployee,
  deleteEmployee,
  getDepartments,
  getEmployeeById,
  getEmployees,
  updateEmployee,
} from "./employees.service";

export async function listEmployees(req: Request, res: Response) {
  const result = EmployeeQuerySchema.safeParse(req.query);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Invalid query parameters",
      data: result.error.issues,
    });
    return;
  }

  try {
    const data = await getEmployees(result.data);
    res.status(200).json({
      success: true,
      message: "fetched employees data",
      data: data,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch Employees";
    res.status(500).json({ success: false, message: message, data: null });
  }
}

export async function getEmployee(req: Request, res: Response) {
  try {
    const employee = await getEmployeeById(req.params.id);

    res.status(200).json({
      success: true,
      message: "Employee found",
      data: { employee },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Employee not found";
    res.status(500).json({ success: false, message: message, data: null });
  }
}

export async function addEmployee(req: Request, res: Response) {
  const result = CreateEmployeeSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Failed to add Employee",
      data: result.error.issues,
    });
    return;
  }

  try {
    const employee = await createEmployee(result.data);
    res.status(201).json({
      success: true,
      message: "Employee created",
      data: { employee },
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Employee creation failed";
    res.status(500).json({ success: false, message, data: null });
  }
}

export async function editEmployee(req: Request, res: Response) {
  const result = UpdateEmployeeSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Failed to Edit Employee",
      data: result.error.issues,
    });
    return;
  }

  try {
    const employee = await updateEmployee(req.params.id, result.data);
    res.status(200).json({
      success: true,
      message: "Updated successfully",
      data: { employee },
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to update employee";
    res.status(400).json({ success: false, message, data: null });
  }
}

export async function removeEmployee(req: Request, res: Response) {
  try {
    await deleteEmployee(req.params.id);
    res.status(200).json({
      success: true,
      message: "Employee deleted",
      data: null,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to delete employee";
    res.status(400).json({ success: false, message, data: null });
  }
}

export async function listDepartments(req: Request, res: Response) {
  try {
    const departments = await getDepartments();
    res.status(200).json({
      success: true,
      message: "OK",
      data: { departments },
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch departments";
    res.status(500).json({ success: false, message, data: null });
  }
}
