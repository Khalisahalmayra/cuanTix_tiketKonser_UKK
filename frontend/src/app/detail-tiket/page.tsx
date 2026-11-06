
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import GradientIcon from "@/components/icon/GradientIcon";
import EventBanner from "@/components/banner/EventBanner";

const poster = "/image/snada-event.png";
const denah = "/image/denah-snada.png";

const tickets = [
  { name: "DIAMOND SPOT A", price: 6000000, stock: 30 },
  { name: "DIAMOND SPOT B", price: 6000000, stock: 30 },
  { name: "VIP", price: 2500000, stock: 50 },
  { name: "PLATINUM A", price: 1800000, stock: 60 },
  { name: "PLATINUM B", price: 1800000, stock: 60 },
  { name: "GOLD A", price: 1500000, stock: 60 },
  { name: "GOLD B", price: 1500000, stock: 60 },
  { name: "SILVER A", price: 1200000, stock: 60 },
  { name: "SILVER B", price: 1200000, stock: 60 },
  { name: "BRONZE A", price: 1000000, stock: 60 },
  { name: "BRONZE B", price: 1000000, stock: 60 },
  { name: "FESTIVAL", price: 750000, stock: 60 },
];

const formatPrice = (price: number) =>
  "Rp" + price.toLocaleString("id-ID");

export default function DetailTiketPage() {
  const router = useRouter();

  const [showAll, setShowAll] = useState(false);
  const [activeTab, setActiveTab] = useState("kategori");

  const visibleTickets = showAll
    ? tickets
    : tickets.slice(0, 5);

  const tabs = [
    { id: "kategori", label: "Kategori & Harga" },
    { id: "syarat", label: "Syarat & Ketentuan" },
    { id: "lokasi", label: "Lokasi" },
  ];

  const scrollToSection = (id: string) => {
    setActiveTab(id);

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="min-h-screen bg-white text-black">

      {/* ================= NAVBAR ================= */}
      <HomeNavbar />

    {/* BANNER EVENT */}
        <EventBanner
        image="/image/snada-event.png"
        title="Snada Indonesia - 2026"
        location="Istora Senayan, Jakarta Pusat"
        date="Sabtu, 10 October 2026 - 22.00 WIB"
        price="Rp750.000"
        category="Konser Musik Pop"
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

          {/* ================= KATEGORI & HARGA ================= */}
          <section
            id="kategori"
            className="scroll-mt-24"
          >

            <h2 className="mb-6 flex items-center gap-4 text-xl font-bold">
              <GradientIcon type="ticket" size={25} />
              Kategori & Harga
            </h2>

            {/* Denah Tiket */}
            <img
              src={denah}
              alt="Denah kategori tempat duduk Snada Indonesia"
              className="mx-auto w-full max-w-[520px] rounded-sm object-contain"
            />

          </section>

          {/* ================= SYARAT & KETENTUAN ================= */}
          <section
            id="syarat"
            className="mt-8 scroll-mt-24"
          >

            <h2 className="mb-6 flex items-center gap-4 text-xl font-bold">
              <GradientIcon type="fileText" size={25} />
              Syarat & Ketentuan
            </h2>

            <div className="space-y-4 text-[15px] leading-[1.65]">

              <div>
                <h3 className="font-bold">
                  SYARAT & KETENTUAN - Snada Indonesia 2026
                </h3>

                <p>
                  Dengan membeli tiket Snada Indonesia 2026,
                  Anda telah menyetujui seluruh Syarat & Ketentuan
                  yang berlaku di bawah ini. Harap baca dengan
                  saksama demi kenyamanan dan keselamatan semua
                  pihak yang terlibat, terutama anak-anak dan keluarga.
                </p>

                <p>
                  Dengan membeli dan/atau menggunakan tiket ini,
                  pengunjung dianggap telah membaca, memahami,
                  dan menyetujui seluruh isi dokumen ini sebagai
                  bentuk perjanjian yang mengikat antara pengunjung
                  dan penyelenggara.
                </p>
              </div>

              <div>
                <h3 className="font-bold">
                  PEMBELIAN TIKET
                </h3>

                <ul className="list-disc space-y-1 pl-6">
                  <li>
                    Tiket hanya dapat dibeli melalui
                    snadaindonesia.com.
                  </li>

                  <li>
                    Harga tiket belum termasuk Pajak Hiburan Daerah
                    10%, Biaya Admin 5%, dan biaya platform pembayaran.
                  </li>

                  <li>
                    Setiap transaksi General Admission maksimal
                    dapat membeli 4 (empat) tiket menggunakan
                    data diri yang berbeda.
                  </li>

                  <li>
                    Satu tiket berlaku untuk satu orang dan dapat
                    digunakan untuk keluar-masuk (re-entry).
                  </li>

                  <li>
                    Gunakan data identitas yang valid
                    (KTP/SIM/Paspor) saat membeli tiket.
                  </li>

                  <li>
                    Tiket bersifat digital dan akan tersedia H-5
                    konser melalui aplikasi Loket X.
                  </li>

                  <li>
                    Tiket hanya untuk keperluan pribadi. Dilarang
                    menjual kembali tanpa izin promotor.
                  </li>

                  <li>
                    Pelanggaran terhadap ketentuan pembelian tiket
                    dapat menyebabkan pembatalan tiket tanpa
                    pengembalian dana.
                  </li>

                  <li>
                    Semua penjualan bersifat final. Tidak ada
                    pengembalian dana, pertukaran, atau pengalihan
                    kepemilikan.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold">
                  BATASAN UMUR
                </h3>

                <ul className="list-disc space-y-1 pl-6">
                  <li>
                    Usia 17 tahun ke atas diperbolehkan menonton
                    konser dan membeli tiket secara mandiri.
                  </li>

                  <li>
                    Usia 2-16 tahun diperbolehkan menonton konser
                    dengan pendampingan orang dewasa.
                  </li>
                </ul>
              </div>

            </div>
          </section>

          {/* ================= LOKASI ================= */}
          <section
            id="lokasi"
            className="mt-10 scroll-mt-24"
          >

            <h2 className="mb-6 flex items-center gap-4 text-xl font-bold">
              <GradientIcon type="mapPin" size={25} />
              Lokasi
            </h2>

            {/* MAP CONTAINER */}
            <div className="relative h-[195px] w-full overflow-hidden rounded-xl border border-gray-200">

              {/* GOOGLE MAPS */}
              <iframe
                title="Lokasi Istora Senayan"
                src="https://maps.google.com/maps?q=Istora%20Senayan%2C%20Jakarta%20Pusat&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* OVERLAY BAGIAN BAWAH */}
              <div className="absolute bottom-0 left-0 right-0 flex min-h-[92px] items-center justify-between gap-3 bg-black/55 px-5 py-3 text-white backdrop-blur-[2px]">

                {/* NAMA LOKASI */}
                <div className="flex min-w-0 items-center gap-2">

                  <GradientIcon
                    type="mapPin"
                    size={19}
                    color="#ffffff"
                  />

                  <p className="text-sm font-medium md:text-base">
                    Istora Senayan, Jakarta Pusat
                  </p>

                </div>

                {/* TOMBOL MAP */}
                <div className="flex shrink-0 items-center gap-4 md:gap-8">

                  {/* LIHAT MAP */}
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Istora+Senayan+Jakarta"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 transition hover:scale-105"
                  >

                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-pink-500 bg-white">

                      <GradientIcon
                        type="navigation"
                        size={23}
                      />

                    </div>

                    <span className="text-xs font-semibold">
                      Lihat Map
                    </span>

                  </a>

                  {/* ARAHKAN */}
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=Istora+Senayan+Jakarta"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 transition hover:scale-105"
                  >

                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-pink-500 bg-white">

                      <GradientIcon
                        type="mapPinned"
                        size={23}
                      />

                    </div>

                    <span className="text-xs font-semibold">
                      Arahkan
                    </span>

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
            <img
              src={poster}
              alt="Snada Indonesia 2026"
              className="aspect-[1.7/1] w-full object-cover"
            />

            {/* HARGA TIKET */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-5 md:px-8">

              <div>
                <p className="flex items-center gap-2 font-medium">
                  <GradientIcon type="ticket" size={20} color="#000000" />
                  Harga Tiket Dimulai dari
                </p>

                <p className="text-sm">
                  <i>Rp750.000</i> | 500 Tiket Tersedia
                </p>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="rounded-lg border border-pink-400 px-8 py-1.5 font-semibold text-pink-600 transition hover:bg-pink-50"
                >
                Beli Tiket
                </button>

            </div>

            {/* DETAIL EVENT */}
            <div className="space-y-3 px-7 pb-6 pt-1">

              <h2 className="text-lg font-bold">
                Snada Indonesia - 2026
              </h2>

              <p className="flex items-center gap-2 text-sm">
                <GradientIcon type="mapPin" size={18} color="#000000" />
                Istora Senayan, Jakarta Pusat
              </p>

              <p className="flex items-center gap-2 text-sm">
                <GradientIcon type="calendar" size={18} color="#000000" />
                Sabtu, 10 October 2026 - 22.00 WIB
              </p>

              <p className="flex items-center gap-2 text-sm">
                <GradientIcon type="users" size={18} color="#000000" />
                PT Oppal Musik Indonesia
              </p>

              <p className="flex items-center gap-2 text-sm">
                <GradientIcon type="shapes" size={18} color="#000000" />
                Konser Musik Pop
              </p>

              <p className="flex items-center gap-2 text-sm">
                <GradientIcon type="armchair" size={18} color="#000000" />
                12 Kategori Kursi
              </p>

            </div>

            {/* ================= DAFTAR TIKET ================= */}
            <div className="border-t border-gray-400">

              {visibleTickets.map((ticket) => (

                <div
                  key={ticket.name}
                  className="grid grid-cols-[105px_minmax(0,1fr)_88px] items-center gap-2 border-b border-gray-400 px-3 py-4 md:grid-cols-[120px_minmax(0,1fr)_95px] md:px-4"
                >

                  {/* HARGA */}
                  <p className="text-sm font-medium">
                    {formatPrice(ticket.price)}
                  </p>

                  {/* INFORMASI TIKET */}
                  <div className="min-w-0">

                    <p className="text-sm font-medium">
                      {ticket.name}
                    </p>

                    <p className="text-xs leading-5">
                      Penjualan berakhir 9 Okt 2026 23.59 WIB
                    </p>

                    <p className="text-xs font-bold text-purple-800">
                      {ticket.stock} Kursi Tersisa
                    </p>

                  </div>

                  {/* STATUS */}
                  <button
                    onClick={() =>
                      router.push(
                        `/checkout?ticket=${encodeURIComponent(ticket.name)}`
                      )
                    }
                    className="rounded-full border border-purple-400 bg-pink-50 px-2 py-2 text-xs font-medium text-pink-600 transition hover:bg-purple-100"
                  >
                    Tersedia
                  </button>

                </div>

              ))}

              {/* TAMPILKAN LEBIH BANYAK */}
              <button
                onClick={() => setShowAll(!showAll)}
                className="flex w-full items-center justify-center gap-2 py-5 text-sm font-semibold text-purple-800 transition hover:text-pink-600"
              >

                {showAll
                  ? "Tampilkan Lebih sedikit"
                  : "Tampilkan Lebih banyak"}

                <GradientIcon
                  type="chevronDown"
                  size={17}
                  color="#7C3AED"
                />

              </button>

            </div>
          </div>
        </aside>

      </div>
    </main>
  );
}
