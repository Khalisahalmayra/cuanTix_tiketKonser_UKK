/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { Info, ZoomIn, X } from "lucide-react";

export type SeatingZone = {
  id: string;
  name: string;
  ticketName?: string;
  capacity?: number;
  color?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type?: "standing" | "seated" | string;
};

export type SeatingLayout = {
  preset?: string;
  total_capacity?: number;
  svg_string?: string;
  image_url?: string | null;
  zones?: SeatingZone[];
};

interface EventSeatingViewerProps {
  seatingLayout?: SeatingLayout | null;
  denahUrl?: string | null;
  eventTitle?: string;
  highlightedTicketName?: string | null;
  onSelectTicketName?: (ticketName: string) => void;
}

export default function EventSeatingViewer({
  seatingLayout,
  denahUrl,
  eventTitle = "Event",
  highlightedTicketName,
  onSelectTicketName,
}: EventSeatingViewerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Prioritas: Cek apakah ada denah gambar kustom (dari image_url atau denahUrl non-data-url)
  const customImageUrl =
    seatingLayout?.image_url ||
    (denahUrl && !denahUrl.startsWith("data:") ? denahUrl : null);

  const zones = Array.isArray(seatingLayout?.zones) ? seatingLayout.zones : [];
  const hasZones = zones.length > 0;

  // Jika tidak ada denah gambar maupun zona SVG
  if (!customImageUrl && !hasZones) {
    return (
      <p className="text-[15px] text-gray-600">
        Pilih kategori tiket yang tersedia di panel sebelah kanan.
      </p>
    );
  }

  // A. RENDER JIKA CUSTOM IMAGE TERSEDIA
  if (customImageUrl) {
    return (
      <div className="space-y-3">
        <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-slate-50 p-2 shadow-xs transition hover:shadow-md">
          <img
            src={customImageUrl}
            alt={`Denah venue ${eventTitle}`}
            className="mx-auto max-h-[460px] w-full object-contain cursor-pointer transition duration-200 group-hover:scale-[1.01]"
            onClick={() => setIsModalOpen(true)}
          />
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold text-white shadow backdrop-blur-xs transition hover:bg-black/85 cursor-pointer"
          >
            <ZoomIn className="h-3.5 w-3.5" />
            <span>Perbesar Denah</span>
          </button>
        </div>

        {/* Modal Pratinjau Denah Resolusi Penuh */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="relative max-h-[90vh] max-w-4xl overflow-auto rounded-2xl bg-white p-2 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/70 text-white transition hover:bg-slate-900 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
              <img
                src={customImageUrl}
                alt={`Denah venue ${eventTitle}`}
                className="max-h-[85vh] w-auto object-contain"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // B. RENDER JIKA ZONES TERSEDIA (SVG INTERAKTIF)
  const isTargetZone = (z: SeatingZone) => {
    if (!highlightedTicketName) return false;
    const target = highlightedTicketName.trim().toLowerCase();
    const zTicket = (z.ticketName || "").trim().toLowerCase();
    const zName = z.name.trim().toLowerCase();
    return zTicket === target || zName === target;
  };

  const handleZoneClick = (z: SeatingZone) => {
    const targetTicket = z.ticketName || z.name;
    if (targetTicket && onSelectTicketName) {
      onSelectTicketName(targetTicket);
    }
  };

  return (
    <div className="space-y-4">
      {/* Container SVG Denah Panggung */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-2 shadow-inner">
        <svg
          viewBox="0 0 800 500"
          className="h-full w-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="detailStageGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.38" />
              <stop offset="100%" stopColor="#E91E8C" stopOpacity="0.0" />
            </linearGradient>
            <filter id="zoneGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#FFFFFF" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Efek Sorot Panggung */}
          <path
            d="M 220 25 L 260 95 L 540 95 L 580 25 Z"
            fill="url(#detailStageGlow)"
          />

          {/* Panggung Utama */}
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

          {/* Zona-Zona Penonton */}
          {zones.map((z) => {
            const isHighlighted = isTargetZone(z);
            const zoneColor = z.color || "#7C3AED";

            return (
              <g
                key={z.id}
                onClick={() => handleZoneClick(z)}
                className="cursor-pointer transition-all duration-200"
                filter={isHighlighted ? "url(#zoneGlow)" : undefined}
              >
                <rect
                  x={z.x}
                  y={z.y}
                  width={z.width}
                  height={z.height}
                  rx="12"
                  ry="12"
                  fill={zoneColor}
                  fillOpacity={isHighlighted ? 0.45 : 0.22}
                  stroke={isHighlighted ? "#FFFFFF" : zoneColor}
                  strokeWidth={isHighlighted ? 3.5 : 2}
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
                  {z.ticketName ? `Kategori ${z.ticketName}` : `${z.capacity || 0} Kapasitas`}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Petunjuk Interaksi */}
        <div className="pointer-events-none absolute bottom-2.5 right-3 flex items-center gap-1.5 rounded-full bg-slate-900/80 px-2.5 py-1 text-[11px] font-medium text-slate-300 backdrop-blur-xs">
          <Info className="h-3 w-3 text-purple-400" />
          <span>Klik zona untuk melihat tiket</span>
        </div>
      </div>

      {/* Legend Kategori & Warna Zona */}
      <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-3.5">
        <p className="mb-2.5 text-xs font-bold uppercase tracking-wider text-gray-500">
          Keterangan Zona & Kategori
        </p>
        <div className="flex flex-wrap gap-2.5">
          {zones.map((z) => {
            const isHighlighted = isTargetZone(z);
            const zoneColor = z.color || "#7C3AED";

            return (
              <button
                key={z.id}
                type="button"
                onClick={() => handleZoneClick(z)}
                className={`inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  isHighlighted
                    ? "border-purple-400 bg-purple-50 text-purple-900 shadow-xs ring-2 ring-purple-200"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <span
                  className="h-3 w-3 shrink-0 rounded-full border border-black/10"
                  style={{ backgroundColor: zoneColor }}
                />
                <span className="font-bold">{z.name}</span>
                {z.ticketName && z.ticketName !== z.name && (
                  <span className="text-[11px] font-medium text-gray-500">
                    ({z.ticketName})
                  </span>
                )}
                {z.capacity ? (
                  <span className="rounded bg-gray-100 px-1 py-0.5 text-[10px] text-gray-500">
                    {z.capacity} kuota
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
