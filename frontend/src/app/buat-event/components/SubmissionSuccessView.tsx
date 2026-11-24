"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Check, Info } from "lucide-react";
import { SubmissionSuccess } from "../types";
import { BRAND_GRADIENT } from "../constants";

interface SubmissionSuccessViewProps {
  submissionSuccess: SubmissionSuccess;
  onReset: () => void;
  onBackHome?: () => void;
}

export function SubmissionSuccessView({
  submissionSuccess,
  onReset,
  onBackHome,
}: SubmissionSuccessViewProps) {
  const router = useRouter();

  const handleBackHome = () => {
    if (onBackHome) {
      onBackHome();
    } else {
      router.push("/home");
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-purple-100 bg-white p-8 text-center shadow-lg sm:p-12">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-[#5B1AA8] to-[#E91E8C] text-white shadow-md">
        <Check className="h-10 w-10 stroke-[3]" />
      </div>

      <span className="inline-block rounded-full bg-amber-50 px-3.5 py-1 text-xs font-bold text-amber-700 border border-amber-200">
        Status: Menunggu Review Tim CuanTix
      </span>

      <h2 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
        Pengajuan Berhasil Dikirim!
      </h2>

      <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
        Terima kasih telah mempercayakan event kamu kepada CuanTix. Proposal event{" "}
        <strong className="text-gray-900 font-semibold">&ldquo;{submissionSuccess.title}&rdquo;</strong>{" "}
        telah masuk ke antrean kurasi dengan nomor registrasi{" "}
        <span className="font-mono font-bold text-[#5B1AA8]">#{submissionSuccess.id}</span>.
      </p>

      <div className="my-6 rounded-2xl bg-[#F8F5FC] p-5 text-left text-xs sm:text-sm text-gray-700">
        <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Info className="h-4 w-4 text-[#5B1AA8]" />
          Langkah Selanjutnya:
        </h4>
        <ul className="list-inside list-disc space-y-1.5 text-gray-600">
          <li>Tim kurasi CuanTix akan memeriksa kelengkapan detail event dalam 1-3 hari kerja.</li>
          <li>Pemberitahuan persetujuan atau catatan revisi akan dikirim ke email akun Anda.</li>
          <li>Setelah disetujui, event akan otomatis aktif dan tiket siap dibeli calon penonton.</li>
        </ul>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={handleBackHome}
          className="rounded-full px-6 py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-95 cursor-pointer"
          style={{ background: BRAND_GRADIENT }}
        >
          Kembali ke Beranda
        </button>
        <button
          type="button"
          onClick={onReset}
          className="rounded-full border border-purple-200 bg-white px-6 py-3 text-sm font-bold text-[#5B1AA8] transition-colors hover:bg-purple-50 cursor-pointer"
        >
          Ajukan Event Lainnya
        </button>
      </div>
    </div>
  );
}
