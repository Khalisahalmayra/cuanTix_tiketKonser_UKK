"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "null");

      if (!token || !user || user.role !== "admin") {
        router.replace("/auth/login");
        return;
      }
      setAllowed(true);
    } catch {
      router.replace("/auth/login");
    }
  }, [router]);

  if (!allowed) return null;

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <aside className="w-60 shrink-0 bg-[#2D1065] p-5 text-white">
        <h1 className="mb-8 text-xl font-extrabold">Cuantix Admin</h1>
        <nav className="space-y-2 text-sm font-semibold">
          <Link
            href="/admin"
            className="block rounded-lg px-3 py-2 hover:bg-white/10"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/events"
            className="block rounded-lg px-3 py-2 hover:bg-white/10"
          >
            Kelola Event
          </Link>
          <Link
            href="/home"
            className="block rounded-lg px-3 py-2 hover:bg-white/10"
          >
            Lihat Situs
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}