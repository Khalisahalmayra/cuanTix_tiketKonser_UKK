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

type Review = {
  id: number;
  event: string;
  tanggal: string;
  rating: number;
  isi: string;
};

// TODO: ganti dengan data ulasan asli dari backend (per user)
const INITIAL_REVIEWS: Review[] = [
  {
    id: 1,
    event: "Seminar Teknologi 2026",
    tanggal: "31 Okt 2026",
    rating: 5,
    isi: "Pembicaranya berkualitas dan acaranya tertata rapi. Pasti ikut lagi tahun depan.",
  },
  {
    id: 2,
    event: "Festival Kuliner Nusantara",
    tanggal: "14 Okt 2026",
    rating: 3,
    isi: "Pilihan makanannya banyak, tapi antreannya cukup panjang di jam makan siang.",
  },
];

function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`Rating ${value} dari 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill={i <= value ? "#E91E8C" : "#E5E7EB"}
        >
          <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z" />
        </svg>
      ))}
    </div>
  );
}

export default function UlasanPage() {
  const router = useRouter();

  // TODO: ganti dengan data user asli dari session/auth
  const [user] = useState<AccountUser>({
    nama: "Iput Cantik",
    tipe: "Personal",
    foto: "/image/avatar.png",
  });

  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  function handleRemove(id: number) {
    // TODO: panggil API hapus ulasan
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2]" style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}>
      <HomeNavbar />

      <main className="flex flex-col gap-8 px-5 py-8 sm:px-8 lg:flex-row lg:px-16">
        {/* SIDEBAR */}
        <AccountSidebar user={user} active="ulasanSaya" />

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
            Ulasan Saya
          </h1>
          <p className="mt-1 text-[13px] text-gray-700">
            {reviews.length > 0
              ? `${reviews.length} ulasan`
              : "Ulasan yang kamu tulis akan muncul di sini"}
          </p>

          {reviews.length === 0 ? (
            /* KOSONG */
            <section className="mt-6 flex flex-col items-center gap-3 rounded-[10px] bg-white px-6 py-16 text-center shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
              <GradientIcon type="messageSquare" size={48} />
              <p className="text-[15px] font-bold text-gray-900">Belum ada ulasan</p>
              <p className="max-w-sm text-[12px] text-gray-600">
                Ulasan yang kamu tulis setelah acara selesai akan muncul di sini.
              </p>
              <button
                onClick={() => router.push("/akun/pesanan")}
                className="mt-2 h-[36px] rounded-full px-8 text-[13px] font-semibold text-white shadow-md transition-opacity hover:opacity-90"
                style={{ background: BUTTON_PINK }}
              >
                Lihat Pesanan
              </button>
            </section>
          ) : (
            /* DAFTAR */
            <section className="mt-6 flex flex-col gap-5">
              {reviews.map((r) => (
                <article
                  key={r.id}
                  className="rounded-[10px] bg-white p-5 shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-[14px] font-bold text-gray-900">{r.event}</h2>
                      <div className="mt-1 flex items-center gap-2">
                        <Stars value={r.rating} />
                        <span className="text-[12px] text-gray-500">{r.tanggal}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => router.push(`/akun/ulasan/${r.id}/edit`)}
                        className="rounded-full bg-white px-4 py-1.5 text-[12px] font-semibold text-[#6D28D9] transition-colors hover:bg-[#F3EBFF]"
                        style={OUTLINE_STYLE}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(r.id)}
                        className="rounded-full bg-white px-4 py-1.5 text-[12px] font-semibold text-[#E91E8C] transition-colors hover:bg-[#FFF0F8]"
                        style={OUTLINE_STYLE}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>

                  <p className="mt-3 text-[13px] leading-relaxed text-gray-700">{r.isi}</p>
                </article>
              ))}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}