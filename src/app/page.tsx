"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ListFilter,
  HandMetal,
  Disc3,
  Music2,
  Radio,
  Mic2,
  Megaphone,
  Bell,
} from "lucide-react";

import LandingNavbar from "@/components/navbar/LandingNavbar";
import Footer from "@/components/footer/Footer";

const SEARCH_BORDER_GRADIENT =
  "linear-gradient(90deg, #7C3AED 0%, #E91E8C 100%)";

const DUMMY_EVENTS = [
  {
    image: "/image/snada event.png",
    location: "Jakarta",
    title: "Senada Indonesia - 2026",
    organizer: "Sucor Sekuritas & OPPAL",
    price: "Rp 75.000 - 1.500.000",
    tickets: "301 Tiket Tersedia",
  },
  {
    image: "/image/snada event.png",
    location: "Jakarta",
    title: "Senada Indonesia - 2026",
    organizer: "Sucor Sekuritas & OPPAL",
    price: "Rp 75.000 - 1.500.000",
    tickets: "301 Tiket Tersedia",
  },
  {
    image: "/image/snada event.png",
    location: "Jakarta",
    title: "Senada Indonesia - 2026",
    organizer: "Sucor Sekuritas & OPPAL",
    price: "Rp 75.000 - 1.500.000",
    tickets: "301 Tiket Tersedia",
  },
  {
    image: "/image/snada event.png",
    location: "Jakarta",
    title: "Senada Indonesia - 2026",
    organizer: "Sucor Sekuritas & OPPAL",
    price: "Rp 75.000 - 1.500.000",
    tickets: "301 Tiket Tersedia",
  },
];

const BANNERS = [
  {
    image: "/image/snada indonesia.png",
    title: "Shada Indonesia 2026",
  },
  {
    image: "/image/banner-konser-2.png",
    title: "Konser Terbaru",
  },
  {
    image: "/image/banner-konser-3.png",
    title: "Event Musik Terbaik",
  },
];

const CATEGORIES = [
  {
    name: "Semua",
    icon: ListFilter,
  },
  {
    name: "Rock",
    icon: HandMetal,
  },
  {
    name: "Pop",
    icon: Disc3,
  },
  {
    name: "Indie",
    icon: Music2,
  },
  {
    name: "EDM",
    icon: Radio,
  },
  {
    name: "Jazz",
    icon: Mic2,
  },
];

const PROMO_BANNERS = [
  "/image/promo-gojek.png",
  "/image/promo-bayar-makin-praktis.png",
  "/image/promo-shower-fresh.png",
];

export default function Home() {
  const [activeBanner, setActiveBanner] = useState(0);
  const [activeCategory, setActiveCategory] = useState("Semua");

  const nextBanner = () => {
    setActiveBanner((current) =>
      current === BANNERS.length - 1 ? 0 : current + 1
    );
  };

  const previousBanner = () => {
    setActiveBanner((current) =>
      current === 0 ? BANNERS.length - 1 : current - 1
    );
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ================= NAVBAR ================= */}
      <LandingNavbar />

      {/* ================= MAIN ================= */}
      <main className="w-full">

        {/* ================= HERO BANNER ================= */}
        <section className="w-full px-3 sm:px-5 lg:px-8 pt-3">
          <div className="relative w-full overflow-hidden rounded-[20px]">
            
            {/* Banner */}
            <div className="relative aspect-[3.8/1] w-full min-h-[180px] sm:min-h-[220px] lg:min-h-[250px]">
              <Image
                src={BANNERS[activeBanner].image}
                alt={BANNERS[activeBanner].title}
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* LEFT BUTTON */}
            <button
              onClick={previousBanner}
              aria-label="Banner sebelumnya"
              className="absolute left-[-1px] top-1/2 -translate-y-1/2
                         flex h-[38px] w-[38px] items-center justify-center
                         rounded-full border border-[#E91E8C]
                         bg-white text-[#171717]
                         shadow-sm transition-all duration-200
                         hover:bg-[#F3EBFF] hover:scale-105"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* RIGHT BUTTON */}
            <button
              onClick={nextBanner}
              aria-label="Banner berikutnya"
              className="absolute right-[-1px] top-1/2 -translate-y-1/2
                         flex h-[38px] w-[38px] items-center justify-center
                         rounded-full border border-[#E91E8C]
                         bg-white text-[#171717]
                         shadow-sm transition-all duration-200
                         hover:bg-[#F3EBFF] hover:scale-105"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* DOT INDICATOR */}
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
              {BANNERS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveBanner(index)}
                  aria-label={`Banner ${index + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeBanner === index
                      ? "w-2 bg-white"
                      : "w-2 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ================= CATEGORY ================= */}
<section className="w-full px-5 sm:px-8 lg:px-16 pt-8">
  <div className="flex items-center justify-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
    {CATEGORIES.map((category) => {
      const Icon = category.icon;
      const active = activeCategory === category.name;

      return (
        <button
          key={category.name}
          onClick={() => setActiveCategory(category.name)}
          className={`group flex h-[65px] min-w-[65px] flex-col items-center justify-center gap-1.5 rounded-[10px] border-2 transition-all duration-200 sm:min-w-[66px] ${
            active
              ? "bg-[#F3EBFF]"
              : "bg-white hover:bg-[#F3EBFF]"
          }`}
          style={{
            border: "2px solid transparent",
            backgroundImage: `
              linear-gradient(
                ${active ? "#F3EBFF" : "white"},
                ${active ? "#F3EBFF" : "white"}
              ),
              ${SEARCH_BORDER_GRADIENT}
            `,
            backgroundOrigin: "border-box",
            backgroundClip: "padding-box, border-box",
          }}
        >
          <Icon
            className={`h-6 w-6 transition-transform duration-200 group-hover:scale-110 ${
              active
                ? "text-[#7C3AED]"
                : "text-[#C026D3]"
            }`}
            strokeWidth={2}
          />

          <span
            className={`text-[11px] font-semibold ${
              active
                ? "text-[#6D28D9]"
                : "text-[#A21CAF]"
            }`}
          >
            {category.name}
          </span>
        </button>
      );
    })}
  </div>
</section>

        {/* ================= PROMO ================= */}
        <section className="w-full px-5 sm:px-8 lg:px-16 pt-8 pb-12">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {PROMO_BANNERS.map((banner, index) => (
              <div
                key={banner}
                className="group relative aspect-[2.5/1] overflow-hidden rounded-[12px] bg-zinc-100"
              >
                <Image
                  src={banner}
                  alt={`Promo ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
            ))}
          </div>
        </section>

        {/* ================= EVENT TERBARU ================= */}
<section className="w-full px-5 sm:px-8 lg:px-16 pb-16">
  {/* HEADER */}
  <div className="mb-5 flex items-center justify-between">
    <div className="flex items-center gap-3">
      {/* Icon */}
        <div className="flex items-center justify-center">
          <Megaphone
            className="h-8 w-8"
            strokeWidth={2.5}
            style={{
              stroke: "url(#megaphone-gradient)",
            }}
          />

          <svg width="0" height="0">
            <defs>
              <linearGradient
                id="megaphone-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#E91E8C" />
              </linearGradient>
            </defs>
          </svg>
        </div>

      <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
        Event Konser Terbaru
      </h2>
    </div>

    <button
      className="rounded-[10px] px-5 py-2 text-xs font-semibold transition-all duration-200 hover:bg-[#F3EBFF]"
      style={{
        color: "#111827",
        border: "1.5px solid transparent",
        backgroundImage: `
          linear-gradient(white, white),
          ${SEARCH_BORDER_GRADIENT}
        `,
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
      }}
    >
      Lihat Semua
    </button>
  </div>

  {/* EVENT CARDS */}
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {DUMMY_EVENTS.map((event, index) => (
      <div
        key={index}
        className="group overflow-hidden rounded-[8px] bg-white border border-gray-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
      >
        {/* IMAGE */}
        <div className="relative aspect-[1.9/1] overflow-hidden bg-gray-100">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>

        {/* CONTENT */}
        <div className="px-3 py-2.5">

          {/* LOCATION */}
          <p className="text-[10px] text-gray-500">
            Kota {event.location}
          </p>

          {/* TITLE */}
          <h3 className="mt-1 text-[12px] font-bold text-gray-900">
            {event.title}
          </h3>

          {/* ORGANIZER */}
          <p className="mt-1 text-[10px] text-gray-500">
            Oleh {event.organizer}
          </p>

          {/* BOTTOM */}
          <div className="mt-4 flex items-center justify-between gap-2">
            <p className="text-[10px] font-medium text-gray-900">
              {event.price}
            </p>

            <p className="whitespace-nowrap text-[8px] text-gray-500">
              {event.tickets}
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>

{/* ================= AKAN SEGERA DATANG ================= */}
<section className="w-full px-5 sm:px-8 lg:px-16 pb-16">
  {/* HEADER */}
  <div className="mb-5 flex items-center justify-between">
    <div className="flex items-center gap-3">
      {/* Icon */}
        <div className="flex items-center justify-center">
          <Megaphone
            className="h-8 w-8"
            strokeWidth={2.5}
            style={{
              stroke: "url(#megaphone-gradient)",
            }}
          />

          <svg width="0" height="0">
            <defs>
              <linearGradient
                id="megaphone-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#E91E8C" />
              </linearGradient>
            </defs>
          </svg>
        </div>

      <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
        Akan Segera Datang
      </h2>
    </div>

    <button
      className="rounded-[10px] px-5 py-2 text-xs font-semibold transition-all duration-200 hover:bg-[#F3EBFF]"
      style={{
        color: "#111827",
        border: "1.5px solid transparent",
        backgroundImage: `
          linear-gradient(white, white),
          ${SEARCH_BORDER_GRADIENT}
        `,
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
      }}
    >
      Lihat Semua
    </button>
  </div>

  {/* UPCOMING EVENTS */}
  <div className="flex flex-col gap-6">
    {DUMMY_EVENTS.slice(0, 3).map((event, index) => (
      <div
        key={index}
        className="group flex w-full items-center gap-5 rounded-[10px] border-2 border-transparent bg-white px-3 py-3 shadow-sm transition-all duration-300 hover:bg-[#F3EBFF] hover:shadow-md"
        style={{
          backgroundImage: `
            linear-gradient(
              white,
              white
            ),
            ${SEARCH_BORDER_GRADIENT}
          `,
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
        }}
      >
        {/* DATE */}
        <div
          className="flex h-[68px] w-[68px] shrink-0 flex-col items-center justify-center rounded-[10px] bg-white text-center"
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
          <span className="text-[12px] font-semibold text-[#A21CAF]">
            August
          </span>

          <span className="text-[24px] font-bold leading-6 text-[#6D28D9]">
            10
          </span>
        </div>

        {/* IMAGE */}
        <div className="relative h-[68px] w-[135px] shrink-0 overflow-hidden rounded-[4px]">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* EVENT INFO */}
        <div className="min-w-0 flex-1">
          <h3 className="text-[13px] font-bold text-gray-900">
            {event.title}
          </h3>

          <p className="mt-0.5 text-[11px] text-gray-700">
            Oleh {event.organizer}
          </p>
        </div>

        {/* PRICE */}
        <div className="hidden shrink-0 text-[11px] font-medium text-gray-900 md:block">
          {event.price}
        </div>

        {/* REMINDER BUTTON */}
        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="mr-2 flex shrink-0 items-center gap-1.5 rounded-[10px] px-3 py-2 text-[11px] font-medium text-gray-900 transition-all duration-200 hover:bg-[#F3EBFF]"
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
          <Bell
            className="h-4 w-4"
            style={{ color: "#E91E8C" }}
          />

          Ingatkan Saya
        </button>
      </div>
    ))}
  </div>
</section>
      </main>
      <Footer />
    </div>
  );
}