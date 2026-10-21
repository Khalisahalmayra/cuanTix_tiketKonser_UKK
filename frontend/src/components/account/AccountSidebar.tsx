"use client";

import { useRouter } from "next/navigation";
import GradientIcon, { type GradientIconType } from "@/components/icon/GradientIcon";

export type AccountUser = {
  nama: string;
  tipe: string;
  foto?: string;
};

// Route tujuan (sesuaikan dengan struktur folder app/ kamu)
export const ACCOUNT_ROUTES = {
  riwayatTransaksi: "/akun/riwayat-transaksi",
  metodePembayaran: "/akun/metode-pembayaran",
  pesananKamu: "/akun/pesanan",
  ulasanSaya: "/akun/ulasan",
  pengaturanAkun: "/akun/pengaturan",
  pusatBantuan: "/bantuan",
} as const;

export type AccountMenuKey = keyof typeof ACCOUNT_ROUTES;

type MenuEntry = {
  key: AccountMenuKey;
  label: string;
  icon: GradientIconType;
};

const ACTIVITY_MENU: MenuEntry[] = [
  { key: "riwayatTransaksi", label: "Riwayat Transaksi", icon: "trending" },
  { key: "metodePembayaran", label: "Metode Pembayaran", icon: "wallet" },
  { key: "pesananKamu", label: "Pesanan Kamu", icon: "fileText" },
  { key: "ulasanSaya", label: "Ulasan Saya", icon: "messageSquare" },
];

const HELP_MENU: MenuEntry[] = [
  { key: "pengaturanAkun", label: "Pengaturan Akun", icon: "settings" },
  { key: "pusatBantuan", label: "Pusat Bantuan", icon: "help" },
];

type AccountSidebarProps = {
  user: AccountUser;
  /** Menu yang sedang aktif. Kosongkan kalau halaman aktifnya bukan salah satu menu (mis. Profil). */
  active?: AccountMenuKey;
};

export default function AccountSidebar({ user, active }: AccountSidebarProps) {
  const router = useRouter();

  function handleLogout(): void {
    // TODO: panggil logout (signOut / hapus token), lalu arahkan ke beranda
    router.push("/");
  }

  function renderItem(item: MenuEntry) {
    const isActive = active === item.key;

    return (
      <button
        key={item.key}
        type="button"
        onClick={() => router.push(ACCOUNT_ROUTES[item.key])}
        aria-current={isActive ? "page" : undefined}
        className="flex w-full items-center gap-3 rounded-[6px] px-3 py-2.5 text-left text-[12px] font-semibold transition-colors hover:bg-[#F3EBFF]"
        style={{
          color: "#3B0F8C",
          background: isActive ? "#FFE3EE" : undefined,
          borderRight: isActive ? "4px solid #E91E8C" : "4px solid transparent",
        }}
      >
        <GradientIcon type={item.icon} size={20} />
        {item.label}
      </button>
    );
  }

  return (
    <aside
      className="w-full shrink-0 rounded-[6px] bg-[#F2F2F2] px-5 py-6 lg:w-[210px]"
      style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
    >
      {/* PROFIL RINGKAS */}
      <div className="flex flex-col items-center">
        {user.foto ? (
          <img
            src={user.foto}
            alt={user.nama}
            className="h-20 w-20 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#C9B8E8]">
            <GradientIcon type="user" size={40} color="#ffffff" />
          </span>
        )}

        <h2 className="mt-3 text-center text-[20px] font-bold text-gray-900">
          {user.nama}
        </h2>

        <span
          className="mt-1 rounded-full px-2.5 py-0.5 text-[9px] font-semibold"
          style={{ background: "#FBD3E6", color: "#E91E8C" }}
        >
          {user.tipe}
        </span>
      </div>

      {/* MY ACTIVITY */}
      <div className="mt-6">
        <h3 className="mb-1 text-[13px] font-bold text-gray-900">My Activity</h3>
        <div className="flex flex-col gap-1">{ACTIVITY_MENU.map(renderItem)}</div>
      </div>

      {/* PUSAT BANTUAN */}
      <div className="mt-6">
        <h3 className="mb-1 text-[13px] font-bold text-gray-900">Pusat Bantuan</h3>
        <div className="flex flex-col gap-1">{HELP_MENU.map(renderItem)}</div>
      </div>

      {/* KELUAR */}
      <div className="mt-5 border-t border-gray-300 pt-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-[6px] px-3 py-2 text-left text-[12px] font-semibold transition-colors hover:bg-[#FFE9EC]"
          style={{ color: "#E11D2E" }}
        >
          <GradientIcon type="logOut" size={20} />
          Keluar
        </button>
      </div>
    </aside>
  );
}