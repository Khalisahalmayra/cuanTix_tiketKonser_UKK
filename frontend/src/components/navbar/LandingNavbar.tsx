"use client";

import React, { useState, useRef, useEffect, RefObject } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/search/SearchBar";

import GradientIcon from "@/components/icon/GradientIcon";

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

// Gradasi yang sama dipakai di tombol Akun & border search bar biar konsisten
const AKUN_GRADIENT = "linear-gradient(90deg,#E91E8C 0%,#4C1D95 100%)";
// Gradasi khusus border (ungu -> pink)
const SEARCH_BORDER_GRADIENT = "linear-gradient(90deg,#7C3AED 0%,#E91E8C 100%)";

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
    // Arahkan ke halaman detail pembelian / panggil API cek pembelian
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
    <div style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }} className="relative z-40 w-full bg-white">
      <nav className="w-full flex items-center gap-4 px-6 py-4 flex-wrap">
        {/* LOGO */}
        <div className="flex items-center shrink-0">
          <img
            src="/image/logo-cuantix.png"
            alt="Cuantix"
            className="h-18 w-auto shrink-0 object-contain"
          />
        </div>

        {/* SEARCH */}
        <SearchBar />

        {/* PEMBELIAN */}
        <div className="relative shrink-0" ref={pembelianRef}>
          <button
            onClick={() => {
              setPembelianOpen((v) => !v);
              setLokasiOpen(false);
              setAkunOpen(false);
            }}
            className={`group relative font-semibold text-sm px-4 py-2.5 rounded-[12px] transition-all duration-200 ${
              pembelianOpen ? "bg-[#F3EBFF]" : "bg-white hover:bg-[#F3EBFF]"
            }`}
            style={{
              color: "#E91E8C",
              border: "2px solid transparent",
              backgroundImage: `
                linear-gradient(
                  ${pembelianOpen ? "#F3EBFF" : "white"},
                  ${pembelianOpen ? "#F3EBFF" : "white"}
                ),
                ${SEARCH_BORDER_GRADIENT}
              `,
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
            }}
          >
            Pembelian
          </button>

          {pembelianOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-[#EDEDED] rounded-2xl shadow-2xl p-6 z-50">
              <button
                onClick={() => setPembelianOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                aria-label="Tutup"
              >
                <GradientIcon type="close" size={16} color="#9CA3AF" />
              </button>
              <h3 className="font-bold text-center text-gray-900 mb-2">Cek Pembelian Tiket</h3>
              <p className="text-xs text-center text-gray-600 mb-5 leading-relaxed">
                Silakan masukkan No. Telp dan nama lengkap yang digunakan saat
                pembelian untuk melihat detail tiket Anda.
              </p>

              <label className="block text-sm font-bold text-gray-900 mb-1">No Telp</label>
              <input
                value={noTelp}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNoTelp(e.target.value)}
                placeholder="No. Telp sesuai pada saat pemesanan tiket"
                className="w-full rounded-lg px-3 py-2.5 text-xs mb-4 outline-none border border-transparent focus:border-[#7C3AED] bg-white"
              />

              <label className="block text-sm font-bold text-gray-900 mb-1">Nama Lengkap</label>
              <input
                value={namaLengkap}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNamaLengkap(e.target.value)}
                placeholder="Nama lengkap sesuai pada saat pemesanan tiket"
                className="w-full rounded-lg px-3 py-2.5 text-xs mb-5 outline-none border border-transparent focus:border-[#7C3AED] bg-white"
              />

              <button
                onClick={handleLihatPembelian}
                className="w-full rounded-full py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(90deg,#E91E8C 0%,#6D28D9 100%)" }}
              >
                Lihat Pembelian
              </button>
            </div>
          )}
        </div>

        {/* LOKASI */}
        <div className="relative shrink-0" ref={lokasiRef}>
          <button
            onClick={() => {
              setLokasiOpen((v) => !v);
              setPembelianOpen(false);
              setAkunOpen(false);
            }}
            className={`group relative flex items-center gap-2 font-semibold text-sm px-4 py-2.5 rounded-[12px] transition-all duration-200 ${
              lokasiOpen ? "bg-[#F3EBFF]" : "bg-white hover:bg-[#F3EBFF]"
            }`}
            style={{
              color: "#374151",
              border: "2px solid transparent",
              backgroundImage: `
                linear-gradient(
                  ${lokasiOpen ? "#F3EBFF" : "white"},
                  ${lokasiOpen ? "#F3EBFF" : "white"}
                ),
                ${SEARCH_BORDER_GRADIENT}
              `,
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
            }}
          >
            <GradientIcon type="mapPin" size={16} />
            {selectedLokasi}
          </button>

          {lokasiOpen && (
            <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl p-4 z-50 max-h-96 flex flex-col">
              <div className="flex items-center gap-2 rounded-full border-2 border-[#7C3AED] px-4 py-2 mb-3 shrink-0">
                <input
                  autoFocus
                  value={lokasiQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLokasiQuery(e.target.value)}
                  placeholder="Cari Nama Kota"
                  className="flex-1 outline-none bg-transparent text-sm text-[#6D28D9]"
                />
                <GradientIcon type="search" size={16} />
              </div>

              <div className="overflow-y-auto pr-1">
                <button
                  onClick={() => {
                    setSelectedLokasi("Semua Lokasi");
                    setLokasiOpen(false);
                    setLokasiQuery("");
                  }}
                  className="w-full text-left text-sm font-semibold py-1.5 px-1 rounded hover:bg-pink-50"
                  style={{ color: "#E91E8C" }}
                >
                  Semua Lokasi
                </button>

                {Object.keys(groupedKota).length === 0 && (
                  <p className="text-xs text-gray-400 px-1 py-2">Kota tidak ditemukan</p>
                )}

                {Object.entries(groupedKota).map(([letter, kotas]) => (
                  <div key={letter} className="mb-2">
                    <div className="text-xs font-bold text-gray-800 px-1 pt-1 pb-0.5">{letter}</div>
                    {kotas.map((kota: string) => (
                      <button
                        key={kota}
                        onClick={() => {
                          setSelectedLokasi(kota);
                          setLokasiOpen(false);
                          setLokasiQuery("");
                        }}
                        className="w-full text-left text-sm text-gray-700 py-1.5 px-2 rounded hover:bg-purple-50"
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

        {/* AKUN */}
        <div className="relative shrink-0" ref={akunRef}>
          <button
            onClick={() => {
              setAkunOpen((v) => !v);
              setPembelianOpen(false);
              setLokasiOpen(false);
            }}
            className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-90 transition-opacity"
            style={{ background: AKUN_GRADIENT }}
          >
            <GradientIcon type="user" size={16} color="#ffffff" />
            Akun
          </button>

          {akunOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl p-4 z-50 flex flex-col gap-3">
              <button
                onClick={() => goTo("/auth/register")}
                className="w-full rounded-lg border-2 py-2.5 text-sm font-semibold hover:bg-pink-50 transition-colors"
                style={{ borderColor: "#E91E8C", color: "#6D28D9" }}
              >
                Buat Akun Anda
              </button>
              <button
                onClick={() => goTo("/auth/login")}
                className="w-full rounded-lg border-2 py-2.5 text-sm font-semibold hover:bg-purple-50 transition-colors"
                style={{ borderColor: "#E91E8C", color: "#6D28D9" }}
              >
                Masuk Akun Anda
              </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}