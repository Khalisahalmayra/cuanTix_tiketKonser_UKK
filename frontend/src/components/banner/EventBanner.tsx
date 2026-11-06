
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import GradientIcon from "@/components/icon/GradientIcon";

type EventBannerProps = {
  image: string;
  title: string;
  location: string;
  date: string;
  price: string;
  category: string;
};

export default function EventBanner({
  image,
  title,
  location,
  date,
  price,
  category,
}: EventBannerProps) {
  const router = useRouter();

  return (
    <section className="relative mx-3 mt-3 overflow-hidden rounded-[24px] bg-[#70436F] shadow-[0_5px_20px_rgba(91,26,120,0.35)]">

      {/* BACKGROUND BLUR */}
      <div
        className="absolute inset-0 scale-110 bg-cover bg-center opacity-50 blur-xl"
        style={{
          backgroundImage: `url(${image})`,
        }}
      />

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 py-7 lg:flex-row lg:px-10">

        {/* TOMBOL KEMBALI */}
            <button
            onClick={() => router.back()}
            aria-label="Kembali"
            className="absolute left-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition hover:scale-105"
            >
            <GradientIcon type="arrowLeft" size={22} />
            </button>

        {/* POSTER EVENT */}
        <div className="relative aspect-[1.7/1] w-full max-w-[430px] overflow-hidden rounded-md shadow-lg lg:w-[44%]">
          <Image
            src={image}
            alt={title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 430px"
            className="object-cover"
          />
        </div>

        {/* INFORMASI EVENT */}
        <div className="w-full space-y-3 text-white lg:flex-1">

          <h1 className="text-xl font-bold md:text-2xl">
            {title}
          </h1>

          <p className="flex items-center gap-2 text-sm md:text-base">
            <GradientIcon type="mapPin" color="#ffffff" />
            {location}
          </p>

          <p className="flex items-center gap-2 text-sm md:text-base">
            <GradientIcon type="calendar" color="#ffffff" />
            {date}
          </p>

          <p className="flex items-center gap-2 text-sm md:text-base">
            <GradientIcon type="ticket" color="#ffffff" />
            Harga Tiket Dimulai dari {price}
          </p>

          <p className="flex items-center gap-2 text-sm md:text-base">
            <GradientIcon type="music" color="#ffffff" />
            {category}
          </p>

        </div>
      </div>
    </section>
  );
}
