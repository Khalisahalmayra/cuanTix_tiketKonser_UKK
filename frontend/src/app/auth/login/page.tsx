"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const GRADIENT = "linear-gradient(90deg, #7C3AED 0%, #E91E8C 100%)";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleChange =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    try {
      setIsSubmitting(true);
      // TODO: hook up to your auth/login endpoint
      // await fetch("/api/auth/login", { method: "POST", body: JSON.stringify(form) });
      console.log("Logging in:", form);
    } catch {
      setError("Email atau password salah.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      // TODO: hook up to your Google OAuth flow, e.g.:
      // await signIn("google");
      // or: window.location.href = "/api/auth/google";
      console.log("Login with Google");
    } finally {
      setIsGoogleLoading(false);
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
                Masuk Akun
              </h2>
              <p className="mt-1 text-[11px] text-gray-700 sm:text-xs">
                Silahkan masuk akun Cuantix Anda, atau klik{" "}
                <Link
                  href="/auth/register"
                  className="font-medium text-[#C026D3] hover:underline"
                >
                  Daftar Sekarang
                </Link>{" "}
                untuk mendaftar akun di Cuantix.
              </p>

              <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
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
                    className="w-full rounded-[10px] border border-white/60 bg-white/90 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-[#C026D3]/50"
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
                    autoComplete="current-password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange("password")}
                    className="w-full rounded-[10px] border border-white/60 bg-white/90 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-[#C026D3]/50"
                  />
                </div>

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
                  {isSubmitting ? "Memproses..." : "Masuk"}
                </button>
              </form>

              {/* DIVIDER */}
              <div className="mt-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-400/50" />
                <span className="text-[11px] text-gray-700">
                  Atau masuk dengan
                </span>
                <div className="h-px flex-1 bg-gray-400/50" />
              </div>

              {/* GOOGLE LOGIN */}
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading}
                  aria-label="Masuk dengan Google"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isGoogleLoading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                  ) : (
                    <GoogleIcon />
                  )}
                </button>
              </div>

              <p className="mt-4 text-center text-[11px] text-gray-800 sm:text-xs">
                Belum Memiliki Akun?{" "}
                <Link
                  href="/auth/register"
                  className="font-semibold text-[#E91E8C] hover:underline"
                >
                  Daftar Sekarang
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}