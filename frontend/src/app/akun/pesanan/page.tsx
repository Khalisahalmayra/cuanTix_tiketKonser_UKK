"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import GradientIcon from "@/components/icon/GradientIcon";
import AccountSidebar, { type AccountUser } from "@/components/account/AccountSidebar";

const BORDER_GRADIENT = "linear-gradient(90deg,#7C3AED 0%,#E91E8C 100%)";
const TITLE_GRADIENT = "linear-gradient(90deg,#E91E8C 0%,#5B1AA8 100%)";
const BUTTON_PINK = "#EC407A";

const OUTLINE_STYLE = {
  border: "1.5px solid transparent",
  backgroundImage: `linear-gradient(white, white), ${BORDER_GRADIENT}`,
  backgroundOrigin: "border-box" as const,
  backgroundClip: "padding-box, border-box",
};

type OrderStatus = "aktif" | "selesai" | "dibatalkan";
type FilterId = "semua" | OrderStatus;

type Order = {
  id: string;
  event: string;
  tanggal: string;
  lokasi: string;
  jumlah: number;
  total: number;
  status: OrderStatus;
};

// TODO: ganti dengan data pesanan asli dari backend (per user)
const ORDERS: Order[] = [
  {
    id: "ORD-88120",
    event: "Konser Musik Akhir Tahun",
    tanggal: "20 Des 2026, 19:00",
    lokasi: "Istora Senayan, Jakarta Pusat",
    jumlah: 2,
    total: 700000,
    status: "aktif",
  },
  {
    id: "ORD-87004",
    event: "Seminar Teknologi 2026",
    tanggal: "30 Okt 2026, 09:00",
    lokasi: "Balai Kartini, Jakarta Selatan",
    jumlah: 1,
    total: 250000,
    status: "selesai",
  },
  {
    id: "ORD-86311",
    event: "Festival Kuliner Nusantara",
    tanggal: "12 Okt 2026, 11:00",
    lokasi: "JIExpo Kemayoran, Jakarta Pusat",
    jumlah: 3,
    total: 450000,
    status: "dibatalkan",
  },
];

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "semua", label: "Semua" },
  { id: "aktif", label: "Aktif" },
  { id: "selesai", label: "Selesai" },
  { id: "dibatalkan", label: "Dibatalkan" },
];

const STATUS_META: Record<OrderStatus, { label: string; className: string }> = {
  aktif: { label: "Aktif", className: "bg-[#F3EBFF] text-[#6D28D9]" },
  selesai: { label: "Selesai", className: "bg-green-50 text-green-700" },
  dibatalkan: { label: "Dibatalkan", className: "bg-red-50 text-red-600" },
};

const formatPrice = (price: number) => "Rp" + price.toLocaleString("id-ID");

export default function PesananPage() {
  const router = useRouter();

  // TODO: ganti dengan data user asli dari session/auth
  const [user] = useState<AccountUser>({
    nama: "Iput Cantik",
    tipe: "Personal",
    foto: "/image/avatar.png",
  });

  const [filter, setFilter] = useState<FilterId>("semua");

  const filtered = ORDERS.filter((o) => filter === "semua" || o.status === filter);

  return (
    <div className="min-h-screen bg-[#F2F2F2]" style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}>
      <HomeNavbar />

      <main className="flex flex-col gap-8 px-5 py-8 sm:px-8 lg:flex-row lg:px-16">
        {/* SIDEBAR */}
        <AccountSidebar user={user} active="pesananKamu" />

        {/* KONTEN */}
        <div className="min-w-0 flex-1">
          <h1
            className="inline-block text-[22px] font-bold"
            style={{
              backgroundImage: TITLE_GRADIENT,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Pesanan Kamu
          </h1>
          <p className="mt-1 text-[13px] text-gray-700">
            {ORDERS.length > 0
              ? `${ORDERS.length} pesanan`
              : "Tiket dan pesananmu akan muncul di sini"}
          </p>

          {/* Filter */}
          <div
            role="tablist"
            aria-label="Filter pesanan"
            className="mt-5 flex gap-2 overflow-x-auto pb-1"
          >
            {FILTERS.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(f.id)}
                  className="shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-[12px] font-semibold transition-colors"
                  style={{
                    color: active ? "#ffffff" : "#6D28D9",
                    border: "1.5px solid transparent",
                    backgroundImage: active
                      ? `${BORDER_GRADIENT}`
                      : `linear-gradient(white, white), ${BORDER_GRADIENT}`,
                    backgroundOrigin: "border-box",
                    backgroundClip: active ? "border-box" : "padding-box, border-box",
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {filtered.length === 0 ? (
            /* KOSONG */
            <section className="mt-6 flex flex-col items-center gap-3 rounded-[10px] bg-white px-6 py-16 text-center shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
              <GradientIcon type="ticket" size={48} />
              <p className="text-[15px] font-bold text-gray-900">
                {filter === "semua"
                  ? "Belum ada pesanan"
                  : "Tidak ada pesanan di filter ini"}
              </p>
              <p className="max-w-sm text-[12px] text-gray-600">
                Tiket dan pesananmu akan muncul di sini.
              </p>
              {filter === "semua" && (
                <button
                  onClick={() => router.push("/home")}
                  className="mt-2 h-[36px] rounded-full px-8 text-[13px] font-semibold text-white shadow-md transition-opacity hover:opacity-90"
                  style={{ background: BUTTON_PINK }}
                >
                  Cari Event
                </button>
              )}
            </section>
          ) : (
            /* DAFTAR */
            <section className="mt-6 flex flex-col gap-5">
              {filtered.map((o) => {
                const meta = STATUS_META[o.status];
                return (
                  <article
                    key={o.id}
                    className="overflow-hidden rounded-[10px] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-5 py-3">
                      <p className="text-[12px] text-gray-500">No. Pesanan {o.id}</p>
                      <span
                        className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${meta.className}`}
                      >
                        {meta.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 p-5">
                      <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <h2 className="text-[14px] font-bold text-gray-900">{o.event}</h2>
                        <p className="flex items-center gap-2 text-[12px] text-gray-700">
                          <GradientIcon type="mapPin" size={14} color="#6B7280" />
                          {o.lokasi}
                        </p>
                        <p className="flex items-center gap-2 text-[12px] text-gray-700">
                          <GradientIcon type="calendar" size={14} color="#6B7280" />
                          {o.tanggal}
                        </p>
                        <p className="text-[12px] text-gray-500">{o.jumlah} tiket</p>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <p className="text-[12px] text-gray-500">
                          Total{" "}
                          <span className="text-[14px] font-bold" style={{ color: "#E91E8C" }}>
                            {formatPrice(o.total)}
                          </span>
                        </p>
                        {o.status === "aktif" && (
                          <button
                            onClick={() => router.push(`/akun/pesanan/${o.id}`)}
                            className="h-[36px] rounded-full px-8 text-[13px] font-semibold text-white shadow-md transition-opacity hover:opacity-90"
                            style={{ background: BUTTON_PINK }}
                          >
                            Lihat Tiket
                          </button>
                        )}
                        {o.status === "selesai" && (
                          <button
                            onClick={() => router.push(`/akun/pesanan/${o.id}/ulasan`)}
                            className="rounded-full bg-white px-5 py-2 text-[12px] font-semibold text-[#6D28D9] transition-colors hover:bg-[#F3EBFF]"
                            style={OUTLINE_STYLE}
                          >
                            Beri Ulasan
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}