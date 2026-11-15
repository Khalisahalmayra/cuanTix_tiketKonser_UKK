"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BannerIndicators from "@/components/banner/BannerIndicators";

const BANNERS = [
  {
    image: "/image/snada-indonesia.png",
    title: "Senada Indonesia 2026",
  },
  {
    image: "/image/concert-crowd.jpg",
    title: "Konser Musik Spektakuler",
  },
  {
    image: "/image/cuantixCreators.png",
    title: "Cuantix Creator Festival",
  },
];

export default function HeroBanner() {
  const [activeBanner, setActiveBanner] = useState(0);

  const nextBanner = useCallback(() => {
    setActiveBanner((current) =>
      current === BANNERS.length - 1 ? 0 : current + 1
    );
  }, []);

  const previousBanner = useCallback(() => {
    setActiveBanner((current) =>
      current === 0 ? BANNERS.length - 1 : current - 1
    );
  }, []);

  // Auto slide setiap 6 detik
  useEffect(() => {
    const timer = setInterval(() => {
      nextBanner();
    }, 6000);
    return () => clearInterval(timer);
  }, [nextBanner]);

  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1320px] px-5 pt-4 pb-2 sm:px-8 md:px-10 lg:px-14 xl:px-16 sm:pt-6 sm:pb-3">
        <div className="group relative w-full overflow-hidden rounded-2xl md:rounded-3xl border border-gray-100 bg-gray-950 shadow-xs">
          {/* BANNER IMAGE CONTAINER */}
          <div className="relative aspect-[2.4/1] min-h-[180px] w-full sm:aspect-[3/1] sm:min-h-[220px] lg:aspect-[3.3/1] lg:max-h-[380px]">
            <Image
              src={BANNERS[activeBanner].image}
              alt={BANNERS[activeBanner].title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1320px"
              className="object-cover object-center transition-all duration-500"
            />

            {/* SUBTLE OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />
          </div>

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
            total={BANNERS.length}
            activeIndex={activeBanner}
            onSelect={setActiveBanner}
          />
        </div>
      </div>
    </section>
  );
}
