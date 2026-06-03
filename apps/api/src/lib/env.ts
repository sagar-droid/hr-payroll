import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT || "4000",
  DATABASE_URL: process.env.DATABASE_URL!,
  SUPABASE_URL: process.env.SUPABASE_URL!,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
};

// Fail fast — crash on startup if anything is missing
const required = Object.entries(env);
for (const [key, value] of required) {
  if (!value) throw new Error(`Missing environment variable: ${key}`);
}
