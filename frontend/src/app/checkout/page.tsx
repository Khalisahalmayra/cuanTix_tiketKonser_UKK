"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import GradientIcon from "@/components/icon/GradientIcon";
import EventBanner from "@/components/banner/EventBanner";
import { startPaymentTimer } from "@/hooks/usePaymentTimer";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// Gambar cadangan kalau event belum punya banner / poster
const FALLBACK_IMAGE = "/image/snada-event.png";

const MAX_QTY = 4;

type Ticket = {
  id: string | number;
  name: string;
  price: number;
  available: number;
  // Belum dikirim backend. Kalau nanti ditambahkan, otomatis tampil.
  benefits?: string[];
};

// Bentuk respons GET /api/events/:slug
type EventDetail = {
  id: string | number;
  slug: string;
  title: string;
  image: string | null;
  poster: string | null;
  city: string;
  venue: string;
  date: string; // ISO (start_at)
  category: string;
  tickets: Ticket[];
};

const formatPrice = (price: number) => "Rp" + price.toLocaleString("id-ID");

const ticketAnchor = (id: string | number) => `tiket-${id}`;

const TZ = "Asia/Jakarta";

// "Sabtu, 10 Oktober 2026 - 22.00 WIB"
function formatEventDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  const tanggal = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TZ,
  }).format(d);
  const jam = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: TZ,
  }).format(d);
  return `${tanggal} - ${jam} WIB`;
}

// { day: "10", monthYear: "Oktober 2026" }
function formatDateParts(iso: string): { day: string; monthYear: string } {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { day: "-", monthYear: "" };
  return {
    day: new Intl.DateTimeFormat("id-ID", { day: "numeric", timeZone: TZ }).format(d),
    monthYear: new Intl.DateTimeFormat("id-ID", {
      month: "long",
      year: "numeric",
      timeZone: TZ,
    }).format(d),
  };
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const eventSlug = searchParams.get("event");
  const selectedId = searchParams.get("ticketId");
  const selectedName = searchParams.get("ticket");

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<"noevent" | "notfound" | "failed" | null>(null);

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [activeId, setActiveId] = useState<string>("");

  const scrollToTicket = (id: string) => {
    document.getElementById(ticketAnchor(id))?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  // Dipanggil saat kartu kiri atau item kanan diklik
  const selectTicket = (id: string, scroll = false) => {
    setActiveId(id);
    if (scroll) scrollToTicket(id);
  };

  // Ambil detail event + daftar tiket dari backend
  useEffect(() => {
    if (!eventSlug) {
      setError("noevent");
      setLoading(false);
      return;
    }
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/api/events/${encodeURIComponent(eventSlug as string)}`);
        if (res.status === 404) {
          if (!cancelled) setError("notfound");
          return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: EventDetail = await res.json();
        if (!cancelled) setEvent(data);
      } catch {
        if (!cancelled) setError("failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [eventSlug]);

  // Setelah data masuk: pilih tiket dari query (?ticketId= atau ?ticket=), lalu scroll ke sana
  useEffect(() => {
    if (!event) return;
    const list = event.tickets ?? [];
    const found =
      list.find((t) => selectedId && String(t.id) === selectedId) ??
      list.find((t) => selectedName && t.name === selectedName);
    const target = found ?? list[0];
    if (target) {
      setActiveId(String(target.id));
      if (found) scrollToTicket(String(target.id));
    }
  }, [event, selectedId, selectedName]);

  const handleBuy = (ticket: Ticket) => {
  if (!event) return;

  const qty = quantities[String(ticket.id)] ?? 1;

  startPaymentTimer();

  router.push(
    `/input-data-pribadi?event=${encodeURIComponent(event.slug)}&eventId=${event.id}&ticketId=${ticket.id}&ticket=${encodeURIComponent(ticket.name)}&qty=${qty}`
  );
};

  /* ---------- Loading / error ---------- */
  if (loading || error || !event) {
    const message =
      error === "noevent"
        ? { title: "Pilih event dulu", desc: "Buka halaman detail event, lalu pilih kategori tiket." }
        : error === "notfound"
        ? { title: "Event tidak ditemukan", desc: "Event ini mungkin sudah tidak tersedia." }
        : { title: "Gagal memuat tiket", desc: "Periksa koneksi atau pastikan server backend sedang berjalan." };

    return (
      <main className="min-h-screen bg-white text-black">
        <HomeNavbar />
        <div className="mx-auto flex max-w-[600px] flex-col items-center gap-3 px-6 py-24 text-center">
          {loading ? (
            <p className="text-sm text-gray-500">Memuat tiket…</p>
          ) : (
            <>
              <GradientIcon type="ticket" size={48} />
              <h1 className="text-lg font-bold">{message.title}</h1>
              <p className="text-sm text-gray-600">{message.desc}</p>
              <button
                onClick={() => router.push("/home")}
                className="mt-2 h-[36px] rounded-full px-8 text-[13px] font-semibold text-white shadow-md transition-opacity hover:opacity-90"
                style={{ background: "#EC407A" }}
              >
                Kembali ke Beranda
              </button>
            </>
          )}
        </div>
      </main>
    );
  }

  /* ---------- Data turunan ---------- */
  const tickets = event.tickets ?? [];
  const prices = tickets.map((t) => t.price);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const lokasi = [event.venue, event.city].filter(Boolean).join(", ");
  const dateParts = formatDateParts(event.date);

  return (
    <main className="min-h-screen bg-white text-black">
      {/* ================= NAVBAR ================= */}
      <HomeNavbar />

      {/* ================= BANNER EVENT ================= */}
      <EventBanner
        image={event.image || event.poster || FALLBACK_IMAGE}
        title={event.title}
        location={lokasi}
        date={formatEventDate(event.date)}
        price={formatPrice(minPrice)}
        category={event.category}
      />

      {/* ================= JUDUL SECTION ================= */}
      <div className="mx-auto max-w-[1450px] px-5 pt-8 lg:px-10">
        <h2 className="flex items-center gap-4 text-lg font-bold md:text-xl">
          <GradientIcon type="fileText" size={25} />
          Penjualan Umum – Semua Metode Pembayaran
        </h2>
      </div>

      {tickets.length === 0 ? (
        <p className="mx-auto max-w-[1450px] px-5 py-10 text-center text-sm text-gray-500 lg:px-10">
          Belum ada tiket untuk event ini.
        </p>
      ) : (
        /* ================= KONTEN ================= */
        <div className="mx-auto grid max-w-[1450px] grid-cols-1 items-start gap-8 px-5 py-6 lg:grid-cols-2 lg:gap-9 lg:px-10">
          {/* ================= KOLOM KIRI: KARTU TIKET ================= */}
          <div className="min-w-0 space-y-5">
            {tickets.map((ticket) => {
              const id = String(ticket.id);
              const available = Math.max(0, ticket.available);
              const soldOut = available === 0;
              const qty = quantities[id] ?? 1;
              const isSelected = activeId === id;

              return (
                <article
                  key={id}
                  id={ticketAnchor(id)}
                  onClick={() => selectTicket(id)}
                  className={`relative scroll-mt-24 cursor-pointer rounded-xl border bg-white transition-all duration-200 ${
                    isSelected
                      ? "border-purple-500 shadow-[0_6px_14px_-4px_rgba(124,58,237,0.45)]"
                      : "border-pink-300 hover:border-purple-400 hover:shadow-md"
                  }`}
                >
                  {/* BAGIAN ATAS: NAMA + BENEFIT */}
                  <div className="px-5 pb-4 pt-5">
                    <h3 className="text-sm font-bold">{ticket.name}</h3>

                    {ticket.benefits && ticket.benefits.length > 0 && (
                      <ul className="mt-2 list-disc space-y-1 pl-6 text-sm leading-snug">
                        {ticket.benefits.map((benefit) => (
                          <li key={benefit}>{benefit}</li>
                        ))}
                      </ul>
                    )}

                    <p className="mt-5 flex items-center gap-2 text-xs font-medium text-purple-800">
                      <GradientIcon type="clock" size={17} />
                      Acara berlangsung {dateParts.day} {dateParts.monthYear}
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
                        {soldOut ? "Habis" : `${available} Kursi Tersisa`}
                      </p>
                    </div>

                    <div className="relative w-[100px] shrink-0 md:w-[100px]">
                      <select
                        aria-label={`Jumlah tiket ${ticket.name}`}
                        value={qty}
                        disabled={soldOut}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          setQuantities((prev) => ({
                            ...prev,
                            [id]: Number(e.target.value),
                          }))
                        }
                        className="w-full cursor-pointer appearance-none rounded-lg border border-pink-300 bg-white py-2.5 pl-5 pr-9 text-base outline-none transition hover:bg-pink-50 focus:border-pink-500 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {Array.from(
                          { length: Math.max(1, Math.min(MAX_QTY, available)) },
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
                const id = String(ticket.id);
                const available = Math.max(0, ticket.available);
                const soldOut = available === 0;
                const isActive = activeId === id;
                const qty = quantities[id] ?? 1;

                return (
                  <div
                    key={id}
                    className={index !== tickets.length - 1 ? "border-b border-purple-300" : ""}
                  >
                    {/* BARIS KATEGORI */}
                    <button
                      onClick={() => selectTicket(id, true)}
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
                        {soldOut ? "Habis" : `${available} Kursi Tersisa`}
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
                          <span>{dateParts.day}</span>
                          <span>{dateParts.monthYear}</span>
                        </div>

                        <p className="mt-3 flex items-center gap-3 text-sm">
                          <span>Masa berlaku:</span>
                          <span className="italic text-pink-600">
                            {dateParts.day} {dateParts.monthYear}
                          </span>
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
                            disabled={soldOut}
                            className="rounded-lg border border-pink-400 px-6 py-2 text-sm font-bold text-pink-600 transition hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {soldOut ? "Habis" : "Beli Tiket"}
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
      )}
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