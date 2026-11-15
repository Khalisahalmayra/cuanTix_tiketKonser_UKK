import { CheckInResult, TicketCheckResult, TicketInfo } from "@/types/ticket";
import { PetugasProfile } from "@/types/petugas";

/**
 * Mode dummy: aktif kalau .env.local berisi NEXT_PUBLIC_USE_MOCK=true
 * Semua data di file ini palsu — cuma untuk mengecek tampilan tanpa backend.
 * Matikan (hapus / set false) kalau backend sudah siap.
 */
export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

const wait = (ms = 500) => new Promise<void>((r) => setTimeout(r, ms));

const MOCK_OFFICER_NAME = "Rina Wulandari";
const MOCK_OFFICER_GATE = "Gate 3";
const USED_KEY = "mock_used_tickets";

// ---------------------------------------------------------------- petugas

function formatHHmmJakarta(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  }).format(date);
}

export async function mockGetPetugasProfile(): Promise<PetugasProfile> {
  await wait(400);
  const now = Date.now();
  return {
    id: 1,
    name: MOCK_OFFICER_NAME,
    role: "Petugas Scan",
    gate: MOCK_OFFICER_GATE,
    shiftName: "Shift 2",
    // Jam shift selalu membungkus waktu sekarang, jadi status "di luar shift" tidak muncul.
    shiftStart: formatHHmmJakarta(new Date(now - 2 * 60 * 60 * 1000)),
    shiftEnd: formatHHmmJakarta(new Date(now + 6 * 60 * 60 * 1000)),
    eventTitle: "Senada Indonesia - 2026",
    onlineSince: new Date(now - 95 * 60 * 1000).toISOString(),
    coordinatorPhone: "+6281234567890",
  };
}

export async function mockSendHelpRequest(): Promise<void> {
  await wait(700);
}

// ----------------------------------------------------------------- tiket

const BASE = {
  eventTitle: "Senada Indonesia - 2026",
  eventDate: "2026-11-15T19:00:00+07:00",
  venue: "Istora Senayan",
};

/**
 * Kode untuk dites (ketik di "Kode tiket manual", atau buat QR dari teks ini):
 *   TIX-VALID-001   → valid, Gate 3 (sama dengan gate petugas)
 *   TIX-VALID-002   → asli tapi untuk Gate 5 → DITOLAK (salah gate)
 *   TIX-USED-001    → sudah pernah dipakai
 *   TIX-CANCEL-001  → dibatalkan
 *   TIX-EXPIRED-001 → kedaluwarsa
 *   kode lain       → tidak valid
 */
const TICKETS: Record<string, { status: "valid" | "used" | "cancelled" | "expired"; info: TicketInfo }> = {
  "TIX-VALID-001": {
    status: "valid",
    info: {
      ...BASE,
      code: "TIX-VALID-001",
      ticketType: "Festival",
      holderName: "Budi Santoso",
      gate: "Gate 3",
      section: "Festival A",
    },
  },
  "TIX-VALID-002": {
    status: "valid",
    info: {
      ...BASE,
      code: "TIX-VALID-002",
      ticketType: "Tribun VIP",
      holderName: "Siti Aminah",
      gate: "Gate 5",
      section: "Tribun Timur",
      seat: "B-12",
    },
  },
  "TIX-USED-001": {
    status: "used",
    info: {
      ...BASE,
      code: "TIX-USED-001",
      ticketType: "Festival",
      holderName: "Andi Pratama",
      gate: "Gate 3",
      section: "Festival A",
      usedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      usedBy: "Dimas Pratama",
    },
  },
  "TIX-CANCEL-001": {
    status: "cancelled",
    info: {
      ...BASE,
      code: "TIX-CANCEL-001",
      ticketType: "Festival",
      holderName: "Rudi Hartono",
    },
  },
  "TIX-EXPIRED-001": {
    status: "expired",
    info: {
      ...BASE,
      code: "TIX-EXPIRED-001",
      eventDate: "2026-10-10T19:00:00+07:00",
      ticketType: "Festival",
      holderName: "Dewi Lestari",
    },
  },
};

// Tiket yang sudah di-check-in selama sesi browser ini (bertahan walau halaman di-refresh).
function readUsed(): Record<string, { usedAt: string; usedBy: string }> {
  try {
    return JSON.parse(window.sessionStorage.getItem(USED_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function writeUsed(data: Record<string, { usedAt: string; usedBy: string }>) {
  try {
    window.sessionStorage.setItem(USED_KEY, JSON.stringify(data));
  } catch {
    // abaikan
  }
}

function resolveTicket(code: string): TicketCheckResult {
  const key = code.trim().toUpperCase();
  const found = TICKETS[key];

  if (!found) {
    return {
      status: "invalid",
      message: "Kode tiket tidak ditemukan. Kemungkinan tiket palsu.",
    };
  }

  const usedLocally = readUsed()[key];
  if (found.status === "valid" && usedLocally) {
    return {
      status: "used",
      message: "Tiket ini sudah digunakan.",
      ticket: { ...found.info, ...usedLocally },
    };
  }

  switch (found.status) {
    case "valid":
      // Seperti backend sungguhan: tiket untuk gate lain ditolak di gate ini.
      if (found.info.gate && found.info.gate !== MOCK_OFFICER_GATE) {
        return {
          status: "wrong_gate",
          message: `Tiket ini untuk ${found.info.gate}, sedangkan kamu bertugas di ${MOCK_OFFICER_GATE}.`,
          ticket: found.info,
        };
      }
      return {
        status: "valid",
        message: "Tiket asli dan belum digunakan.",
        ticket: found.info,
      };
    case "used":
      return {
        status: "used",
        message: "Tiket ini sudah digunakan.",
        ticket: found.info,
      };
    case "cancelled":
      return {
        status: "cancelled",
        message: "Tiket sudah dibatalkan / di-refund.",
        ticket: found.info,
      };
    default:
      return {
        status: "expired",
        message: "Event untuk tiket ini sudah lewat.",
        ticket: found.info,
      };
  }
}

export async function mockValidateTicket(code: string): Promise<TicketCheckResult> {
  await wait(600);
  return resolveTicket(code);
}

export async function mockCheckInTicket(code: string): Promise<CheckInResult> {
  await wait(600);
  const current = resolveTicket(code);

  if (current.status !== "valid" || !current.ticket) {
    return { ...current, success: false };
  }

  const record = { usedAt: new Date().toISOString(), usedBy: MOCK_OFFICER_NAME };
  const used = readUsed();
  used[current.ticket.code] = record;
  writeUsed(used);

  return {
    success: true,
    status: "used",
    message: "Tiket berhasil divalidasi dan ditandai sudah digunakan.",
    ticket: { ...current.ticket, ...record },
  };
}