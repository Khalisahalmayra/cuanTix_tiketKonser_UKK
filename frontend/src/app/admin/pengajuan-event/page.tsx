
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL = "http://localhost:4000/api/event-submissions";

type Submission = {
  id: number;
  title: string;
  city: string | null;
  venue: string | null;
  start_at: string;
  status: string;
  created_at: string;
  users: {
    name: string;
    email: string;
  } | null;
  event_submission_ticket_types: {
    id: number;
    name: string;
    price: number;
    quota: number;
  }[];
};

const statusLabels: Record<string, string> = {
  pending_review: "Menunggu Review",
  needs_revision: "Perlu Revisi",
  approved: "Disetujui",
  rejected: "Ditolak",
  draft: "Draft",
};

export default function PengajuanEventPage() {
  const [data, setData] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSubmissions() {
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

        const result = await res.json();
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Terjadi kesalahan"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchSubmissions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <Link
            href="/admin"
            className="mb-4 inline-block text-sm text-purple-600 hover:text-purple-800"
          >
            ← Kembali ke Dashboard
          </Link>

          <h1 className="text-3xl font-bold text-gray-900">
            Pengajuan Event
          </h1>

          <p className="mt-2 text-gray-500">
            Kelola dan review pengajuan event dari customer.
          </p>
        </div>

        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Pengajuan</p>
          <p className="mt-1 text-3xl font-bold text-purple-700">
            {data.length}
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center text-gray-500">
            Memuat data pengajuan...
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-white p-10 text-center text-red-500">
            {error}
          </div>
        ) : data.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center text-gray-500">
            Belum ada pengajuan event.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-sm text-gray-500">
                <tr>
                  <th className="px-6 py-4">Event</th>
                  <th className="px-6 py-4">Pengaju</th>
                  <th className="px-6 py-4">Tanggal Event</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Detail</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-5">
                      <p className="font-semibold text-gray-900">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {item.city || "-"}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <p className="text-sm font-medium text-gray-800">
                        {item.users?.name || "Tidak diketahui"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.users?.email || "-"}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-600">
                      {new Date(item.start_at).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          item.status === "pending_review"
                            ? "bg-yellow-100 text-yellow-700"
                            : item.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : item.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {statusLabels[item.status] || item.status}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                    <Link
                    href={`/admin/pengajuan-event/${item.id}`}
                    className="rounded-lg bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700 hover:bg-purple-200"
                    >
                    Lihat
                    </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
