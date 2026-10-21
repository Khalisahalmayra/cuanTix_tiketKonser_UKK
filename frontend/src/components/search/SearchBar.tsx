"use client";

import React, { useState, useRef, useEffect, RefObject } from "react";
import { useRouter } from "next/navigation";
import { Search, TrendingUp, X } from "lucide-react";
import GradientIcon from "@/components/icon/GradientIcon";

const SEARCH_BORDER_GRADIENT = "linear-gradient(90deg,#7C3AED 0%,#E91E8C 100%)";

// TODO: ganti dengan data dari API
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

// TODO: ganti dengan data dari API
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
  placeholder = "Cari Konser",
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
    <div ref={wrapperRef} className="relative flex-1 min-w-[200px]">
      {/* INPUT */}
      <div
        className="flex items-center gap-2 rounded-[12px] px-5 py-2.5"
        style={{
          border: "2px solid transparent",
          background: `linear-gradient(white, white) padding-box, ${SEARCH_BORDER_GRADIENT} border-box`,
        }}
      >
        <input
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          onFocus={() => setOpenState(true)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") submitSearch(query);
            if (e.key === "Escape") setOpenState(false);
          }}
          placeholder={placeholder}
          className="flex-1 outline-none bg-transparent text-sm"
          style={{ color: "#6D28D9" }}
        />
        <button
          type="button"
          onClick={() => submitSearch(query)}
          aria-label="Cari"
          className="shrink-0"
        >
          <Search className="w-5 h-5" style={{ color: "#7C3AED" }} />
        </button>
      </div>

      {/* PANEL */}
      {open && (
        <div
          className="absolute left-0 top-full z-50 mt-3 w-full min-w-[320px] rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
          style={{
            border: "1.5px solid transparent",
            background: `linear-gradient(white, white) padding-box, ${SEARCH_BORDER_GRADIENT} border-box`,
          }}
        >
          <button
            type="button"
            onClick={() => setOpenState(false)}
            aria-label="Tutup"
            className="absolute right-5 top-5 text-[#9D1B7E] hover:opacity-70"
          >
            <X className="h-5 w-5" strokeWidth={3} />
          </button>

          {/* EVENT BANYAK DICARI */}
          {filteredPopular.length > 0 && (
            <div className="mb-6">
              <div className="mb-3 flex items-center gap-2 pr-8">
                <GradientIcon type="trending" size={23} />
                <h4 className="text-sm font-semibold" style={{ color: "black" }}>
                  Event Banyak Dicari
                </h4>
              </div>

              <div className="flex flex-wrap gap-2.5 sm:pl-7">
                {filteredPopular.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setQuery(item);
                      submitSearch(item);
                    }}
                    className="rounded-lg px-4 py-1.5 text-[11px] font-bold transition-colors hover:bg-[#F3EBFF]"
                    style={{
                      color: "#4C1D95",
                      background: `linear-gradient(#F7F0FF, #F7F0FF) padding-box, ${SEARCH_BORDER_GRADIENT} border-box`,
                      border: "1px solid transparent",
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* EVENT KONSER TERLARIS */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <GradientIcon type="trending" size={23} />
              <h4 className="text-sm font-semibold" style={{ color: "black" }}>
                Event Konser Terlaris
              </h4>
            </div>

            {filteredTerlaris.length === 0 ? (
              <p className="px-1 py-2 text-xs text-gray-400">Event tidak ditemukan</p>
            ) : (
              <div className="flex max-h-[320px] flex-col gap-4 overflow-y-auto p-1 sm:pl-8">
                {filteredTerlaris.map((event, index) => (
                  <button
                    key={`${event.title}-${index}`}
                    type="button"
                    onClick={() => goToEvent(event.href)}
                    className="flex w-full items-center gap-4 rounded-lg bg-white p-3 text-left shadow-md transition-shadow hover:shadow-lg"
                    style={{
                      border: "1px solid transparent",
                      background: `linear-gradient(white, white) padding-box, ${SEARCH_BORDER_GRADIENT} border-box`,
                    }}
                  >
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl"
                      style={{ border: "1.5px solid #7C3AED", color: "#7C3AED" }}
                    >
                      {index + 1}
                    </span>

                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-[54px] w-[106px] shrink-0 rounded object-cover"
                    />

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-bold text-gray-900">
                        {event.title}
                      </span>
                      <span className="block truncate text-[11px] text-gray-800">
                        {event.organizer}
                      </span>
                      <span className="block truncate text-[11px] text-gray-800">
                        {event.location}
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