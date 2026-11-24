"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Save, Send } from "lucide-react";

interface AddEventHeaderProps {
  saving: boolean;
  onTriggerSave: (action: "draft" | "publish") => void;
}

export function AddEventHeader({
  saving,
  onTriggerSave,
}: AddEventHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-gray-200 pb-5 md:flex-row md:items-center md:justify-between">
      <div>
        <nav className="flex items-center gap-2 text-xs font-medium text-gray-500">
          <Link
            href="/admin/events"
            className="flex items-center gap-1 text-[#7C3AED] hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Kelola Event
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Tambah Event Baru</span>
        </nav>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-gray-900 md:text-3xl">
          Tambah Event Baru
        </h1>
        <p className="text-sm text-gray-600">
          Kelola rincian konser, kategori tiket, denah panggung visual, dan publikasikan secara instan.
        </p>
      </div>

      {/* Global Save Actions in Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onTriggerSave("draft")}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
        >
          <Save className="h-4 w-4 text-gray-500" />
          Simpan Draft
        </button>

        <button
          type="button"
          onClick={() => onTriggerSave("publish")}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:opacity-95 disabled:opacity-50 cursor-pointer"
          style={{
            backgroundImage: "linear-gradient(90deg, #7C3AED 0%, #E91E8C 100%)",
          }}
        >
          <Send className="h-4 w-4" />
          Publikasikan Event
        </button>
      </div>
    </div>
  );
}
