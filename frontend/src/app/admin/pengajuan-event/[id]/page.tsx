
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const API_URL = "http://localhost:4000/api/event-submissions";

type TicketType = {
  id: number;
  name: string;
  price: number;
  quota: number;
  sale_start: string | null;
  sale_end: string | null;
  description: string | null;
};

type Submission = {
  id: number;
  title: string;
  description: string | null;
  city: string | null;
  venue: string | null;
  venue_address: string | null;
  location_info: string | null;
  poster_url: string | null;
  banner_url: string | null;
  start_at: string;
  end_at: string | null;
  status: string;
  admin_notes: string | null;
  users: {
    name: string;
    email: string;
  } | null;
  event_submission_ticket_types: TicketType[];
};

export default function DetailPengajuanPage() {
  const params = useParams();
  const id = String(params.id);

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  // Mengambil detail pengajuan
  useEffect(() => {
    async function fetchDetail() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Gagal mengambil data pengajuan");
        }

        const result: Submission[] = await res.json();

        const found = result.find(
          (item) => String(item.id) === id
        );

        if (!found) {
          throw new Error("Pengajuan tidak ditemukan");
        }

        setSubmission(found);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Terjadi kesalahan"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
  }, [id]);

  // Format tanggal
  const formatDate = (date: string | null) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format harga
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Proses review pengajuan
  const handleReview = async (
    action: "approve" | "needs_revision" | "rejected"
  ) => {
    if (!submission) return;

    if (action !== "approve" && !adminNotes.trim()) {
      setActionMessage("Catatan admin wajib diisi.");
      return;
    }

    const confirmation =
      action === "approve"
        ? "Yakin ingin menyetujui pengajuan event ini?"
        : action === "needs_revision"
        ? "Yakin ingin meminta revisi pengajuan ini?"
        : "Yakin ingin menolak pengajuan event ini?";

    if (!window.confirm(confirmation)) return;

    try {
      setActionLoading(true);
      setActionMessage("");

      const token = localStorage.getItem("token");

      const endpoint =
        action === "approve"
          ? `${API_URL}/${submission.id}/approve`
          : `${API_URL}/${submission.id}/review`;

      const body =
        action === "approve"
          ? undefined
          : JSON.stringify({
              status: action,
              admin_notes: adminNotes,
            });

      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          ...(body ? { "Content-Type": "application/json" } : {}),
        },
        ...(body ? { body } : {}),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(
          result.message || "Gagal memproses pengajuan"
        );
      }

      alert(result.message || "Pengajuan berhasil diproses");
      window.location.reload();
    } catch (err) {
      setActionMessage(
        err instanceof Error ? err.message : "Terjadi kesalahan"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Tampilan loading
  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Memuat detail pengajuan...
      </div>
    );
  }

  // Tampilan error
  if (error || !submission) {
    return (
      <div className="p-10 text-center text-red-500">
        {error || "Pengajuan tidak ditemukan"}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-5xl">

        {/* Tombol kembali */}
        <Link
          href="/admin/pengajuan-event"
          className="mb-6 inline-block text-purple-600 hover:text-purple-800"
        >
          ← Kembali ke Pengajuan Event
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Detail Pengajuan
          </h1>
          <p className="mt-2 text-gray-500">
            Periksa informasi event sebelum melakukan review.
          </p>
        </div>

        {/* Banner Event */}
        {submission.banner_url && (
          <div className="mb-6 overflow-hidden rounded-2xl bg-white">
            <img
              src={submission.banner_url}
              alt={submission.title}
              className="max-h-96 w-full object-cover"
            />
          </div>
        )}

        <div className="space-y-6">

          {/* Informasi Event */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold text-gray-900">
              Informasi Event
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Nama Event</p>
                <p className="font-semibold text-gray-900">
                  {submission.title}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Deskripsi</p>
                <p className="whitespace-pre-line text-gray-700">
                  {submission.description || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Kota</p>
                <p className="text-gray-900">
                  {submission.city || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Venue</p>
                <p className="text-gray-900">
                  {submission.venue || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Alamat Venue</p>
                <p className="text-gray-900">
                  {submission.venue_address || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Informasi Lokasi
                </p>
                <p className="text-gray-900">
                  {submission.location_info || "-"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Mulai Event
                </p>
                <p className="text-gray-900">
                  {formatDate(submission.start_at)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Selesai Event
                </p>
                <p className="text-gray-900">
                  {formatDate(submission.end_at)}
                </p>
              </div>
            </div>
          </section>

          {/* Informasi Pengaju */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold text-gray-900">
              Informasi Pengaju
            </h2>

            <p className="font-medium text-gray-900">
              {submission.users?.name || "-"}
            </p>

            <p className="text-gray-500">
              {submission.users?.email || "-"}
            </p>
          </section>

          {/* Jenis Tiket */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold text-gray-900">
              Jenis Tiket
            </h2>

            {submission.event_submission_ticket_types?.length ? (
              <div className="space-y-4">
                {submission.event_submission_ticket_types.map(
                  (ticket) => (
                    <div
                      key={ticket.id}
                      className="rounded-xl border border-gray-200 p-4"
                    >
                      <h3 className="font-semibold text-gray-900">
                        {ticket.name}
                      </h3>

                      <p className="mt-2 font-medium text-purple-700">
                        {formatPrice(ticket.price)}
                      </p>

                      <p className="text-sm text-gray-500">
                        Kuota: {ticket.quota} tiket
                      </p>

                      <p className="mt-2 text-sm text-gray-500">
                        Penjualan mulai: {formatDate(ticket.sale_start)}
                      </p>

                      <p className="text-sm text-gray-500">
                        Penjualan berakhir: {formatDate(ticket.sale_end)}
                      </p>

                      <p className="mt-2 text-sm text-gray-700">
                        {ticket.description || "-"}
                      </p>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="text-gray-500">
                Belum ada jenis tiket.
              </p>
            )}
          </section>

          {/* Review Pengajuan */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Review Pengajuan
            </h2>

            <p className="mb-4 text-sm text-gray-500">
              Status saat ini:{" "}
              <span className="font-semibold text-purple-700">
                {submission.status === "pending_review"
                  ? "Menunggu Review"
                  : submission.status === "needs_revision"
                  ? "Perlu Revisi"
                  : submission.status === "approved"
                  ? "Disetujui"
                  : submission.status === "rejected"
                  ? "Ditolak"
                  : submission.status}
              </span>
            </p>

            {submission.admin_notes && (
              <div className="mb-5 rounded-xl bg-gray-50 p-4">
                <p className="mb-1 text-sm font-medium text-gray-700">
                  Catatan review sebelumnya
                </p>
                <p className="whitespace-pre-line text-gray-600">
                  {submission.admin_notes}
                </p>
              </div>
            )}

            {submission.status === "pending_review" ? (
              <>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Catatan Admin
                </label>

                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Tulis catatan jika ingin meminta revisi atau menolak pengajuan..."
                  rows={4}
                  className="mb-5 w-full rounded-xl border border-gray-300 p-3 text-gray-800 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />

                {actionMessage && (
                  <p className="mb-4 text-sm text-red-600">
                    {actionMessage}
                  </p>
                )}

                <div className="flex flex-wrap gap-3">
                  <button
                    disabled={actionLoading}
                    onClick={() => handleReview("approve")}
                    className="rounded-xl bg-green-600 px-5 py-3 font-medium text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    {actionLoading ? "Memproses..." : "Setujui Event"}
                  </button>

                  <button
                    disabled={actionLoading}
                    onClick={() => handleReview("needs_revision")}
                    className="rounded-xl bg-amber-500 px-5 py-3 font-medium text-white hover:bg-amber-600 disabled:opacity-50"
                  >
                    {actionLoading ? "Memproses..." : "Minta Revisi"}
                  </button>

                  <button
                    disabled={actionLoading}
                    onClick={() => handleReview("rejected")}
                    className="rounded-xl bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {actionLoading ? "Memproses..." : "Tolak Pengajuan"}
                  </button>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">
                Pengajuan ini sudah diproses dan tidak tersedia untuk review ulang melalui halaman ini.
              </p>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}
