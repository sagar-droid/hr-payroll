"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useEmployee, useUpdateEmployee } from "@/src/features/employees/hooks";
import { EmployeeForm } from "@/src/features/employees/components/EmployeeForm";
import Link from "next/link";

export default function EditEmployeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: employee, isLoading } = useEmployee(id);
  const updateEmployee = useUpdateEmployee(id);

  if (isLoading)
    return <p className="p-8 text-sm text-slate-500">Loading...</p>;
  if (!employee)
    return <p className="p-8 text-sm text-rose-600">Employee not found.</p>;

  return (
    <div className="p-8 font-sans max-w-4xl">
      <div className="mb-6 space-y-3">
        <Link
          href={`/dashboard/employees/${id}`}
          className="text-sm text-slate-500 transition hover:text-slate-700"
        >
          ← Back to employee
        </Link>
        <h1 className="text-2xl font-semibold">
          Edit {employee.first_name} {employee.last_name}
        </h1>
      </div>

      <EmployeeForm
        initial={employee}
        onSubmit={(data) =>
          updateEmployee.mutate(data, {
            onSuccess: () => router.push(`/dashboard/employees/${id}`),
          })
        }
        isLoading={updateEmployee.isPending}
        error={
          updateEmployee.error instanceof Error
            ? updateEmployee.error.message
            : undefined
        }
      />
    </div>
  );
}
