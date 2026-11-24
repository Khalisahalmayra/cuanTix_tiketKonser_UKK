"use client";

import React from "react";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import GradientIcon from "@/components/icon/GradientIcon";
import { TicketTypeInput, SummaryMetrics } from "../types";
import { formatRupiah } from "../utils";

type Step3TicketTypesProps = {
  ticketTypes: TicketTypeInput[];
  errors: Record<string, string>;
  summaryMetrics: SummaryMetrics;
  handleAddTicket: () => void;
  handleRemoveTicket: (index: number) => void;
  handleTicketChange: (index: number, field: keyof TicketTypeInput, value: string | number) => void;
  applyTicketPreset: (name: string, price: number, quota: number) => void;
};

export function Step3TicketTypes({
  ticketTypes,
  errors,
  summaryMetrics,
  handleAddTicket,
  handleRemoveTicket,
  handleTicketChange,
  applyTicketPreset,
}: Step3TicketTypesProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Langkah 3: Pengaturan Kategori Tiket
          </h2>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Buat satu atau lebih jenis tiket. Tentukan harga yang wajar dan kuota yang realistis.
          </p>
        </div>

        {/* LIVE METRICS BAR */}
        <div className="flex items-center gap-4 rounded-xl border border-purple-100 bg-[#FAF5FF] px-4 py-2 text-xs">
          <div>
            <span className="text-gray-500 block text-[10px]">Total Kuota:</span>
            <span className="font-extrabold text-[#5B1AA8]">
              {summaryMetrics.totalQuota.toLocaleString("id-ID")} Tiket
            </span>
          </div>
          <div className="h-6 w-px bg-purple-200" />
          <div>
            <span className="text-gray-500 block text-[10px]">Potensi Omset:</span>
            <span className="font-extrabold text-[#E91E8C]">
              {formatRupiah(summaryMetrics.potentialRevenue)}
            </span>
          </div>
        </div>
      </div>

      {errors.tickets && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
          {errors.tickets}
        </div>
      )}

      {/* PRESET TIKET CEPAT */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-gray-500 mr-1">Template Cepat:</span>
        <button
          type="button"
          onClick={() => applyTicketPreset("VIP", 350000, 50)}
          className="rounded-full border border-purple-200 bg-white px-3 py-1 text-xs font-medium text-[#5B1AA8] hover:bg-purple-50 transition-colors"
        >
          + Tambah VIP (Rp350.000)
        </button>
        <button
          type="button"
          onClick={() => applyTicketPreset("Early Bird", 100000, 150)}
          className="rounded-full border border-purple-200 bg-white px-3 py-1 text-xs font-medium text-[#5B1AA8] hover:bg-purple-50 transition-colors"
        >
          + Tambah Early Bird (Rp100.000)
        </button>
        <button
          type="button"
          onClick={() => applyTicketPreset("VVIP", 750000, 30)}
          className="rounded-full border border-pink-200 bg-white px-3 py-1 text-xs font-medium text-[#E91E8C] hover:bg-pink-50 transition-colors"
        >
          + Tambah VVIP (Rp750.000)
        </button>
      </div>

      {/* DAFTAR JENIS TIKET */}
      <div className="space-y-4">
        {ticketTypes.map((ticket, index) => {
          const nameErr = errors[`ticket_name_${index}`];
          const priceErr = errors[`ticket_price_${index}`];
          const quotaErr = errors[`ticket_quota_${index}`];

          return (
            <div
              key={ticket.id || index}
              className="rounded-2xl border border-gray-200/90 bg-[#FAF9FD]/60 p-5 transition-all hover:border-purple-200"
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-200/80">
                <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-gray-700">
                  <GradientIcon type="ticket" size={18} />
                  Kategori Tiket #{index + 1}
                </span>

                {ticketTypes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTicket(index)}
                    className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Hapus
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* NAMA TIKET */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Nama Tiket <span className="text-[#E91E8C]">*</span>
                  </label>
                  <input
                    type="text"
                    value={ticket.name}
                    onChange={(e) => handleTicketChange(index, "name", e.target.value)}
                    placeholder="Contoh: Regular / VIP / CAT 1"
                    className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#5B1AA8]/20 ${
                      nameErr ? "border-red-500 bg-red-50/20" : "border-gray-200 focus:border-[#5B1AA8]"
                    }`}
                  />
                  {nameErr && (
                    <p className="mt-1 text-[11px] text-red-600">{nameErr}</p>
                  )}
                </div>

                {/* HARGA TIKET */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Harga Satuan (Rp) <span className="text-[#E91E8C]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-400">
                      Rp
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={ticket.price}
                      onChange={(e) =>
                        handleTicketChange(
                          index,
                          "price",
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      placeholder="0"
                      className={`w-full rounded-xl border bg-white pl-9 pr-3.5 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#5B1AA8]/20 ${
                        priceErr ? "border-red-500 bg-red-50/20" : "border-gray-200 focus:border-[#5B1AA8]"
                      }`}
                    />
                  </div>
                  <span className="mt-1 block text-[11px] text-gray-400">
                    Terbaca: {formatRupiah(ticket.price)}
                  </span>
                  {priceErr && (
                    <p className="mt-1 text-[11px] text-red-600">{priceErr}</p>
                  )}
                </div>

                {/* KUOTA TIKET */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Kuota Tiket <span className="text-[#E91E8C]">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={ticket.quota}
                    onChange={(e) =>
                      handleTicketChange(
                        index,
                        "quota",
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    placeholder="Jumlah lembar"
                    className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#5B1AA8]/20 ${
                      quotaErr ? "border-red-500 bg-red-50/20" : "border-gray-200 focus:border-[#5B1AA8]"
                    }`}
                  />
                  {quotaErr && (
                    <p className="mt-1 text-[11px] text-red-600">{quotaErr}</p>
                  )}
                </div>
              </div>

              {/* DESKRIPSI & PERIODE PENJUALAN */}
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                    Fasilitas / Keterangan Tiket (Opsional)
                  </label>
                  <input
                    type="text"
                    value={ticket.description}
                    onChange={(e) => handleTicketChange(index, "description", e.target.value)}
                    placeholder="Contoh: Bebas antre, sudah termasuk wristband dan merchandise pack"
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 outline-none focus:border-[#5B1AA8]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                    Batas Akhir Jual (Opsional)
                  </label>
                  <input
                    type="date"
                    value={ticket.sale_end}
                    onChange={(e) => handleTicketChange(index, "sale_end", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 outline-none focus:border-[#5B1AA8]"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* TOMBOL TAMBAH TIKET */}
      <button
        type="button"
        onClick={handleAddTicket}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-purple-200 bg-white p-4 text-xs font-bold text-[#5B1AA8] transition-colors hover:border-[#5B1AA8] hover:bg-purple-50 sm:text-sm"
      >
        <Plus className="h-4 w-4" />
        Tambah Jenis Tiket Lainnya
      </button>
    </div>
  );
}
