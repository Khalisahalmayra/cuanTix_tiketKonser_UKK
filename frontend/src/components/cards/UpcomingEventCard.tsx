"use client";

import Image from "next/image";
import { Bell, MapPin } from "lucide-react";

export type UpcomingEvent = {
  image: string;
  location: string;
  title: string;
  organizer: string;
  price: string;
  tickets: string;
  month: string;
  day: string;
};

export const UPCOMING_EVENTS: UpcomingEvent[] = [
  {
    image: "/image/snada-event.png",
    location: "Jakarta",
    title: "Senada Indonesia - 2026",
    organizer: "Sucor Sekuritas & OPPAL",
    price: "Rp 75.000 - 1.500.000",
    tickets: "301 Tiket Tersedia",
    month: "August",
    day: "10",
  },
  {
    image: "/image/snada-event.png",
    location: "Jakarta",
    title: "Senada Indonesia - 2026",
    organizer: "Sucor Sekuritas & OPPAL",
    price: "Rp 75.000 - 1.500.000",
    tickets: "301 Tiket Tersedia",
    month: "August",
    day: "15",
  },
  {
    image: "/image/snada-event.png",
    location: "Jakarta",
    title: "Senada Indonesia - 2026",
    organizer: "Sucor Sekuritas & OPPAL",
    price: "Rp 75.000 - 1.500.000",
    tickets: "301 Tiket Tersedia",
    month: "August",
    day: "20",
  },
];

type UpcomingEventCardProps = {
  event: UpcomingEvent;
  onRemind?: () => void;
};

export default function UpcomingEventCard({
  event,
  onRemind,
}: UpcomingEventCardProps) {
  return (
    <div className="group rounded-2xl border border-gray-200/80 bg-white p-3.5 sm:p-4 shadow-2xs transition-all duration-300 hover:border-purple-300 hover:shadow-md">
      <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:gap-4 md:gap-5">
        {/* TANGGAL & THUMBNAIL */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* TANGGAL */}
          <div className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-[#FAF5FF] border border-purple-100 text-center">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#E91E8C]">
              {event.month}
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-[#7C3AED] leading-none mt-0.5">
              {event.day}
            </span>
          </div>

          {/* GAMBAR */}
          <div className="relative h-14 w-24 sm:h-16 sm:w-28 md:w-32 shrink-0 overflow-hidden rounded-xl bg-gray-100">
            <Image
              src={event.image}
              alt={event.title}
              fill
              sizes="(max-width: 640px) 96px, 128px"
              className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>

        {/* INFORMASI EVENT */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
            <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <span className="truncate">Kota {event.location}</span>
            <span className="text-gray-300">·</span>
            <span className="text-purple-600 font-medium truncate">{event.tickets}</span>
          </div>

          <h3 className="mt-1 text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#7C3AED] transition-colors truncate">
            {event.title}
          </h3>

          <p className="mt-0.5 text-xs text-gray-500 truncate">
            Oleh {event.organizer}
          </p>

          <p className="mt-2 text-xs font-bold text-gray-900 md:hidden">
            {event.price}
          </p>
        </div>

        {/* HARGA (DESKTOP) */}
        <div className="hidden shrink-0 text-right md:block">
          <span className="block text-[10px] uppercase tracking-wider text-gray-400 font-medium">
            Estimasi Harga
          </span>
          <span className="text-xs sm:text-sm font-bold text-gray-900">
            {event.price}
          </span>
        </div>

        {/* TOMBOL PENGINGAT */}
        <button
          type="button"
          onClick={onRemind}
          className="flex shrink-0 items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-2 text-xs font-semibold text-gray-700 transition-all duration-200 hover:border-purple-300 hover:bg-purple-50/60 hover:text-[#7C3AED] active:scale-95 cursor-pointer"
        >
          <Bell className="h-4 w-4 text-[#E91E8C]" />
          <span>Ingatkan Saya</span>
        </button>
      </div>
    </div>
  );
}
