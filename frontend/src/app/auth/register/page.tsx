"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";

const GRADIENT = "linear-gradient(90deg, #7C3AED 0%, #E91E8C 100%)";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      if (field === "phone") {
        value = value.replace(/[^0-9]/g, "");
      }
      setForm((prev) => ({ ...prev, [field]: value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Nama, email, dan password wajib diisi.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password minimal 6 karakter.");
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

      const res = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || null,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Gagal mendaftar.");
        return;
      }

      window.location.href = "/auth/login";
    } catch {
      setError("Tidak bisa terhubung ke server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black">
      {/* ================= BACKGROUND ================= */}
      <div className="fixed inset-0">
        <Image
          src="/image/concert-crowd.jpg"
          alt="Concert background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/85" />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 flex min-h-screen w-full flex-col">
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
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-6 sm:px-10 lg:flex-row lg:justify-between lg:gap-10 lg:px-16">
          {/* LEFT: HERO TEXT */}
          <div className="hidden w-full max-w-xl lg:block">
            <h1 className="text-4xl font-extrabold leading-tight text-white xl:text-6xl">
              Mulai
              <br />
              Petualangan
              <br />
              Konsermu
            </h1>

            <p className="mt-6 max-w-md text-sm text-gray-200 xl:text-base leading-relaxed">
              Daftar sekarang untuk akses eksklusif tiket konser artis
              favoritmu. Nikmati pengalaman memesan tiket tercepat dan
              teraman.
            </p>
          </div>

          {/* MOBILE HERO */}
          <div className="w-full max-w-md text-center lg:hidden">
            <h1 className="text-xl font-extrabold leading-tight text-white sm:text-2xl">
              Mulai Petualangan Konsermu
            </h1>
          </div>

          {/* RIGHT: FORM CARD (Clean Frosted Glass, Transparent & Highly Readable) */}
          <div
            className="relative w-full max-w-md overflow-hidden rounded-[24px] p-6 shadow-2xl sm:p-8"
            style={{
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.60) 0%, rgba(255,255,255,0.40) 100%)",
              border: "1px solid rgba(255,255,255,0.5)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
            }}
          >
            {/* Subtle inner highlight for crisp frosted glass edge */}
            <div
              className="pointer-events-none absolute inset-0 rounded-[24px]"
              style={{
                boxShadow:
                  "inset 0 1px 1px rgba(255,255,255,0.7), inset 0 -1px 1px rgba(255,255,255,0.2)",
              }}
            />

            <div className="relative">
              {/* Card Header */}
              <div>
                <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                  Daftar Akun
                </h2>
                <p className="mt-1 text-xs text-gray-800 sm:text-sm">
                  Silahkan buat akun Cuantix, atau klik{" "}
                  <Link
                    href="/auth/login"
                    className="font-semibold text-[#7C3AED] hover:text-[#E91E8C] transition-colors hover:underline"
                  >
                    Masuk Sekarang
                  </Link>{" "}
                  untuk masuk ke akun Cuantix kamu.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                {/* NAMA LENGKAP */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-semibold text-gray-900 mb-1.5"
                  >
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Nama Lengkap"
                    value={form.name}
                    onChange={handleChange("name")}
                    className="w-full h-11 px-3.5 rounded-xl border border-white/70 bg-white/90 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-150 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-[#7C3AED]/50 hover:bg-white"
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold text-gray-900 mb-1.5"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Alamat Email"
                    value={form.email}
                    onChange={handleChange("email")}
                    className="w-full h-11 px-3.5 rounded-xl border border-white/70 bg-white/90 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-150 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-[#7C3AED]/50 hover:bg-white"
                  />
                </div>

                {/* NO HP */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="phone"
                      className="block text-xs font-semibold text-gray-900"
                    >
                      No. HP
                    </label>
                    <span className="text-[11px] font-medium text-gray-600">
                      (opsional)
                    </span>
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="08123456789"
                    maxLength={15}
                    value={form.phone}
                    onChange={handleChange("phone")}
                    className="w-full h-11 px-3.5 rounded-xl border border-white/70 bg-white/90 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-150 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-[#7C3AED]/50 hover:bg-white"
                  />
                </div>

                {/* PASSWORD + KONFIRMASI (sejajar di sm, vertikal di mobile) */}
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-xs font-semibold text-gray-900 mb-1.5"
                    >
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Min. 6 karakter"
                        value={form.password}
                        onChange={handleChange("password")}
                        className="w-full h-11 pl-3.5 pr-10 rounded-xl border border-white/70 bg-white/90 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-150 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-[#7C3AED]/50 hover:bg-white"
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-800 transition-colors focus:outline-none"
                        aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-xs font-semibold text-gray-900 mb-1.5"
                    >
                      Konfirmasi <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Ulangi password"
                        value={form.confirmPassword}
                        onChange={handleChange("confirmPassword")}
                        className="w-full h-11 pl-3.5 pr-10 rounded-xl border border-white/70 bg-white/90 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-150 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-[#7C3AED]/50 hover:bg-white"
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-800 transition-colors focus:outline-none"
                        aria-label={showConfirmPassword ? "Sembunyikan konfirmasi password" : "Lihat konfirmasi password"}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* TERMS CHECKBOX */}
                <div className="pt-0.5">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      id="agreed"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-[#7C3AED] accent-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/30 cursor-pointer"
                    />
                    <span className="text-xs text-gray-900 leading-snug">
                      Saya menyetujui{" "}
                      <Link
                        href="/terms"
                        className="font-semibold text-[#7C3AED] hover:text-[#E91E8C] transition-colors underline-offset-2 hover:underline"
                      >
                        Syarat dan Ketentuan
                      </Link>{" "}
                      serta{" "}
                      <Link
                        href="/privacy"
                        className="font-semibold text-[#7C3AED] hover:text-[#E91E8C] transition-colors underline-offset-2 hover:underline"
                      >
                        Kebijakan Privasi
                      </Link>{" "}
                      yang berlaku di Cuantix.
                    </span>
                  </label>
                </div>

                {/* ERROR MESSAGE */}
                {error && (
                  <div className="flex items-start gap-2.5 rounded-xl bg-red-500/10 border border-red-500/20 px-3.5 py-2.5 text-xs text-red-700 backdrop-blur-sm">
                    <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                    <span className="font-semibold leading-relaxed">{error}</span>
                  </div>
                )}

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 rounded-xl py-2.5 text-sm font-bold text-white shadow-lg hover:shadow-xl hover:opacity-95 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                  style={{ backgroundImage: GRADIENT }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <span>Daftar</span>
                  )}
                </button>
              </form>

              {/* BOTTOM LOGIN LINK */}
              <p className="mt-5 text-center text-xs text-gray-900 sm:text-sm">
                Sudah Punya Akun?{" "}
                <Link
                  href="/auth/login"
                  className="font-bold text-[#7C3AED] hover:text-[#E91E8C] transition-colors hover:underline"
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
