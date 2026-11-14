"use client";

import React, { useState, useRef, useEffect, RefObject } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SearchBar from "@/components/search/SearchBar";
import { ChevronDown, MapPin, Receipt, User, X } from "lucide-react";

const KOTA_LIST: string[] = [
  "Jakarta",
  "Surabaya",
  "Bandung",
  "Medan",
  "Semarang",
  "Makassar",
  "Palembang",
  "Tangerang",
  "Depok",
  "Bekasi",
  "Bogor",
  "Yogyakarta",
  "Malang",
  "Denpasar",
  "Batam",
  "Pekanbaru",
  "Bandar Lampung",
  "Padang",
  "Banjarmasin",
  "Samarinda",
  "Balikpapan",
  "Pontianak",
  "Manado",
  "Jayapura",
];

type GroupedKota = Record<string, string[]>;

function groupByLetter(list: string[]): GroupedKota {
  const sorted = [...list].sort((a, b) => a.localeCompare(b));
  const groups: GroupedKota = {};
  for (const kota of sorted) {
    const letter = kota[0].toUpperCase();
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(kota);
  }
  return groups;
}

function useOutsideClose<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onClose: () => void
): void {
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [ref, onClose]);
}

export default function LandingNavbar() {
  const router = useRouter();

  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [pembelianOpen, setPembelianOpen] = useState<boolean>(false);
  const [noTelp, setNoTelp] = useState<string>("");
  const [namaLengkap, setNamaLengkap] = useState<string>("");
  const pembelianRef = useRef<HTMLDivElement>(null);
  useOutsideClose(pembelianRef, () => setPembelianOpen(false));

  const [lokasiOpen, setLokasiOpen] = useState<boolean>(false);
  const [lokasiQuery, setLokasiQuery] = useState<string>("");
  const [selectedLokasi, setSelectedLokasi] = useState<string>("Semua Lokasi");
  const lokasiRef = useRef<HTMLDivElement>(null);
  useOutsideClose(lokasiRef, () => setLokasiOpen(false));

  const [akunOpen, setAkunOpen] = useState<boolean>(false);
  const akunRef = useRef<HTMLDivElement>(null);
  useOutsideClose(akunRef, () => setAkunOpen(false));

  const filteredKota: string[] = KOTA_LIST.filter((k) =>
    k.toLowerCase().includes(lokasiQuery.toLowerCase())
  );
  const groupedKota: GroupedKota = groupByLetter(filteredKota);

  function handleLihatPembelian(): void {
    if (!noTelp.trim() || !namaLengkap.trim()) return;
    router.push(
      `/pembelian/cek?noTelp=${encodeURIComponent(
        noTelp
      )}&nama=${encodeURIComponent(namaLengkap)}`
    );
    setPembelianOpen(false);
  }

  function goTo(path: string): void {
    setAkunOpen(false);
    router.push(path);
  }

  return (
    <header
    className={`sticky top-0 z-40 w-full border-b backdrop-blur-md transition-all duration-300 ${
      scrolled
        ? "border-gray-200 bg-white/80 shadow-md"
        : "border-gray-100 bg-white/95 shadow-none"
    }`}
  >
           <div
        className={`mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-5 transition-all duration-300 sm:px-8 md:px-10 lg:gap-8 lg:px-14 xl:px-16 ${
          scrolled ? "h-[64px] md:h-[68px]" : "h-[82px] md:h-[88px]"
        }`}
      >
        {/* LOGO (Prominent, natural ratio, plenty of breathing room) */}
        
{/* LOGO CUANTIX */}
<div
  onClick={() => router.push("/")}
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      router.push("/");
    }
  }}
  className="flex shrink-0 cursor-pointer items-center pr-2 transition-transform duration-200 hover:scale-[1.03]"
>
  <Image
    src="/image/logo-cuantix.png"
    alt="Cuantix - Platform Tiket Konser"
    width={190}
    height={60}
    priority
    sizes="190px"
    className={`w-auto object-contain object-left transition-all duration-300 ${
      scrolled ? "h-11 md:h-12" : "h-12 md:h-14"
    }`}
  />
</div>


        {/* SEARCH BAR (Center area, controlled max-width, balanced) */}
        <div className="hidden sm:block flex-1 max-w-[360px] md:max-w-[420px] lg:max-w-[460px] mx-auto">
          <SearchBar />
        </div>

        {/* RIGHT NAVIGATION ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* TOMBOL PEMBELIAN */}
          <div className="relative" ref={pembelianRef}>
            <button
              type="button"
              onClick={() => {
                setPembelianOpen((v) => !v);
                setLokasiOpen(false);
                setAkunOpen(false);
              }}
              className={`flex h-[44px] items-center gap-2 rounded-full px-4 text-xs sm:text-sm font-semibold transition-all duration-200 border cursor-pointer ${
                pembelianOpen
                  ? "border-[#7C3AED] bg-[#FAF5FF] text-[#7C3AED] shadow-2xs"
                  : "border-gray-200/90 bg-white text-gray-700 hover:border-purple-300 hover:bg-[#FAF8FE] hover:text-[#7C3AED]"
              }`}
            >
              <Receipt className="h-4 w-4 text-[#7C3AED]" />
              <span className="hidden md:inline">Pembelian</span>
            </button>

            {pembelianOpen && (
              <div className="absolute right-0 mt-2.5 w-80 rounded-2xl border border-gray-100 bg-white p-5 shadow-2xl z-50">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
                  <h3 className="text-sm font-bold text-gray-900">
                    Cek Pembelian Tiket
                  </h3>
                  <button
                    onClick={() => setPembelianOpen(false)}
                    className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
                    aria-label="Tutup"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  Masukkan No. Telp dan Nama Lengkap yang digunakan saat
                  pembelian untuk melihat detail tiket.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      No. Telepon
                    </label>
                    <input
                      type="tel"
                      value={noTelp}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNoTelp(e.target.value)
                      }
                      placeholder="Contoh: 08123456789"
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs text-gray-900 outline-none transition-colors focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={namaLengkap}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNamaLengkap(e.target.value)
                      }
                      placeholder="Nama sesuai pemesanan"
                      className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs text-gray-900 outline-none transition-colors focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleLihatPembelian}
                    className="mt-2 w-full rounded-full py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95 active:scale-[0.99] cursor-pointer"
                    style={{
                      background:
                        "linear-gradient(90deg, #7C3AED 0%, #E91E8C 100%)",
                    }}
                  >
                    Lihat Pembelian
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* TOMBOL LOKASI */}
          <div className="relative" ref={lokasiRef}>
            <button
              type="button"
              onClick={() => {
                setLokasiOpen((v) => !v);
                setPembelianOpen(false);
                setAkunOpen(false);
              }}
              className={`flex h-[44px] items-center gap-2 rounded-full px-4 text-xs sm:text-sm font-semibold transition-all duration-200 border cursor-pointer ${
                lokasiOpen
                  ? "border-[#7C3AED] bg-[#FAF5FF] text-[#7C3AED] shadow-2xs"
                  : "border-gray-200/90 bg-white text-gray-700 hover:border-purple-300 hover:bg-[#FAF8FE] hover:text-[#7C3AED]"
              }`}
            >
              <MapPin className="h-4 w-4 text-[#E91E8C]" />
              <span className="max-w-[110px] truncate">{selectedLokasi}</span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </button>

            {lokasiOpen && (
              <div className="absolute right-0 mt-2.5 w-72 rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl z-50 max-h-96 flex flex-col">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-3">
                  <h4 className="text-xs font-bold text-gray-800">Pilih Lokasi</h4>
                  <button
                    onClick={() => setLokasiOpen(false)}
                    className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-1.5 mb-3 bg-gray-50/70 focus-within:bg-white focus-within:border-[#7C3AED]">
                  <input
                    autoFocus
                    value={lokasiQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setLokasiQuery(e.target.value)
                    }
                    placeholder="Cari nama kota..."
                    className="w-full outline-none bg-transparent text-xs text-gray-800"
                  />
                  {lokasiQuery && (
                    <button
                      onClick={() => setLokasiQuery("")}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>

                <div className="overflow-y-auto pr-1 flex-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLokasi("Semua Lokasi");
                      setLokasiOpen(false);
                      setLokasiQuery("");
                    }}
                    className={`w-full text-left text-xs font-semibold py-2 px-2.5 rounded-lg transition-colors mb-1 cursor-pointer ${
                      selectedLokasi === "Semua Lokasi"
                        ? "bg-purple-50 text-[#7C3AED]"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Semua Lokasi
                  </button>

                  {Object.keys(groupedKota).length === 0 && (
                    <p className="text-xs text-gray-400 px-2 py-3 text-center">
                      Kota tidak ditemukan
                    </p>
                  )}

                  {Object.entries(groupedKota).map(([letter, kotas]) => (
                    <div key={letter} className="mb-2">
                      <div className="text-[10px] font-bold text-gray-400 px-2 pt-1 uppercase tracking-wider">
                        {letter}
                      </div>
                      {kotas.map((kota: string) => (
                        <button
                          key={kota}
                          type="button"
                          onClick={() => {
                            setSelectedLokasi(kota);
                            setLokasiOpen(false);
                            setLokasiQuery("");
                          }}
                          className={`w-full text-left text-xs py-1.5 px-2.5 rounded-lg transition-colors cursor-pointer ${
                            selectedLokasi === kota
                              ? "bg-purple-50 text-[#7C3AED] font-semibold"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {kota}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* TOMBOL AKUN (Gradient ungu-pink khas Cuantix) */}
          <div className="relative" ref={akunRef}>
            <button
              type="button"
              onClick={() => {
                setAkunOpen((v) => !v);
                setPembelianOpen(false);
                setLokasiOpen(false);
              }}
              className="flex h-[44px] items-center gap-2 rounded-full px-5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:opacity-95 active:scale-[0.98] cursor-pointer"
              style={{
                background: "linear-gradient(90deg, #7C3AED 0%, #E91E8C 100%)",
              }}
            >
              <User className="h-4 w-4" />
              <span>Akun</span>
            </button>

            {akunOpen && (
              <div className="absolute right-0 mt-2.5 w-60 rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl z-50 flex flex-col gap-2.5">
                <div className="px-1 pb-1 border-b border-gray-100">
                  <p className="text-xs font-bold text-gray-900">Halo, Cuantixer!</p>
                  <p className="text-[11px] text-gray-500">
                    Masuk untuk akses tiket & promo
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => goTo("/auth/login")}
                  className="w-full rounded-xl py-2 text-xs font-semibold text-white transition-opacity hover:opacity-95 cursor-pointer"
                  style={{
                    background:
                      "linear-gradient(90deg, #7C3AED 0%, #E91E8C 100%)",
                  }}
                >
                  Masuk Akun
                </button>
                <button
                  type="button"
                  onClick={() => goTo("/auth/register")}
                  className="w-full rounded-xl border border-gray-200 py-2 text-xs font-semibold text-gray-700 transition-colors hover:border-[#7C3AED] hover:bg-purple-50/50 hover:text-[#7C3AED] cursor-pointer"
                >
                  Daftar Akun Baru
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE SEARCH BAR (Tampil hanya di layar kecil) */}
      <div className="block sm:hidden px-5 pb-3.5">
        <SearchBar />
      </div>
    </header>
  );
}
