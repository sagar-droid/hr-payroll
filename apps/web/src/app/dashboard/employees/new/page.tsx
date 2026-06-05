"use client";

import { EmployeeForm } from "@/src/features/employees/components/EmployeeForm";
import { useCreateEmployee } from "@/src/features/employees/hooks";
import { useRouter } from "next/navigation";

export default function NewEmployeePage() {
  const router = useRouter();
  const createEmployee = useCreateEmployee();

  return (
    <div className="p-8 font-sans max-w-4xl">
      <div className="mb-6 space-y-3">
        <a
          href="/dashboard/employees"
          className="text-sm text-slate-500 transition hover:text-slate-700"
        >
          ← Back to employees
        </a>
        <h1 className="text-2xl font-semibold">Add employee</h1>
      </div>

      <EmployeeForm
        onSubmit={(data) =>
          createEmployee.mutate(data, {
            onSuccess: () => router.push("/dashboard/employees"),
          })
        }
        isLoading={createEmployee.isPending}
        error={
          createEmployee.error instanceof Error
            ? createEmployee.error.message
            : undefined
        }
      />
    </div>
  );
}
