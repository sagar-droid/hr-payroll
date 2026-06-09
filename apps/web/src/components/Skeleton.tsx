"use client";

import React from "react";

type Variant = "table" | "card";

interface SkeletonProps {
  variant?: Variant;
  rows?: number;
  cardsPerRow?: number;
  className?: string;
}

export default function Skeleton({
  variant = "table",
  rows = 5,
  cardsPerRow = 3,
  className = "",
}: SkeletonProps) {
  if (variant === "card") {
    return (
      <div
        className={`grid gap-4 ${className}`}
        style={{ gridTemplateColumns: `repeat(${cardsPerRow}, minmax(0,1fr))` }}
      >
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse space-y-3 rounded-2xl bg-white p-4 shadow-sm"
          >
            <div className="h-4 w-1/2 rounded bg-slate-200" />
            <div className="h-36 rounded bg-slate-200" />
            <div className="flex gap-2">
              <div className="h-4 w-1/3 rounded bg-slate-200" />
              <div className="h-4 w-1/4 rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // table variant
  return (
    <div
      className={`overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3" />
            <th className="px-4 py-3" />
            <th className="px-4 py-3" />
            <th className="px-4 py-3" />
            <th className="px-4 py-3" />
            <th className="px-4 py-3" />
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="bg-white">
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="animate-pulse hover:bg-transparent">
              <td className="px-4 py-4 align-middle">
                <div className="h-4 w-48 rounded bg-slate-200" />
              </td>
              <td className="px-4 py-4 align-middle">
                <div className="h-4 w-48 rounded bg-slate-200" />
              </td>
              <td className="px-4 py-4 align-middle">
                <div className="h-4 w-32 rounded bg-slate-200" />
              </td>
              <td className="px-4 py-4 align-middle">
                <div className="h-4 w-28 rounded bg-slate-200" />
              </td>
              <td className="px-4 py-4 align-middle">
                <div className="h-4 w-20 rounded bg-slate-200" />
              </td>
              <td className="px-4 py-4 align-middle">
                <div className="h-4 w-20 rounded bg-slate-200" />
              </td>
              <td className="px-4 py-4 align-middle">
                <div className="h-4 w-24 rounded bg-slate-200" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
