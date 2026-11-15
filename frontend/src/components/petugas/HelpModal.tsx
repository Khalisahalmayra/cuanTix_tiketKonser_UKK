"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, LifeBuoy, Phone, X } from "lucide-react";

import { HELP_OPTIONS, HelpCategory, PetugasProfile } from "@/types/petugas";
import { sendHelpRequest } from "@/lib/petugas";

interface HelpModalProps {
  profile: PetugasProfile;
  onClose: () => void;
}

type Status = "idle" | "sending" | "sent" | "error";

export default function HelpModal({ profile, onClose }: HelpModalProps) {
  const [category, setCategory] = useState<HelpCategory | null>(null);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  async function handleSend() {
    if (!category) return;
    setStatus("sending");
    setErrorMsg("");
    try {
      await sendHelpRequest({
        category,
        note: note.trim() || undefined,
        gate: profile.gate,
      });
      setStatus("sent");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal mengirim bantuan.");
      setStatus("error");
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-4 sm:items-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Panggil bantuan"
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[20px] bg-white p-5 shadow-2xl"
      >
        <button
          onClick={onClose}
          aria-label="Tutup"
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        {status === "sent" ? (
          <div className="py-6 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
            <h3 className="mt-3 text-lg font-bold text-gray-900">
              Bantuan sedang dipanggil
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Koordinator sudah menerima permintaanmu dari{" "}
              <b>{profile.gate}</b>. Tetap di posisi ya.
            </p>
            <button
              onClick={onClose}
              className="mt-5 rounded-full px-8 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-90"
              style={{
                background: "linear-gradient(90deg,#E91E8C 0%,#4C1D95 100%)",
              }}
            >
              Tutup
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 pr-6">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                style={{
                  background: "linear-gradient(135deg,#E91E8C 0%,#4C1D95 100%)",
                }}
              >
                <LifeBuoy className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Panggil Bantuan
                </h3>
                <p className="text-xs text-gray-500">
                  Dikirim dari {profile.gate} · {profile.name}
                </p>
              </div>
            </div>

            <p className="mb-2 mt-5 text-sm font-semibold text-gray-900">
              Apa kendalanya?
            </p>
            <div className="space-y-2">
              {HELP_OPTIONS.map((opt) => {
                const selected = category === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setCategory(opt.id)}
                    className={`w-full rounded-xl border-2 px-4 py-3 text-left transition-colors ${
                      selected
                        ? "border-[#E91E8C] bg-[#FDF0F8]"
                        : "border-gray-200 hover:border-[#7C3AED]"
                    }`}
                  >
                    <span className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                      {opt.label}
                      {opt.urgent && (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase text-red-600">
                          Darurat
                        </span>
                      )}
                    </span>
                    <span className="block text-xs text-gray-500">
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              maxLength={300}
              placeholder="Catatan tambahan (opsional)"
              className="mt-3 w-full resize-none rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#7C3AED]"
            />

            {status === "error" && (
              <p className="mt-2 rounded-lg bg-red-50 p-3 text-xs text-red-600">
                {errorMsg}
              </p>
            )}

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                onClick={handleSend}
                disabled={!category || status === "sending"}
                className="flex-1 rounded-full py-3 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{
                  background: "linear-gradient(90deg,#E91E8C 0%,#4C1D95 100%)",
                }}
              >
                {status === "sending" ? "Mengirim..." : "Kirim Permintaan"}
              </button>
              {profile.coordinatorPhone && (
                <a
                  href={`tel:${profile.coordinatorPhone}`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-[#E91E8C] py-3 text-sm font-semibold text-[#E91E8C] hover:bg-[#FDF0F8]"
                >
                  <Phone className="h-4 w-4" />
                  Telepon Koordinator
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}