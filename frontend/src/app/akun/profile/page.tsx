"use client";

import React, { useRef, useState } from "react";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import Footer from "@/components/footer/Footer";
import GradientIcon from "@/components/icon/GradientIcon";
import AccountSidebar, { type AccountUser } from "@/components/account/AccountSidebar";

const SEARCH_BORDER_GRADIENT = "linear-gradient(90deg,#7C3AED 0%,#E91E8C 100%)";
const TITLE_GRADIENT = "linear-gradient(90deg,#E91E8C 0%,#5B1AA8 100%)";
const BUTTON_PINK = "#EC407A";

// Border gradasi untuk input
const FIELD_STYLE: React.CSSProperties = {
  border: "1.5px solid transparent",
  backgroundImage: `linear-gradient(white, white), ${SEARCH_BORDER_GRADIENT}`,
  backgroundOrigin: "border-box",
  backgroundClip: "padding-box, border-box",
};

const FIELD_CLASS =
  "h-[40px] w-full rounded-[8px] px-3 text-[12px] text-gray-800 outline-none placeholder:text-gray-400 focus:shadow-[0_0_0_3px_rgba(124,58,237,0.18)]";

type FieldProps = {
  label: React.ReactNode;
  children: React.ReactNode;
};

function Field({ label, children }: FieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-bold text-gray-900">{label}</span>
      {children}
    </label>
  );
}

function CardTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      {icon}
      <h2 className="text-[12px] font-bold text-gray-900">{children}</h2>
    </div>
  );
}

export default function ProfilPage() {
  // TODO: ganti dengan data user asli dari session/auth
  const [user, setUser] = useState<AccountUser>({
    nama: "Iput Cantik",
    tipe: "Personal",
    foto: "/image/avatar.png",
  });

  const [username, setUsername] = useState<string>("Iput Cantik");
  const [email, setEmail] = useState<string>("Iputimut@gmail.com");
  const [telepon, setTelepon] = useState<string>("");
  const [tglLahir, setTglLahir] = useState<string>("");
  const [profilStatus, setProfilStatus] = useState<"idle" | "saved">("idle");

  const [passLama, setPassLama] = useState<string>("");
  const [passBaru, setPassBaru] = useState<string>("");
  const [passStatus, setPassStatus] = useState<"idle" | "saved" | "error">("idle");

  const fileRef = useRef<HTMLInputElement>(null);

  function handlePilihFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // TODO: upload file ke server, lalu pakai URL dari server
    setUser((u) => ({ ...u, foto: URL.createObjectURL(file) }));
  }

  function handleSimpanProfil(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: panggil API update profil
    setUser((u) => ({ ...u, nama: username }));
    setProfilStatus("saved");
  }

  function handleUbahPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!passLama || passBaru.length < 8) {
      setPassStatus("error");
      return;
    }
    // TODO: panggil API ubah password
    setPassStatus("saved");
    setPassLama("");
    setPassBaru("");
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2]" style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}>
      <HomeNavbar />

      <main className="flex flex-col gap-8 px-5 py-8 sm:px-8 lg:flex-row lg:px-16">
        {/* SIDEBAR */}
        <AccountSidebar user={user} />

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
            Profil Kamu
          </h1>
          <p className="mt-1 text-[13px] text-gray-700">
            Kelola informasi dan keamanan kamu
          </p>

          {/* KARTU FOTO */}
          <section className="mt-6 flex items-center gap-5 rounded-[10px] bg-white p-3 shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
            <div className="relative h-20 w-20 shrink-0">
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

              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                aria-label="Ganti foto profil"
                className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-md shadow-md transition-opacity hover:opacity-90"
                style={{ background: BUTTON_PINK }}
              >
                <GradientIcon type="camera" size={14} color="#ffffff" />
              </button>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handlePilihFoto}
                className="hidden"
              />
            </div>

            <div>
              <p className="text-[20px] font-bold text-gray-900">{user.nama}</p>
              <span
                className="mt-0.5 inline-block rounded-full px-2.5 py-0.5 text-[9px] font-semibold"
                style={{ background: "#FBD3E6", color: "#E91E8C" }}
              >
                {user.tipe}
              </span>
            </div>
          </section>

          {/* INFORMASI AKUN */}
          <form
            onSubmit={handleSimpanProfil}
            className="mt-5 rounded-[10px] bg-white p-5 shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
          >
            <CardTitle icon={<GradientIcon type="user" size={22} color="#E91E8C" />}>
              Informasi Akun
            </CardTitle>

            <div className="grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2 sm:px-2">
              <Field label="Username">
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Iput Cantik"
                  className={FIELD_CLASS}
                  style={FIELD_STYLE}
                />
              </Field>

              <Field label="Email">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Iputimut@gmail.com"
                  className={FIELD_CLASS}
                  style={FIELD_STYLE}
                />
              </Field>

              <Field label="Nomor Telepon">
                <input
                  type="tel"
                  value={telepon}
                  onChange={(e) => setTelepon(e.target.value)}
                  placeholder="+62"
                  className={FIELD_CLASS}
                  style={FIELD_STYLE}
                />
              </Field>

              <Field
                label={
                  <>
                    Tanggal Lahir{" "}
                    <span className="text-[8px] font-normal text-gray-500">(Opsional)</span>
                  </>
                }
              >
                <input
                  type="date"
                  value={tglLahir}
                  onChange={(e) => setTglLahir(e.target.value)}
                  className={FIELD_CLASS}
                  style={FIELD_STYLE}
                />
              </Field>
            </div>

            <div className="mt-6 flex flex-col items-center gap-2">
              <button
                type="submit"
                className="h-[36px] rounded-full px-8 text-[13px] font-semibold text-white shadow-md transition-opacity hover:opacity-90"
                style={{ background: BUTTON_PINK }}
              >
                Edit Profile
              </button>
              {profilStatus === "saved" && (
                <p className="text-[12px] font-semibold text-green-600" role="status">
                  Profil berhasil disimpan.
                </p>
              )}
            </div>
          </form>

          {/* UBAH PASSWORD */}
          <form
            onSubmit={handleUbahPassword}
            className="mt-5 rounded-[10px] bg-white p-5 shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
          >
            <CardTitle icon={<GradientIcon type="lock" size={22} color="#E91E8C" />}>
              Ubah Password
            </CardTitle>

            <div className="grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2 sm:px-2">
              <Field label="Password Sekarang">
                <input
                  type="password"
                  value={passLama}
                  onChange={(e) => setPassLama(e.target.value)}
                  autoComplete="current-password"
                  className={FIELD_CLASS}
                  style={FIELD_STYLE}
                />
              </Field>

              <Field label="Password Baru">
                <input
                  type="password"
                  value={passBaru}
                  onChange={(e) => setPassBaru(e.target.value)}
                  autoComplete="new-password"
                  className={FIELD_CLASS}
                  style={FIELD_STYLE}
                />
              </Field>
            </div>

            <div className="mt-12 flex flex-col items-center gap-2">
              <button
                type="submit"
                className="h-[36px] rounded-full px-8 text-[13px] font-semibold text-white shadow-md transition-opacity hover:opacity-90"
                style={{ background: BUTTON_PINK }}
              >
                Perbarui Password
              </button>
              {passStatus === "saved" && (
                <p className="text-[12px] font-semibold text-green-600" role="status">
                  Password berhasil diperbarui.
                </p>
              )}
              {passStatus === "error" && (
                <p className="text-[12px] font-semibold text-red-600" role="alert">
                  Isi password sekarang dan password baru minimal 8 karakter.
                </p>
              )}
            </div>
          </form>
        </div>
      </main>

    </div>
  );
}