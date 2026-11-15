export interface PetugasProfile {
  id: number | string;
  name: string;
  role: string; // contoh: "Petugas Scan"
  gate: string; // gate tempat bertugas, contoh: "Gate 3"
  shiftName: string; // contoh: "Shift 2"
  shiftStart: string; // "HH:mm" WIB, contoh: "14:00"
  shiftEnd: string; // "HH:mm" WIB, contoh: "22:00"
  eventTitle?: string;
  onlineSince?: string | null; // ISO — waktu login petugas (opsional)
  coordinatorPhone?: string; // nomor koordinator untuk tombol telepon
}

// Bentuk mentah dari backend (snake_case) — sesuaikan dengan API kamu
export interface PetugasApiResponse {
  id: number | string;
  name: string;
  role?: string;
  gate: string;
  shift_name: string;
  shift_start: string;
  shift_end: string;
  event_title?: string;
  online_since?: string | null;
  coordinator_phone?: string;
}

export function mapPetugasApiResponse(raw: PetugasApiResponse): PetugasProfile {
  return {
    id: raw.id,
    name: raw.name,
    role: raw.role ?? "Petugas Scan",
    gate: raw.gate,
    shiftName: raw.shift_name,
    shiftStart: raw.shift_start,
    shiftEnd: raw.shift_end,
    eventTitle: raw.event_title,
    onlineSince: raw.online_since,
    coordinatorPhone: raw.coordinator_phone,
  };
}

export type HelpCategory =
  | "scanner"
  | "tiket"
  | "keamanan"
  | "medis"
  | "lainnya";

export interface HelpOption {
  id: HelpCategory;
  label: string;
  desc: string;
  urgent?: boolean;
}

export const HELP_OPTIONS: HelpOption[] = [
  {
    id: "scanner",
    label: "Scanner / kamera bermasalah",
    desc: "Kamera tidak terbuka, QR tidak terbaca, aplikasi error",
  },
  {
    id: "tiket",
    label: "Tiket bermasalah",
    desc: "Pengunjung protes, tiket ganda, atau data tidak cocok",
  },
  {
    id: "keamanan",
    label: "Keamanan / antrean ricuh",
    desc: "Butuh tambahan petugas keamanan di gate",
    urgent: true,
  },
  {
    id: "medis",
    label: "Darurat medis",
    desc: "Ada pengunjung yang butuh pertolongan segera",
    urgent: true,
  },
  {
    id: "lainnya",
    label: "Lainnya",
    desc: "Kendala lain yang butuh bantuan koordinator",
  },
];