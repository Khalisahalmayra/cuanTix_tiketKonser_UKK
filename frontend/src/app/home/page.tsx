"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import NavbarHome from "@/components/navbar/HomeNavbar";
import AuthGuard from "@/components/auth/AuthGuard";
import HeroBanner from "@/components/banner/HeroBanner";
import CategoryList from "@/components/category/CategoryList";
import EventCard from "@/components/cards/EventCard";
import GradientIcon from "@/components/icon/GradientIcon";
import UpcomingEventCard, {
  UPCOMING_EVENTS,
} from "@/components/cards/UpcomingEventCard";

import { fetchEvents, type Event } from "@/data/events";

const SEARCH_BORDER_GRADIENT =
  "linear-gradient(90deg, #7C3AED 0%, #E91E8C 100%)";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvents()
      .then(setEvents)
      .catch(() => setError("Gagal memuat event. Pastikan backend berjalan."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = events.filter(
    (e) => activeCategory === "Semua" || e.category === activeCategory
  );

  const konserTerlaris = [...filtered]
    .sort((a, b) => b.soldCount - a.soldCount)
    .slice(0, 8);

  const konserTerbaru = [...filtered]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 8);

  const handleRemind = (eventTitle: string) => {
    alert(`Pengingat untuk ${eventTitle} belum tersedia.`);
  };

  const renderGrid = (list: Event[]) => {
    if (loading) {
      return <p className="text-sm text-gray-500">Memuat event...</p>;
    }
    if (error) {
      return <p className="text-sm text-red-500">{error}</p>;
    }
    if (list.length === 0) {
      return (
        <p className="text-sm text-gray-500">
          Belum ada event untuk kategori ini.
        </p>
      );
    }
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
        {list.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    );
  };

  const LihatSemuaButton = () => (
    <button
      type="button"
      className="shrink-0 rounded-[10px] px-5 py-2 text-xs font-semibold text-gray-900 transition-all duration-200 hover:bg-[#F3EBFF]"
      style={{
        border: "1.5px solid transparent",
        backgroundImage: `linear-gradient(white, white), ${SEARCH_BORDER_GRADIENT}`,
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
      }}
    >
      Lihat Semua
    </button>
  );

  return (
    <AuthGuard>
      <main className="min-h-screen bg-white">
        <NavbarHome />

        <HeroBanner />

        <CategoryList
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Konser Terlaris */}
        <section className="w-full px-5 pt-10 sm:px-8 lg:px-16">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-extrabold text-gray-900 sm:text-xl">
                <GradientIcon type="trending" />
                Konser Terlaris
              </h2>
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                Konser yang sedang populer dan banyak diminati.
              </p>
            </div>
            <LihatSemuaButton />
          </div>
          {renderGrid(konserTerlaris)}
        </section>

        {/* Konser Terbaru */}
        <section className="w-full px-5 pb-12 pt-10 sm:px-8 lg:px-16">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-extrabold text-gray-900 sm:text-xl">
                <GradientIcon type="megaphone" />
                Konser Terbaru
              </h2>
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                Temukan event konser terbaru untukmu.
              </p>
            </div>
            <LihatSemuaButton />
          </div>
          {renderGrid(konserTerbaru)}
        </section>

        {/* Banner Cuantix Creators */}
        <section className="w-full px-5 pt-8 sm:px-8 lg:px-16">
          <div className="relative w-full overflow-hidden rounded-[20px]">
            <Image
              src="/image/cuantixCreators.png"
              alt="Cuantix Creators - Jual Tiket Eventmu Sekarang"
              width={1600}
              height={400}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        </section>

        {/* Akan Segera Datang */}
        <section className="w-full px-5 pb-16 pt-10 sm:px-8 lg:px-16">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <GradientIcon type="megaphone" size={32} />
              <h2 className="flex items-center gap-2 text-lg font-extrabold text-gray-900 sm:text-xl">
                Akan Segera Datang
              </h2>
            </div>
            <LihatSemuaButton />
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
    </AuthGuard>
  );
}