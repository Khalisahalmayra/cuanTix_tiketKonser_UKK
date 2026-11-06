"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import GradientIcon from "@/components/icon/GradientIcon";
import EventBanner from "@/components/banner/EventBanner";
import { startPaymentTimer } from "@/hooks/usePaymentTimer";

type Ticket = {
  name: string;
  price: number;
  stock: number;
  benefits: string[];
};

const taxNote = "Harga tiket belum termasuk Pajak Hiburan Daerah 10%, Biaya Admin 5%";

const diamondBenefits = [
  "1 tiket Snada Indonesia 2026",
  "1 akses VVIP Lounge",
  "1 pax merchandise exclusive Snada Indonesia",
  "Akses meet and greet with Anggun",
  "1 pax Dinner Buffet at Snada Indonesia Lounge",
  "1 tiket berlaku untuk satu orang dan tidak dapat digunakan untuk keluar-masuk (re-entry)",
  taxNote,
];

const vipBenefits = [
  "1 tiket Snada Indonesia 2026",
  "1 akses VIP Lounge",
  "1 tiket berlaku untuk satu orang dan dapat digunakan untuk keluar-masuk (re-entry)",
  taxNote,
];

const regularBenefits = [
  "1 tiket Snada Indonesia 2026",
  "1 tiket berlaku untuk satu orang dan dapat digunakan untuk keluar-masuk (re-entry)",
  taxNote,
];

const tickets: Ticket[] = [
  { name: "DIAMOND SPOT A", price: 6000000, stock: 30, benefits: diamondBenefits },
  { name: "DIAMOND SPOT B", price: 6000000, stock: 30, benefits: diamondBenefits },
  { name: "VIP", price: 2500000, stock: 50, benefits: vipBenefits },
  { name: "PLATINUM A", price: 1800000, stock: 60, benefits: regularBenefits },
  { name: "PLATINUM B", price: 1800000, stock: 60, benefits: regularBenefits },
  { name: "GOLD A", price: 1500000, stock: 60, benefits: regularBenefits },
  { name: "GOLD B", price: 1500000, stock: 60, benefits: regularBenefits },
  { name: "SILVER A", price: 1200000, stock: 60, benefits: regularBenefits },
  { name: "SILVER B", price: 1200000, stock: 60, benefits: regularBenefits },
  { name: "BRONZE A", price: 1000000, stock: 60, benefits: regularBenefits },
  { name: "BRONZE B", price: 1000000, stock: 60, benefits: regularBenefits },
  { name: "FESTIVAL", price: 750000, stock: 60, benefits: regularBenefits },
];

const MAX_QTY = 4;

const formatPrice = (price: number) => "Rp" + price.toLocaleString("id-ID");

const slug = (name: string) => "tiket-" + name.toLowerCase().replace(/\s+/g, "-");

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selected = searchParams.get("ticket");

  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // Tiket yang sedang aktif (dari query ?ticket=, kalau tidak ada pakai yang pertama)
  const [activeName, setActiveName] = useState<string>(
    tickets.some((t) => t.name === selected) ? (selected as string) : tickets[0].name
  );

  const scrollToTicket = (name: string) => {
    document.getElementById(slug(name))?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  // Dipanggil saat kartu kiri atau item kanan diklik
  const selectTicket = (name: string, scroll = false) => {
    setActiveName(name);
    if (scroll) scrollToTicket(name);
  };

  // Saat halaman dibuka dari detail tiket, langsung scroll ke tiket yang dipilih
  useEffect(() => {
    if (selected && tickets.some((t) => t.name === selected)) {
      setActiveName(selected);
      scrollToTicket(selected);
    }
  }, [selected]);

  const handleBuy = (ticket: Ticket) => {
    const qty = quantities[ticket.name] ?? 1;
    // Mulai hitung mundur 15 menit; dilanjutkan di halaman berikutnya
    startPaymentTimer();
    router.push(
      `/input-data-pribadi?ticket=${encodeURIComponent(ticket.name)}&qty=${qty}`
    );
  };

  return (
    <main className="min-h-screen bg-white text-black">
      {/* ================= NAVBAR ================= */}
      <HomeNavbar />

      {/* ================= BANNER EVENT ================= */}
      <EventBanner
        image="/image/snada-event.png"
        title="Snada Indonesia - 2026"
        location="Istora Senayan, Jakarta Pusat"
        date="Sabtu, 10 October 2026 - 22.00 WIB"
        price="Rp750.000"
        category="Konser Musik Pop"
      />

      {/* ================= JUDUL SECTION ================= */}
      <div className="mx-auto max-w-[1450px] px-5 pt-8 lg:px-10">
        <h2 className="flex items-center gap-4 text-lg font-bold md:text-xl">
          <GradientIcon type="fileText" size={25} />
          Penjualan Umum – Semua Metode Pembayaran
        </h2>
      </div>

      {/* ================= KONTEN ================= */}
      <div className="mx-auto grid max-w-[1450px] grid-cols-1 items-start gap-8 px-5 py-6 lg:grid-cols-2 lg:gap-9 lg:px-10">
        {/* ================= KOLOM KIRI: KARTU TIKET ================= */}
        <div className="min-w-0 space-y-5">
          {tickets.map((ticket) => {
            const qty = quantities[ticket.name] ?? 1;
            const isSelected = activeName === ticket.name;

            return (
              <article
                key={ticket.name}
                id={slug(ticket.name)}
                onClick={() => selectTicket(ticket.name)}
                className={`relative scroll-mt-24 cursor-pointer rounded-xl border bg-white transition-all duration-200 ${
                  isSelected
                    ? "border-purple-500 shadow-[0_6px_14px_-4px_rgba(124,58,237,0.45)]"
                    : "border-pink-300 hover:border-purple-400 hover:shadow-md"
                }`}
              >
                {/* BAGIAN ATAS: BENEFIT */}
                <div className="px-5 pb-4 pt-5">
                  <h3 className="text-sm font-bold">{ticket.name}</h3>

                  <ul className="mt-2 list-disc space-y-1 pl-6 text-sm leading-snug">
                    {ticket.benefits.map((benefit) => (
                      <li key={benefit}>{benefit}</li>
                    ))}
                  </ul>

                  <p className="mt-5 flex items-center gap-2 text-xs font-medium text-purple-800">
                    <GradientIcon type="clock" size={17} />
                    Penjualan berakhir pada 9 Okt 2026 • 23:59
                  </p>
                </div>

                {/* GARIS PUTUS-PUTUS + LEKUKAN TIKET */}
                <div className="relative">
                  <div className="border-t border-dashed border-pink-300" />
                  <span
                    aria-hidden="true"
                    className="absolute -left-[13px] top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border border-pink-300 bg-white [clip-path:inset(0_0_0_50%)]"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute -right-[13px] top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border border-pink-300 bg-white [clip-path:inset(0_50%_0_0)]"
                  />
                </div>

                {/* BAGIAN BAWAH: HARGA + JUMLAH */}
                <div className="flex items-center justify-between gap-3 px-5 py-4">
                  <p className="text-sm font-medium">{formatPrice(ticket.price)}</p>

                  <div className="min-w-0 flex-1 px-2">
                    <p className="text-sm font-medium">{ticket.name}</p>
                    <p className="text-[11px] font-bold text-purple-800">
                      {ticket.stock} Kursi Tersisa
                    </p>
                  </div>

                  <div className="relative w-[100px] shrink-0 md:w-[100px]">
                    <select
                      aria-label={`Jumlah tiket ${ticket.name}`}
                      value={qty}
                      onChange={(e) =>
                        setQuantities((prev) => ({
                          ...prev,
                          [ticket.name]: Number(e.target.value),
                        }))
                      }
                      className="w-full cursor-pointer appearance-none rounded-lg border border-pink-300 bg-white py-2.5 pl-5 pr-9 text-base outline-none transition hover:bg-pink-50 focus:border-pink-500"
                    >
                      {Array.from(
                        { length: Math.min(MAX_QTY, ticket.stock) },
                        (_, i) => i + 1
                      ).map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>

                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                      <GradientIcon type="chevronDown" size={17} color="#4B5563" />
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* ================= KOLOM KANAN: DAFTAR KATEGORI ================= */}
        <aside className="min-w-0 lg:sticky lg:top-6">
          <div className="overflow-hidden rounded-xl border border-purple-300 bg-white">
            {tickets.map((ticket, index) => {
              const isActive = activeName === ticket.name;
              const qty = quantities[ticket.name] ?? 1;

              return (
                <div
                  key={ticket.name}
                  className={index !== tickets.length - 1 ? "border-b border-purple-300" : ""}
                >
                  {/* BARIS KATEGORI */}
                  <button
                    onClick={() => selectTicket(ticket.name, true)}
                    aria-expanded={isActive}
                    className={`flex w-full items-center justify-between gap-3 px-5 text-left transition md:px-6 ${
                      isActive
                        ? "pb-2 pt-5 hover:bg-transparent"
                        : "py-4 hover:bg-purple-50 md:py-[18px]"
                    }`}
                  >
                    <span
                      className={`text-sm md:text-base ${
                        isActive ? "font-bold text-purple-800" : "font-medium"
                      }`}
                    >
                      {ticket.name}
                    </span>
                    <span className="text-sm font-semibold text-purple-800 md:text-base">
                      {ticket.stock} Kursi Tersisa
                    </span>
                  </button>

                  {/* DETAIL (muncul saat aktif) */}
                  {isActive && (
                    <div className="px-5 pb-5 md:px-6">
                      <p className="flex items-center gap-2 text-sm">
                        <GradientIcon type="calendar" size={16} />
                        Tanggal Acara
                      </p>

                      <div className="mt-2 inline-flex flex-col items-center rounded-lg border border-purple-300 px-4 py-1.5 text-center text-sm leading-tight">
                        <span>10</span>
                        <span>Oktober 2026</span>
                      </div>

                      <p className="mt-3 flex items-center gap-3 text-sm">
                        <span>Masa berlaku:</span>
                        <span className="italic text-pink-600">10 Oktober 2026</span>
                      </p>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <p className="text-sm">
                          Total ({qty} Tiket):{" "}
                          <span className="font-medium italic text-pink-600">
                            {formatPrice(ticket.price * qty)}
                          </span>
                        </p>

                        <button
                          onClick={() => handleBuy(ticket)}
                          className="rounded-lg border border-pink-400 px-6 py-2 text-sm font-bold text-pink-600 transition hover:bg-pink-50"
                        >
                          Beli Tiket
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  // useSearchParams di App Router harus dibungkus Suspense
  return (
    <Suspense fallback={null}>
      <CheckoutContent />
    </Suspense>
  );
}