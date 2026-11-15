"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import GradientIcon from "@/components/icon/GradientIcon";
import EventBanner from "@/components/banner/EventBanner";
import WishlistButton from "@/components/wishlist/WishlistButton";
import EventDescription from "@/components/event-detail/EventDescription";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// Gambar cadangan kalau event belum punya banner / poster
const FALLBACK_IMAGE = "/image/snada-event.png";

type TicketType = {
  id: string | number;
  name: string;
  price: number;
  available: number;
};

// Bentuk respons GET /api/events/:slug
type EventDetail = {
  id: string | number;
  slug: string;
  title: string;
  description: string | null;
  image: string | null;
  poster: string | null;
  city: string;
  venue: string;
  date: string; // ISO (start_at)
  category: string;
  organizer: string;
  tickets: TicketType[];
  // Belum dikirim backend. Kalau nanti ditambahkan, otomatis tampil.
  denah?: string | null;
  terms?: string[] | null;
};

const tabs = [
  { id: "kategori", label: "Kategori & Harga" },
  { id: "syarat", label: "Syarat & Ketentuan" },
  { id: "lokasi", label: "Lokasi" },
];

const formatPrice = (price: number) => "Rp" + price.toLocaleString("id-ID");

// "Sabtu, 10 Oktober 2026 - 22.00 WIB"
function formatEventDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  const tanggal = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(d);
  const jam = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  }).format(d);
  return `${tanggal} - ${jam} WIB`;
}

export default function DetailTiketPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<"notfound" | "failed" | null>(null);

  const [showAll, setShowAll] = useState(false);
  const [activeTab, setActiveTab] = useState("kategori");

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/api/events/${encodeURIComponent(slug)}`);
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
  }, [slug]);

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  /* ---------- Loading / error ---------- */
  if (loading || error || !event) {
    return (
      <main className="min-h-screen bg-white text-black">
        <HomeNavbar />
        <div className="mx-auto flex max-w-[600px] flex-col items-center gap-3 px-6 py-24 text-center">
          {loading ? (
            <p className="text-sm text-gray-500">Memuat detail event…</p>
          ) : (
            <>
              <GradientIcon type="ticket" size={48} />
              <h1 className="text-lg font-bold">
                {error === "notfound"
                  ? "Event tidak ditemukan"
                  : "Gagal memuat event"}
              </h1>
              <p className="text-sm text-gray-600">
                {error === "notfound"
                  ? "Event ini mungkin sudah tidak tersedia."
                  : "Periksa koneksi atau pastikan server backend sedang berjalan."}
              </p>
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
  const visibleTickets = showAll ? tickets : tickets.slice(0, 5);

  const prices = tickets.map((t) => t.price);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const totalAvailable = tickets.reduce((sum, t) => sum + Math.max(0, t.available), 0);

  const lokasi = [event.venue, event.city].filter(Boolean).join(", ");
  const tanggal = formatEventDate(event.date);
  const poster = event.poster || event.image || FALLBACK_IMAGE;
  const banner = event.image || event.poster || FALLBACK_IMAGE;
  const mapQuery = encodeURIComponent(lokasi);

  const descriptionParagraphs = (event.description ?? "")
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-white text-black">
      {/* ================= NAVBAR ================= */}
      <HomeNavbar />

      {/* BANNER EVENT */}
      <EventBanner
        image={banner}
        title={event.title}
        location={lokasi}
        date={tanggal}
        price={formatPrice(minPrice)}
        category={event.category}
      />

      {/* ================= NAVIGASI TAB ================= */}
      <nav className="sticky top-0 z-30 mt-5 border-y border-purple-300 bg-white">
        <div className="mx-auto flex max-w-[1450px] gap-8 overflow-x-auto px-6 md:gap-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => scrollToSection(tab.id)}
              className={`whitespace-nowrap border-b-2 px-2 py-4 text-sm font-bold transition md:text-base ${
                activeTab === tab.id
                  ? "border-pink-500 text-pink-600"
                  : "border-transparent text-purple-800 hover:text-pink-500"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ================= KONTEN UTAMA ================= */}
      <div className="mx-auto grid max-w-[1450px] grid-cols-1 gap-8 px-5 py-6 lg:grid-cols-2 lg:gap-9 lg:px-10">
        {/* ================= KOLOM KIRI ================= */}
        <div className="min-w-0">
          {/* Line-up dan kredit belum ada di backend, jadi dikirim kosong */}
          <EventDescription
            description={descriptionParagraphs}
            lineup={[]}
            credits={[]}
          />

          {/* ================= KATEGORI & HARGA ================= */}
          <section id="kategori" className="scroll-mt-24">
            <h2 className="mb-6 flex items-center gap-4 text-xl font-bold">
              <GradientIcon type="ticket" size={25} />
              Kategori & Harga
            </h2>

            {event.denah ? (
              <img
                src={event.denah}
                alt={`Denah kategori tempat duduk ${event.title}`}
                className="mx-auto w-full max-w-[520px] rounded-sm object-contain"
              />
            ) : (
              <p className="text-[15px] text-gray-600">
                Pilih kategori tiket yang tersedia di panel sebelah kanan.
              </p>
            )}
          </section>

          {/* ================= SYARAT & KETENTUAN ================= */}
          <section id="syarat" className="mt-8 scroll-mt-24">
            <h2 className="mb-6 flex items-center gap-4 text-xl font-bold">
              <GradientIcon type="fileText" size={25} />
              Syarat & Ketentuan
            </h2>

            {event.terms && event.terms.length > 0 ? (
              <ul className="list-disc space-y-1 pl-6 text-[15px] leading-[1.65]">
                {event.terms.map((term, i) => (
                  <li key={i}>{term}</li>
                ))}
              </ul>
            ) : (
              <p className="text-[15px] leading-[1.65] text-gray-600">
                Dengan membeli tiket {event.title}, Anda menyetujui syarat dan
                ketentuan yang ditetapkan penyelenggara. Hubungi penyelenggara
                atau Pusat Bantuan untuk informasi lebih lanjut.
              </p>
            )}
          </section>

          {/* ================= LOKASI ================= */}
          <section id="lokasi" className="mt-10 scroll-mt-24">
            <h2 className="mb-6 flex items-center gap-4 text-xl font-bold">
              <GradientIcon type="mapPin" size={25} />
              Lokasi
            </h2>

            <div className="relative h-[195px] w-full overflow-hidden rounded-xl border border-gray-200">
              {/* GOOGLE MAPS */}
              <iframe
                title={`Lokasi ${event.venue}`}
                src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* OVERLAY BAGIAN BAWAH */}
              <div className="absolute bottom-0 left-0 right-0 flex min-h-[92px] items-center justify-between gap-3 bg-black/55 px-5 py-3 text-white backdrop-blur-[2px]">
                <div className="flex min-w-0 items-center gap-2">
                  <GradientIcon type="mapPin" size={19} color="#ffffff" />
                  <p className="text-sm font-medium md:text-base">{lokasi}</p>
                </div>

                <div className="flex shrink-0 items-center gap-4 md:gap-8">
                  {/* LIHAT MAP */}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 transition hover:scale-105"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-pink-500 bg-white">
                      <GradientIcon type="navigation" size={23} />
                    </div>
                    <span className="text-xs font-semibold">Lihat Map</span>
                  </a>

                  {/* ARAHKAN */}
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 transition hover:scale-105"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-pink-500 bg-white">
                      <GradientIcon type="mapPinned" size={23} />
                    </div>
                    <span className="text-xs font-semibold">Arahkan</span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ================= KOLOM KANAN ================= */}
        <aside className="min-w-0">
          <div className="overflow-hidden rounded-2xl border-[5px] border-purple-100 bg-white shadow-lg">
            {/* POSTER EVENT */}
            <div className="relative">
              <img
                src={poster}
                alt={event.title}
                className="aspect-[1.7/1] w-full object-cover"
              />
              <WishlistButton eventId={String(event.id)} />
            </div>

            {/* HARGA TIKET */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-5 md:px-8">
              <div>
                <p className="flex items-center gap-2 font-medium">
                  <GradientIcon type="ticket" size={20} color="#000000" />
                  Harga Tiket Dimulai dari
                </p>
                <p className="text-sm">
                  <i>{formatPrice(minPrice)}</i> | {totalAvailable} Tiket Tersedia
                </p>
              </div>

              <button
                onClick={() => router.push(`/checkout?event=${encodeURIComponent(event.slug)}`)}
                disabled={totalAvailable === 0}
                className="rounded-lg border border-pink-400 px-8 py-1.5 font-semibold text-pink-600 transition hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {totalAvailable === 0 ? "Habis" : "Beli Tiket"}
              </button>
            </div>

            {/* DETAIL EVENT */}
            <div className="space-y-3 px-7 pb-6 pt-1">
              <h2 className="text-lg font-bold">{event.title}</h2>

              <p className="flex items-center gap-2 text-sm">
                <GradientIcon type="mapPin" size={18} color="#000000" />
                {lokasi}
              </p>

              <p className="flex items-center gap-2 text-sm">
                <GradientIcon type="calendar" size={18} color="#000000" />
                {tanggal}
              </p>

              {event.organizer && (
                <p className="flex items-center gap-2 text-sm">
                  <GradientIcon type="users" size={18} color="#000000" />
                  {event.organizer}
                </p>
              )}

              {event.category && (
                <p className="flex items-center gap-2 text-sm">
                  <GradientIcon type="shapes" size={18} color="#000000" />
                  {event.category}
                </p>
              )}

              <p className="flex items-center gap-2 text-sm">
                <GradientIcon type="armchair" size={18} color="#000000" />
                {tickets.length} Kategori Tiket
              </p>
            </div>

            {/* ================= DAFTAR TIKET ================= */}
            <div className="border-t border-gray-400">
              {tickets.length === 0 && (
                <p className="px-5 py-6 text-center text-sm text-gray-500">
                  Belum ada tiket untuk event ini.
                </p>
              )}

              {visibleTickets.map((ticket) => {
                const available = Math.max(0, ticket.available);
                const soldOut = available === 0;
                return (
                  <div
                    key={ticket.id}
                    className="grid grid-cols-[105px_minmax(0,1fr)_88px] items-center gap-2 border-b border-gray-400 px-3 py-4 md:grid-cols-[120px_minmax(0,1fr)_95px] md:px-4"
                  >
                    {/* HARGA */}
                    <p className="text-sm font-medium">{formatPrice(ticket.price)}</p>

                    {/* INFORMASI TIKET */}
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{ticket.name}</p>
                      <p className="text-xs font-bold text-purple-800">
                        {soldOut ? "Habis" : `${available} Kursi Tersisa`}
                      </p>
                    </div>

                    {/* STATUS */}
                    <button
                      onClick={() =>
                        router.push(
                          `/checkout?event=${encodeURIComponent(event.slug)}&ticketId=${ticket.id}&ticket=${encodeURIComponent(ticket.name)}`
                        )
                      }
                      disabled={soldOut}
                      className="rounded-full border border-purple-400 bg-pink-50 px-2 py-2 text-xs font-medium text-pink-600 transition hover:bg-purple-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {soldOut ? "Habis" : "Tersedia"}
                    </button>
                  </div>
                );
              })}

              {/* TAMPILKAN LEBIH BANYAK */}
              {tickets.length > 5 && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="flex w-full items-center justify-center gap-2 py-5 text-sm font-semibold text-purple-800 transition hover:text-pink-600"
                >
                  {showAll ? "Tampilkan Lebih sedikit" : "Tampilkan Lebih banyak"}
                  <GradientIcon type="chevronDown" size={17} color="#7C3AED" />
                </button>
              )}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}