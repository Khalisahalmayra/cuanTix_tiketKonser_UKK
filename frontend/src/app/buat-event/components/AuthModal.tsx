"use client";

import React from "react";
import GradientIcon from "@/components/icon/GradientIcon";
import { BRAND_GRADIENT } from "../constants";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-[#5B1AA8]">
          <GradientIcon type="lock" size={28} />
        </div>

        <h3 className="text-center text-lg font-bold text-gray-900 sm:text-xl">
          Login Akun Customer Diperlukan
        </h3>

        <p className="mt-2 text-center text-xs leading-relaxed text-gray-600 sm:text-sm">
          Untuk mengajukan proposal event di CuanTix, Anda harus masuk ke akun customer terlebih dahulu agar kami dapat mengaitkan tiket dan pengajuan ke profil Anda.
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full border border-gray-200 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 sm:text-sm cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onLogin}
            className="w-full rounded-full py-2.5 text-xs font-bold text-white shadow-md hover:opacity-95 sm:text-sm cursor-pointer"
            style={{ background: BRAND_GRADIENT }}
          >
            Login Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
