"use client";

import React from "react";
import { AlertCircle, Layers } from "lucide-react";
import GradientIcon from "@/components/icon/GradientIcon";
import { KOTA_LIST } from "@/data/cities";

type Step2ScheduleLocationProps = {
  startDate: string;
  setStartDate: (value: string) => void;
  startTime: string;
  setStartTime: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  endTime: string;
  setEndTime: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  venue: string;
  setVenue: (value: string) => void;
  venueAddress: string;
  setVenueAddress: (value: string) => void;
  locationInfo: string;
  setLocationInfo: (value: string) => void;
  seatingPreset: string;
  setSeatingPreset: (value: string) => void;
  customSeatingNotes: string;
  setCustomSeatingNotes: (value: string) => void;
  errors: Record<string, string>;
};

export function Step2ScheduleLocation({
  startDate,
  setStartDate,
  startTime,
  setStartTime,
  endDate,
  setEndDate,
  endTime,
  setEndTime,
  city,
  setCity,
  venue,
  setVenue,
  venueAddress,
  setVenueAddress,
  locationInfo,
  setLocationInfo,
  seatingPreset,
  setSeatingPreset,
  customSeatingNotes,
  setCustomSeatingNotes,
  errors,
}: Step2ScheduleLocationProps) {
  return (
    <div className="space-y-8">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
          Langkah 2: Detail Jadwal & Lokasi Acara
        </h2>
        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          Tentukan waktu pelaksanaan dan tempat diselenggarakannya event Anda secara akurat.
        </p>
      </div>

      {/* WAKTU MULAI & SELESAI */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* WAKTU MULAI */}
        <div className="rounded-2xl border border-gray-200/90 p-5 bg-[#FAF8FE]/40">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-1.5 mb-4">
            <GradientIcon type="calendar" size={18} />
            Mulai Acara <span className="text-[#E91E8C]">*</span>
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                Tanggal Mulai
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#5B1AA8]/20 ${
                  errors.start_date ? "border-red-500" : "border-gray-200 focus:border-[#5B1AA8]"
                }`}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                Jam Mulai (WIB)
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#5B1AA8]"
              />
            </div>
          </div>
          {errors.start_date && (
            <p className="mt-2 text-xs font-semibold text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" /> {errors.start_date}
            </p>
          )}
        </div>

        {/* WAKTU SELESAI */}
        <div className="rounded-2xl border border-gray-200/90 p-5 bg-[#FAF8FE]/40">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-1.5 mb-4">
            <GradientIcon type="clock" size={18} />
            Selesai Acara (Opsional)
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                Tanggal Selesai
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#E91E8C]/20 ${
                  errors.end_date ? "border-red-500" : "border-gray-200 focus:border-[#E91E8C]"
                }`}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                Jam Selesai (WIB)
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#E91E8C]"
              />
            </div>
          </div>
          {errors.end_date && (
            <p className="mt-2 text-xs font-semibold text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" /> {errors.end_date}
            </p>
          )}
        </div>
      </div>

      {/* KOTA & VENUE */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* KOTA PENYELENGGARAAN */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-1">
            <GradientIcon type="mapPin" size={15} />
            Kota Penyelenggaraan <span className="text-[#E91E8C]">*</span>
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none focus:border-[#5B1AA8] focus:ring-2 focus:ring-[#5B1AA8]/20"
          >
            {KOTA_LIST.map((cityName) => (
              <option key={cityName} value={cityName}>
                {cityName}
              </option>
            ))}
          </select>
        </div>

        {/* NAMA VENUE */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
            Nama Gedung / Venue <span className="text-[#E91E8C]">*</span>
          </label>
          <input
            type="text"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            placeholder="Contoh: Istora Senayan, M Bloc Space, ICE BSD"
            className={`w-full rounded-xl border px-4 py-3.5 text-sm text-gray-900 outline-none transition-all focus:ring-2 focus:ring-[#5B1AA8]/20 ${
              errors.venue ? "border-red-500 bg-red-50/20" : "border-gray-200 focus:border-[#5B1AA8]"
            }`}
          />
          {errors.venue && (
            <p className="mt-1.5 text-xs font-semibold text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" /> {errors.venue}
            </p>
          )}
        </div>
      </div>

      {/* ALAMAT LENGKAP VENUE */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
          Alamat Lengkap Venue
        </label>
        <input
          type="text"
          value={venueAddress}
          onChange={(e) => setVenueAddress(e.target.value)}
          placeholder="Contoh: Jl. Pintu Satu Senayan, Gelora, Kecamatan Tanah Abang, Kota Jakarta Pusat"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#5B1AA8] focus:ring-2 focus:ring-[#5B1AA8]/20"
        />
      </div>

      {/* INFORMASI AKSES LOKASI */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
          Informasi Tambahan Akses / Lokasi
        </label>
        <input
          type="text"
          value={locationInfo}
          onChange={(e) => setLocationInfo(e.target.value)}
          placeholder="Contoh: Akses via MRT Istora Mandiri (Pintu 5), Tersedia kantong parkir motor & mobil di Parkir Timur"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#5B1AA8] focus:ring-2 focus:ring-[#5B1AA8]/20"
        />
      </div>

      {/* SEATING LAYOUT / DENAH TEMPAT DUDUK (SEDERHANA & OPSIONAL) */}
      <div className="rounded-2xl border border-purple-100 bg-[#FAF8FE] p-5">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="h-5 w-5 text-[#5B1AA8]" />
          <h4 className="text-sm font-bold text-gray-900">
            Denah & Pengaturan Tempat Duduk (Opsional)
          </h4>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Pilih tipe pengaturan area penonton agar calon pembeli mengetahui format panggung Anda.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              id: "festival_standing",
              label: "Standing / Festival Ground",
              desc: "Penonton berdiri bebas di area panggung",
            },
            {
              id: "all_seated",
              label: "All Seated / Kursi Bernomor",
              desc: "Penonton duduk di kursi / tribun tertata",
            },
            {
              id: "hybrid_mix",
              label: "Kombinasi (VIP Seated & Festival)",
              desc: "Area VIP duduk dan Festival berdiri",
            },
          ].map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setSeatingPreset(preset.id)}
              className={`rounded-xl border p-3.5 text-left transition-all ${
                seatingPreset === preset.id
                  ? "border-[#5B1AA8] bg-white shadow-xs ring-2 ring-[#5B1AA8]/15"
                  : "border-gray-200 bg-white hover:border-purple-200"
              }`}
            >
              <p
                className={`text-xs font-bold ${
                  seatingPreset === preset.id ? "text-[#5B1AA8]" : "text-gray-800"
                }`}
              >
                {preset.label}
              </p>
              <p className="mt-1 text-[11px] text-gray-500">{preset.desc}</p>
            </button>
          ))}
        </div>

        <div className="mt-4">
          <label className="block text-[11px] font-semibold text-gray-600 mb-1">
            Catatan Denah Tambahan (Opsional)
          </label>
          <input
            type="text"
            value={customSeatingNotes}
            onChange={(e) => setCustomSeatingNotes(e.target.value)}
            placeholder="Contoh: Baris A-D khusus VIP, pintu gate masuk dibuka 2 jam sebelum acara"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 outline-none focus:border-[#5B1AA8]"
          />
        </div>
      </div>
    </div>
  );
}
