"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  Music2,
  Undo2,
  Ticket,
  CalendarClock,
  CreditCard,
  Download,
  Send,
} from "lucide-react";

import LandingNavbar from "@/components/navbar/LandingNavbar";

const GRADIENT = "linear-gradient(90deg, #7C3AED 0%, #E91E8C 100%)";

// Dummy data — ganti dengan hasil fetch API berdasarkan ID tiket
const TICKET_DETAIL = {
  eventImage: "/image/snada event.png",
  eventTitle: "Snada Indonesia - 2026",
  venue: "Istora Senayan, Jakarta Pusat",
  eventDateTime: "Sabtu, 10 October 2026 - 22.00 WIB",
  category: "Konser Musik Pop",
  ticketType: "DIAMOND SPOT A",
  totalTickets: 1,
  pricePerTicket: 6000000,
  selectedDate: "Senin, 10 Agustus 2026",
  refundPolicy: "Pengembalian dana tidak diperbolehkan.",
  confirmationType: "Konfirmasi Instan",
  validOn: "Berlaku pada 10 Agustus 2026",
  totalPayment: 6000000,
  orderId: "#BYEW10255Q",
  customer: {
    name: "Iput Cantik",
    email: "IputCantik@gmail.com",
    phone: "08 9988 7898 3223",
  },
};

function formatRupiah(value: number): string {
  return `Rp.${value.toLocaleString("id-ID")}`;
}

function Barcode() {
  // Pola batang barcode statis — cukup untuk tampilan visual
  const bars = [
    2, 1, 3, 1, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 2, 1, 1,
    2, 1, 3, 1, 2,
  ];
  return (
    <div className="flex h-14 items-stretch gap-[3px]">
      {bars.map((w, i) => (
        <div key={i} className="bg-white" style={{ width: `${w * 2}px` }} />
      ))}
    </div>
  );
}

export default function DetailTiketPage() {
  const router = useRouter();
  const params = useParams();
  const ticketId = params?.id as string;

  const t = TICKET_DETAIL;

  return (
    <div className="min-h-screen w-full bg-white">
      {/* ================= NAVBAR ================= */}
      <LandingNavbar />

      <main className="mx-auto w-full max-w-7xl px-5 pb-16 pt-6 sm:px-8 lg:px-16">
        {/* ================= HERO BANNER ================= */}
        <div className="relative overflow-hidden rounded-[24px]">
          {/* Blurred background */}
          <div className="absolute inset-0">
            <Image
              src={t.eventImage}
              alt=""
              fill
              className="scale-110 object-cover blur-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
          </div>

          <div className="relative z-10 flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center">
            {/* BACK BUTTON */}
            <button
              onClick={() => router.back()}
              aria-label="Kembali"
              className="absolute left-0 top-0 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-md transition-all duration-200 hover:scale-105 sm:relative sm:mr-2"
            >
              <ArrowLeft className="h-5 w-5" style={{ color: "#7C3AED" }} />
            </button>

            {/* THUMBNAIL POSTER */}
            <div className="relative mt-14 aspect-[2/1] w-full max-w-md shrink-0 overflow-hidden rounded-[14px] sm:mt-0 lg:w-[420px]">
              <Image
                src={t.eventImage}
                alt={t.eventTitle}
                fill
                className="object-cover object-center"
              />
            </div>

            {/* EVENT INFO */}
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold text-white sm:text-2xl">
                {t.eventTitle}
              </h1>

              <div className="mt-3 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 shrink-0 text-white" fill="white" />
                  <span className="text-sm text-white/90">{t.venue}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CalendarDays className="h-4 w-4 shrink-0 text-white" />
                  <span className="text-sm text-white/90">{t.eventDateTime}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Music2 className="h-4 w-4 shrink-0 text-white" />
                  <span className="text-sm text-white/90">{t.category}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= CONTENT GRID ================= */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* ================= LEFT: TICKET STUB CARD ================= */}
          <div
            className="overflow-hidden rounded-[16px]"
            style={{
              border: "1.5px solid transparent",
              backgroundImage: `linear-gradient(white, white), ${GRADIENT}`,
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
            }}
          >
            {/* POSTER */}
            <div className="relative aspect-[2/1] w-full overflow-hidden bg-black">
              <Image
                src={t.eventImage}
                alt={t.ticketType}
                fill
                className="object-cover object-center"
              />
            </div>

            <div className="px-6 py-5">
              {/* TICKET TYPE */}
              <h3 className="text-lg font-extrabold sm:text-xl" style={{ color: "#4C1D95" }}>
                {t.ticketType}
              </h3>

              {/* TOTAL */}
              <p className="mt-4 text-sm text-gray-900 sm:text-base">
                <span className="font-bold">Total ({t.totalTickets} Tiket):</span>{" "}
                <span className="font-bold" style={{ color: "#7C3AED" }}>
                  {formatRupiah(t.pricePerTicket)}
                </span>
              </p>

              {/* TANGGAL */}
              <div className="mt-4 border-t border-pink-100 pt-4">
                <p className="text-sm font-bold text-gray-900 sm:text-base">
                  Tanggal yang Dipilih:
                </p>
                <p className="mt-1 text-sm font-bold sm:text-base" style={{ color: "#7C3AED" }}>
                  {t.selectedDate}
                </p>
              </div>

              {/* INFO LIST */}
              <div className="mt-4 space-y-3 border-t border-pink-100 pt-4">
                <div className="flex items-center gap-3">
                  <Undo2 className="h-5 w-5 shrink-0" style={{ color: "#E91E8C" }} />
                  <span className="text-sm font-semibold sm:text-base" style={{ color: "#7C3AED" }}>
                    {t.refundPolicy}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Ticket className="h-5 w-5 shrink-0" style={{ color: "#E91E8C" }} />
                  <span className="text-sm font-semibold sm:text-base" style={{ color: "#7C3AED" }}>
                    {t.confirmationType}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarClock className="h-5 w-5 shrink-0" style={{ color: "#E91E8C" }} />
                  <span className="text-sm font-semibold sm:text-base" style={{ color: "#7C3AED" }}>
                    {t.validOn}
                  </span>
                </div>
              </div>
            </div>

            {/* DIVIDER BAR — gradient */}
            <div className="h-2 w-full" style={{ backgroundImage: GRADIENT }} />

            {/* TOTAL PEMBAYARAN */}
            <div className="px-6 py-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-800 sm:text-base">Total Pembayaran:</p>
                <p className="text-lg font-extrabold sm:text-xl" style={{ color: "#4C1D95" }}>
                  {formatRupiah(t.totalPayment)}
                </p>
              </div>
            </div>

            {/* TICKET STUB / ID PEMESANAN + BARCODE — gradient */}
            <div className="relative">
              {/* Notch cutouts kiri-kanan */}
              <div className="absolute left-[-14px] top-0 h-7 w-7 -translate-y-1/2 rounded-full bg-white" />
              <div className="absolute right-[-14px] top-0 h-7 w-7 -translate-y-1/2 rounded-full bg-white" />

              <div
                className="flex flex-col items-center gap-4 px-6 py-6"
                style={{ backgroundImage: GRADIENT }}
              >
                <div className="text-center">
                  <p className="text-sm font-semibold tracking-wide text-white/90">
                    ID Pemesanan :
                  </p>
                  <p className="mt-1 text-lg font-bold tracking-[0.2em] text-white">
                    {t.orderId}
                  </p>
                </div>

                <Barcode />
              </div>
            </div>
          </div>

          {/* ================= RIGHT: DATA & PEMBAYARAN ================= */}
          <div className="flex flex-col gap-6">
            {/* DATA PELANGGAN */}
            <div
              className="rounded-[16px] border-2 px-6 py-6 sm:px-8 sm:py-7"
              style={{ borderColor: "#E91E8C" }}
            >
              <h2 className="text-lg font-extrabold sm:text-xl" style={{ color: "#E91E8C" }}>
                DATA PELANGGAN
              </h2>
              <div className="mt-3 h-px w-full bg-gray-200" />

              <div className="mt-5 space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-bold" style={{ color: "#6D28D9" }}>
                    Nama Pengguna:
                  </label>
                  <input
                    readOnly
                    value={t.customer.name}
                    className="w-full rounded-[10px] border-2 px-4 py-2.5 text-sm font-semibold outline-none"
                    style={{ borderColor: "#E91E8C", color: "#6D28D9" }}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold" style={{ color: "#6D28D9" }}>
                    Email:
                  </label>
                  <input
                    readOnly
                    value={t.customer.email}
                    className="w-full rounded-[10px] border-2 px-4 py-2.5 text-sm font-semibold outline-none"
                    style={{ borderColor: "#E91E8C", color: "#6D28D9" }}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold" style={{ color: "#6D28D9" }}>
                    Nomor Telepon:
                  </label>
                  <input
                    readOnly
                    value={t.customer.phone}
                    className="w-full rounded-[10px] border-2 px-4 py-2.5 text-sm font-semibold outline-none"
                    style={{ borderColor: "#E91E8C", color: "#6D28D9" }}
                  />
                </div>
              </div>
            </div>

            {/* METODE PEMBAYARAN */}
            <div>
              <h2 className="text-lg font-extrabold sm:text-xl" style={{ color: "#E91E8C" }}>
                METODE PEMBAYARAN
              </h2>

              <div className="mt-4 flex flex-col gap-3.5">
                <button
                  type="button"
                  onClick={() => console.log("Bayar dengan kartu kredit")}
                  className="flex items-center gap-3.5 rounded-[10px] border-2 px-5 py-3.5 text-left transition-all duration-200 hover:bg-[#F3EBFF]"
                  style={{ borderColor: "#7C3AED" }}
                >
                  <CreditCard className="h-5 w-5 shrink-0" style={{ color: "#4C1D95" }} />
                  <span className="text-sm font-bold sm:text-base" style={{ color: "#4C1D95" }}>
                    Kartu Kredit
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => console.log("Unduh PDF")}
                  className="flex items-center gap-3.5 rounded-[10px] border-2 px-5 py-3.5 text-left transition-all duration-200 hover:bg-[#F3EBFF]"
                  style={{ borderColor: "#E91E8C" }}
                >
                  <Download className="h-5 w-5 shrink-0" style={{ color: "#E91E8C" }} />
                  <span className="text-sm font-bold sm:text-base" style={{ color: "#4C1D95" }}>
                    Unduh Menggunakan PDF
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => console.log("Kirim ke email")}
                  className="flex items-center gap-3.5 rounded-[10px] border-2 px-5 py-3.5 text-left transition-all duration-200 hover:bg-[#F3EBFF]"
                  style={{ borderColor: "#7C3AED" }}
                >
                  <Send className="h-5 w-5 shrink-0" style={{ color: "#4C1D95" }} />
                  <span className="text-sm font-bold sm:text-base" style={{ color: "#4C1D95" }}>
                    Kirim ke Email Anda
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}