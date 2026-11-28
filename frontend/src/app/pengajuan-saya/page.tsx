"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL = "http://localhost:4000/api/event-submissions";

type TicketType = {
  id: number;
  name: string;
  price: number;
  quota: number;
};

type Submission = {
  id: number;
  title: string;
  city: string | null;
  venue: string | null;
  start_at: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
  event_submission_ticket_types: TicketType[];
};

const STATUS: Record<string, { label: string; color: string }> = {
  pending_review: {
    label: "Menunggu Review",
    color: "bg-yellow-100 text-yellow-700",
  },
  needs_revision: {
    label: "Perlu Revisi",
    color: "bg-orange-100 text-orange-700",
  },
  approved: {
    label: "Disetujui",
    color: "bg-green-100 text-green-700",
  },
  rejected: {
    label: "Ditolak",
    color: "bg-red-100 text-red-700",
  },
  draft: {
    label: "Draft",
    color: "bg-gray-100 text-gray-700",
  },
};

export default function PengajuanSayaPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch(`${API_URL}/my`, {
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Silakan login terlebih dahulu.");
          }
          throw new Error(data.message || "Gagal mengambil data pengajuan.");
        }

        setSubmissions(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat mengambil data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <main className="min-h-screen bg-gray-50 px-5 py-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/home"
          className="mb-6 inline-block text-sm text-purple-700 hover:underline"
        >
          ← Kembali ke Home
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Pengajuan Saya
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Pantau status pengajuan event yang sudah kamu kirim.
          </p>
        </div>

        {loading ? (
          <div className="rounded-xl bg-white p-10 text-center text-gray-500 shadow-sm">
            Memuat pengajuan...
          </div>
        ) : error ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="text-red-600">{error}</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800">
              Belum ada pengajuan event
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Pengajuan event yang kamu kirim akan muncul di sini.
            </p>
            <Link
              href="/buat-event"
              className="mt-5 inline-block rounded-lg bg-purple-700 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-800"
            >
              Buat Pengajuan Event
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {submissions.map((item) => {
              const status = STATUS[item.status] || {
                label: item.status,
                color: "bg-gray-100 text-gray-700",
              };

              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        {item.title}
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        {item.city || "Kota belum diisi"}
                        {item.venue ? ` • ${item.venue}` : ""}
                      </p>
                      <p className="mt-2 text-sm text-gray-500">
                        Tanggal event: {formatDate(item.start_at)}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <div className="mt-5 border-t border-gray-100 pt-4">
                    <h3 className="mb-3 text-sm font-semibold text-gray-800">
                      Tiket yang diajukan
                    </h3>

                    {item.event_submission_ticket_types?.length ? (
                      <div className="space-y-2">
                        {item.event_submission_ticket_types.map((ticket) => (
                          <div
                            key={ticket.id}
                            className="flex flex-wrap justify-between gap-2 text-sm"
                          >
                            <span className="text-gray-600">
                              {ticket.name} ({ticket.quota} kuota)
                            </span>
                            <span className="font-medium text-gray-800">
                              {formatPrice(ticket.price)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Belum ada informasi tiket.
                      </p>
                    )}
                  </div>

                  {item.admin_notes && (
                    <div className="mt-5 rounded-lg bg-orange-50 p-4">
                      <h3 className="text-sm font-semibold text-orange-800">
                        Catatan Admin
                      </h3>
                      <p className="mt-1 text-sm text-orange-700">
                        {item.admin_notes}
                      </p>
                    </div>
                  )}

                  <p className="mt-4 text-xs text-gray-400">
                    Diajukan pada {formatDate(item.created_at)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
