"use client";

import { useState } from "react";
import { useRegister } from "../../features/auth/hooks";
import { RegisterSchema } from "../../features/auth/schemas";

export default function RegisterPage() {
  const register = useRegister();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setErrors({});

    const result = RegisterSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    register.mutate({
      email: result.data.email,
      password: result.data.password,
    });
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>HR Payroll</h1>
        <p style={styles.subtitle}>Create your account</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="you@company.com"
            />
            {errors.email && <p style={styles.error}>{errors.email}</p>}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              style={styles.input}
              placeholder="••••••••"
            />
            {errors.password && <p style={styles.error}>{errors.password}</p>}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              style={styles.input}
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p style={styles.error}>{errors.confirmPassword}</p>
            )}
          </div>

          {register.error && (
            <p style={styles.error}>
              {register.error instanceof Error
                ? register.error.message
                : "Registration failed"}
            </p>
          )}

          <button
            type="submit"
            disabled={register.isPending}
            style={styles.button}
          >
            {register.isPending ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <a href="/login" style={styles.link}>
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f5f5",
  },
  card: {
    background: "white",
    padding: "2rem",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  title: { margin: "0 0 4px", fontSize: "24px", fontWeight: 600 },
  subtitle: { margin: "0 0 24px", color: "#666", fontSize: "14px" },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "14px", fontWeight: 500 },
  input: {
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
  },
  error: { color: "#e53e3e", fontSize: "12px", margin: 0 },
  button: {
    padding: "10px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    marginTop: "8px",
  },
  footer: {
    textAlign: "center",
    fontSize: "14px",
    marginTop: "16px",
    color: "#666",
  },
  link: { color: "#2563eb", textDecoration: "none" },
};
