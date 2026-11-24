"use client";

import React from "react";
import { Calendar, Clock, MapPin, ChevronDown, Search, Check } from "lucide-react";
import { POPULAR_CITIES } from "@/data/cities";
import { DurationInfo } from "../types";

interface SectionJadwalLokasiProps {
  startAt: string;
  setStartAt: (val: string) => void;
  endAt: string;
  setEndAt: (val: string) => void;
  durationInfo: DurationInfo | null;
  city: string;
  setCity: (val: string) => void;
  venue: string;
  setVenue: (val: string) => void;
  venueAddress: string;
  setVenueAddress: (val: string) => void;
  locationInfo: string;
  setLocationInfo: (val: string) => void;
  citySearch: string;
  setCitySearch: (val: string) => void;
  isCityOpen: boolean;
  setIsCityOpen: (val: boolean) => void;
  cityDropdownRef: React.RefObject<HTMLDivElement | null>;
  groupedCities: Record<string, string[]>;
}

export function SectionJadwalLokasi({
  startAt,
  setStartAt,
  endAt,
  setEndAt,
  durationInfo,
  city,
  setCity,
  venue,
  setVenue,
  venueAddress,
  setVenueAddress,
  locationInfo,
  setLocationInfo,
  citySearch,
  setCitySearch,
  isCityOpen,
  setIsCityOpen,
  cityDropdownRef,
  groupedCities,
}: SectionJadwalLokasiProps) {
  return (
    <section
      id="jadwal"
      className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-[#E91E8C]">
          <Calendar className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">2. Jadwal Konser & Lokasi Venue</h2>
          <p className="text-xs text-gray-500">
            Atur waktu mulai & berakhirnya konser serta titik lokasi tempat pelaksanaan.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-gray-700">
                Tanggal & Waktu Mulai <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={startAt}
                onChange={(e) => setStartAt(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-900 outline-none transition focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-gray-700">
                Tanggal & Waktu Selesai (Opsional)
              </label>
              <input
                type="datetime-local"
                value={endAt}
                onChange={(e) => setEndAt(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-900 outline-none transition focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20"
              />
            </div>
          </div>

          {durationInfo && (
            <div
              className={`mt-3 flex items-center gap-2 rounded-xl border p-3 text-xs font-semibold ${
                durationInfo.isValid
                  ? "border-purple-200 bg-purple-50 text-purple-900"
                  : "border-red-200 bg-red-50 text-red-800"
              }`}
            >
              <Clock className="h-4 w-4 shrink-0 text-[#7C3AED]" />
              <span>Jadwal Terhitung: {durationInfo.text}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="relative" ref={cityDropdownRef}>
            <label className="mb-1 block text-xs font-bold text-gray-700">
              Kota Pelaksanaan <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => setIsCityOpen(!isCityOpen)}
              className="flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-900 outline-none transition hover:border-gray-400 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#7C3AED]" />
                {city || "Pilih Kota"}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {isCityOpen && (
              <div className="absolute left-0 top-full z-30 mt-1 max-h-80 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                <div className="p-2.5 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-1.5">
                    <Search className="h-3.5 w-3.5 text-gray-400" />
                    <input
                      type="text"
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                      placeholder="Cari nama kota..."
                      className="w-full text-xs outline-none"
                      autoFocus
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {POPULAR_CITIES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setCity(c);
                          setIsCityOpen(false);
                        }}
                        className={`rounded-lg px-2 py-0.5 text-[10px] font-bold cursor-pointer ${
                          city === c
                            ? "bg-[#7C3AED] text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="max-h-52 overflow-y-auto p-2">
                  {Object.keys(groupedCities).length === 0 ? (
                    <p className="p-4 text-center text-xs text-gray-400">
                      Kota tidak ditemukan
                    </p>
                  ) : (
                    Object.entries(groupedCities).map(([letter, list]) => (
                      <div key={letter} className="mb-2">
                        <span className="px-2 text-[10px] font-extrabold uppercase text-gray-400">
                          {letter}
                        </span>
                        <div className="mt-0.5 space-y-0.5">
                          {list.map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => {
                                setCity(c);
                                setIsCityOpen(false);
                              }}
                              className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition cursor-pointer ${
                                city === c
                                  ? "bg-purple-50 font-bold text-[#7C3AED]"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              <span>{c}</span>
                              {city === c && (
                                <Check className="h-3.5 w-3.5 text-[#7C3AED]" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-gray-700">
              Nama Venue / Gedung <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="Contoh: Stadion Utama Gelora Bung Karno"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-900 outline-none transition focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-bold text-gray-700">
              Alamat Lengkap Venue
            </label>
            <textarea
              rows={2}
              value={venueAddress}
              onChange={(e) => setVenueAddress(e.target.value)}
              placeholder="Contoh: Jl. Pintu Satu Senayan, Gelora, Tanah Abang, Jakarta Pusat"
              className="w-full rounded-xl border border-gray-300 bg-white p-3 text-xs text-gray-800 outline-none transition focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-gray-700">
              Catatan Akses & Transportasi (Opsional)
            </label>
            <textarea
              rows={2}
              value={locationInfo}
              onChange={(e) => setLocationInfo(e.target.value)}
              placeholder="Contoh: Gerbang masuk Plaza Barat. Akses shuttle bus tersedia dari Stasiun Palmerah."
              className="w-full rounded-xl border border-gray-300 bg-white p-3 text-xs text-gray-800 outline-none transition focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
