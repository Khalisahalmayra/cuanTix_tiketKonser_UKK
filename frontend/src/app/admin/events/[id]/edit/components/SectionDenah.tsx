/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { Layers, Plus, Trash2, Check, AlertTriangle } from "lucide-react";
import { SeatingZone, SeatingPreset, TicketItem } from "../types";
import { ZONE_COLORS } from "../constants";

interface SectionDenahProps {
  layoutPreset: SeatingPreset;
  applyPresetLayout: (preset: SeatingPreset) => void;
  selectedZoneId: string | null;
  setSelectedZoneId: (id: string | null) => void;
  zones: SeatingZone[];
  tickets: TicketItem[];
  customLayoutImage: string | null;
  setCustomLayoutImage: (val: string | null) => void;
  setCustomImageFile: (val: File | null) => void;
  handleCustomImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addZone: () => void;
  updateZone: (id: string, patch: Partial<SeatingZone>) => void;
  setZoneToDelete: (z: SeatingZone | null) => void;
}

export function SectionDenah({
  layoutPreset,
  applyPresetLayout,
  selectedZoneId,
  setSelectedZoneId,
  zones,
  tickets,
  customLayoutImage,
  setCustomLayoutImage,
  setCustomImageFile,
  handleCustomImageChange,
  addZone,
  updateZone,
  setZoneToDelete,
}: SectionDenahProps) {
  return (
    <section
      id="denah"
      className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="mb-6 flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">4. Pengaturan Denah Venue (Seating Map)</h2>
            <p className="text-xs text-gray-500">
              Denah panggung visual berbasis zona interaktif, sinkron dengan kategori tiket.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => applyPresetLayout("standing_seated")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
              layoutPreset === "standing_seated"
                ? "bg-[#7C3AED] text-white shadow-sm"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Festival & Tribun
          </button>
          <button
            type="button"
            onClick={() => applyPresetLayout("all_seated")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
              layoutPreset === "all_seated"
                ? "bg-[#7C3AED] text-white shadow-sm"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            All Seated Arena
          </button>
          <button
            type="button"
            onClick={() => applyPresetLayout("festival_ground")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
              layoutPreset === "festival_ground"
                ? "bg-[#7C3AED] text-white shadow-sm"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Festival Ground
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-3 lg:col-span-7">
          <div className="flex items-center justify-between text-xs font-bold text-gray-700">
            <span>Pratinjau Interaktif Denah Panggung</span>
            <span className="text-[11px] font-normal text-gray-500">
              Klik zona pada denah untuk memilih
            </span>
          </div>

          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-2 shadow-inner">
            {customLayoutImage ? (
              <div className="relative h-full w-full">
                <img
                  src={customLayoutImage}
                  alt="Custom Denah"
                  className="h-full w-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => {
                    setCustomLayoutImage(null);
                    setCustomImageFile(null);
                  }}
                  className="absolute right-2 top-2 rounded-lg bg-red-600/90 px-2 py-1 text-[10px] font-bold text-white shadow hover:bg-red-700 cursor-pointer"
                >
                  Kembali ke SVG Editor
                </button>
              </div>
            ) : (
              <svg
                viewBox="0 0 800 500"
                className="h-full w-full select-none"
              >
                <defs>
                  <linearGradient id="stageGlowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#E91E8C" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                <path
                  d="M 220 25 L 260 95 L 540 95 L 580 25 Z"
                  fill="url(#stageGlowGradient)"
                />

                <rect
                  x="220"
                  y="24"
                  width="360"
                  height="46"
                  rx="8"
                  fill="#1E293B"
                  stroke="#7C3AED"
                  strokeWidth="2"
                />
                <text
                  x="400"
                  y="52"
                  fontFamily="sans-serif"
                  fontSize="14"
                  fontWeight="900"
                  fill="#F8FAFC"
                  textAnchor="middle"
                  letterSpacing="3"
                >
                  ★ PANGGUNG / STAGE ★
                </text>

                {zones.map((z) => {
                  const isSelected = selectedZoneId === z.id;
                  return (
                    <g
                      key={z.id}
                      onClick={() => setSelectedZoneId(z.id)}
                      className="cursor-pointer transition-all duration-200"
                    >
                      <rect
                        x={z.x}
                        y={z.y}
                        width={z.width}
                        height={z.height}
                        rx="12"
                        ry="12"
                        fill={z.color}
                        fillOpacity={isSelected ? 0.38 : 0.22}
                        stroke={isSelected ? "#FFFFFF" : z.color}
                        strokeWidth={isSelected ? 3.5 : 2}
                        className="transition-all hover:fill-opacity-40"
                      />
                      <text
                        x={z.x + z.width / 2}
                        y={z.y + z.height / 2 - 6}
                        fontFamily="sans-serif"
                        fontSize="13"
                        fontWeight="800"
                        fill="#F8FAFC"
                        textAnchor="middle"
                      >
                        {z.name}
                      </text>
                      <text
                        x={z.x + z.width / 2}
                        y={z.y + z.height / 2 + 14}
                        fontFamily="sans-serif"
                        fontSize="11"
                        fontWeight="600"
                        fill="#94A3B8"
                        textAnchor="middle"
                      >
                        {z.capacity} Kursi / Kapasitas
                      </text>
                    </g>
                  );
                })}
              </svg>
            )}
          </div>

          <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50/60 p-3 text-xs">
            <div>
              <span className="font-bold text-gray-800">
                Punya file denah denah resmi sendiri?
              </span>
              <p className="text-[11px] text-gray-500">
                Unggah denah static resmi dari promotor (JPG/PNG/SVG).
              </p>
            </div>
            <label className="cursor-pointer rounded-xl border border-gray-300 bg-white px-3 py-1.5 font-bold text-gray-700 shadow-sm transition hover:bg-gray-100">
              Unggah File
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/svg+xml"
                onChange={handleCustomImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="space-y-4 lg:col-span-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700">
              Daftar Zona Panggung ({zones.length})
            </span>
            <button
              type="button"
              onClick={addZone}
              className="flex items-center gap-1 rounded-xl bg-purple-50 px-2.5 py-1 text-xs font-bold text-[#7C3AED] hover:bg-purple-100 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              + Tambah Zona
            </button>
          </div>

          <div className="max-h-96 space-y-2.5 overflow-y-auto pr-1">
            {zones.map((zone) => {
              const isSelected = selectedZoneId === zone.id;
              const linkedTicket = tickets.find((t) => t.name === zone.ticketName);
              const isCapacityMatch =
                linkedTicket && linkedTicket.quota === zone.capacity;

              return (
                <div
                  key={zone.id}
                  onClick={() => setSelectedZoneId(zone.id)}
                  className={`cursor-pointer rounded-xl border p-3.5 transition ${
                    isSelected
                      ? "border-[#7C3AED] bg-purple-50/30 shadow-sm ring-1 ring-[#7C3AED]/30"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: zone.color }}
                      />
                      <span className="text-xs font-bold text-gray-900">
                        {zone.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setZoneToDelete(zone);
                      }}
                      className="text-gray-400 hover:text-red-600 cursor-pointer"
                      title="Hapus Zona"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {isSelected ? (
                    <div className="mt-3 space-y-2.5 border-t border-purple-100 pt-3">
                      <div>
                        <label className="mb-0.5 block text-[10px] font-bold text-gray-600">
                          Nama Zona
                        </label>
                        <input
                          type="text"
                          value={zone.name}
                          onChange={(e) => updateZone(zone.id, { name: e.target.value })}
                          className="w-full rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs font-semibold text-gray-800 outline-none focus:border-[#7C3AED]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="mb-0.5 block text-[10px] font-bold text-gray-600">
                            Terhubung ke Tiket
                          </label>
                          <select
                            value={zone.ticketName}
                            onChange={(e) =>
                              updateZone(zone.id, { ticketName: e.target.value })
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-800 outline-none focus:border-[#7C3AED]"
                          >
                            <option value="">-- Pilih Tiket --</option>
                            {tickets.map((t) => (
                              <option key={t.id ?? t.name} value={t.name}>
                                {t.name} (Kuota: {t.quota})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="mb-0.5 block text-[10px] font-bold text-gray-600">
                            Kapasitas Zona
                          </label>
                          <input
                            type="number"
                            min={1}
                            value={zone.capacity}
                            onChange={(e) =>
                              updateZone(zone.id, {
                                capacity: Math.max(1, Number(e.target.value)),
                              })
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs font-semibold text-gray-800 outline-none focus:border-[#7C3AED]"
                          />
                        </div>
                      </div>

                      {linkedTicket && (
                        <div className="flex items-center gap-1.5 text-[10px]">
                          {isCapacityMatch ? (
                            <span className="flex items-center gap-1 font-bold text-emerald-600">
                              <Check className="h-3 w-3" />
                              Kapasitas sesuai kuota tiket ({linkedTicket.quota})
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 font-bold text-amber-600">
                              <AlertTriangle className="h-3 w-3" />
                              Selisih: Zona ({zone.capacity}) vs Tiket ({linkedTicket.quota})
                            </span>
                          )}
                        </div>
                      )}

                      <div>
                        <label className="mb-1 block text-[10px] font-bold text-gray-600">
                          Warna Zona Denah
                        </label>
                        <div className="flex items-center gap-1">
                          {ZONE_COLORS.map((zc) => (
                            <button
                              key={zc.hex}
                              type="button"
                              onClick={() => updateZone(zone.id, { color: zc.hex })}
                              style={{ backgroundColor: zc.hex }}
                              className={`h-4 w-4 rounded-full border cursor-pointer ${
                                zone.color === zc.hex
                                  ? "border-black scale-125"
                                  : "border-white"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-1 flex items-center justify-between text-[11px] text-gray-500">
                      <span>
                        Tiket: <strong>{zone.ticketName || "Belum dipilih"}</strong>
                      </span>
                      <span>
                        Kapasitas: <strong>{zone.capacity}</strong>
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
