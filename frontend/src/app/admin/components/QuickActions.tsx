"use client";

import Link from "next/link";
import { Plus, ClipboardCheck, Calendar } from "lucide-react";

interface QuickActionsProps {
  pendingCount?: number;
}

export function QuickActions({ pendingCount = 0 }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Tombol Utama: Tambah Event Baru */}
      <Link
        href="/admin/events/new"
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#E91E8C] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:opacity-95 hover:shadow-md active:scale-[0.99]"
      >
        <Plus className="h-4 w-4" />
        <span>Tambah Event Baru</span>
      </Link>

      {/* Tombol Sekunder: Pengajuan Event */}
      <Link
        href="/admin/pengajuan-event"
        className="inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-white px-4 py-2.5 text-xs font-semibold text-purple-900 shadow-xs transition hover:bg-purple-50 hover:border-purple-300"
      >
        <ClipboardCheck className="h-4 w-4 text-purple-600" />
        <span>Periksa Pengajuan Event</span>
        {pendingCount > 0 && (
          <span className="ml-1 inline-flex h-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-[10px] font-bold text-white">
            {pendingCount}
          </span>
        )}
      </Link>

      {/* Tombol Sekunder: Kelola Semua Event */}
      <Link
        href="/admin/events"
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:border-slate-300"
      >
        <Calendar className="h-4 w-4 text-slate-500" />
        <span>Kelola Semua Event</span>
      </Link>
    </div>
  );
}
