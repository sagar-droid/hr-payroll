"use client";

import { useState } from "react";
import { useLogin } from "../../features/auth/hooks";
import { LoginSchema } from "../../features/auth/schemas";

export default function LoginPage() {
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setErrors({});

    const result = LoginSchema.safeParse({ email, password });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    login.mutate(result.data);
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>HR Payroll</h1>
        <p style={styles.subtitle}>Sign in to your account</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="you@company.com"
            />
            {errors.email && <p style={styles.error}>{errors.email}</p>}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
            />
            {errors.password && <p style={styles.error}>{errors.password}</p>}
          </div>

          {login.error && (
            <p style={styles.error}>
              {login.error instanceof Error
                ? login.error.message
                : "Login failed"}
            </p>
          )}

          <button
            type="submit"
            disabled={login.isPending}
            style={styles.button}
          >
            {login.isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p style={styles.footer}>
          Don&apos;t have an account?{" "}
          <a href="/register" style={styles.link}>
            Register
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
