"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import GradientIcon from "@/components/icon/GradientIcon";
import AccountSidebar, { type AccountUser } from "@/components/account/AccountSidebar";

const TITLE_GRADIENT = "linear-gradient(90deg,#E91E8C 0%,#5B1AA8 100%)";
const BUTTON_PINK = "#EC407A";

type WishlistItem = {
  id: number;
  nama: string;
  lokasi: string;
  tanggal: string;
  hargaMulai: number;
  poster: string;
  href: string; // halaman detail event
};

// TODO: ganti dengan data wishlist asli dari backend (per user)
const INITIAL_WISHLIST: WishlistItem[] = [
  {
    id: 1,
    nama: "Snada Indonesia - 2026",
    lokasi: "Istora Senayan, Jakarta Pusat",
    tanggal: "Sabtu, 10 Oktober 2026",
    hargaMulai: 750000,
    poster: "/image/snada-event.png",
    href: "/detail-tiket",
  },
  {
    id: 2,
    nama: "Konser Pop Akhir Tahun",
    lokasi: "Jakarta Convention Center",
    tanggal: "Sabtu, 28 November 2026",
    hargaMulai: 500000,
    poster: "/image/snada-event.png",
    href: "/detail-tiket",
  },
  {
    id: 3,
    nama: "Festival Musik Nusantara",
    lokasi: "GBK Senayan, Jakarta Pusat",
    tanggal: "Minggu, 13 Desember 2026",
    hargaMulai: 350000,
    poster: "/image/snada-event.png",
    href: "/detail-tiket",
  },
];

const formatPrice = (price: number) => "Rp" + price.toLocaleString("id-ID");

export default function WishlistPage() {
  const router = useRouter();

  // TODO: ganti dengan data user asli dari session/auth
  const [user] = useState<AccountUser>({
    nama: "Iput Cantik",
    tipe: "Personal",
    foto: "/image/avatar.png",
  });

  const [items, setItems] = useState<WishlistItem[]>(INITIAL_WISHLIST);

  function handleRemove(id: number) {
    // TODO: panggil API hapus dari wishlist
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2]" style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}>
      <HomeNavbar />

      <main className="flex flex-col gap-8 px-5 py-8 sm:px-8 lg:flex-row lg:px-16">
        {/* SIDEBAR */}
        <AccountSidebar user={user} active="wishlist" />

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
            Wishlist Kamu
          </h1>
          <p className="mt-1 text-[13px] text-gray-700">
            {items.length > 0
              ? `${items.length} event tersimpan`
              : "Simpan event favoritmu di sini"}
          </p>

          {items.length === 0 ? (
            /* KOSONG */
            <section className="mt-6 flex flex-col items-center gap-3 rounded-[10px] bg-white px-6 py-16 text-center shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
              <GradientIcon type="heart" size={48} />
              <p className="text-[15px] font-bold text-gray-900">
                Wishlist kamu masih kosong
              </p>
              <p className="max-w-sm text-[12px] text-gray-600">
                Tekan ikon hati pada event yang kamu suka, supaya mudah ditemukan
                lagi nanti.
              </p>
              <button
                onClick={() => router.push("/home")}
                className="mt-2 h-[36px] rounded-full px-8 text-[13px] font-semibold text-white shadow-md transition-opacity hover:opacity-90"
                style={{ background: BUTTON_PINK }}
              >
                Cari Event
              </button>
            </section>
          ) : (
            /* DAFTAR */
            <section className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col overflow-hidden rounded-[10px] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
                >
                  {/* Poster + tombol hati */}
                  <div className="relative">
                    <img
                      src={item.poster}
                      alt={item.nama}
                      className="aspect-[1.7/1] w-full object-cover"
                    />
                    <button
                      onClick={() => handleRemove(item.id)}
                      aria-label={`Hapus ${item.nama} dari wishlist`}
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md transition-transform hover:scale-105"
                    >
                      <GradientIcon type="heart" size={20} color="#E91E8C" />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <h2 className="text-[14px] font-bold text-gray-900">{item.nama}</h2>

                    <p className="flex items-center gap-2 text-[12px] text-gray-700">
                      <GradientIcon type="mapPin" size={14} color="#6B7280" />
                      {item.lokasi}
                    </p>
                    <p className="flex items-center gap-2 text-[12px] text-gray-700">
                      <GradientIcon type="calendar" size={14} color="#6B7280" />
                      {item.tanggal}
                    </p>

                    <p className="mt-1 text-[12px] text-gray-500">
                      Mulai dari{" "}
                      <span className="text-[14px] font-bold" style={{ color: "#E91E8C" }}>
                        {formatPrice(item.hargaMulai)}
                      </span>
                    </p>

                    <button
                      onClick={() => router.push(item.href)}
                      className="mt-auto h-[36px] rounded-full text-[13px] font-semibold text-white shadow-md transition-opacity hover:opacity-90"
                      style={{ background: BUTTON_PINK }}
                    >
                      Beli Tiket
                    </button>
                  </div>
                </article>
              ))}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}