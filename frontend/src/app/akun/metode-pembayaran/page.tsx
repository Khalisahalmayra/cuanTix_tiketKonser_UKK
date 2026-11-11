"use client";

import { useState } from "react";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import GradientIcon, { type GradientIconType } from "@/components/icon/GradientIcon";
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

type MethodType = "kartu" | "ewallet" | "bank";

type PaymentMethod = {
  id: number;
  type: MethodType;
  nama: string;
  detail: string;
  utama: boolean;
};

const METHOD_ICON: Record<MethodType, GradientIconType> = {
  kartu: "creditCard",
  ewallet: "wallet",
  bank: "landmark",
};

// TODO: ganti dengan data metode pembayaran asli dari backend (per user)
const INITIAL_METHODS: PaymentMethod[] = [
  { id: 1, type: "kartu", nama: "Visa", detail: "•••• •••• •••• 4417", utama: true },
  { id: 2, type: "ewallet", nama: "GoPay", detail: "0812 •••• 7890", utama: false },
  { id: 3, type: "bank", nama: "BCA", detail: "Rek. •••• 2231", utama: false },
];

export default function MetodePembayaranPage() {
  // TODO: ganti dengan data user asli dari session/auth
  const [user] = useState<AccountUser>({
    nama: "Iput Cantik",
    tipe: "Personal",
    foto: "/image/avatar.png",
  });

  const [methods, setMethods] = useState<PaymentMethod[]>(INITIAL_METHODS);

  function handleSetDefault(id: number) {
    // TODO: panggil API ubah metode utama
    setMethods((prev) => prev.map((m) => ({ ...m, utama: m.id === id })));
  }

  function handleRemove(id: number) {
    // TODO: panggil API hapus metode pembayaran
    setMethods((prev) => prev.filter((m) => m.id !== id));
  }

  function handleAdd() {
    // TODO: buka modal / arahkan ke form tambah metode pembayaran
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2]" style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}>
      <HomeNavbar />

      <main className="flex flex-col gap-8 px-5 py-8 sm:px-8 lg:flex-row lg:px-16">
        {/* SIDEBAR */}
        <AccountSidebar user={user} active="metodePembayaran" />

        {/* KONTEN */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1
                className="inline-block text-[22px] font-bold"
                style={{
                  backgroundImage: TITLE_GRADIENT,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Metode Pembayaran
              </h1>
              <p className="mt-1 text-[13px] text-gray-700">
                {methods.length > 0
                  ? `${methods.length} metode tersimpan`
                  : "Simpan metode pembayaran favoritmu di sini"}
              </p>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className="flex h-[36px] items-center gap-2 rounded-full px-5 text-[13px] font-semibold text-white shadow-md transition-opacity hover:opacity-90"
              style={{ background: BUTTON_PINK }}
            >
              <GradientIcon type="plusCircle" size={16} color="#ffffff" />
              Tambah Metode
            </button>
          </div>

          {methods.length === 0 ? (
            /* KOSONG */
            <section className="mt-6 flex flex-col items-center gap-3 rounded-[10px] bg-white px-6 py-16 text-center shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
              <GradientIcon type="creditCard" size={48} />
              <p className="text-[15px] font-bold text-gray-900">
                Belum ada metode pembayaran
              </p>
              <p className="max-w-sm text-[12px] text-gray-600">
                Tambahkan metode pembayaran agar checkout lebih cepat.
              </p>
              <button
                type="button"
                onClick={handleAdd}
                className="mt-2 h-[36px] rounded-full px-8 text-[13px] font-semibold text-white shadow-md transition-opacity hover:opacity-90"
                style={{ background: BUTTON_PINK }}
              >
                Tambah Metode
              </button>
            </section>
          ) : (
            /* DAFTAR */
            <section className="mt-6 overflow-hidden rounded-[10px] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
              <ul className="divide-y divide-gray-100">
                {methods.map((m) => (
                  <li
                    key={m.id}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F3EBFF]">
                        <GradientIcon type={METHOD_ICON[m.type]} size={22} />
                      </span>
                      <div className="min-w-0">
                        <p className="flex items-center gap-2 text-[14px] font-bold text-gray-900">
                          {m.nama}
                          {m.utama && (
                            <span className="rounded-full bg-[#FFD6E8] px-2.5 py-0.5 text-[11px] font-semibold text-[#E91E8C]">
                              Utama
                            </span>
                          )}
                        </p>
                        <p className="text-[12px] text-gray-500">{m.detail}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {!m.utama && (
                        <button
                          type="button"
                          onClick={() => handleSetDefault(m.id)}
                          className="rounded-full bg-white px-4 py-1.5 text-[12px] font-semibold text-[#6D28D9] transition-colors hover:bg-[#F3EBFF]"
                          style={OUTLINE_STYLE}
                        >
                          Jadikan Utama
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemove(m.id)}
                        className="rounded-full bg-white px-4 py-1.5 text-[12px] font-semibold text-[#E91E8C] transition-colors hover:bg-[#FFF0F8]"
                        style={OUTLINE_STYLE}
                      >
                        Hapus
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}