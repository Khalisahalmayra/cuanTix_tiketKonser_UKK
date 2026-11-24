"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { useAdminDashboard } from "../hooks/useAdminDashboard";
import { DashboardHeader } from "../components/DashboardHeader";
import { StatsCardGrid } from "../components/StatsCardGrid";
import { QuickActions } from "../components/QuickActions";
import { RecentSubmissionsCard } from "../components/RecentSubmissionsCard";
import { RecentEventsCard } from "../components/RecentEventsCard";

export default function AdminDashboardPage() {
  const {
    adminUser,
    stats,
    recentSubmissions,
    recentEvents,
    loading,
    refreshing,
    error,
    refreshData,
  } = useAdminDashboard();

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="h-8 w-64 rounded-xl bg-slate-200" />
            <div className="mt-2 h-4 w-96 rounded-lg bg-slate-200" />
          </div>
          <div className="h-10 w-28 rounded-xl bg-slate-200" />
        </div>

        {/* Quick Actions Skeleton */}
        <div className="flex gap-3">
          <div className="h-10 w-44 rounded-xl bg-slate-200" />
          <div className="h-10 w-48 rounded-xl bg-slate-200" />
          <div className="h-10 w-40 rounded-xl bg-slate-200" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-slate-200" />
          ))}
        </div>

        {/* Tables Skeleton */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="h-72 rounded-2xl bg-slate-200" />
          <div className="h-72 rounded-2xl bg-slate-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Utama */}
      <DashboardHeader
        adminUser={adminUser}
        refreshing={refreshing}
        onRefresh={refreshData}
      />

      {/* Error Alert jika terjadi kegagalan pemanggilan API */}
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
            <p className="text-xs sm:text-sm font-medium">{error}</p>
          </div>
          <button
            type="button"
            onClick={refreshData}
            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 shadow-xs hover:bg-rose-100 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Coba Lagi</span>
          </button>
        </div>
      )}

      {/* Baris Tombol Aksi Cepat */}
      <QuickActions pendingCount={stats.pendingSubmissions} />

      {/* Grid 6 Kartu Statistik */}
      <StatsCardGrid stats={stats} />

      {/* Bagian Bawah: Grid 2 Kolom untuk Pengajuan Terbaru & Event Terbaru */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <RecentSubmissionsCard submissions={recentSubmissions} />
        <RecentEventsCard events={recentEvents} />
      </div>
    </div>
  );
}
