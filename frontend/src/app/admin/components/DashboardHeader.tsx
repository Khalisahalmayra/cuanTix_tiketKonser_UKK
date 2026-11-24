"use client";

import { RefreshCw, ShieldCheck } from "lucide-react";
import { AdminUser } from "../types";

interface DashboardHeaderProps {
  adminUser: AdminUser | null;
  refreshing: boolean;
  onRefresh: () => void;
}

export function DashboardHeader({
  adminUser,
  refreshing,
  onRefresh,
}: DashboardHeaderProps) {
  const greetingName = adminUser?.name || "Admin CuanTix";

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Halo, {greetingName} 👋
          </h1>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700 border border-purple-200/80">
            <ShieldCheck className="h-3.5 w-3.5 text-purple-600" />
            Administrator
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Pantau performa event dan kelola persetujuan pengajuan event CuanTix secara real-time.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 disabled:opacity-60 cursor-pointer"
          title="Segarkan data terbaru dari server"
        >
          <RefreshCw
            className={`h-4 w-4 text-purple-600 ${refreshing ? "animate-spin" : ""}`}
          />
          <span>{refreshing ? "Memperbarui..." : "Segarkan"}</span>
        </button>
      </div>
    </div>
  );
}
