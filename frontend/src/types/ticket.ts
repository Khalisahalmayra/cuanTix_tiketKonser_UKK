export type TicketStatus =
  | "valid" // asli & belum dipakai
  | "used" // asli tapi sudah pernah dipakai
  | "cancelled" // dibatalkan / refund
  | "expired" // event sudah lewat
  | "wrong_gate" // tiket asli, tapi untuk gate lain
  | "invalid"; // kode tidak ditemukan / palsu

export interface TicketInfo {
  code: string;
  eventTitle: string;
  eventDate?: string; // ISO string
  venue?: string;
  ticketType?: string;
  holderName?: string;
  gate?: string; // contoh: "Gate 3"
  section?: string; // contoh: "Tribun Timur" / "Festival A"
  seat?: string; // contoh: "B-12" (kosong untuk tiket festival/berdiri)
  usedAt?: string | null; // ISO string
  usedBy?: string | null; // nama petugas yang meng-check-in
}

export interface TicketCheckResult {
  status: TicketStatus;
  message: string;
  ticket?: TicketInfo;
}

export interface CheckInResult extends TicketCheckResult {
  success: boolean;
}

// Bentuk mentah dari backend (snake_case) — sesuaikan dengan API kamu
export interface TicketApiResponse {
  code: string;
  event_title: string;
  event_date?: string;
  venue?: string;
  ticket_type?: string;
  holder_name?: string;
  gate?: string;
  section?: string;
  seat?: string;
  used_at?: string | null;
  used_by?: string | null;
}

export function mapTicketApiResponse(raw: TicketApiResponse): TicketInfo {
  return {
    code: raw.code,
    eventTitle: raw.event_title,
    eventDate: raw.event_date,
    venue: raw.venue,
    ticketType: raw.ticket_type,
    holderName: raw.holder_name,
    gate: raw.gate,
    section: raw.section,
    seat: raw.seat,
    usedAt: raw.used_at,
    usedBy: raw.used_by,
  };
}