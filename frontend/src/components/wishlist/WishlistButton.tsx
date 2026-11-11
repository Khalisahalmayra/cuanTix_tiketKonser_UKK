"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import GradientIcon from "@/components/icon/GradientIcon";
import { useWishlist } from "./useWishlist";

type WishlistButtonProps = {
  /** ID unik event (slug atau id dari database) */
  eventId: string;
  className?: string;
};

const TOAST_DURATION = 2500;

export default function WishlistButton({ eventId, className = "" }: WishlistButtonProps) {
  const { wishlisted, toggle } = useWishlist(eventId);
  const [message, setMessage] = useState<string>("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function handleClick() {
    const added = toggle();
    setMessage(added ? "Ditambahkan ke wishlist" : "Dihapus dari wishlist");

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(""), TOAST_DURATION);
  }

  return (
    <>
      <div className={`absolute right-3 top-3 z-10 ${className}`}>
        <button
          type="button"
          onClick={handleClick}
          aria-pressed={wishlisted}
          aria-label={wishlisted ? "Hapus dari wishlist" : "Tambah ke wishlist"}
          title={wishlisted ? "Hapus dari wishlist" : "Tambah ke wishlist"}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-200 hover:scale-110 active:scale-95"
        >
          <GradientIcon type="heart" size={22} filled={wishlisted} />
        </button>
      </div>

      {/*
        Notifikasi dirender ke document.body dengan posisi fixed,
        supaya tidak terpotong oleh overflow-hidden / ukuran poster.
        `message` hanya terisi setelah klik, jadi aman dari masalah SSR.
      */}
      {message &&
        createPortal(
          <div
            role="status"
            aria-live="polite"
            className="fixed bottom-8 left-1/2 z-[9999] -translate-x-1/2 whitespace-nowrap rounded-full bg-gray-900/90 px-5 py-2.5 text-sm font-medium text-white shadow-lg"
          >
            {message}
          </div>,
          document.body
        )}
    </>
  );
}