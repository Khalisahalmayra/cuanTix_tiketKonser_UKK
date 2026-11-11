"use client";

import { useState } from "react";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import GradientIcon from "@/components/icon/GradientIcon";
import AccountSidebar, { type AccountUser } from "@/components/account/AccountSidebar";

const BORDER_GRADIENT = "linear-gradient(90deg,#7C3AED 0%,#E91E8C 100%)";
const TITLE_GRADIENT = "linear-gradient(90deg,#E91E8C 0%,#5B1AA8 100%)";

type TrxStatus = "berhasil" | "menunggu" | "gagal";
type FilterId = "semua" | TrxStatus;

type Transaction = {
  id: string;
  title: string;
  date: string;
  method: string;
  amount: number;
  status: TrxStatus;
};

// TODO: ganti dengan data transaksi asli dari backend (per user)
const TRANSACTIONS: Transaction[] = [
  {
    id: "TRX-20261105-001",
    title: "Tiket Konser Musik Akhir Tahun x2",
    date: "5 Nov 2026, 19:42",
    method: "GoPay",
    amount: 700000,
    status: "berhasil",
  },
  {
    id: "TRX-20261101-014",
    title: "Tiket Festival Kuliner Nusantara",
    date: "1 Nov 2026, 10:15",
    method: "Transfer BCA",
    amount: 150000,
    status: "menunggu",
  },
  {
    id: "TRX-20261022-007",
    title: "Tiket Seminar Teknologi 2026",
    date: "22 Okt 2026, 08:03",
    method: "Kartu Kredit",
    amount: 250000,
    status: "gagal",
  },
];

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "semua", label: "Semua" },
  { id: "berhasil", label: "Berhasil" },
  { id: "menunggu", label: "Menunggu" },
  { id: "gagal", label: "Gagal" },
];

const STATUS_META: Record<TrxStatus, { label: string; className: string }> = {
  berhasil: { label: "Berhasil", className: "bg-green-50 text-green-700" },
  menunggu: { label: "Menunggu Pembayaran", className: "bg-amber-50 text-amber-700" },
  gagal: { label: "Gagal", className: "bg-red-50 text-red-600" },
};

const formatPrice = (price: number) => "Rp" + price.toLocaleString("id-ID");

export default function RiwayatTransaksiPage() {
  // TODO: ganti dengan data user asli dari session/auth
  const [user] = useState<AccountUser>({
    nama: "Iput Cantik",
    tipe: "Personal",
    foto: "/image/avatar.png",
  });

  const [filter, setFilter] = useState<FilterId>("semua");

  const filtered = TRANSACTIONS.filter((t) => filter === "semua" || t.status === filter);

  return (
    <div className="min-h-screen bg-[#F2F2F2]" style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}>
      <HomeNavbar />

      <main className="flex flex-col gap-8 px-5 py-8 sm:px-8 lg:flex-row lg:px-16">
        {/* SIDEBAR */}
        <AccountSidebar user={user} active="riwayatTransaksi" />

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
            Riwayat Transaksi
          </h1>
          <p className="mt-1 text-[13px] text-gray-700">
            Semua pembayaran yang pernah kamu lakukan.
          </p>

          {/* Filter */}
          <div
            role="tablist"
            aria-label="Filter transaksi"
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
              <GradientIcon type="fileText" size={48} />
              <p className="text-[15px] font-bold text-gray-900">
                {filter === "semua"
                  ? "Belum ada transaksi"
                  : "Tidak ada transaksi di filter ini"}
              </p>
              <p className="max-w-sm text-[12px] text-gray-600">
                Riwayat pembayaranmu akan muncul di sini.
              </p>
            </section>
          ) : (
            /* DAFTAR */
            <section className="mt-6 overflow-hidden rounded-[10px] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
              <ul className="divide-y divide-gray-100">
                {filtered.map((t) => {
                  const meta = STATUS_META[t.status];
                  return (
                    <li
                      key={t.id}
                      className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-bold text-gray-900">{t.title}</p>
                        <p className="mt-0.5 text-[12px] text-gray-500">
                          {t.id} · {t.date}
                        </p>
                        <p className="text-[12px] text-gray-500">{t.method}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <p className="text-[14px] font-bold" style={{ color: "#E91E8C" }}>
                          {formatPrice(t.amount)}
                        </p>
                        <span
                          className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${meta.className}`}
                        >
                          {meta.label}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}