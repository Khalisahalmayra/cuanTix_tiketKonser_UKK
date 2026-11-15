"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Clock,
  LifeBuoy,
  LogOut,
  MapPin,
  ScanLine,
  User,
  Wifi,
  WifiOff,
} from "lucide-react";

import { PetugasProfile } from "@/types/petugas";
import { formatElapsed, isWithinShift, logoutPetugas } from "@/lib/petugas";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import HelpModal from "./HelpModal";

interface PetugasNavbarProps {
  profile: PetugasProfile;
  /** epoch ms — kapan petugas mulai online di sesi ini */
  onlineSince: number;
}

const GRADIENT = "linear-gradient(90deg,#E91E8C 0%,#4C1D95 100%)";

export default function PetugasNavbar({
  profile,
  onlineSince,
}: PetugasNavbarProps) {
  const router = useRouter();
  const online = useOnlineStatus();

  const [now, setNow] = useState<number>(() => Date.now());
  const [akunOpen, setAkunOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const akunRef = useRef<HTMLDivElement>(null);

  // Perbarui durasi online & status jam shift tiap 30 detik.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (akunRef.current && !akunRef.current.contains(e.target as Node)) {
        setAkunOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const inShift = isWithinShift(
    profile.shiftStart,
    profile.shiftEnd,
    new Date(now)
  );
  const initial = profile.name.trim().charAt(0).toUpperCase() || "P";

  async function handleLogout() {
    setLoggingOut(true);
    await logoutPetugas();
    router.replace("/login");
  }

  return (
    <>
      <header
        className="sticky top-0 z-40 border-b border-gray-100 bg-white"
        style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
      >
        {/* BARIS ATAS */}
        <div className="mx-auto flex max-w-xl items-center gap-3 px-5 py-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-md"
            style={{
              background: "linear-gradient(135deg,#E91E8C 0%,#4C1D95 100%)",
            }}
          >
            <ScanLine className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-bold leading-tight text-gray-900">
              Scan Tiket
            </h1>
            <p className="truncate text-xs text-gray-500">
              {profile.eventTitle ?? "Panel Petugas Cuantix"}
            </p>
          </div>

          {/* BANTUAN */}
          <button
            onClick={() => setHelpOpen(true)}
            className="flex shrink-0 items-center gap-2 rounded-full border-2 border-[#E91E8C] px-3 py-2 text-sm font-semibold text-[#E91E8C] transition-colors hover:bg-[#FDF0F8]"
            aria-label="Panggil bantuan"
          >
            <LifeBuoy className="h-4 w-4" />
            <span className="hidden sm:inline">Bantuan</span>
          </button>

          {/* AKUN */}
          <div className="relative shrink-0" ref={akunRef}>
            <button
              onClick={() => setAkunOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90"
              style={{ background: GRADIENT }}
              aria-label="Menu akun"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/25 text-xs font-bold">
                {initial}
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {akunOpen && (
              <div className="absolute right-0 mt-3 w-72 rounded-2xl bg-white p-4 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
                    style={{ background: GRADIENT }}
                  >
                    {initial}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-gray-900">
                      {profile.name}
                    </p>
                    <p className="flex items-center gap-1 text-xs text-gray-500">
                      <User className="h-3 w-3" />
                      {profile.role}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 rounded-xl bg-[#F8F4FF] p-3 text-xs text-gray-700">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Gate</span>
                    <span className="font-semibold">{profile.gate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{profile.shiftName}</span>
                    <span className="font-semibold">
                      {profile.shiftStart} – {profile.shiftEnd} WIB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Online selama</span>
                    <span className="font-semibold">
                      {formatElapsed(now - onlineSince)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border-2 border-red-300 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
                >
                  <LogOut className="h-4 w-4" />
                  {loggingOut ? "Keluar..." : "Logout"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* BARIS INFO: shift, gate, status online */}
        <div className="border-t border-gray-100 bg-[#FAF7FF]">
          <div className="mx-auto flex max-w-xl flex-wrap items-center gap-x-4 gap-y-1.5 px-5 py-2 text-xs">
            <span
              className={`flex items-center gap-1.5 font-semibold ${
                online ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {online ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  <Wifi className="h-3.5 w-3.5" />
                  Online · {formatElapsed(now - onlineSince)}
                </>
              ) : (
                <>
                  <WifiOff className="h-3.5 w-3.5" />
                  Offline — periksa koneksi
                </>
              )}
            </span>

            <span
              className={`flex items-center gap-1.5 font-medium ${
                inShift ? "text-[#6D28D9]" : "text-amber-600"
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              {profile.shiftName} · {profile.shiftStart}–{profile.shiftEnd} WIB
              {!inShift && " (di luar jam shift)"}
            </span>

            <span className="flex items-center gap-1.5 font-medium text-[#C026D3]">
              <MapPin className="h-3.5 w-3.5" />
              {profile.gate}
            </span>
          </div>
        </div>
      </header>

      {helpOpen && (
        <HelpModal profile={profile} onClose={() => setHelpOpen(false)} />
      )}
    </>
  );
}