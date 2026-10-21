"use client";

import Image from "next/image";
import { Bell } from "lucide-react";
import type { Event } from "@/components/cards/EventCard";

const SEARCH_BORDER_GRADIENT =
  "linear-gradient(90deg, #7C3AED 0%, #E91E8C 100%)";

type UpcomingEvent = Event & {
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
    <div
      className="rounded-[12px] p-[1.5px]"
      style={{ background: SEARCH_BORDER_GRADIENT }}
    >
      <div className="group flex flex-col gap-4 rounded-[11px] bg-white p-3 transition-colors duration-200 hover:bg-[#FDFBFF] sm:flex-row sm:items-center sm:gap-5">
        {/* TANGGAL */}
        <div className="flex shrink-0 flex-row items-center gap-3 sm:w-[68px] sm:flex-col sm:gap-1">
          <span className="text-xs font-semibold text-[#A21CAF]">
            {event.month}
          </span>

          <span className="text-2xl font-bold leading-6 text-[#6D28D9]">
            {event.day}
          </span>
        </div>

        {/* GAMBAR */}
        <div className="relative aspect-[1.9/1] w-full shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:aspect-auto sm:h-[68px] sm:w-[135px]">
          <Image
            src={event.image}
            alt={event.title}
            fill
            sizes="(max-width: 640px) 100vw, 135px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* INFORMASI EVENT */}
        <div className="min-w-0 flex-1">
          <p className="text-[10px] text-gray-500">
            Kota {event.location}
          </p>

          <h3 className="mt-1 text-[13px] font-bold text-gray-900">
            {event.title}
          </h3>

          <p className="mt-0.5 text-[11px] text-gray-700">
            Oleh {event.organizer}
          </p>

          <p className="mt-2 text-[11px] font-medium text-gray-900 md:hidden">
            {event.price}
          </p>
        </div>

        {/* HARGA */}
        <div className="hidden shrink-0 text-[11px] font-medium text-gray-900 md:block">
          {event.price}
        </div>

        {/* TOMBOL PENGINGAT */}
        <button
          type="button"
          onClick={onRemind}
          className="flex shrink-0 items-center justify-center gap-1.5 rounded-[10px] px-3 py-2 text-[11px] font-medium text-gray-900 transition-colors duration-200 hover:bg-[#F3EBFF]"
          style={{
            border: "1.5px solid transparent",
            backgroundImage: `
              linear-gradient(white, white),
              ${SEARCH_BORDER_GRADIENT}
            `,
            backgroundOrigin: "border-box",
            backgroundClip: "padding-box, border-box",
          }}
        >
          <Bell className="h-4 w-4 text-[#E91E8C]" />
          Ingatkan Saya
        </button>
      </div>
    </div>
  );
}