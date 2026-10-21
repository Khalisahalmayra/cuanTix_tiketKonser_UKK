
"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { ArrowLeft } from "lucide-react";

import LandingNavbar from "@/components/navbar/LandingNavbar";
import TicketResults from "@/components/ticket-search/TicketResults";

const GRADIENT =
  "linear-gradient(90deg, #7C3AED 0%, #E91E8C 100%)";

const GRADIENT_CSS_TEXT: React.CSSProperties = {
  backgroundImage: GRADIENT,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  WebkitTextFillColor: "transparent",
};

// Gradient untuk ikon
function IconGradientDefs() {
  return (
    <svg
      width="0"
      height="0"
      className="pointer-events-none absolute"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="icon-gradient"
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
  );
}

function HasilPencarianTiketContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nama = searchParams.get("nama") || "Anda";

  // Jumlah data dummy sementara ada 2 tiket.
  // Jika data berubah, sesuaikan juga jumlah di TicketResults.
  const totalTickets = 2;

  return (
    <div className="min-h-screen w-full bg-white">
      {/* NAVBAR */}
      <LandingNavbar />

      {/* ICON GRADIENT */}
      <IconGradientDefs />

      {/* MAIN */}
      <main className="w-full px-5 pb-16 pt-6 sm:px-8 lg:px-16">
        {/* BACK BUTTON */}
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Kembali"
          className="flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 hover:scale-105 hover:bg-[#F3EBFF]"
          style={{
            border: "2px solid transparent",
            backgroundImage: `linear-gradient(white, white), ${GRADIENT}`,
            backgroundOrigin: "border-box",
            backgroundClip: "padding-box, border-box",
          }}
        >
          <ArrowLeft
            className="h-5 w-5"
            style={{ stroke: "url(#icon-gradient)" }}
          />
        </button>

        {/* HEADER */}
        <div className="mt-6">
          <h1
            className="text-2xl font-extrabold sm:text-3xl"
            style={GRADIENT_CSS_TEXT}
          >
            Hasil Pencarian Tiket Anda
          </h1>

          <p
            className="mt-2 text-base font-medium"
            style={GRADIENT_CSS_TEXT}
          >
            Kami menemukan {totalTickets} tiket aktif untuk{" "}
            <span className="font-bold">{nama}</span>
          </p>
        </div>

        {/* TICKET RESULTS */}
        <TicketResults />
      </main>
    </div>
  );
}

export default function HasilPencarianTiketPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white">
          <LandingNavbar />
        </div>
      }
    >
      <HasilPencarianTiketContent />
    </Suspense>
  );
}
