import { ReactNode } from "react";
import {
  BadgeCheck,
  Ban,
  CalendarX2,
  CircleAlert,
  MapPinOff,
  ShieldX,
} from "lucide-react";

import { TicketCheckResult, TicketStatus } from "@/types/ticket";
import { formatDateTime, isWrongGate } from "@/lib/tickets";

interface StatusStyle {
  label: string;
  icon: ReactNode;
  box: string;
  iconWrap: string;
  title: string;
}

const STATUS_STYLES: Record<TicketStatus, StatusStyle> = {
  valid: {
    label: "Tiket Valid",
    icon: <BadgeCheck className="h-8 w-8" />,
    box: "border-emerald-200 bg-emerald-50",
    iconWrap: "bg-emerald-500 text-white",
    title: "text-emerald-700",
  },
  used: {
    label: "Sudah Digunakan",
    icon: <CircleAlert className="h-8 w-8" />,
    box: "border-amber-200 bg-amber-50",
    iconWrap: "bg-amber-500 text-white",
    title: "text-amber-700",
  },
  wrong_gate: {
    label: "Salah Gate",
    icon: <MapPinOff className="h-8 w-8" />,
    box: "border-orange-200 bg-orange-50",
    iconWrap: "bg-orange-500 text-white",
    title: "text-orange-700",
  },
  cancelled: {
    label: "Tiket Dibatalkan",
    icon: <Ban className="h-8 w-8" />,
    box: "border-red-200 bg-red-50",
    iconWrap: "bg-red-500 text-white",
    title: "text-red-700",
  },
  expired: {
    label: "Tiket Kedaluwarsa",
    icon: <CalendarX2 className="h-8 w-8" />,
    box: "border-red-200 bg-red-50",
    iconWrap: "bg-red-500 text-white",
    title: "text-red-700",
  },
  invalid: {
    label: "Tiket Tidak Valid",
    icon: <ShieldX className="h-8 w-8" />,
    box: "border-red-200 bg-red-50",
    iconWrap: "bg-red-500 text-white",
    title: "text-red-700",
  },
};

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-right font-semibold text-gray-900">{value}</span>
    </div>
  );
}

interface ScanResultCardProps {
  result: TicketCheckResult;
  /** true = tiket baru saja berhasil di-check-in pada langkah ini */
  checkedIn: boolean;
  busy: boolean;
  /** Gate tempat petugas ini bertugas, untuk mendeteksi salah gate. */
  officerGate?: string;
  onConfirm: () => void;
  onNext: () => void;
}

export default function ScanResultCard({
  result,
  checkedIn,
  busy,
  officerGate,
  onConfirm,
  onNext,
}: ScanResultCardProps) {
  const { ticket } = result;

  // Pengaman di frontend: kalau backend belum menolak salah gate
  // (masih membalas "valid"), tiket tetap diperlakukan sebagai salah gate.
  const wrongGateByClient =
    result.status === "valid" &&
    !checkedIn &&
    isWrongGate(ticket?.gate, officerGate);

  const effectiveStatus: TicketStatus = wrongGateByClient
    ? "wrong_gate"
    : result.status;

  // Setelah check-in sukses, status di data = "used" tapi tampilannya harus hijau.
  const style = STATUS_STYLES[checkedIn ? "valid" : effectiveStatus];
  const label = checkedIn ? "Check-in Berhasil" : style.label;
  const message = wrongGateByClient
    ? `Tiket ini untuk ${ticket?.gate}, sedangkan kamu bertugas di ${officerGate}. Tiket tidak bisa dipakai di gate ini.`
    : result.message;

  const showGate = Boolean(
    ticket?.gate &&
      (effectiveStatus === "valid" ||
        effectiveStatus === "wrong_gate" ||
        checkedIn)
  );

  const seatInfo = [
    ticket?.section,
    ticket?.seat ? `Kursi ${ticket.seat}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const canCheckIn = effectiveStatus === "valid" && !checkedIn;

  return (
    <div className={`rounded-[20px] border-2 p-5 ${style.box}`}>
      <div className="flex items-center gap-4">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${style.iconWrap}`}
        >
          {style.icon}
        </div>
        <div className="min-w-0">
          <h2 className={`text-lg font-bold ${style.title}`}>{label}</h2>
          <p className="text-sm text-gray-600">{message}</p>
        </div>
      </div>

      {/* GATE TUJUAN */}
      {showGate && ticket && (
        <div
          className="mt-5 rounded-xl p-4 text-white shadow-md"
          style={{
            background: "linear-gradient(135deg,#E91E8C 0%,#4C1D95 100%)",
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
            Arahkan pengunjung ke
          </p>
          <p className="text-3xl font-extrabold leading-tight">{ticket.gate}</p>
          {seatInfo && (
            <p className="mt-1 text-sm font-medium text-white/90">{seatInfo}</p>
          )}
        </div>
      )}

      {ticket && (
        <div className="mt-4 space-y-2 rounded-xl bg-white p-4">
          <Row label="Kode Tiket" value={ticket.code} />
          <Row label="Event" value={ticket.eventTitle} />
          <Row label="Jenis Tiket" value={ticket.ticketType} />
          <Row label="Pemilik" value={ticket.holderName} />
          <Row label="Venue" value={ticket.venue} />
          <Row
            label="Jadwal"
            value={ticket.eventDate ? formatDateTime(ticket.eventDate) : null}
          />
          {effectiveStatus === "used" && (
            <>
              <Row label="Dipakai pada" value={formatDateTime(ticket.usedAt)} />
              <Row label="Oleh petugas" value={ticket.usedBy} />
            </>
          )}
        </div>
      )}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        {canCheckIn && (
          <button
            onClick={onConfirm}
            disabled={busy}
            className="flex-1 rounded-full py-3 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{
              background: "linear-gradient(90deg,#E91E8C 0%,#4C1D95 100%)",
            }}
          >
            {busy ? "Memproses..." : "Izinkan Masuk"}
          </button>
        )}
        <button
          onClick={onNext}
          disabled={busy}
          className="flex-1 rounded-full border-2 border-[#E91E8C] bg-white py-3 text-sm font-semibold text-[#E91E8C] transition-colors hover:bg-[#FDF0F8] disabled:opacity-60"
        >
          {canCheckIn ? "Batal / Scan Lagi" : "Scan Tiket Berikutnya"}
        </button>
      </div>
    </div>
  );
}