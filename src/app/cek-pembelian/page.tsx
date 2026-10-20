"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { MapPin, Undo2, Ticket, CalendarClock, ArrowLeft } from "lucide-react";

import LandingNavbar from "@/components/navbar/LandingNavbar";

const GRADIENT = "linear-gradient(90deg, #7C3AED 0%, #E91E8C 100%)";
const GRADIENT_CSS_TEXT: React.CSSProperties = {
  backgroundImage: GRADIENT,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  WebkitTextFillColor: "transparent",
};

// Dummy data — ganti dengan hasil fetch API berdasarkan noTelp & nama
type TicketResult = {
  id: string;
  eventImage: string;
  ticketType: string;
  totalTickets: number;
  pricePerTicket: number;
  selectedDate: string;
  venue: string;
  refundPolicy: string;
  confirmationType: string;
  validOn: string;
  totalPayment: number;
};

const DUMMY_TICKETS: TicketResult[] = [
  {
    id: "1",
    eventImage: "/image/snada event.png",
    ticketType: "DIAMOND SPOT A",
    totalTickets: 1,
    pricePerTicket: 6000000,
    selectedDate: "Senin, 10 Agustus 2026",
    venue: "Istora Senayan, Jakarta Pusat",
    refundPolicy: "Pengembalian dana tidak diperbolehkan.",
    confirmationType: "Konfirmasi Instan",
    validOn: "Berlaku pada 10 Agustus 2026",
    totalPayment: 6000000,
  },
  {
    id: "2",
    eventImage: "/image/snada event.png",
    ticketType: "DIAMOND SPOT A",
    totalTickets: 1,
    pricePerTicket: 6000000,
    selectedDate: "Senin, 10 Agustus 2026",
    venue: "Istora Senayan, Jakarta Pusat",
    refundPolicy: "Pengembalian dana tidak diperbolehkan.",
    confirmationType: "Konfirmasi Instan",
    validOn: "Berlaku pada 10 Agustus 2026",
    totalPayment: 6000000,
  },
];

function formatRupiah(value: number): string {
  return `Rp.${value.toLocaleString("id-ID")}`;
}

// Icon SVG gradient definitions — dipakai bareng oleh semua ikon di halaman ini
function IconGradientDefs() {
  return (
    <svg width="0" height="0" className="absolute">
      <defs>
        <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#E91E8C" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function HasilPencarianTiketPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const nama = searchParams.get("nama") || "Anda";
  const tickets = DUMMY_TICKETS; // TODO: fetch berdasarkan noTelp & nama dari query

  return (
    <div className="min-h-screen w-full bg-white">
      {/* ================= NAVBAR ================= */}
      <LandingNavbar />

      {/* Definisi gradient untuk semua ikon di halaman ini */}
      <IconGradientDefs />

      {/* ================= MAIN ================= */}
      <main className="w-full px-5 pb-16 pt-6 sm:px-8 lg:px-16">
        {/* BACK BUTTON */}
        <button
          onClick={() => router.back()}
          aria-label="Kembali"
          className="flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 hover:bg-[#F3EBFF] hover:scale-105"
          style={{
            border: "2px solid transparent",
            backgroundImage: `linear-gradient(white, white), ${GRADIENT}`,
            backgroundOrigin: "border-box",
            backgroundClip: "padding-box, border-box",
          }}
        >
          <ArrowLeft className="h-5 w-5" style={{ stroke: "url(#icon-gradient)" }} />
        </button>

        {/* HEADER */}
        <div className="mt-6">
          <h1
            className="text-2xl font-extrabold sm:text-3xl"
            style={GRADIENT_CSS_TEXT}
          >
            Hasil Pencarian Tiket Anda
          </h1>

        <p className="mt-2 text-base font-medium" style={GRADIENT_CSS_TEXT}>
            Kami menemukan {tickets.length} tiket aktif untuk{" "}
            <span className="font-bold" style={GRADIENT_CSS_TEXT}>
              {nama}
            </span>
          </p>
        </div>

        {/* EMPTY STATE */}
        {tickets.length === 0 ? (
          <div className="mt-16 flex flex-col items-center justify-center text-center">
            <Ticket className="h-12 w-12 text-gray-300" />
            <p className="mt-4 text-sm font-semibold text-gray-700">
              Tidak ada tiket ditemukan
            </p>
            <p className="mt-1 max-w-sm text-xs text-gray-500">
              Periksa kembali No. Telp dan Nama Lengkap yang kamu masukkan,
              lalu coba lagi.
            </p>
          </div>
        ) : (
          /* TICKET CARDS */
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tickets.map((ticket) => (
              <button
                key={ticket.id}
                type="button"
                onClick={() => router.push(`/detail-pembelian-tiket/${ticket.id}`)}
                aria-label={`Lihat detail tiket ${ticket.ticketType}`}
                className="group flex flex-col overflow-hidden rounded-[14px] text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  border: "1.5px solid transparent",
                  backgroundImage: `linear-gradient(white, white), ${GRADIENT}`,
                  backgroundOrigin: "border-box",
                  backgroundClip: "padding-box, border-box",
                }}
              >
                {/* EVENT IMAGE */}
                <div className="relative aspect-[2/1] w-full overflow-hidden bg-black">
                  <Image
                    src={ticket.eventImage}
                    alt={ticket.ticketType}
                    fill
                    className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>

                <div className="px-4 py-3.5">
                  {/* TICKET TYPE */}
                  <h3
                    className="text-sm font-extrabold sm:text-base"
                    style={GRADIENT_CSS_TEXT}
                  >
                    {ticket.ticketType}
                  </h3>

                  {/* TOTAL */}
                  <p className="mt-2 text-xs text-gray-900 sm:text-sm">
                    <span className="font-bold">
                      Total ({ticket.totalTickets} Tiket):
                    </span>{" "}
                    <span className="font-bold" style={GRADIENT_CSS_TEXT}>
                      {formatRupiah(ticket.pricePerTicket)}
                    </span>
                  </p>

                  {/* TANGGAL */}
                  <div className="mt-2.5 border-t border-pink-100 pt-2.5">
                    <p className="text-xs font-bold text-gray-900 sm:text-sm">
                      Tanggal yang Dipilih:
                    </p>
                    <p
                      className="mt-0.5 text-xs font-bold sm:text-sm"
                      style={GRADIENT_CSS_TEXT}
                    >
                      {ticket.selectedDate}
                    </p>
                  </div>

                  {/* INFO LIST */}
                  <div className="mt-2.5 space-y-2 border-t border-pink-100 pt-2.5">
                    <div className="flex items-center gap-2">
                      <MapPin
                        className="h-4 w-4 shrink-0"
                        style={{ stroke: "url(#icon-gradient)", fill: "url(#icon-gradient)" }}
                      />
                      <span
                        className="text-xs font-semibold sm:text-sm"
                        style={GRADIENT_CSS_TEXT}
                      >
                        {ticket.venue}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Undo2
                        className="h-4 w-4 shrink-0"
                        style={{ stroke: "url(#icon-gradient)" }}
                      />
                      <span
                        className="text-xs font-semibold sm:text-sm"
                        style={GRADIENT_CSS_TEXT}
                      >
                        {ticket.refundPolicy}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Ticket
                        className="h-4 w-4 shrink-0"
                        style={{ stroke: "url(#icon-gradient)" }}
                      />
                      <span
                        className="text-xs font-semibold sm:text-sm"
                        style={GRADIENT_CSS_TEXT}
                      >
                        {ticket.confirmationType}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <CalendarClock
                        className="h-4 w-4 shrink-0"
                        style={{ stroke: "url(#icon-gradient)" }}
                      />
                      <span
                        className="text-xs font-semibold sm:text-sm"
                        style={GRADIENT_CSS_TEXT}
                      >
                        {ticket.validOn}
                      </span>
                    </div>
                  </div>
                </div>

                {/* DIVIDER BAR */}
                <div className="h-1.5 w-full" style={{ backgroundImage: GRADIENT }} />

                {/* FOOTER — total pembayaran saja, tanpa tombol */}
                <div className="px-4 py-3.5">
                  <p className="text-xs text-gray-800 sm:text-sm">
                    Total Pembayaran:
                  </p>
                  <p
                    className="mt-0.5 text-base font-extrabold sm:text-lg"
                    style={GRADIENT_CSS_TEXT}
                  >
                    {formatRupiah(ticket.totalPayment)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}