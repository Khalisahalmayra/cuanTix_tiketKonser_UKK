/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { CheckCircle2, Calendar, MapPin, AlertCircle, Send, Save } from "lucide-react";
import { TicketItem, SeatingZone, DurationInfo } from "../types";
import { CATEGORIES } from "../constants";
import { formatRupiah } from "../utils";

interface SectionReviewProps {
  title: string;
  categoryId: number;
  currentStatus: string;
  shownBanner: string;
  durationInfo: DurationInfo | null;
  startAt: string;
  city: string;
  venue: string;
  tickets: TicketItem[];
  zones: SeatingZone[];
  saving: boolean;
  onTriggerSave: (action: "draft" | "publish") => void;
}

export function SectionReview({
  title,
  categoryId,
  currentStatus,
  shownBanner,
  durationInfo,
  startAt,
  city,
  venue,
  tickets,
  zones,
  saving,
  onTriggerSave,
}: SectionReviewProps) {
  return (
    <section
      id="review"
      className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-[#7C3AED]">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">5. Ringkasan & Konfirmasi Perubahan</h2>
          <p className="text-xs text-gray-500">
            Tinjau kelengkapan informasi event sebelum menyimpan perubahan.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          <div className="rounded-2xl border border-gray-200 bg-slate-50/50 p-5">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative aspect-[2/1] w-full shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-200 sm:w-48">
                {shownBanner ? (
                  <img
                    src={shownBanner}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
                    Poster Event
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-purple-100 px-2.5 py-0.5 text-[10px] font-extrabold text-[#7C3AED]">
                    {CATEGORIES.find((c) => c.id === categoryId)?.name || "Pop"}
                  </span>
                  <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700">
                    {currentStatus === "published" ? "Published" : "Draft"}
                  </span>
                </div>

                <h3 className="mt-1.5 text-base font-extrabold text-gray-900">
                  {title || "(Judul Event Belum Diisi)"}
                </h3>

                <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-600">
                  <Calendar className="h-3.5 w-3.5 text-[#7C3AED]" />
                  {durationInfo?.text || "Waktu belum diatur"}
                </p>

                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-600">
                  <MapPin className="h-3.5 w-3.5 text-[#E91E8C]" />
                  {[venue, city].filter(Boolean).join(", ") || "Lokasi belum diatur"}
                </p>
              </div>
            </div>

            <div className="mt-5 border-t border-gray-200 pt-4">
              <h4 className="mb-2 text-xs font-bold text-gray-700">
                Rincian Kategori Tiket & Potensi Penjualan:
              </h4>
              <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-[11px] font-bold text-gray-500">
                    <tr>
                      <th className="px-3.5 py-2">Jenis Tiket</th>
                      <th className="px-3.5 py-2">Harga</th>
                      <th className="px-3.5 py-2">Kuota (Terjual)</th>
                      <th className="px-3.5 py-2">Subtotal Potensi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {tickets.map((t, idx) => (
                      <tr key={t.id ?? idx}>
                        <td className="px-3.5 py-2.5 font-bold flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: t.color }}
                          />
                          {t.name}
                        </td>
                        <td className="px-3.5 py-2.5">{formatRupiah(t.price)}</td>
                        <td className="px-3.5 py-2.5">
                          {t.quota} Tiket{" "}
                          {Boolean(t.sold) && (
                            <span className="font-semibold text-blue-600">
                              ({t.sold} terjual)
                            </span>
                          )}
                        </td>
                        <td className="px-3.5 py-2.5 font-semibold text-gray-900">
                          {formatRupiah(t.price * t.quota)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 lg:col-span-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Daftar Kelayakan Event
            </h4>

            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                {title ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <span className={title ? "text-gray-800" : "font-bold text-red-600"}>
                  Judul Event terisi
                </span>
              </div>

              <div className="flex items-center gap-2">
                {startAt ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <span className={startAt ? "text-gray-800" : "font-bold text-red-600"}>
                  Jadwal Mulai ditentukan
                </span>
              </div>

              <div className="flex items-center gap-2">
                {venue && city ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <span className={venue && city ? "text-gray-800" : "font-bold text-red-600"}>
                  Kota & Venue ditentukan
                </span>
              </div>

              <div className="flex items-center gap-2">
                {tickets.length > 0 ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <span className="text-gray-800">
                  Minimal 1 jenis tiket ({tickets.length} terdaftar)
                </span>
              </div>

              <div className="flex items-center gap-2">
                {zones.length > 0 ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                )}
                <span className="text-gray-800">
                  Denah panggung ({zones.length} zona)
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-2.5">
              <button
                type="button"
                onClick={() => onTriggerSave("publish")}
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold text-white shadow-md transition hover:opacity-95 disabled:opacity-50 cursor-pointer"
                style={{
                  backgroundImage: "linear-gradient(90deg, #7C3AED 0%, #E91E8C 100%)",
                }}
              >
                <Send className="h-4 w-4" />
                {saving ? "Menyimpan..." : "Simpan & Publikasikan"}
              </button>

              <button
                type="button"
                onClick={() => onTriggerSave("draft")}
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white py-2.5 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
              >
                <Save className="h-4 w-4 text-gray-500" />
                Simpan Sebagai DRAFT
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
