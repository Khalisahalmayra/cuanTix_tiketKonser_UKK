"use client";

import { useEffect, useState } from "react";
import { Camera, Clock, MapPin, TriangleAlert, WifiOff } from "lucide-react";

import { PetugasProfile } from "@/types/petugas";
import { isWithinShift } from "@/lib/petugas";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

interface ScanStartCardProps {
  profile: PetugasProfile;
  onStart: () => void;
}

export default function ScanStartCard({ profile, onStart }: ScanStartCardProps) {
  const online = useOnlineStatus();
  const [inShift, setInShift] = useState(true);

  useEffect(() => {
    setInShift(isWithinShift(profile.shiftStart, profile.shiftEnd));
  }, [profile.shiftStart, profile.shiftEnd]);

  const firstName = profile.name.trim().split(" ")[0] || "Petugas";

  return (
    <section className="rounded-[20px] border border-gray-100 bg-white p-6 text-center shadow-sm">
      <div
        className="mx-auto flex h-20 w-20 items-center justify-center rounded-full text-white shadow-lg"
        style={{
          background: "linear-gradient(135deg,#E91E8C 0%,#4C1D95 100%)",
        }}
      >
        <Camera className="h-9 w-9" />
      </div>

      <h2 className="mt-4 text-xl font-bold text-gray-900">
        Halo, {firstName}!
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Kamera belum aktif. Tekan tombol di bawah saat kamu sudah siap menerima
        pengunjung.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 text-left">
        <div className="rounded-xl bg-[#F8F4FF] p-3">
          <p className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin className="h-3.5 w-3.5" />
            Posisi tugas
          </p>
          <p className="mt-0.5 text-base font-bold text-[#4C1D95]">
            {profile.gate}
          </p>
        </div>
        <div className="rounded-xl bg-[#F8F4FF] p-3">
          <p className="flex items-center gap-1.5 text-xs text-gray-500">
            <Clock className="h-3.5 w-3.5" />
            {profile.shiftName}
          </p>
          <p className="mt-0.5 text-base font-bold text-[#4C1D95]">
            {profile.shiftStart}–{profile.shiftEnd}
          </p>
        </div>
      </div>

      {!online && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-left text-sm text-red-600">
          <WifiOff className="mt-0.5 h-4 w-4 shrink-0" />
          Perangkat sedang offline. Scan butuh internet untuk memeriksa tiket.
        </div>
      )}

      {online && !inShift && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-left text-sm text-amber-800">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
          Sekarang di luar jam shift kamu. Pastikan sudah diizinkan koordinator
          sebelum mulai scan.
        </div>
      )}

      <button
        onClick={onStart}
        disabled={!online}
        className="mt-6 w-full rounded-full py-3.5 text-base font-semibold text-white shadow-md transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          background: "linear-gradient(90deg,#E91E8C 0%,#4C1D95 100%)",
        }}
      >
        Mulai Scan
      </button>
      <p className="mt-3 text-xs text-gray-400">
        Browser akan meminta izin kamera saat scan dimulai.
      </p>
    </section>
  );
}