"use client";

import { useAuthStore } from "../../features/auth/store";
import { useLogout } from "../../features/auth/hooks";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const logout = useLogout();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ margin: "0 0 4px" }}>Dashboard</h1>
          <p style={{ margin: 0, color: "#666" }}>
            Welcome, {user?.email} — {user?.role}
          </p>
        </div>
        <button
          onClick={() => logout.mutate()}
          style={{
            padding: "8px 16px",
            background: "#fee2e2",
            color: "#991b1b",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          {logout.isPending ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
}
