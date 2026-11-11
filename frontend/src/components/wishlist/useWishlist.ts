"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "cuantix:wishlist";

function readIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string")
      : [];
  } catch {
    return [];
  }
}

function writeIds(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // storage penuh / diblokir — abaikan
  }
}

/**
 * Wishlist per event.
 * Sementara disimpan di localStorage. TODO: kalau user sudah login,
 * panggil API backend (Supabase) di dalam `toggle` dan baca status awalnya dari API.
 */
export function useWishlist(eventId: string) {
  const [wishlisted, setWishlisted] = useState<boolean>(false);

  // Dibaca di useEffect supaya tidak bentrok dengan render di server (hydration)
  useEffect(() => {
    setWishlisted(readIds().includes(eventId));
  }, [eventId]);

  /** Mengembalikan status baru (true = ditambahkan, false = dihapus) */
  const toggle = useCallback((): boolean => {
    const ids = readIds();
    const has = ids.includes(eventId);
    writeIds(has ? ids.filter((id) => id !== eventId) : [...ids, eventId]);
    setWishlisted(!has);
    return !has;
  }, [eventId]);

  return { wishlisted, toggle };
}