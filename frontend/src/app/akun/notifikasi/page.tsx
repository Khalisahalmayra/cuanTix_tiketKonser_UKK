"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import Footer from "@/components/footer/Footer";
import GradientIcon from "@/components/icon/GradientIcon";
import NotificationItem from "@/components/notifications/NotificationItem";
import { useNotifications } from "@/components/notifications/useNotifications";
import {
  TYPE_META,
  type NotificationType,
  type NotificationView,
} from "@/components/notifications/data";

const BORDER_GRADIENT = "linear-gradient(90deg,#7C3AED 0%,#E91E8C 100%)";
const TITLE_GRADIENT = "linear-gradient(90deg,#E91E8C 0%,#5B1AA8 100%)";

type FilterId = "semua" | "belum-dibaca" | NotificationType;

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "semua", label: "Semua" },
  { id: "belum-dibaca", label: "Belum Dibaca" },
  ...(Object.keys(TYPE_META) as NotificationType[]).map((t) => ({
    id: t as FilterId,
    label: TYPE_META[t].label,
  })),
];

export default function NotifikasiPage() {
  const router = useRouter();
  const { items, unreadCount, ready, markRead, markAllRead, remove } = useNotifications();
  const [filter, setFilter] = useState<FilterId>("semua");

  const filtered = items.filter((n) => {
    if (filter === "semua") return true;
    if (filter === "belum-dibaca") return !n.read;
    return n.type === filter;
  });

  function handleSelect(item: NotificationView) {
    markRead(item.id);
    if (item.href) router.push(item.href);
  }

  return (
    <div
      className="min-h-screen bg-[#F2F2F2]"
      style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
    >
      <HomeNavbar />

      <main className="mx-auto w-full max-w-[900px] px-5 py-8 sm:px-8">
        {/* Judul */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1
              className="inline-block text-[22px] font-bold"
              style={{
                backgroundImage: TITLE_GRADIENT,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Notifikasi
            </h1>
            <p className="mt-1 text-[13px] text-gray-700">
              {unreadCount > 0
                ? `${unreadCount} notifikasi belum dibaca`
                : "Semua notifikasi sudah dibaca"}
            </p>
          </div>

          <button
            type="button"
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-[#5B1AA8] shadow-sm transition-colors hover:bg-[#F3EBFF] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <GradientIcon type="checkCircle" size={18} />
            Tandai semua dibaca
          </button>
        </div>

        {/* Filter */}
        <div
          role="tablist"
          aria-label="Filter notifikasi"
          className="mt-5 flex gap-2 overflow-x-auto pb-1"
        >
          {FILTERS.map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f.id)}
                className="shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-[12px] font-semibold transition-colors"
                style={{
                  color: active ? "#ffffff" : "#6D28D9",
                  border: "1.5px solid transparent",
                  backgroundImage: active
                    ? `${BORDER_GRADIENT}`
                    : `linear-gradient(white, white), ${BORDER_GRADIENT}`,
                  backgroundOrigin: "border-box",
                  backgroundClip: active ? "border-box" : "padding-box, border-box",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Daftar */}
        <section className="mt-5 overflow-hidden rounded-[14px] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.12)]">
          {!ready ? (
            <div className="px-6 py-14 text-center text-[13px] text-gray-500">Memuat…</div>
          ) : filtered.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {filtered.map((item) => (
                <NotificationItem
                  key={item.id}
                  item={item}
                  onSelect={handleSelect}
                  onRemove={remove}
                />
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
              <GradientIcon type="bell" size={36} />
              <p className="text-[15px] font-semibold text-gray-900">
                {filter === "semua" ? "Belum ada notifikasi" : "Tidak ada notifikasi di filter ini"}
              </p>
              <p className="text-[13px] text-gray-500">
                Info pembayaran, tiket, dan event akan muncul di sini.
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}