import {
  HelpCategory,
  PetugasApiResponse,
  PetugasProfile,
  mapPetugasApiResponse,
} from "@/types/petugas";
import {
  USE_MOCK,
  mockGetPetugasProfile,
  mockSendHelpRequest,
} from "@/lib/mock";

// .env.local → NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

const ONLINE_SINCE_KEY = "petugas_online_since";

export class SessionExpiredError extends Error {
  constructor(message = "Sesi petugas tidak valid. Silakan login ulang.") {
    super(message);
    this.name = "SessionExpiredError";
  }
}

// Ganti dengan cara kamu menyimpan token login petugas.
function authHeaders(): HeadersInit {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("token");
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

/** Profil petugas yang sedang login: nama, gate, dan jadwal shift. */
export async function getPetugasProfile(): Promise<PetugasProfile> {
  if (USE_MOCK) return mockGetPetugasProfile();

  const res = await fetch(`${API_BASE_URL}/api/petugas/me`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  if (res.status === 401 || res.status === 403) throw new SessionExpiredError();
  if (!res.ok) throw new Error("Gagal memuat data petugas.");

  const json = await res.json();
  // Asumsi response: { data: {...} } atau objek langsung
  const raw: PetugasApiResponse = json.data ?? json;
  return mapPetugasApiResponse(raw);
}

export async function logoutPetugas(): Promise<void> {
  try {
    if (!USE_MOCK) {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: authHeaders(),
      });
    }
  } catch {
    // Logout tetap lanjut walau server tidak terjangkau.
  } finally {
    try {
      window.localStorage.removeItem("token");
      window.sessionStorage.removeItem(ONLINE_SINCE_KEY);
    } catch {
      // storage tidak tersedia — abaikan
    }
  }
}

export interface HelpRequestPayload {
  category: HelpCategory;
  note?: string;
  gate?: string;
}

export async function sendHelpRequest(
  payload: HelpRequestPayload
): Promise<void> {
  if (USE_MOCK) return mockSendHelpRequest();

  const res = await fetch(`${API_BASE_URL}/api/petugas/help`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (res.status === 401 || res.status === 403) throw new SessionExpiredError();
  if (!res.ok) {
    throw new Error(
      "Permintaan bantuan gagal dikirim. Coba lagi atau hubungi koordinator langsung."
    );
  }
}

/**
 * Kapan petugas mulai "online" di sesi ini (epoch ms).
 * Pakai waktu login dari backend kalau ada; kalau tidak, pakai waktu
 * pertama kali halaman dibuka di sesi browser ini.
 */
export function resolveOnlineSince(profile: PetugasProfile): number {
  const fromServer = profile.onlineSince ? Date.parse(profile.onlineSince) : NaN;
  if (!Number.isNaN(fromServer)) return fromServer;

  try {
    const saved = window.sessionStorage.getItem(ONLINE_SINCE_KEY);
    if (saved && !Number.isNaN(Number(saved))) return Number(saved);
    const now = Date.now();
    window.sessionStorage.setItem(ONLINE_SINCE_KEY, String(now));
    return now;
  } catch {
    return Date.now();
  }
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

function nowMinutesJakarta(date: Date): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  }).formatToParts(date);
  const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0) % 24;
  const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return h * 60 + m;
}

/** Apakah sekarang (WIB) masih di dalam jam shift? Mendukung shift lewat tengah malam. */
export function isWithinShift(
  start: string,
  end: string,
  date: Date = new Date()
): boolean {
  const s = toMinutes(start);
  const e = toMinutes(end);
  const n = nowMinutesJakarta(date);
  return s <= e ? n >= s && n < e : n >= s || n < e;
}

/** 135 menit → "2j 15m", 40 menit → "40m" */
export function formatElapsed(ms: number): string {
  const totalMin = Math.max(0, Math.floor(ms / 60000));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h > 0 ? `${h}j ${m}m` : `${m}m`;
}