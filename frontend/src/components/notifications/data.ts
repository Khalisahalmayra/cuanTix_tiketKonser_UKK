import type { GradientIconType } from "@/components/icon/GradientIcon";

export type NotificationType = "pembayaran" | "tiket" | "event" | "promo" | "sistem";

export type NotificationData = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  /** Teks waktu siap tampil. TODO: kalau dari API pakai timestamp lalu format di client */
  time: string;
  /** Tujuan saat notifikasi diklik (opsional) */
  href?: string;
};

export type NotificationView = NotificationData & { read: boolean };

export const TYPE_META: Record<NotificationType, { label: string; icon: GradientIconType }> = {
  pembayaran: { label: "Pembayaran", icon: "creditCard" },
  tiket: { label: "Tiket", icon: "ticket" },
  event: { label: "Event", icon: "calendar" },
  promo: { label: "Promo", icon: "megaphone" },
  sistem: { label: "Info", icon: "info" },
};

// TODO: ganti dengan data dari API / Supabase milik user yang sedang login
export const NOTIFICATIONS: NotificationData[] = [
  {
    id: "n1",
    type: "pembayaran",
    title: "Pembayaran berhasil",
    message: "Pembayaran tiket Snada Indonesia - 2026 (VIP) telah kami terima.",
    time: "5 menit lalu",
    href: "/akun/pesanan",
  },
  {
    id: "n2",
    type: "tiket",
    title: "E-tiket siap digunakan",
    message: "E-tiket Snada Indonesia - 2026 sudah tersedia di menu Pesanan Kamu.",
    time: "1 jam lalu",
    href: "/akun/pesanan",
  },
  {
    id: "n3",
    type: "pembayaran",
    title: "Menunggu pembayaran",
    message: "Selesaikan pembayaran pesanan Gold A sebelum batas waktu berakhir.",
    time: "3 jam lalu",
    href: "/akun/pesanan",
  },
  {
    id: "n4",
    type: "event",
    title: "Pengingat event",
    message:
      "Snada Indonesia - 2026 berlangsung pada Sabtu, 10 Oktober 2026 pukul 22.00 WIB di Istora Senayan.",
    time: "Kemarin",
    href: "/event/snada-indonesia-2026",
  },
  {
    id: "n5",
    type: "promo",
    title: "Konser baru menanti kamu",
    message: "Cek event terbaru dan temukan konser favoritmu di Cuantix.",
    time: "2 hari lalu",
    href: "/",
  },
  {
    id: "n6",
    type: "sistem",
    title: "Selamat datang di Cuantix",
    message: "Lengkapi profilmu agar proses pembelian tiket lebih cepat.",
    time: "3 hari lalu",
    href: "/akun/profil",
  },
];