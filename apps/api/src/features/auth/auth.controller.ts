import type { Request, Response } from "express";
import { RegisterSchema, LoginSchema } from "./auth.schemas";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  getAuthUser,
} from "./auth.service";

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export async function register(req: Request, res: Response) {
  const result = RegisterSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      data: result.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const { user, accessToken, refreshToken } = await registerUser(result.data);
    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
    res.status(201).json({
      success: true,
      message: "Registered successfully",
      data: { user, accessToken },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Registration failed";
    res.status(400).json({ success: false, message, data: null });
  }
}

export async function login(req: Request, res: Response) {
  const result = LoginSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      data: result.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const { user, accessToken, refreshToken } = await loginUser(result.data);
    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: { user, accessToken },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Login failed";
    res.status(401).json({ success: false, message, data: null });
  }
}

export async function refresh(req: Request, res: Response) {
  const token = req.cookies?.refreshToken;

  if (!token) {
    res
      .status(401)
      .json({ success: false, message: "No refresh token", data: null });
    return;
  }

  try {
    const { accessToken } = await refreshAccessToken(token);
    res.status(200).json({
      success: true,
      message: "Token refreshed",
      data: { accessToken },
    });
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
      data: null,
    });
  }
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie("refreshToken");
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
    data: null,
  });
}

export async function getMe(req: Request, res: Response) {
  try {
    const user = await getAuthUser(req.user!.userId);
    res.status(200).json({
      success: true,
      message: "User fetched",
      data: { user },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch user";
    res.status(401).json({ success: false, message, data: null });
  }
}
