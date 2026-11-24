/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { ImageIcon } from "lucide-react";
import GradientIcon from "@/components/icon/GradientIcon";
import { Category, TicketTypeInput, SummaryMetrics } from "../types";
import { formatIndonesianDateTime, formatRupiah } from "../utils";

interface Step4ReviewProps {
  title: string;
  selectedCategoryObj?: Category;
  description: string;
  posterPreview: string;
  posterUrl: string;
  bannerPreview: string;
  bannerUrl: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  venue: string;
  city: string;
  venueAddress: string;
  ticketTypes: TicketTypeInput[];
  summaryMetrics: SummaryMetrics;
}

export function Step4Review({
  title,
  selectedCategoryObj,
  description,
  posterPreview,
  posterUrl,
  bannerPreview,
  bannerUrl,
  startDate,
  startTime,
  endDate,
  endTime,
  venue,
  city,
  venueAddress,
  ticketTypes,
  summaryMetrics,
}: Step4ReviewProps) {
  return (
    <div className="space-y-8">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
          Langkah 4: Tinjau Rangkuman Pengajuan
        </h2>
        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          Pastikan seluruh detail acara sudah lengkap dan akurat sebelum dikirim ke tim kurasi CuanTix.
        </p>
      </div>

      {/* KARTU PREVIEW UTAMA */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
        {/* BANNER PREVIEW */}
        <div className="relative aspect-[16/6] w-full bg-gradient-to-r from-purple-900 via-indigo-900 to-pink-900 flex items-center justify-center overflow-hidden">
          {bannerPreview || bannerUrl ? (
            <img
              src={bannerPreview || bannerUrl}
              alt="Banner Event"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-white/80 p-4 text-center">
              <GradientIcon type="megaphone" size={32} />
              <p className="text-xs sm:text-sm font-semibold">Banner Resmi CuanTix</p>
            </div>
          )}

          {/* BADGE KATEGORI */}
          {selectedCategoryObj && (
            <span className="absolute top-4 left-4 rounded-full bg-black/60 backdrop-blur-xs px-3.5 py-1 text-xs font-bold text-white shadow-sm border border-white/20">
              {selectedCategoryObj.name}
            </span>
          )}
        </div>

        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[140px_1fr]">
            {/* POSTER THUMBNAIL */}
            <div className="aspect-[3/4] w-full max-w-[140px] overflow-hidden rounded-xl border border-gray-200 bg-gray-100 shadow-xs shrink-0 mx-auto md:mx-0">
              {posterPreview || posterUrl ? (
                <img
                  src={posterPreview || posterUrl}
                  alt="Poster Event"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center p-2 text-center text-gray-400">
                  <ImageIcon className="h-6 w-6 mb-1 text-gray-300" />
                  <span className="text-[10px]">Tanpa Poster</span>
                </div>
              )}
            </div>

            {/* DESKRIPSI & INFO UTAMA */}
            <div className="min-w-0">
              <h3 className="text-xl font-extrabold text-gray-900 sm:text-2xl">
                {title || "Nama Event Belum Diisi"}
              </h3>

              <p className="mt-3 text-xs leading-relaxed text-gray-600 sm:text-sm whitespace-pre-line">
                {description || "Deskripsi event belum diisi."}
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs text-gray-700 border-t border-gray-100 pt-4">
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 shrink-0">
                    <GradientIcon type="calendar" size={18} />
                  </span>
                  <div>
                    <strong className="block text-gray-900">Jadwal Acara:</strong>
                    <span>{formatIndonesianDateTime(startDate, startTime)}</span>
                    {endDate && (
                      <span className="block text-gray-500">
                        s/d {formatIndonesianDateTime(endDate, endTime)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 shrink-0">
                    <GradientIcon type="mapPin" size={18} />
                  </span>
                  <div>
                    <strong className="block text-gray-900">Lokasi Venue:</strong>
                    <span>{venue || "Venue belum ditentukan"}, {city}</span>
                    {venueAddress && (
                      <span className="block text-[11px] text-gray-500 mt-0.5">
                        {venueAddress}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABEL RINGKASAN TIKET */}
      <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white">
        <div className="bg-[#FAF8FE] px-5 py-3.5 border-b border-gray-200 flex items-center justify-between">
          <h4 className="text-xs font-extrabold uppercase tracking-wide text-gray-800 flex items-center gap-2">
            <GradientIcon type="ticket" size={18} />
            Daftar Kategori Tiket ({ticketTypes.length} Jenis)
          </h4>
          <span className="text-xs font-bold text-[#5B1AA8]">
            Total Kuota: {summaryMetrics.totalQuota} Tiket
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {ticketTypes.map((t, i) => (
            <div
              key={t.id || i}
              className="flex flex-col gap-2 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between text-xs"
            >
              <div>
                <span className="font-bold text-gray-900 text-sm">{t.name}</span>
                {t.description && (
                  <p className="text-[11px] text-gray-500 mt-0.5">{t.description}</p>
                )}
              </div>
              <div className="flex items-center gap-6">
                <span className="text-gray-600 font-medium">
                  Kuota: <strong className="text-gray-900">{t.quota}</strong>
                </span>
                <span className="font-extrabold text-[#5B1AA8] text-sm">
                  {formatRupiah(t.price)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PERNYATAAN KURASI & KEAMANAN */}
      <div className="rounded-2xl border border-purple-100 bg-[#FAF5FF] p-4 text-xs text-gray-700 flex items-start gap-3">
        <span className="mt-0.5 shrink-0">
          <GradientIcon type="shieldCheck" size={20} />
        </span>
        <div>
          <strong className="block text-[#5B1AA8] font-bold">
            Persetujuan Syarat & Ketentuan Kurasi
          </strong>
          <p className="mt-1 leading-relaxed text-gray-600">
            Dengan menekan tombol kirim di bawah, Anda menyetujui bahwa informasi yang diberikan adalah benar.
            Pengajuan Anda akan ditinjau oleh tim CuanTix untuk memastikan standar keamanan dan kualitas acara.
          </p>
        </div>
      </div>
    </div>
  );
}
