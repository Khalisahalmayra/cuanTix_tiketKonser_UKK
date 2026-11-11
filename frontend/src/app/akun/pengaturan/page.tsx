"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import AccountSidebar, { type AccountUser } from "@/components/account/AccountSidebar";

const BORDER_GRADIENT = "linear-gradient(90deg,#7C3AED 0%,#E91E8C 100%)";
const TITLE_GRADIENT = "linear-gradient(90deg,#E91E8C 0%,#5B1AA8 100%)";
const BUTTON_PINK = "#EC407A";

const CARD_CLS = "rounded-[10px] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.15)]";

const inputCls =
  "w-full rounded-[10px] border border-gray-200 bg-white px-3.5 py-2.5 text-[13px] text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-[12px] font-semibold text-gray-700">
        {label}
      </label>
      {children}
    </div>
  );
}

function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="relative h-6 w-11 shrink-0 rounded-full transition-colors"
      style={{
        backgroundImage: checked ? BORDER_GRADIENT : "linear-gradient(#D1D5DB,#D1D5DB)",
      }}
    >
      <span
        className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all"
        style={{ left: checked ? 22 : 2 }}
      />
    </button>
  );
}

function SubmitButton({ children, disabled }: { children: ReactNode; disabled?: boolean }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="h-[36px] rounded-full px-8 text-[13px] font-semibold text-white shadow-md transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      style={{ background: BUTTON_PINK }}
    >
      {children}
    </button>
  );
}

export default function PengaturanAkunPage() {
  // TODO: ganti dengan data user asli dari session/auth
  const [user] = useState<AccountUser>({
    nama: "Iput Cantik",
    tipe: "Personal",
    foto: "/image/avatar.png",
  });

  const [profile, setProfile] = useState({
    nama: "Iput Cantik",
    email: "nama@email.com",
    telepon: "081234567890",
  });
  const [password, setPassword] = useState({ current: "", next: "", confirm: "" });
  const [notif, setNotif] = useState({ payment: true, ticket: true, promo: false });
  const [passwordError, setPasswordError] = useState("");

  function saveProfile(e: FormEvent) {
    e.preventDefault();
    // TODO: panggil API simpan profil
  }

  function savePassword(e: FormEvent) {
    e.preventDefault();
    if (password.next.length < 8) {
      setPasswordError("Kata sandi baru minimal 8 karakter.");
      return;
    }
    if (password.next !== password.confirm) {
      setPasswordError("Konfirmasi kata sandi tidak sama.");
      return;
    }
    setPasswordError("");
    // TODO: panggil API ubah kata sandi
    setPassword({ current: "", next: "", confirm: "" });
  }

  const notifItems: { key: keyof typeof notif; title: string; desc: string }[] = [
    { key: "payment", title: "Info pembayaran", desc: "Status dan pengingat pembayaran." },
    { key: "ticket", title: "Tiket & pesanan", desc: "Pembaruan tiket dan jadwal acara." },
    { key: "promo", title: "Promo & event", desc: "Penawaran dan rekomendasi event." },
  ];

  return (
    <div className="min-h-screen bg-[#F2F2F2]" style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}>
      <HomeNavbar />

      <main className="flex flex-col gap-8 px-5 py-8 sm:px-8 lg:flex-row lg:px-16">
        {/* SIDEBAR */}
        <AccountSidebar user={user} active="pengaturanAkun" />

        {/* KONTEN */}
        <div className="min-w-0 flex-1">
          <h1
            className="inline-block text-[22px] font-bold"
            style={{
              backgroundImage: TITLE_GRADIENT,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Pengaturan Akun
          </h1>
          <p className="mt-1 text-[13px] text-gray-700">
            Atur profil, kata sandi, dan preferensi notifikasimu.
          </p>

          <div className="mt-6 flex flex-col gap-5">
            {/* Profil */}
            <section className={CARD_CLS}>
              <form onSubmit={saveProfile} className="flex flex-col gap-4 p-5">
                <h2 className="text-[14px] font-bold text-gray-900">Profil</h2>

                <Field label="Nama lengkap" htmlFor="nama">
                  <input
                    id="nama"
                    className={inputCls}
                    value={profile.nama}
                    onChange={(e) => setProfile({ ...profile, nama: e.target.value })}
                  />
                </Field>
                <Field label="Email" htmlFor="email">
                  <input
                    id="email"
                    type="email"
                    className={inputCls}
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </Field>
                <Field label="Nomor telepon" htmlFor="telepon">
                  <input
                    id="telepon"
                    type="tel"
                    className={inputCls}
                    value={profile.telepon}
                    onChange={(e) => setProfile({ ...profile, telepon: e.target.value })}
                  />
                </Field>

                <div className="flex justify-end">
                  <SubmitButton>Simpan Profil</SubmitButton>
                </div>
              </form>
            </section>

            {/* Kata sandi */}
            <section className={CARD_CLS}>
              <form onSubmit={savePassword} className="flex flex-col gap-4 p-5">
                <h2 className="text-[14px] font-bold text-gray-900">Ubah Kata Sandi</h2>

                <Field label="Kata sandi saat ini" htmlFor="current">
                  <input
                    id="current"
                    type="password"
                    autoComplete="current-password"
                    className={inputCls}
                    value={password.current}
                    onChange={(e) => setPassword({ ...password, current: e.target.value })}
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Kata sandi baru" htmlFor="next">
                    <input
                      id="next"
                      type="password"
                      autoComplete="new-password"
                      className={inputCls}
                      value={password.next}
                      onChange={(e) => setPassword({ ...password, next: e.target.value })}
                    />
                  </Field>
                  <Field label="Konfirmasi kata sandi baru" htmlFor="confirm">
                    <input
                      id="confirm"
                      type="password"
                      autoComplete="new-password"
                      className={inputCls}
                      value={password.confirm}
                      onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                    />
                  </Field>
                </div>

                {passwordError && (
                  <p role="alert" className="text-[12px] font-medium text-red-600">
                    {passwordError}
                  </p>
                )}

                <div className="flex justify-end">
                  <SubmitButton
                    disabled={!password.current || !password.next || !password.confirm}
                  >
                    Ubah Kata Sandi
                  </SubmitButton>
                </div>
              </form>
            </section>

            {/* Notifikasi */}
            <section className={CARD_CLS}>
              <div className="p-5">
                <h2 className="text-[14px] font-bold text-gray-900">Preferensi Notifikasi</h2>
                <ul className="mt-3 divide-y divide-gray-100">
                  {notifItems.map((n) => (
                    <li key={n.key} className="flex items-center justify-between gap-4 py-3">
                      <div>
                        <p className="text-[13px] font-semibold text-gray-900">{n.title}</p>
                        <p className="text-[12px] text-gray-500">{n.desc}</p>
                      </div>
                      <Switch
                        label={n.title}
                        checked={notif[n.key]}
                        onChange={(v) => setNotif({ ...notif, [n.key]: v })}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}