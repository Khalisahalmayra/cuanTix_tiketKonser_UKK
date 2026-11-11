"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import GradientIcon from "@/components/icon/GradientIcon";

const BORDER_GRADIENT = "linear-gradient(90deg,#7C3AED 0%,#E91E8C 100%)";
const BUTTON_PINK = "#EC407A";

type LogoutConfirmModalProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function LogoutConfirmModal({
  open,
  onCancel,
  onConfirm,
}: LogoutConfirmModalProps) {
  // Tutup dengan tombol Esc
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-5"
      style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
      onMouseDown={(e) => {
        // klik area gelap di luar kartu = batal
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="logout-title"
        aria-describedby="logout-desc"
        className="w-full max-w-[360px] rounded-[14px] bg-white px-6 py-7 text-center shadow-[0_8px_24px_rgba(0,0,0,0.2)]"
      >
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F3EBFF]">
          <GradientIcon type="logOut" size={28} />
        </span>

        <h2 id="logout-title" className="mt-4 text-[18px] font-bold text-gray-900">
          Yakin mau keluar?
        </h2>
        <p id="logout-desc" className="mt-1 text-[13px] text-gray-600">
          Kamu akan keluar dari akunmu dan perlu masuk lagi untuk melanjutkan.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            autoFocus
            onClick={onCancel}
            className="h-[40px] flex-1 rounded-full bg-white text-[13px] font-semibold text-[#6D28D9] transition-colors hover:bg-[#F3EBFF]"
            style={{
              border: "1.5px solid transparent",
              backgroundImage: `linear-gradient(white, white), ${BORDER_GRADIENT}`,
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
            }}
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-[40px] flex-1 rounded-full text-[13px] font-semibold text-white shadow-md transition-opacity hover:opacity-90"
            style={{ background: BUTTON_PINK }}
          >
            Ya, Keluar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}