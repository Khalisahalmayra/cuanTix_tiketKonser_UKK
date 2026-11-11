"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type AdminEvent = {
  id: number;
  title: string;
  city: string;
  start_at: string;
  status: string;
  categories: { name: string } | null;
  ticket_types: { price: number; quota: number; sold: number }[];
};

const STATUS_OPTIONS = ["draft", "published", "cancelled", "finished"];
const API = "http://localhost:4000/api/admin/events";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = () => localStorage.getItem("token");

  const loadEvents = async () => {
    try {
      const res = await fetch(API, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal memuat event");
      setEvents(data);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat event");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const changeStatus = async (id: number, status: string) => {
    const res = await fetch(`${API}/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Gagal mengubah status");
      return;
    }
    loadEvents();
  };

  const deleteEvent = async (id: number, title: string) => {
    if (!confirm(`Hapus event "${title}"? Tindakan ini tidak bisa dibatalkan.`)) {
      return;
    }
    const res = await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Gagal menghapus event");
      return;
    }
    loadEvents();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold text-gray-900">Kelola Event</h2>
        <Link
          href="/admin/events/new"
          className="rounded-[10px] px-4 py-2 text-sm font-bold text-white"
          style={{
            backgroundImage: "linear-gradient(90deg, #7C3AED 0%, #E91E8C 100%)",
          }}
        >
          + Tambah Event
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl bg-white shadow-sm">
        {loading ? (
          <p className="p-5 text-sm text-gray-500">Memuat...</p>
        ) : error ? (
          <p className="p-5 text-sm text-red-500">{error}</p>
        ) : events.length === 0 ? (
          <p className="p-5 text-sm text-gray-500">Belum ada event.</p>
        ) : (
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Judul</th>
                <th className="px-4 py-3">Kota</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Terjual / Kuota</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => {
                const sold = e.ticket_types.reduce((s, t) => s + t.sold, 0);
                const quota = e.ticket_types.reduce((s, t) => s + t.quota, 0);
                return (
                  <tr key={e.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {e.title}
                    </td>
                    <td className="px-4 py-3">{e.city}</td>
                    <td className="px-4 py-3">
                      {new Date(e.start_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-4 py-3">{e.categories?.name || "-"}</td>
                    <td className="px-4 py-3">
                      {sold} / {quota}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={e.status}
                        onChange={(ev) => changeStatus(e.id, ev.target.value)}
                        className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs font-semibold text-gray-800"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => deleteEvent(e.id, e.title)}
                        className="rounded-lg bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}