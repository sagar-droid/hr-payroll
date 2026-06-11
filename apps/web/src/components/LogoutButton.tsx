"use client";

import { useLogout } from "@/src/features/auth/hooks";

export function LogoutButton() {
  const logout = useLogout();

  return (
    <button
      onClick={() => logout.mutate()}
      disabled={logout.isPending}
      className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left disabled:opacity-50"
    >
      {logout.isPending ? "Logging out..." : "Log out"}
    </button>
  );
}
