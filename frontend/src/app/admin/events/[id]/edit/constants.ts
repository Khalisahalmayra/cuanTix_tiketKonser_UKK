import { Flame, Sparkles, Radio, Disc, Music } from "lucide-react";
import { CategoryItem, TicketPreset, ZoneColor, StepItem } from "./types";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const CATEGORIES: CategoryItem[] = [
  { id: 1, name: "Rock", icon: Flame, color: "#EF4444", bg: "#FEF2F2" },
  { id: 2, name: "Pop", icon: Sparkles, color: "#EC4899", bg: "#FDF2F8" },
  { id: 3, name: "Indie", icon: Radio, color: "#8B5CF6", bg: "#F5F3FF" },
  { id: 4, name: "EDM", icon: Disc, color: "#06B6D4", bg: "#ECFEFF" },
  { id: 5, name: "Jazz", icon: Music, color: "#F59E0B", bg: "#FFFBEB" },
];

export const TICKET_PRESETS: TicketPreset[] = [
  {
    name: "VIP",
    price: 750000,
    quota: 200,
    color: "#7C3AED",
    description: "Akses gate khusus, soundcheck viewing & exclusive merch",
  },
  {
    name: "Festival",
    price: 400000,
    quota: 500,
    color: "#EC4899",
    description: "Area berdiri depan panggung, official wristband",
  },
  {
    name: "CAT 1 (Numbered Seated)",
    price: 600000,
    quota: 350,
    color: "#2563EB",
    description: "Kursi bernomor tier 1 dengan view panggung lurus",
  },
  {
    name: "CAT 2 (Seated)",
    price: 450000,
    quota: 400,
    color: "#059669",
    description: "Kursi bertingkat tier 2, akses fasilitas tribun",
  },
  {
    name: "Early Bird",
    price: 300000,
    quota: 150,
    color: "#F59E0B",
    description: "Tiket promo khusus pembeli pertama kuota terbatas",
  },
  {
    name: "Platinum VIP",
    price: 1250000,
    quota: 80,
    color: "#9333EA",
    description: "Meet & greet pass, VIP lounge access & premium gift",
  },
  {
    name: "Tribune Barat",
    price: 350000,
    quota: 300,
    color: "#0D9488",
    description: "Tribun sisi barat dengan tempat duduk beratap",
  },
];

export const ZONE_COLORS: ZoneColor[] = [
  { label: "Ungu VIP", hex: "#7C3AED" },
  { label: "Pink Magenta", hex: "#EC4899" },
  { label: "Biru CAT 1", hex: "#2563EB" },
  { label: "Hijau Emerald", hex: "#059669" },
  { label: "Kuning Amber", hex: "#F59E0B" },
  { label: "Teal Cyan", hex: "#0D9488" },
  { label: "Indigo Navy", hex: "#4338CA" },
];

export const STEPS: StepItem[] = [
  { id: 1, label: "Informasi Event", anchor: "#informasi" },
  { id: 2, label: "Jadwal & Lokasi", anchor: "#jadwal" },
  { id: 3, label: "Pengaturan Tiket", anchor: "#tiket" },
  { id: 4, label: "Denah Panggung", anchor: "#denah" },
  { id: 5, label: "Review & Simpan", anchor: "#review" },
];
