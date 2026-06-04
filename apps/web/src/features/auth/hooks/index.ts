"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store";
import { loginApi, registerApi, logoutApi, refreshTokenApi } from "../api";

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      router.push("/dashboard");
    },
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: registerApi,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      router.push("/dashboard");
    },
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      clearAuth();
      router.push("/login");
    },
  });
}

export function useInitAuth() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useQuery({
    queryKey: ["auth", "refresh"],
    queryFn: async () => {
      const { accessToken } = await refreshTokenApi();

      // decode the JWT to get user info — no library needed
      const payload = JSON.parse(atob(accessToken.split(".")[1]));

      // we need the full user from DB — for now store what we have
      setAuth(
        { id: payload.userId, email: "", role: payload.role },
        accessToken
      );

      return accessToken;
    },
    retry: false,
    staleTime: 14 * 60 * 1000, // 14 minutes (access token lasts 15)
  });
}
