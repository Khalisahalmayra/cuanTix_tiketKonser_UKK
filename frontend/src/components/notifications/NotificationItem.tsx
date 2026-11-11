"use client";

import GradientIcon from "@/components/icon/GradientIcon";
import { TYPE_META, type NotificationView } from "./data";

const BORDER_GRADIENT = "linear-gradient(90deg,#7C3AED 0%,#E91E8C 100%)";

type NotificationItemProps = {
  item: NotificationView;
  onSelect: (item: NotificationView) => void;
  /** Kalau diisi, muncul tombol hapus saat di-hover */
  onRemove?: (id: string) => void;
  /** Versi ringkas untuk dropdown (pesan dipotong 2 baris) */
  compact?: boolean;
};

export default function NotificationItem({
  item,
  onSelect,
  onRemove,
  compact = false,
}: NotificationItemProps) {
  const meta = TYPE_META[item.type];

  return (
    <li className="group relative">
      <button
        type="button"
        onClick={() => onSelect(item)}
        className={`flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[#F3EBFF] ${
          item.read ? "bg-white" : "bg-[#FBF7FF]"
        } ${onRemove ? "pr-11" : ""}`}
      >
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
          style={{
            border: "1.5px solid transparent",
            backgroundImage: `linear-gradient(white, white), ${BORDER_GRADIENT}`,
            backgroundOrigin: "border-box",
            backgroundClip: "padding-box, border-box",
          }}
        >
          <GradientIcon type={meta.icon} size={20} />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span
              className={`text-[14px] text-gray-900 ${item.read ? "font-medium" : "font-bold"}`}
            >
              {item.title}
            </span>
            {!item.read && (
              <span
                className="h-2 w-2 shrink-0 rounded-full bg-[#E91E8C]"
                aria-label="Belum dibaca"
              />
            )}
          </span>

          <span
            className={`mt-0.5 block text-[13px] leading-snug text-gray-600 ${
              compact ? "line-clamp-2" : ""
            }`}
          >
            {item.message}
          </span>

          <span className="mt-1.5 flex items-center gap-1.5 text-[11px] text-gray-500">
            <GradientIcon type="clock" size={12} color="#6B7280" />
            {item.time}
            <span className="text-gray-300">•</span>
            {meta.label}
          </span>
        </span>
      </button>

      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          aria-label={`Hapus notifikasi ${item.title}`}
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full opacity-0 transition-opacity hover:bg-white focus:opacity-100 group-hover:opacity-100"
        >
          <GradientIcon type="close" size={16} color="#9CA3AF" />
        </button>
      )}
    </li>
  );
}