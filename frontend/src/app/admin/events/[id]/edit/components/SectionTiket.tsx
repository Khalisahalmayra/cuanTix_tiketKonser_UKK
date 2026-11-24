"use client";

import React from "react";
import { Ticket, Plus, ChevronDown, Trash2 } from "lucide-react";
import { TicketItem, TicketPreset } from "../types";
import { TICKET_PRESETS, ZONE_COLORS } from "../constants";
import { formatRupiah } from "../utils";

interface SectionTiketProps {
  tickets: TicketItem[];
  ticketPresetMenuOpen: boolean;
  setTicketPresetMenuOpen: (val: boolean) => void;
  addEmptyTicket: () => void;
  addPresetTicket: (preset: TicketPreset) => void;
  updateTicket: (index: number, patch: Partial<TicketItem>) => void;
  setTicketToDelete: (t: TicketItem | null) => void;
  totalQuota: number;
  totalSold: number;
  totalRevenue: number;
}

export function SectionTiket({
  tickets,
  ticketPresetMenuOpen,
  setTicketPresetMenuOpen,
  addEmptyTicket,
  addPresetTicket,
  updateTicket,
  setTicketToDelete,
  totalQuota,
  totalSold,
  totalRevenue,
}: SectionTiketProps) {
  return (
    <section
      id="tiket"
      className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="mb-6 flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Ticket className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">3. Pengaturan Jenis Tiket</h2>
            <p className="text-xs text-gray-500">
              Perbarui kategori tiket, harga IDR, kuota penonton, dan periode penjualan.
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={addEmptyTicket}
              className="flex items-center gap-1.5 rounded-xl border border-[#7C3AED] bg-purple-50 px-3.5 py-2 text-xs font-bold text-[#7C3AED] transition hover:bg-purple-100 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              + Tiket Kustom
            </button>

            <button
              type="button"
              onClick={() => setTicketPresetMenuOpen(!ticketPresetMenuOpen)}
              className="flex items-center gap-1 rounded-xl bg-[#7C3AED] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#6D28D9] cursor-pointer"
            >
              <span>Template Tiket</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>

          {ticketPresetMenuOpen && (
            <div className="absolute right-0 top-full z-20 mt-1 w-64 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl">
              <p className="px-3 py-1 text-[11px] font-bold uppercase text-gray-400">
                Pilih Template Kategori
              </p>
              <div className="space-y-1">
                {TICKET_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => addPresetTicket(preset)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold text-gray-700 transition hover:bg-purple-50 hover:text-[#7C3AED] cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: preset.color }}
                      />
                      <span>{preset.name}</span>
                    </div>
                    <span className="text-[11px] font-bold text-gray-500">
                      {formatRupiah(preset.price)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-100 bg-slate-50 p-3.5">
          <span className="text-[11px] font-bold text-gray-500">Jumlah Jenis Tiket</span>
          <p className="mt-1 text-lg font-black text-gray-900">{tickets.length} Kategori</p>
        </div>
        <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-3.5">
          <span className="text-[11px] font-bold text-purple-700">Total Kuota</span>
          <p className="mt-1 text-lg font-black text-[#7C3AED]">
            {totalQuota.toLocaleString("id-ID")} Tiket
          </p>
        </div>
        <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3.5">
          <span className="text-[11px] font-bold text-blue-700">Tiket Terjual</span>
          <p className="mt-1 text-lg font-black text-blue-800">
            {totalSold.toLocaleString("id-ID")} Tiket
          </p>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5">
          <span className="text-[11px] font-bold text-emerald-700">
            Estimasi Pendapatan
          </span>
          <p className="mt-1 text-lg font-black text-emerald-800">
            {formatRupiah(totalRevenue)}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {tickets.map((t, idx) => {
          const soldCount = t.sold || 0;
          const hasSold = soldCount > 0;

          return (
            <div
              key={t.id ?? idx}
              className="group relative rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: t.color || "#7C3AED" }}
                  />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Tiket #{idx + 1}
                  </span>
                  <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-extrabold text-gray-700">
                    {t.name || "Tanpa Nama"}
                  </span>
                  {hasSold && (
                    <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                      {soldCount} Terjual
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-gray-600">
                    <input
                      type="checkbox"
                      checked={t.is_active}
                      onChange={(e) => updateTicket(idx, { is_active: e.target.checked })}
                      className="h-3.5 w-3.5 rounded text-[#7C3AED] focus:ring-[#7C3AED]"
                    />
                    <span>Aktif</span>
                  </label>

                  <button
                    type="button"
                    disabled={tickets.length <= 1 || hasSold}
                    onClick={() => setTicketToDelete(t)}
                    className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
                    title={
                      hasSold
                        ? "Tiket yang sudah terjual tidak dapat dihapus."
                        : "Hapus Jenis Tiket"
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
                <div className="sm:col-span-4">
                  <label className="mb-1 block text-[11px] font-bold text-gray-700">
                    Nama Tiket <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={t.name}
                    onChange={(e) => updateTicket(idx, { name: e.target.value })}
                    placeholder="Contoh: VIP Standing"
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-gray-900 outline-none transition focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="mb-1 block text-[11px] font-bold text-gray-700">
                    Harga (IDR) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs font-bold text-gray-400">
                      Rp
                    </span>
                    <input
                      type="number"
                      min={0}
                      step={1000}
                      value={t.price}
                      onChange={(e) =>
                        updateTicket(idx, { price: Math.max(0, Number(e.target.value)) })
                      }
                      className="w-full rounded-xl border border-gray-300 bg-white pl-9 pr-3 py-2 text-xs font-bold text-gray-900 outline-none transition focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]"
                    />
                  </div>
                </div>

                <div className="sm:col-span-4">
                  <div className="flex items-center justify-between">
                    <label className="mb-1 block text-[11px] font-bold text-gray-700">
                      Kuota Tiket <span className="text-red-500">*</span>
                    </label>
                    {hasSold && (
                      <span className="text-[10px] text-gray-500 font-semibold">
                        Min: {soldCount}
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    min={hasSold ? soldCount : 1}
                    value={t.quota}
                    onChange={(e) =>
                      updateTicket(idx, {
                        quota: Math.max(hasSold ? soldCount : 1, Number(e.target.value)),
                      })
                    }
                    className={`w-full rounded-xl border bg-white px-3 py-2 text-xs font-bold text-gray-900 outline-none transition focus:ring-1 ${
                      hasSold && t.quota < soldCount
                        ? "border-red-500 focus:border-red-500 focus:ring-red-400"
                        : "border-gray-300 focus:border-[#7C3AED] focus:ring-[#7C3AED]"
                    }`}
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="mb-1 block text-[11px] font-bold text-gray-700">
                    Mulai Penjualan
                  </label>
                  <input
                    type="datetime-local"
                    value={t.sale_start}
                    onChange={(e) => updateTicket(idx, { sale_start: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-[11px] font-medium text-gray-800 outline-none transition focus:border-[#7C3AED]"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="mb-1 block text-[11px] font-bold text-gray-700">
                    Akhir Penjualan
                  </label>
                  <input
                    type="datetime-local"
                    value={t.sale_end}
                    onChange={(e) => updateTicket(idx, { sale_end: e.target.value })}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-[11px] font-medium text-gray-800 outline-none transition focus:border-[#7C3AED]"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="mb-1 block text-[11px] font-bold text-gray-700">
                    Warna Identifikasi
                  </label>
                  <div className="flex items-center gap-1.5 pt-1">
                    {ZONE_COLORS.map((zc) => (
                      <button
                        key={zc.hex}
                        type="button"
                        onClick={() => updateTicket(idx, { color: zc.hex })}
                        style={{ backgroundColor: zc.hex }}
                        className={`h-5 w-5 rounded-full border-2 transition cursor-pointer ${
                          t.color === zc.hex ? "border-gray-900 scale-110" : "border-white"
                        }`}
                        title={zc.label}
                      />
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-12">
                  <label className="mb-1 block text-[11px] font-bold text-gray-700">
                    Deskripsi & Keuntungan (Benefit) Tiket
                  </label>
                  <input
                    type="text"
                    value={t.description}
                    onChange={(e) => updateTicket(idx, { description: e.target.value })}
                    placeholder="Contoh: Akses fast-track, free merchandise pack & numbered seating"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs text-gray-800 outline-none transition focus:border-[#7C3AED] focus:bg-white"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
