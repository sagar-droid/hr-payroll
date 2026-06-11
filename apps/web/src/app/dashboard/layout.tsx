import { Suspense } from "react";
import { DashboardSidebar } from "@/src/components/DashboardSidebar";
import { AuthGuard } from "@/src/components/AuthGuard";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
        <Suspense
          fallback={<div className="w-60 bg-white border-r border-gray-200" />}
        >
          <DashboardSidebar />
        </Suspense>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </AuthGuard>
  );
}

export default DashboardLayout;
