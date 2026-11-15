"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Keyboard, Square } from "lucide-react";

import PetugasNavbar from "@/components/petugas/PetugasNavbar";
import QrScanner from "@/components/scan/QrScanner";
import ScanResultCard from "@/components/scan/ScanResultCard";
import ScanStartCard from "@/components/scan/ScanStartCard";
import { PetugasProfile } from "@/types/petugas";
import { TicketCheckResult, TicketStatus } from "@/types/ticket";
import {
  SessionExpiredError,
  getPetugasProfile,
  logoutPetugas,
  resolveOnlineSince,
} from "@/lib/petugas";
import {
  checkInTicket,
  extractTicketCode,
  isWrongGate,
  validateTicket,
} from "@/lib/tickets";

interface HistoryItem {
  code: string;
  status: TicketStatus;
  checkedIn: boolean;
  time: string;
}

export default function PetugasScanPage() {
  const router = useRouter();

  // ---- data petugas ----
  const [profile, setProfile] = useState<PetugasProfile | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [onlineSince, setOnlineSince] = useState<number>(() => Date.now());

  // ---- state scan ----
  const [started, setStarted] = useState(false); // kamera baru nyala setelah "Mulai Scan"
  const [result, setResult] = useState<TicketCheckResult | null>(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Kunci supaya 1 QR yang terbaca berkali-kali (tiap frame) hanya diproses sekali.
  const lockRef = useRef(false);

  const scanning = started && result === null && !busy;

  useEffect(() => {
    let mounted = true;
    getPetugasProfile()
      .then((p) => {
        if (!mounted) return;
        setProfile(p);
        setOnlineSince(resolveOnlineSince(p));
      })
      .catch((err: unknown) => {
        if (!mounted) return;
        if (err instanceof SessionExpiredError) {
          router.replace("/login");
          return;
        }
        setProfileError(
          err instanceof Error ? err.message : "Gagal memuat data petugas."
        );
      });
    return () => {
      mounted = false;
    };
  }, [router]);

  const pushHistory = useCallback(
    (code: string, status: TicketStatus, didCheckIn: boolean) => {
      setHistory((prev) =>
        [
          {
            code,
            status,
            checkedIn: didCheckIn,
            time: new Date().toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              timeZone: "Asia/Jakarta",
            }),
          },
          ...prev,
        ].slice(0, 8)
      );
    },
    []
  );

  const officerGate = profile?.gate;

  const handleCode = useCallback(
    async (raw: string) => {
      if (lockRef.current) return;
      const code = extractTicketCode(raw);
      if (!code) return;

      lockRef.current = true;
      setBusy(true);
      setError(null);
      setCheckedIn(false);

      try {
        const res = await validateTicket(code);
        setResult({
          ...res,
          ticket: res.ticket ?? { code, eventTitle: "-" },
        });
        // Tiket yang tidak bisa dipakai langsung dicatat di riwayat.
        const wrongGate =
          res.status === "valid" && isWrongGate(res.ticket?.gate, officerGate);
        if (res.status !== "valid" || wrongGate) {
          pushHistory(code, wrongGate ? "wrong_gate" : res.status, false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memeriksa tiket.");
        lockRef.current = false;
      } finally {
        setBusy(false);
      }
    },
    [pushHistory, officerGate]
  );

  async function handleConfirm() {
    if (!result?.ticket) return;
    const code = result.ticket.code;
    setBusy(true);
    setError(null);
    try {
      const res = await checkInTicket(code);
      if (res.success) {
        setCheckedIn(true);
        setResult({
          status: "used",
          message: "Tiket berhasil divalidasi dan ditandai sudah digunakan.",
          ticket: res.ticket ?? result.ticket,
        });
        pushHistory(code, "valid", true);
      } else {
        // Contoh: tiket keburu dipakai petugas lain antara validasi & check-in.
        setCheckedIn(false);
        setResult({
          status: res.status,
          message: res.message,
          ticket: res.ticket ?? result.ticket,
        });
        pushHistory(code, res.status, false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Check-in gagal.");
    } finally {
      setBusy(false);
    }
  }

  function handleNext() {
    setResult(null);
    setCheckedIn(false);
    setError(null);
    setManualCode("");
    lockRef.current = false;
  }

  function handleStop() {
    handleNext();
    setStarted(false); // kamera mati, kembali ke layar "Mulai Scan"
  }

  function handleManualSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (manualCode.trim()) handleCode(manualCode);
  }

  async function handleRelogin() {
    await logoutPetugas();
    router.replace("/login");
  }

  const successCount = history.filter((h) => h.checkedIn).length;
  const rejectedCount = history.filter((h) => !h.checkedIn).length;

  // ---------- loading / error profil ----------
  if (!profile) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-[#FAF7FF] p-6"
        style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
      >
        {profileError ? (
          <div className="w-full max-w-sm rounded-[20px] border border-red-200 bg-white p-6 text-center shadow-sm">
            <p className="text-sm text-red-600">{profileError}</p>
            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={() => window.location.reload()}
                className="rounded-full py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-90"
                style={{
                  background: "linear-gradient(90deg,#E91E8C 0%,#4C1D95 100%)",
                }}
              >
                Coba Lagi
              </button>
              <button
                onClick={handleRelogin}
                className="rounded-full border-2 border-[#E91E8C] py-2.5 text-sm font-semibold text-[#E91E8C] hover:bg-[#FDF0F8]"
              >
                Login Ulang
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Memuat data petugas...</p>
        )}
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#FAF7FF]"
      style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
    >
      <PetugasNavbar profile={profile} onlineSince={onlineSince} />

      <main className="mx-auto max-w-xl space-y-5 px-5 py-6">
        {/* LAYAR MULAI — kamera belum aktif */}
        {!started && (
          <ScanStartCard profile={profile} onStart={() => setStarted(true)} />
        )}

        {/* SCANNER */}
        {started && !result && (
          <section>
            <QrScanner active={scanning} onDetect={handleCode} />
            <p className="mt-3 text-center text-sm text-gray-500">
              {busy
                ? "Memeriksa tiket..."
                : "Arahkan kamera ke QR Code pada tiket"}
            </p>
            <button
              onClick={handleStop}
              className="mx-auto mt-3 flex items-center gap-2 rounded-full border-2 border-gray-300 px-5 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
            >
              <Square className="h-3.5 w-3.5" />
              Selesai Scan
            </button>
          </section>
        )}

        {/* ERROR */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
            {result && (
              <span className="mt-1 block text-xs text-red-500">
                Status tiket belum berubah. Coba tekan tombolnya lagi.
              </span>
            )}
          </div>
        )}

        {/* HASIL */}
        {result && (
          <ScanResultCard
            result={result}
            checkedIn={checkedIn}
            busy={busy}
            officerGate={profile.gate}
            onConfirm={handleConfirm}
            onNext={handleNext}
          />
        )}

        {/* INPUT MANUAL */}
        {started && !result && (
          <form
            onSubmit={handleManualSubmit}
            className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm"
          >
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-900">
              <Keyboard className="h-4 w-4 text-[#7C3AED]" />
              Kode tiket manual
            </label>
            <div className="flex gap-2">
              <input
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Mis. TIX-2026-000123"
                className="min-w-0 flex-1 rounded-full border-2 border-[#7C3AED] px-4 py-2 text-sm text-[#6D28D9] outline-none"
              />
              <button
                type="submit"
                disabled={busy || !manualCode.trim()}
                className="rounded-full px-5 py-2 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{
                  background: "linear-gradient(90deg,#E91E8C 0%,#4C1D95 100%)",
                }}
              >
                Cek
              </button>
            </div>
          </form>
        )}

        {/* RINGKASAN & RIWAYAT SESI */}
        {history.length > 0 && (
          <section className="rounded-[20px] border border-gray-100 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">
                Riwayat scan sesi ini
              </h3>
              <span className="text-xs text-gray-500">
                <span className="font-semibold text-emerald-600">
                  {successCount} masuk
                </span>{" "}
                ·{" "}
                <span className="font-semibold text-red-500">
                  {rejectedCount} ditolak
                </span>
              </span>
            </div>
            <ul className="divide-y divide-gray-100">
              {history.map((h, i) => (
                <li
                  key={`${h.code}-${i}`}
                  className="flex items-center justify-between gap-3 py-2 text-sm"
                >
                  <span className="truncate font-medium text-gray-800">
                    {h.code}
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        h.checkedIn
                          ? "bg-emerald-100 text-emerald-700"
                          : h.status === "used"
                          ? "bg-amber-100 text-amber-700"
                          : h.status === "wrong_gate"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {h.checkedIn
                        ? "Masuk"
                        : h.status === "used"
                        ? "Sudah dipakai"
                        : h.status === "wrong_gate"
                        ? "Salah gate"
                        : "Ditolak"}
                    </span>
                    <span className="text-xs text-gray-400">{h.time}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}