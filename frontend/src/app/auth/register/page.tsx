"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const GRADIENT = "linear-gradient(90deg, #7C3AED 0%, #E91E8C 100%)";

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password || !form.confirmPassword) {
      setError("Semua kolom wajib diisi.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Password dan konfirmasi password tidak sama.");
      return;
    }
    if (!agreed) {
      setError("Kamu harus menyetujui Syarat dan Ketentuan.");
      return;
    }

    try {
      setIsSubmitting(true);
      // TODO: hook up to your auth/register endpoint
      // await fetch("/api/auth/register", { method: "POST", body: JSON.stringify(form) });
      console.log("Registering:", form);
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 h-screen w-full overflow-hidden bg-black">
      {/* ================= BACKGROUND ================= */}
      <div className="absolute inset-0">
        <Image
          src="/image/concert-crowd.jpg"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 flex h-full w-full flex-col overflow-hidden">
        {/* LOGO */}
        <div className="shrink-0 px-6 pt-5 sm:px-10 sm:pt-6 lg:px-16">
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-[#E91E8C] to-[#7C3AED] bg-clip-text text-2xl font-extrabold text-transparent sm:text-3xl"
          >
            Cuantix
          </Link>
        </div>

        {/* MAIN GRID */}
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-6 py-2 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-16">
          {/* LEFT: HERO TEXT */}
          <div className="hidden w-full max-w-xl lg:block">
            <h1 className="text-4xl font-extrabold leading-tight text-white xl:text-6xl">
              Mulai
              <br />
              Petualangan
              <br />
              Konsermu
            </h1>

            <p className="mt-6 max-w-md text-sm text-gray-200 xl:text-base">
              Daftar sekarang untuk akses eksklusif tiket konser artis
              favoritmu. Nikmati pengalaman memesan tiket tercepat dan
              teraman.
            </p>
          </div>

          {/* MOBILE HERO (compact) */}
          <div className="w-full max-w-md text-center lg:hidden">
            <h1 className="text-xl font-extrabold leading-tight text-white sm:text-2xl">
              Mulai Petualangan Konsermu
            </h1>
          </div>

          {/* RIGHT: FORM CARD (frosted glass) */}
          <div
            className="relative w-full max-w-md overflow-hidden rounded-[24px] shadow-2xl"
            style={{
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.35) 100%)",
              border: "1px solid rgba(255,255,255,0.4)",
            }}
          >
            {/* subtle inner glow to blend edges like the reference */}
            <div
              className="pointer-events-none absolute inset-0 rounded-[24px]"
              style={{
                boxShadow:
                  "inset 0 1px 1px rgba(255,255,255,0.6), inset 0 -1px 1px rgba(255,255,255,0.15)",
              }}
            />

            <div className="p-5 sm:p-7">
              <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                Daftar Akun
              </h2>
              <p className="mt-1 text-[11px] text-gray-700 sm:text-xs">
                Silahkan buat akun Cuantix, atau klik{" "}
                <Link
                  href="/login"
                  className="font-medium text-[#C026D3] hover:underline"
                >
                  Masuk Sekarang
                </Link>{" "}
                untuk masuk ke akun Cuantix kamu
              </p>

              <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1 block text-xs font-semibold text-gray-900"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Alamat Email"
                    value={form.email}
                    onChange={handleChange("email")}
                    className="w-full rounded-[10px] border border-white/60 bg-white/90 px-3.5 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-[#C026D3]/50"
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-1 block text-xs font-semibold text-gray-900"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange("password")}
                    className="w-full rounded-[10px] border border-white/60 bg-white/90 px-3.5 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-[#C026D3]/50"
                  />
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-1 block text-xs font-semibold text-gray-900"
                  >
                    Konfirmasi Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Konfirmasi Password"
                    value={form.confirmPassword}
                    onChange={handleChange("confirmPassword")}
                    className="w-full rounded-[10px] border border-white/60 bg-white/90 px-3.5 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-[#C026D3]/50"
                  />
                </div>

                {/* TERMS CHECKBOX */}
                <label className="flex cursor-pointer items-start gap-2">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 text-[#7C3AED] focus:ring-[#7C3AED]"
                  />
                  <span className="text-[11px] text-gray-800">
                    Saya menyetujui{" "}
                    <Link
                      href="/terms"
                      className="font-medium text-[#E91E8C] hover:underline"
                    >
                      Syarat dan Ketentuan
                    </Link>{" "}
                    serta{" "}
                    <Link
                      href="/privacy"
                      className="font-medium text-[#E91E8C] hover:underline"
                    >
                      Kebijakan Privasi
                    </Link>{" "}
                    yang berlaku di Cuantix.
                  </span>
                </label>

                {/* ERROR */}
                {error && (
                  <p className="text-[11px] font-medium text-red-500">
                    {error}
                  </p>
                )}

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-[10px] py-2.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ backgroundImage: GRADIENT }}
                >
                  {isSubmitting ? "Memproses..." : "Daftar"}
                </button>
              </form>

              <p className="mt-3 text-center text-[11px] text-gray-800 sm:text-xs">
                Sudah Punya Akun?{" "}
                <Link
                  href="/auth/login"
                  className="font-semibold text-[#E91E8C] hover:underline"
                >
                  Masuk Sekarang
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}