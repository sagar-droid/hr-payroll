import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabase } from "../../lib/supabase";
import { env } from "../../lib/env";
import type { RegisterInput, LoginInput } from "./auth.schemas";

export function generateAccessToken(userId: string, role: string) {
  return jwt.sign({ userId, role }, env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
}

export function generateRefreshToken(userId: string) {
  return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as {
    userId: string;
    role: string;
  };
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as {
    userId: string;
  };
}

export async function registerUser(input: RegisterInput) {
  // check if email already exists
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("email", input.email)
    .single();

  if (existing) {
    throw new Error("Email already in use");
  }

  const password_hash = await bcrypt.hash(input.password, 12);

  const { data: user, error } = await supabase
    .from("users")
    .insert({
      email: input.email,
      password_hash,
      role: input.role,
    })
    .select("id, email, role, created_at")
    .single();

  if (error) throw new Error(error.message);

  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id);

  return { user, accessToken, refreshToken };
}

export async function loginUser(input: LoginInput) {
  const { data: user, error } = await supabase
    .from("users")
    .select("id, email, role, password_hash")
    .eq("email", input.email)
    .single();

  if (error || !user) {
    throw new Error("Invalid email or password");
  }

  const isValid = await bcrypt.compare(input.password, user.password_hash);

  if (!isValid) {
    throw new Error("Invalid email or password");
  }

  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id);

  // strip password_hash before returning
  const { password_hash: _, ...safeUser } = user;

  return { user: safeUser, accessToken, refreshToken };
}

export async function refreshAccessToken(token: string) {
  const payload = verifyRefreshToken(token);

  const { data: user, error } = await supabase
    .from("users")
    .select("id, role")
    .eq("id", payload.userId)
    .single();

  if (error || !user) throw new Error("User not found");

  const accessToken = generateAccessToken(user.id, user.role);

  return { accessToken };
}
