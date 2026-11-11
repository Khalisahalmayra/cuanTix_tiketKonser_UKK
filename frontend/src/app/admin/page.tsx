"use client";

import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div>
      <h2 className="text-2xl font-extrabold text-gray-900">Dashboard Admin</h2>
      <p className="mt-1 text-sm text-gray-500">
        Selamat datang di panel admin Cuantix.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/admin/events"
          className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <p className="text-sm font-semibold text-[#7C3AED]">Kelola Event</p>
          <p className="mt-1 text-xs text-gray-500">
            Lihat, tambah, dan atur event serta jenis tiketnya.
          </p>
        </Link>

        <div className="rounded-xl bg-white p-5 opacity-60 shadow-sm">
          <p className="text-sm font-semibold text-gray-700">Pesanan</p>
          <p className="mt-1 text-xs text-gray-500">Segera hadir.</p>
        </div>
      </div>
    </div>
  );
}