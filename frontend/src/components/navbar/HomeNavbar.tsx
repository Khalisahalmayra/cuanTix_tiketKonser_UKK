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

// Data user yang sedang login (ganti dengan data dari auth/session kamu)
type UserInfo = {
  nama: string;
  tipe: string; // contoh: "Personal"
  foto?: string;
};

// Route tujuan (sesuaikan dengan struktur folder app/ kamu)
const ROUTES = {
  buatEvent: "/buat-event",
  profil: "/akun/profil",
  riwayatTransaksi: "/akun/riwayat-transaksi",
  metodePembayaran: "/akun/metode-pembayaran",
  pesananKamu: "/akun/pesanan",
  ulasanSaya: "/akun/ulasan",
  pengaturanAkun: "/akun/pengaturan",
  pusatBantuan: "/bantuan",
} as const;

// Gradasi tombol Akun
const AKUN_GRADIENT = "linear-gradient(180deg,#5B1AA8 0%,#8A2A9C 55%,#E2408A 100%)";
// Gradasi border (ungu -> pink)
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

type MenuItemProps = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
};

function MenuItem({ icon, label, onClick, danger = false }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-2 py-2 rounded-lg text-left text-[13px] font-semibold hover:bg-[#F3EBFF] transition-colors"
      style={{ color: danger ? "#E11D2E" : "#3B0F8C" }}
    >
      <span className="w-6 h-6 flex items-center justify-center shrink-0">{icon}</span>
      {label}
    </button>
  );
}

export default function HomeNavbar() {
  const router = useRouter();

  const [lokasiOpen, setLokasiOpen] = useState<boolean>(false);
  const [lokasiQuery, setLokasiQuery] = useState<string>("");
  const [selectedLokasi, setSelectedLokasi] = useState<string>("Semua Lokasi");
  const lokasiRef = useRef<HTMLDivElement>(null);
  useOutsideClose(lokasiRef, () => setLokasiOpen(false));

  const [akunOpen, setAkunOpen] = useState<boolean>(false);
  const akunRef = useRef<HTMLDivElement>(null);
  useOutsideClose(akunRef, () => setAkunOpen(false));

  // TODO: ganti dengan data user asli dari session/auth
  const [user] = useState<UserInfo>({
    nama: "Iput Cantik",
    tipe: "Personal",
    foto: "/image/avatar.png",
  });

  const filteredKota: string[] = KOTA_LIST.filter((k) =>
    k.toLowerCase().includes(lokasiQuery.toLowerCase())
  );
  const groupedKota: GroupedKota = groupByLetter(filteredKota);

  function goTo(path: string): void {
    setAkunOpen(false);
    router.push(path);
  }

  function handleLogout(): void {
    setAkunOpen(false);
    // TODO: panggil logout (signOut / hapus token), lalu arahkan ke beranda
    router.push("/");
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

        {/* BUAT EVENT KAMU */}
        <button
          onClick={() => router.push(ROUTES.buatEvent)}
          className="shrink-0 flex items-center gap-2 font-semibold text-sm px-3 py-2.5 rounded-[12px] hover:bg-[#F3EBFF] transition-colors"
          style={{ color: "#E91E8C" }}
        >
          <GradientIcon type="plusCircle" size={20} color="#4C1D95" />
          Buat Event Kamu
        </button>

        {/* LOKASI */}
        <div className="relative shrink-0" ref={lokasiRef}>
          <button
            onClick={() => {
              setLokasiOpen((v) => !v);
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
              setLokasiOpen(false);
            }}
            aria-haspopup="menu"
            aria-expanded={akunOpen}
            className="flex items-center gap-2 rounded-[12px] px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-90 transition-opacity"
            style={{ background: AKUN_GRADIENT }}
          >
            <GradientIcon type="user" size={20} color="#ffffff" />
            Akun
          </button>

          {akunOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-3 w-[300px] max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Kartu profil */}
              <div className="p-3">
                <button
                  onClick={() => goTo(ROUTES.profil)}
                  className="w-full flex items-center gap-3 rounded-xl bg-[#EDEDED] px-2.5 py-2.5 text-left hover:bg-[#E4E4E4] transition-colors"
                >
                  {user.foto ? (
                    <img
                      src={user.foto}
                      alt={user.nama}
                      className="w-14 h-14 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <span className="w-14 h-14 rounded-full bg-[#C9B8E8] flex items-center justify-center shrink-0">
                      <GradientIcon type="user" size={28} color="#ffffff" />
                    </span>
                  )}
                  <span className="flex-1 min-w-0">
                    <span className="block text-[15px] text-gray-900 truncate">{user.nama}</span>
                    <span
                      className="inline-block mt-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                      style={{ background: "#FBD3E6", color: "#E91E8C" }}
                    >
                      {user.tipe}
                    </span>
                  </span>
                  <GradientIcon type="chevronRight" size={20} />
                </button>
              </div>

              {/* My Activity */}
              <div className="px-4 pt-1 pb-2">
                <h4 className="text-[15px] font-bold text-gray-900 mb-1">My Activity</h4>
                <MenuItem
                  icon={<GradientIcon type="trending" size={20} />}
                  label="Riwayat Transaksi"
                  onClick={() => goTo(ROUTES.riwayatTransaksi)}
                />
                <MenuItem
                  icon={<GradientIcon type="wallet" size={20} />}
                  label="Metode Pembayaran"
                  onClick={() => goTo(ROUTES.metodePembayaran)}
                />
                <MenuItem
                  icon={<GradientIcon type="fileText" size={20} />}
                  label="Pesanan Kamu"
                  onClick={() => goTo(ROUTES.pesananKamu)}
                />
                <MenuItem
                  icon={<GradientIcon type="messageSquare" size={20} />}
                  label="Ulasan Saya"
                  onClick={() => goTo(ROUTES.ulasanSaya)}
                />
              </div>

              {/* Pusat Bantuan */}
              <div className="px-4 pt-2 pb-3">
                <h4 className="text-[15px] font-bold text-gray-900 mb-1">Pusat Bantuan</h4>
                <MenuItem
                  icon={<GradientIcon type="settings" size={20} />}
                  label="Pengaturan Akun"
                  onClick={() => goTo(ROUTES.pengaturanAkun)}
                />
                <MenuItem
                  icon={<GradientIcon type="help" size={20} />}
                  label="Pusat Bantuan"
                  onClick={() => goTo(ROUTES.pusatBantuan)}
                />
              </div>

              {/* Keluar */}
              <div className="border-t border-gray-300 px-4 py-3">
                <MenuItem
                  icon={<GradientIcon type="logOut" size={20} />}
                  label="Keluar"
                  danger
                  onClick={handleLogout}
                />
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}