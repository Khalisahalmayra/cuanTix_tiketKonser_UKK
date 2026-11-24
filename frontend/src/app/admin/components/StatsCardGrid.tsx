"use client";

import {
  CalendarDays,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { DashboardStats } from "../types";

interface StatsCardGridProps {
  stats: DashboardStats;
}

export function StatsCardGrid({ stats }: StatsCardGridProps) {
  const statItems = [
    {
      title: "Total Event",
      value: stats.totalEvents,
      subtext: `${stats.publishedEvents} Aktif • ${stats.draftEvents} Draft`,
      icon: CalendarDays,
      iconBg: "bg-purple-100 text-purple-700",
      cardBorder: "hover:border-purple-300",
    },
    {
      title: "Total Pengajuan",
      value: stats.totalSubmissions,
      subtext: "Pengajuan oleh Customer",
      icon: FileText,
      iconBg: "bg-indigo-100 text-indigo-700",
      cardBorder: "hover:border-indigo-300",
    },
    {
      title: "Menunggu Review",
      value: stats.pendingSubmissions,
      subtext:
        stats.pendingSubmissions > 0
          ? "Perlu tindakan admin segera"
          : "Semua pengajuan telah diproses",
      icon: Clock,
      iconBg: "bg-amber-100 text-amber-700",
      cardBorder:
        stats.pendingSubmissions > 0
          ? "border-amber-300 ring-2 ring-amber-100"
          : "hover:border-amber-300",
      badge:
        stats.pendingSubmissions > 0
          ? { text: "Perlu Tindakan", class: "bg-amber-100 text-amber-800" }
          : null,
    },
    {
      title: "Perlu Revisi",
      value: stats.revisionSubmissions,
      subtext: "Menunggu revisi dari pemohon",
      icon: AlertCircle,
      iconBg: "bg-orange-100 text-orange-700",
      cardBorder: "hover:border-orange-300",
    },
    {
      title: "Pengajuan Disetujui",
      value: stats.approvedSubmissions,
      subtext: "Disetujui untuk dipublikasi",
      icon: CheckCircle2,
      iconBg: "bg-emerald-100 text-emerald-700",
      cardBorder: "hover:border-emerald-300",
    },
    {
      title: "Pengajuan Ditolak",
      value: stats.rejectedSubmissions,
      subtext: "Tidak memenuhi ketentuan",
      icon: XCircle,
      iconBg: "bg-rose-100 text-rose-700",
      cardBorder: "hover:border-rose-300",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {statItems.map((item, idx) => {
        const IconComponent = item.icon;
        return (
          <div
            key={idx}
            className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:shadow-md ${item.cardBorder}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  {item.title}
                </p>
                <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
                  {item.value}
                </p>
              </div>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.iconBg} transition-transform group-hover:scale-105`}
              >
                <IconComponent className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
              <span className="truncate">{item.subtext}</span>
              {item.badge && (
                <span
                  className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${item.badge.class}`}
                >
                  {item.badge.text}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
