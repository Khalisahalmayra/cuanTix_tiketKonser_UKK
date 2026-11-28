
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Calendar,
  FileCheck2,
  Globe,
  LogOut,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let active = true;

    const checkAdmin = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          router.replace("/auth/login");
          return;
        }

        const data = await response.json();
        const user = data.user ?? data;

        if (user.role !== "admin") {
          router.replace("/auth/login");
          return;
        }

        if (active) setAllowed(true);
      } catch {
        router.replace("/auth/login");
      }
    };

    checkAdmin();

    return () => {
      active = false;
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Gagal logout:", error);
    } finally {
      router.replace("/auth/login");
      router.refresh();
    }
  };

  if (!allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
          <p className="text-xs font-medium text-slate-500">
            Memverifikasi akses admin...
          </p>
        </div>
      </div>
    );
  }

  const isDashboardActive =
    pathname === "/admin" || pathname === "/admin/dashboard";
  const isEventsActive = pathname.startsWith("/admin/events");
  const isSubmissionsActive = pathname.startsWith("/admin/pengajuan-event");

  return (
    <div className="flex min-h-screen bg-slate-50/70 text-slate-900">
      <aside className="w-64 shrink-0 bg-[#2D1065] text-white flex flex-col justify-between border-r border-purple-950/40">
        <div className="p-5">
          <div className="mb-8 flex items-center gap-3 px-1">
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl bg-white p-1 shadow-sm">
              <Image
                src="/image/logo-cuantix.png"
                alt="CuanTix Logo"
                fill
                sizes="36px"
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-white">
                CuanTix <span className="text-[#E91E8C]">Admin</span>
              </h1>
              <p className="text-[11px] font-medium text-purple-300/80">
                Workspace Manajemen
              </p>
            </div>
          </div>

          <nav className="space-y-1.5 text-xs font-semibold">
            <Link
              href="/admin/dashboard"
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all ${
                isDashboardActive
                  ? "bg-purple-600/35 text-white font-bold shadow-xs border-l-4 border-[#7C3AED]"
                  : "text-purple-200/70 hover:bg-white/10 hover:text-white border-l-4 border-transparent"
              }`}
            >
              <LayoutDashboard
                className={`h-4 w-4 shrink-0 ${
                  isDashboardActive
                    ? "text-purple-300"
                    : "text-purple-300/70"
                }`}
              />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/admin/events"
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all ${
                isEventsActive
                  ? "bg-purple-600/35 text-white font-bold shadow-xs border-l-4 border-[#7C3AED]"
                  : "text-purple-200/70 hover:bg-white/10 hover:text-white border-l-4 border-transparent"
              }`}
            >
              <Calendar
                className={`h-4 w-4 shrink-0 ${
                  isEventsActive
                    ? "text-purple-300"
                    : "text-purple-300/70"
                }`}
              />
              <span>Kelola Event</span>
            </Link>

            <Link
              href="/admin/pengajuan-event"
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all ${
                isSubmissionsActive
                  ? "bg-purple-600/35 text-white font-bold shadow-xs border-l-4 border-[#7C3AED]"
                  : "text-purple-200/70 hover:bg-white/10 hover:text-white border-l-4 border-transparent"
              }`}
            >
              <FileCheck2
                className={`h-4 w-4 shrink-0 ${
                  isSubmissionsActive
                    ? "text-purple-300"
                    : "text-purple-300/70"
                }`}
              />
              <span>Pengajuan Event</span>
            </Link>

            <div className="my-4 border-t border-purple-800/40" />

            <Link
              href="/home"
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-purple-200/70 hover:bg-white/10 hover:text-white transition-all border-l-4 border-transparent"
            >
              <Globe className="h-4 w-4 shrink-0 text-purple-300/70" />
              <span>Lihat Situs</span>
            </Link>
          </nav>
        </div>

        <div className="p-5 border-t border-purple-800/40">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/15 hover:text-rose-200 transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
