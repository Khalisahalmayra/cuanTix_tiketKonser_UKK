"use client";

import React, { useState, useRef, useEffect, RefObject } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X } from "lucide-react";
import GradientIcon from "@/components/icon/GradientIcon";

// Data event banyak dicari
const EVENT_BANYAK_DICARI: string[] = [
  "ENHYPEN JAKARTA 2027",
  "BTS JAKARTA 2026",
  "SNADA INDONESIA 2026",
  "MENEMBUS AWAN 2026",
  "ROSETOPIA JAKARTA 2026",
];

type EventTerlaris = {
  title: string;
  organizer: string;
  location: string;
  image: string;
  href: string;
};

// Data event terlaris
const EVENT_TERLARIS: EventTerlaris[] = [
  {
    title: "Senada Indonesia - 2026",
    organizer: "Oleh Sucor Sekuritas & OPPAL",
    location: "Jakarta Selatan",
    image: "/image/snada-event.png",
    href: "/event/senada-indonesia-2026",
  },
  {
    title: "Senada Indonesia - 2026",
    organizer: "Oleh Sucor Sekuritas & OPPAL",
    location: "Jakarta Selatan",
    image: "/image/snada-event.png",
    href: "/event/senada-indonesia-2026",
  },
];

function useOutsideClose<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onClose: () => void
): void {
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [ref, onClose]);
}

type SearchBarProps = {
  placeholder?: string;
  onOpenChange?: (open: boolean) => void;
};

export default function SearchBar({
  placeholder = "Cari konser, artis, atau kota favoritmu...",
  onOpenChange,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  function setOpenState(v: boolean) {
    setOpen(v);
    onOpenChange?.(v);
  }

  useOutsideClose(wrapperRef, () => setOpenState(false));

  const q = query.trim().toLowerCase();
  const filteredPopular = EVENT_BANYAK_DICARI.filter((e) =>
    e.toLowerCase().includes(q)
  );
  const filteredTerlaris = EVENT_TERLARIS.filter((e) =>
    e.title.toLowerCase().includes(q)
  );

  function submitSearch(value: string) {
    const keyword = value.trim();
    if (!keyword) return;
    setOpenState(false);
    router.push(`/search?q=${encodeURIComponent(keyword)}`);
  }

  function goToEvent(href: string) {
    setOpenState(false);
    router.push(href);
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* INPUT CONTAINER (Height 48px - 50px) */}
      <div
        className={`flex h-[48px] sm:h-[50px] items-center gap-3 rounded-full border px-4 text-sm transition-all duration-200 ${
          open
            ? "border-[#7C3AED] bg-white ring-2 ring-[#7C3AED]/15 shadow-sm"
            : "border-gray-200/90 bg-gray-50/80 hover:border-gray-300 hover:bg-white"
        }`}
      >
        <Search className="h-4 w-4 shrink-0 text-[#7C3AED]" />
        <input
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          onFocus={() => setOpenState(true)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") submitSearch(query);
            if (e.key === "Escape") setOpenState(false);
          }}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-xs sm:text-sm text-gray-800 placeholder-gray-400 outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="text-gray-400 hover:text-gray-600 cursor-pointer p-0.5"
            aria-label="Hapus kata kunci"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* PANEL POPUP */}
      {open && (
        <div className="absolute left-0 top-full z-50 mt-2.5 w-full min-w-[300px] sm:min-w-[380px] md:min-w-[440px] rounded-2xl border border-gray-100 bg-white p-4 shadow-xl sm:p-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Pencarian Konser
            </span>
            <button
              type="button"
              onClick={() => setOpenState(false)}
              aria-label="Tutup"
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* EVENT BANYAK DICARI */}
          {filteredPopular.length > 0 && (
            <div className="mt-3.5 mb-4">
              <div className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold text-gray-800">
                <GradientIcon type="trending" size={16} />
                <span>Event Banyak Dicari</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {filteredPopular.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setQuery(item);
                      submitSearch(item);
                    }}
                    className="rounded-full border border-purple-100 bg-purple-50/60 px-3 py-1 text-xs font-medium text-[#6D28D9] transition-all hover:border-purple-300 hover:bg-purple-100/70 cursor-pointer"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* EVENT KONSER TERLARIS */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold text-gray-800">
              <GradientIcon type="trending" size={16} />
              <span>Event Konser Terlaris</span>
            </div>

            {filteredTerlaris.length === 0 ? (
              <p className="py-2 text-xs text-gray-400">Event tidak ditemukan</p>
            ) : (
              <div className="flex max-h-[260px] flex-col gap-2 overflow-y-auto pr-1">
                {filteredTerlaris.map((event, index) => (
                  <button
                    key={`${event.title}-${index}`}
                    type="button"
                    onClick={() => goToEvent(event.href)}
                    className="group flex w-full items-center gap-3 rounded-xl border border-gray-100 p-2 text-left transition-all hover:border-purple-200 hover:bg-purple-50/40 cursor-pointer"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-xs font-bold text-[#7C3AED]">
                      {index + 1}
                    </span>

                    <Image
                      src={event.image}
                      alt={event.title}
                      width={64}
                      height={40}
                      className="h-10 w-16 shrink-0 rounded-lg object-cover"
                    />

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-semibold text-gray-900 group-hover:text-[#7C3AED] transition-colors">
                        {event.title}
                      </span>
                      <span className="block truncate text-[11px] text-gray-500">
                        {event.organizer} · {event.location}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
