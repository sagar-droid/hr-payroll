import type { ApiResponse } from "@hr-payroll/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export type AuthUser = {
  id: string;
  email: string;
  role: "ADMIN" | "HR_MANAGER" | "EMPLOYEE";
};

export type AuthResponse = {
  user: AuthUser;
  accessToken: string;
};

export async function registerApi(data: {
  email: string;
  password: string;
  role?: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // sends/receives cookies
    body: JSON.stringify(data),
  });

  const json: ApiResponse<AuthResponse> = await res.json();

  if (!json.success) throw new Error(json.message);

  return json.data;
}

export async function loginApi(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const json: ApiResponse<AuthResponse> = await res.json();

  if (!json.success) throw new Error(json.message);

  return json.data;
}

export async function logoutApi(): Promise<void> {
  await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export async function refreshTokenApi(): Promise<{ accessToken: string }> {
  const res = await fetch(`${API_URL}/api/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  const json: ApiResponse<{ accessToken: string }> = await res.json();

  if (!json.success) throw new Error(json.message);

  return json.data;
}

export async function getMeApi(accessToken: string): Promise<AuthUser> {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "include",
  });

  const json: ApiResponse<{ user: AuthUser }> = await res.json();

  if (!json.success) throw new Error(json.message);

  return json.data.user;
}
