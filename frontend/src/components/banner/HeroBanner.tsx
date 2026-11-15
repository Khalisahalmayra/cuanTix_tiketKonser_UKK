"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BannerIndicators from "@/components/banner/BannerIndicators";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// Jumlah event terbaru yang ditampilkan sebagai banner
const MAX_BANNERS = 5;

type Banner = {
  id: string;
  slug: string;
  title: string;
  image: string;
};

// Sebagian bentuk respons GET /api/events
type ApiEvent = {
  id: string | number;
  slug: string;
  title: string;
  image: string | null;
  createdAt?: string;
};

export default function HeroBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeBanner, setActiveBanner] = useState(0);

  // Ambil event dari backend, pakai yang terbaru sebagai banner
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`${API_URL}/api/events`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: ApiEvent[] = await res.json();

        const list: Banner[] = data
          .filter((e) => e.image)
          .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
          .slice(0, MAX_BANNERS)
          .map((e) => ({
            id: String(e.id),
            slug: e.slug,
            title: e.title,
            image: e.image as string,
          }));

        if (!cancelled) {
          setBanners(list);
          setActiveBanner(0);
        }
      } catch {
        // gagal memuat: carousel disembunyikan
        if (!cancelled) setBanners([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const total = banners.length;

  const nextBanner = useCallback(() => {
    setActiveBanner((current) => (current >= total - 1 ? 0 : current + 1));
  }, [total]);

  const previousBanner = useCallback(() => {
    setActiveBanner((current) => (current <= 0 ? total - 1 : current - 1));
  }, [total]);

  // Auto slide setiap 6 detik (hanya kalau ada lebih dari satu banner)
  useEffect(() => {
    if (total < 2) return;
    const timer = setInterval(() => {
      nextBanner();
    }, 6000);
    return () => clearInterval(timer);
  }, [nextBanner, total]);

  // Kerangka saat memuat, supaya halaman tidak melompat
  if (loading) {
    return (
      <section className="w-full">
        <div className="mx-auto max-w-[1320px] px-5 pt-4 pb-2 sm:px-8 md:px-10 lg:px-14 xl:px-16 sm:pt-6 sm:pb-3">
          <div className="aspect-[2.4/1] min-h-[180px] w-full animate-pulse rounded-2xl bg-gray-200 sm:aspect-[3/1] sm:min-h-[220px] md:rounded-3xl lg:aspect-[3.3/1] lg:max-h-[380px]" />
        </div>
      </section>
    );
  }

  // Tidak ada event untuk ditampilkan
  if (total === 0) return null;

  const current = banners[Math.min(activeBanner, total - 1)];

  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1320px] px-5 pt-4 pb-2 sm:px-8 md:px-10 lg:px-14 xl:px-16 sm:pt-6 sm:pb-3">
        <div className="group relative w-full overflow-hidden rounded-2xl md:rounded-3xl border border-gray-100 bg-gray-950 shadow-xs">
          {/* BANNER IMAGE CONTAINER */}
          <div className="relative aspect-[2.4/1] min-h-[180px] w-full sm:aspect-[3/1] sm:min-h-[220px] lg:aspect-[3.3/1] lg:max-h-[380px]">
            {/* Klik banner -> buka detail event */}
            <Link
              href={`/detail-tiket/${current.slug}`}
              aria-label={`Lihat detail ${current.title}`}
              className="absolute inset-0 block"
            >
              <Image
                key={current.id}
                src={current.image}
                alt={current.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 1320px"
                className="object-cover object-center transition-all duration-500"
              />

              {/* SUBTLE OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />
            </Link>
          </div>

          {total > 1 && (
            <>
              {/* PREVIOUS BUTTON */}
              <button
                type="button"
                onClick={previousBanner}
                aria-label="Banner sebelumnya"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md backdrop-blur-xs transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none opacity-80 group-hover:opacity-100 cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>

              {/* NEXT BUTTON */}
              <button
                type="button"
                onClick={nextBanner}
                aria-label="Banner berikutnya"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md backdrop-blur-xs transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none opacity-80 group-hover:opacity-100 cursor-pointer"
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>

              {/* INDICATORS */}
              <BannerIndicators
                total={total}
                activeIndex={activeBanner}
                onSelect={setActiveBanner}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
}