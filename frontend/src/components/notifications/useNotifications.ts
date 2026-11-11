"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { NOTIFICATIONS, type NotificationView } from "./data";

/**
 * Status dibaca / dihapus disimpan sementara di localStorage dan disinkronkan
 * antar komponen (bell di navbar + halaman notifikasi).
 * TODO: kalau sudah pakai backend, ganti load/save dengan panggilan API.
 */

const STORAGE_KEY = "cuantix:notifications";
const CHANGE_EVENT = "cuantix:notifications-change";

type Stored = { read: string[]; removed: string[] };

const EMPTY: Stored = { read: [], removed: [] };

function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((x): x is string => typeof x === "string") : [];
}

function load(): Stored {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return { read: toStringArray(parsed?.read), removed: toStringArray(parsed?.removed) };
  } catch {
    return EMPTY;
  }
}

function save(next: Stored): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // storage penuh / diblokir — abaikan
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useNotifications() {
  const [stored, setStored] = useState<Stored>(EMPTY);
  // false sampai localStorage terbaca, supaya tidak ada "kedip" badge / status di render pertama
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    function sync() {
      setStored(load());
      setReady(true);
    }

    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const items: NotificationView[] = useMemo(
    () =>
      NOTIFICATIONS.filter((n) => !stored.removed.includes(n.id)).map((n) => ({
        ...n,
        read: stored.read.includes(n.id),
      })),
    [stored]
  );

  const unreadCount = ready ? items.filter((n) => !n.read).length : 0;

  const markRead = useCallback((id: string) => {
    const current = load();
    if (!current.read.includes(id)) save({ ...current, read: [...current.read, id] });
  }, []);

  const markAllRead = useCallback(() => {
    const current = load();
    save({ ...current, read: NOTIFICATIONS.map((n) => n.id) });
  }, []);

  const remove = useCallback((id: string) => {
    const current = load();
    if (!current.removed.includes(id)) save({ ...current, removed: [...current.removed, id] });
  }, []);

  return { items, unreadCount, ready, markRead, markAllRead, remove };
}