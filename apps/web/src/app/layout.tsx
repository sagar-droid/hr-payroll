import type { Metadata } from "next";
import { Providers } from "../lib/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "HR Payroll Platform",
  description: "HR & Payroll management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
