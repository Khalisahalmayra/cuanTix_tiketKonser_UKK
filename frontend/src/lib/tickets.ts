import {
  CheckInResult,
  TicketApiResponse,
  TicketCheckResult,
  TicketStatus,
  mapTicketApiResponse,
} from "@/types/ticket";
import { USE_MOCK, mockCheckInTicket, mockValidateTicket } from "@/lib/mock";

// .env.local → NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

interface ApiEnvelope {
  status?: TicketStatus;
  message?: string;
  success?: boolean;
  data?: TicketApiResponse | null;
}

async function postJson(path: string, body: unknown): Promise<ApiEnvelope> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
    cache: "no-store",
  });

  // 401/403 = bukan petugas / sesi habis
  if (res.status === 401 || res.status === 403) {
    throw new Error("Sesi petugas tidak valid. Silakan login ulang.");
  }

  // Backend boleh membalas 404/409/410 dengan body JSON (status tiket),
  // jadi body tetap dibaca; hanya error server (5xx) yang dianggap gagal.
  if (res.status >= 500) {
    throw new Error("Server sedang bermasalah. Coba lagi sebentar.");
  }

  return (await res.json()) as ApiEnvelope;
}

/**
 * Langkah 1 — hanya MEMERIKSA (read-only):
 * keaslian kode, status tiket, dan apakah sudah pernah dipakai.
 * Tidak mengubah apa pun di database.
 */
export async function validateTicket(code: string): Promise<TicketCheckResult> {
  if (USE_MOCK) return mockValidateTicket(code);

  const json = await postJson("/api/tickets/validate", { code });
  return {
    status: json.status ?? "invalid",
    message: json.message ?? "Tiket tidak dikenali.",
    ticket: json.data ? mapTicketApiResponse(json.data) : undefined,
  };
}

/**
 * Langkah 2 — MENGUBAH status tiket menjadi "sudah digunakan".
 * Backend WAJIB memvalidasi ulang & meng-update secara atomik
 * (contoh SQL: UPDATE tickets SET status='used', used_at=NOW()
 *  WHERE code=? AND status='valid') supaya dua petugas yang scan
 * bersamaan tidak bisa sama-sama lolos.
 */
export async function checkInTicket(code: string): Promise<CheckInResult> {
  if (USE_MOCK) return mockCheckInTicket(code);

  const json = await postJson("/api/tickets/check-in", { code });
  return {
    success: Boolean(json.success),
    status: json.status ?? "invalid",
    message: json.message ?? "Check-in gagal.",
    ticket: json.data ? mapTicketApiResponse(json.data) : undefined,
  };
}

// Isi QR bisa berupa kode polos ("TIX-123") atau URL ("https://.../t/TIX-123").
export function extractTicketCode(raw: string): string {
  const text = raw.trim();
  try {
    const url = new URL(text);
    const fromQuery = url.searchParams.get("code") ?? url.searchParams.get("ticket");
    if (fromQuery) return fromQuery.trim();
    const last = url.pathname.split("/").filter(Boolean).pop();
    if (last) return decodeURIComponent(last).trim();
  } catch {
    // bukan URL → pakai apa adanya
  }
  return text;
}

/** true kalau tiket punya gate dan gate itu berbeda dari gate petugas. */
export function isWrongGate(
  ticketGate?: string | null,
  officerGate?: string | null
): boolean {
  if (!ticketGate || !officerGate) return false;
  const norm = (v: string) => v.toLowerCase().replace(/\s+/g, "");
  return norm(ticketGate) !== norm(officerGate);
}

export function formatDateTime(iso?: string | null): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  }).format(d);
}
