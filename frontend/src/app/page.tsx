"use client";

import { useState } from "react";
import Image from "next/image";
import GradientIcon from "@/components/icon/GradientIcon";
import LandingNavbar from "@/components/navbar/LandingNavbar";
import Footer from "@/components/footer/Footer";

import HeroBanner from "@/components/banner/HeroBanner";
import CategoryList from "@/components/category/CategoryList";
import EventCard, { DUMMY_EVENTS } from "@/components/cards/EventCard";

import UpcomingEventCard, {
  UPCOMING_EVENTS,
} from "@/components/cards/UpcomingEventCard";

const SEARCH_BORDER_GRADIENT =
  "linear-gradient(90deg, #7C3AED 0%, #E91E8C 100%)";

const PROMO_BANNERS = [
  { src: "/image/promo-bayar-makin-praktis.png", alt: "Gojek - Jalan & Jajan Lebih Hemat" },
  { src: "/image/promo-gojek.png", alt: "BCA - Bayar Makin Praktis dengan QRIS CPM" },
  { src: "/image/promo-shower-fresh.png", alt: "Rexona - Stay Shower Fresh All Day Long" },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("Semua");

  const handleRemind = (eventTitle: string) => {
    alert(`Pengingat untuk "${eventTitle}" dipilih.`);
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* NAVBAR */}
      <LandingNavbar />

      <main className="w-full">
        {/* HERO BANNER */}
        <HeroBanner />

        {/* KATEGORI */}
        <CategoryList
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* PROMO BANNER */}
      <section className="w-full px-5 pt-8 sm:px-8 lg:px-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROMO_BANNERS.map((banner) => (
            <div
              key={banner.src}
              className="overflow-hidden rounded-2xl shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <Image
                src={banner.src}
                alt={banner.alt}
                width={0}
                height={0}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="h-auto w-full"
              />
            </div>
          ))}
        </div>
      </section>

        {/* EVENT KONSER TERBARU */}
        <section className="w-full px-5 pb-16 pt-8 sm:px-8 lg:px-16">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <GradientIcon type="megaphone" size={32} />

              <h2 className="flex items-center gap-2 text-lg font-extrabold text-gray-900 sm:text-xl">
                Event Konser Terbaru
              </h2>
            </div>

            <button
              type="button"
              className="shrink-0 rounded-[10px] px-5 py-2 text-xs font-semibold text-gray-900 transition-all duration-200 hover:bg-[#F3EBFF]"
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
              Lihat Semua
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DUMMY_EVENTS.map((event, index) => (
              <EventCard key={`${event.title}-${index}`} event={event} />
            ))}
          </div>
        </section>

        {/* AKAN SEGERA DATANG */}
        <section className="w-full px-5 pb-16 sm:px-8 lg:px-16">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <GradientIcon type="megaphone" size={32} />

              <h2 className="flex items-center gap-2 text-lg font-extrabold text-gray-900 sm:text-xl">
                Akan Segera Datang
              </h2>
            </div>

            <button
              type="button"
              className="shrink-0 rounded-[10px] px-5 py-2 text-xs font-semibold text-gray-900 transition-all duration-200 hover:bg-[#F3EBFF]"
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
              Lihat Semua
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {UPCOMING_EVENTS.map((event, index) => (
              <UpcomingEventCard
                key={`${event.title}-${event.day}-${index}`}
                event={event}
                onRemind={() => handleRemind(event.title)}
              />
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}