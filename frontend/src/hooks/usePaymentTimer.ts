"use client";

import { useEffect, useState } from "react";

const KEY = "paymentDeadline";
export const PAYMENT_DURATION_SECONDS = 15 * 60;

/** Mulai timer baru (panggil saat klik "Beli Tiket" di halaman checkout). */
export function startPaymentTimer() {
  try {
    sessionStorage.setItem(
      KEY,
      String(Date.now() + PAYMENT_DURATION_SECONDS * 1000)
    );
  } catch {}
}

/** Hapus timer (panggil setelah pembayaran selesai). */
export function clearPaymentTimer() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {}
}

/**
 * Sisa detik pembayaran. Memakai waktu batas (deadline) yang disimpan di
 * sessionStorage, jadi timer lanjut di halaman berikutnya dan tidak reset
 * saat di-refresh. Nilai null = belum dibaca (sebelum mount).
 */
export function usePaymentTimer() {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    let deadline = 0;
    try {
      deadline = Number(sessionStorage.getItem(KEY));
      if (!deadline) {
        deadline = Date.now() + PAYMENT_DURATION_SECONDS * 1000;
        sessionStorage.setItem(KEY, String(deadline));
      }
    } catch {
      deadline = Date.now() + PAYMENT_DURATION_SECONDS * 1000;
    }

    const tick = () =>
      setSecondsLeft(Math.max(0, Math.round((deadline - Date.now()) / 1000)));

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return secondsLeft;
}