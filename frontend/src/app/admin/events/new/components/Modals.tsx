"use client";

import React from "react";
import { Send, Save, Trash2 } from "lucide-react";
import { TicketItem, SeatingZone } from "../types";

interface ConfirmSaveModalProps {
  isOpen: boolean;
  saveAction: "draft" | "publish" | null;
  saving: boolean;
  title: string;
  venue: string;
  city: string;
  totalQuota: number;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmSaveModal({
  isOpen,
  saveAction,
  saving,
  title,
  venue,
  city,
  totalQuota,
  onClose,
  onConfirm,
}: ConfirmSaveModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-full ${
              saveAction === "publish"
                ? "bg-purple-100 text-[#7C3AED]"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {saveAction === "publish" ? (
              <Send className="h-5 w-5" />
            ) : (
              <Save className="h-5 w-5" />
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">
              {saveAction === "publish"
                ? "Publikasikan Event Baru?"
                : "Simpan Event Sebagai Draft?"}
            </h3>
            <p className="text-xs text-gray-500">
              {saveAction === "publish"
                ? "Event akan langsung dapat dilihat dan dibeli oleh pengunjung di CuanTix."
                : "Event hanya dapat diakses oleh Admin untuk pengeditan lebih lanjut."}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-gray-100 bg-slate-50 p-3 text-xs space-y-1">
          <p>
            <strong>Judul:</strong> {title}
          </p>
          <p>
            <strong>Lokasi:</strong> {venue}, {city}
          </p>
          <p>
            <strong>Total Kuota:</strong> {totalQuota.toLocaleString("id-ID")} tiket
          </p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-300 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={saving}
            className="rounded-xl px-5 py-2 text-xs font-bold text-white shadow transition hover:opacity-95 cursor-pointer disabled:opacity-50"
            style={{
              backgroundImage: "linear-gradient(90deg, #7C3AED 0%, #E91E8C 100%)",
            }}
          >
            {saving ? "Memproses..." : "Ya, Lanjutkan"}
          </button>
        </div>
      </div>
    </div>
  );
}

interface DeleteTicketModalProps {
  ticketToDelete: TicketItem | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteTicketModal({
  ticketToDelete,
  onClose,
  onConfirm,
}: DeleteTicketModalProps) {
  if (!ticketToDelete) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center gap-3 text-red-600">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <Trash2 className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">Hapus Jenis Tiket?</h3>
        </div>
        <p className="mt-2 text-xs text-gray-600">
          Apakah Anda yakin ingin menghapus kategori tiket{" "}
          <strong>&quot;{ticketToDelete.name}&quot;</strong>? Zona denah yang terhubung
          ke tiket ini akan dilepas.
        </p>
        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-300 px-3.5 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-red-600 px-4 py-1.5 text-xs font-bold text-white shadow hover:bg-red-700 cursor-pointer"
          >
            Hapus Tiket
          </button>
        </div>
      </div>
    </div>
  );
}

interface DeleteZoneModalProps {
  zoneToDelete: SeatingZone | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteZoneModal({
  zoneToDelete,
  onClose,
  onConfirm,
}: DeleteZoneModalProps) {
  if (!zoneToDelete) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center gap-3 text-red-600">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <Trash2 className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">Hapus Zona Denah?</h3>
        </div>
        <p className="mt-2 text-xs text-gray-600">
          Apakah Anda yakin ingin menghapus zona <strong>&quot;{zoneToDelete.name}&quot;</strong> dari
          denah panggung?
        </p>
        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-300 px-3.5 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-red-600 px-4 py-1.5 text-xs font-bold text-white shadow hover:bg-red-700 cursor-pointer"
          >
            Hapus Zona
          </button>
        </div>
      </div>
    </div>
  );
}
