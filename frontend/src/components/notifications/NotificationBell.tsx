"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import GradientIcon from "@/components/icon/GradientIcon";
import NotificationItem from "./NotificationItem";
import { useNotifications } from "./useNotifications";
import type { NotificationView } from "./data";

const BORDER_GRADIENT = "linear-gradient(90deg,#7C3AED 0%,#E91E8C 100%)";
const MAX_PREVIEW = 5;

type NotificationBellProps = {
  /** Halaman daftar lengkap notifikasi */
  allHref?: string;
};

export default function NotificationBell({ allHref = "/notifikasi" }: NotificationBellProps) {
  const router = useRouter();
  const { items, unreadCount, markRead, markAllRead } = useNotifications();

  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  function handleSelect(item: NotificationView) {
    markRead(item.id);
    setOpen(false);
    if (item.href) router.push(item.href);
  }

  const preview = items.slice(0, MAX_PREVIEW);

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={
          unreadCount > 0 ? `Notifikasi, ${unreadCount} belum dibaca` : "Notifikasi"
        }
        className="relative flex h-[44px] w-[44px] items-center justify-center rounded-[12px] transition-colors hover:bg-[#F3EBFF]"
        style={{
          border: "2px solid transparent",
          backgroundImage: `linear-gradient(${open ? "#F3EBFF" : "white"}, ${
            open ? "#F3EBFF" : "white"
          }), ${BORDER_GRADIENT}`,
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
        }}
      >
        <GradientIcon type="bell" size={22} />

        {unreadCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#E91E8C] px-1 text-[11px] font-bold leading-none text-white ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <h3 className="text-[15px] font-bold text-gray-900">Notifikasi</h3>
            <button
              type="button"
              onClick={markAllRead}
              disabled={unreadCount === 0}
              className="text-[12px] font-semibold text-[#6D28D9] hover:underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline"
            >
              Tandai semua dibaca
            </button>
          </div>

          {/* Daftar */}
          {preview.length > 0 ? (
            <ul className="max-h-[400px] divide-y divide-gray-100 overflow-y-auto">
              {preview.map((item) => (
                <NotificationItem key={item.id} item={item} onSelect={handleSelect} compact />
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
              <GradientIcon type="bell" size={32} />
              <p className="text-[14px] font-semibold text-gray-900">Belum ada notifikasi</p>
              <p className="text-[12px] text-gray-500">
                Info pembayaran, tiket, dan event akan muncul di sini.
              </p>
            </div>
          )}

          {/* Footer */}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              router.push(allHref);
            }}
            className="w-full border-t border-gray-200 py-3 text-[13px] font-semibold text-[#5B1AA8] transition-colors hover:bg-[#F3EBFF]"
          >
            Lihat semua notifikasi
          </button>
        </div>
      )}
    </div>
  );
}