"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BannerIndicators from "@/components/banner/BannerIndicators";

const BANNERS = [
  {
    image: "/image/snada-indonesia.png",
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

export default function HeroBanner() {
  const [activeBanner, setActiveBanner] = useState(0);

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
    <section className="w-full px-3 pt-3 sm:px-5 lg:px-8">
      <div className="relative w-full overflow-hidden rounded-[20px]">
        <div className="relative aspect-[3.8/1] min-h-[180px] w-full sm:min-h-[220px] lg:min-h-[250px]">
          <Image
            src={BANNERS[activeBanner].image}
            alt={BANNERS[activeBanner].title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <button
          type="button"
          onClick={previousBanner}
          aria-label="Banner sebelumnya"
          className="absolute left-[-1px] top-1/2 flex h-[38px] w-[38px] -translate-y-1/2 items-center justify-center rounded-full border border-[#E91E8C] bg-white text-[#171717] shadow-sm transition-all duration-200 hover:scale-105 hover:bg-[#F3EBFF]"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={nextBanner}
          aria-label="Banner berikutnya"
          className="absolute right-[-1px] top-1/2 flex h-[38px] w-[38px] -translate-y-1/2 items-center justify-center rounded-full border border-[#E91E8C] bg-white text-[#171717] shadow-sm transition-all duration-200 hover:scale-105 hover:bg-[#F3EBFF]"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <BannerIndicators
          total={BANNERS.length}
          activeIndex={activeBanner}
          onSelect={setActiveBanner}
        />
      </div>
    </section>
  );
}