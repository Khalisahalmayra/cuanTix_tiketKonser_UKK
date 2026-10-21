"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import GradientIcon from "@/components/icon/GradientIcon";
import HomeNavbar from "@/components/navbar/HomeNavbar";

const PURPLE = "#5B1AA8";
const TEXT_GRADIENT = "linear-gradient(90deg,#5B1AA8 0%,#E91E8C 100%)";

type Kontak = {
  icon: React.ReactNode;
  label: string;
  href: string;
  /** true = teks tebal ungu polos, false = teks gradasi ungu → pink */
  plain?: boolean;
};

// TODO: ganti dengan kontak asli
const KONTAK: Kontak[] = [
  {
    icon: <GradientIcon type="mail" size={28} />,
    label: "Cuantix.Service@gmail.com",
    href: "mailto:Cuantix.Service@gmail.com",
  },
  {
    icon: <GradientIcon type="whatsapp" size={28} />,
    label: "0821234902892",
    href: "https://wa.me/62821234902892",
  },
  {
    icon: <GradientIcon type="instagram" size={28} />,
    label: "@Cuantix.TiketOnline",
    href: "https://instagram.com/Cuantix.TiketOnline",
  },
  {
    icon: <GradientIcon type="tiktok" size={28} />,
    label: "@Cuantix.TiketOnline",
    href: "https://tiktok.com/@Cuantix.TiketOnline",
  },
  {
    icon: <GradientIcon type="x" size={28} />,
    label: "@Cuantix.TiketOnline",
    href: "https://x.com/Cuantix.TiketOnline",
  },
  {
    icon: <GradientIcon type="facebook" size={28} />,
    label: "@Cuantix.TiketOnline",
    href: "https://facebook.com/Cuantix.TiketOnline",
  },
  {
    icon: <GradientIcon type="youtube" size={28} />,
    label: "@Cuantix.TiketOnline",
    href: "https://youtube.com/@Cuantix.TiketOnline",
  },
  {
    icon: <GradientIcon type="linkedin" size={28} />,
    label: "@Cuantix.job",
    href: "https://linkedin.com/company/Cuantix.job",
  },
];

const EMAIL_TUJUAN = "cuantix.service@gmail.com";

export default function BuatEventPage() {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [pesan, setPesan] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleKirim(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim() || !pesan.trim()) return;

    setStatus("sending");
    try {
      // TODO: ganti dengan panggilan API kamu, contoh:
      // await fetch("/api/kontak", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email, pesan }),
      // });
      await new Promise((r) => setTimeout(r, 600));
      setStatus("sent");
      setEmail("");
      setPesan("");
    } catch {
      setStatus("error");
    }
  }

  const fieldClass =
    "w-full rounded-[4px] border bg-white px-7 text-[15px] outline-none transition-shadow focus:shadow-[0_0_0_3px_rgba(124,58,237,0.18)]";

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}>
      <HomeNavbar />

      <main className="w-full px-5 pb-20 sm:px-8 lg:px-6">
        {/* TOMBOL KEMBALI */}
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Kembali"
          className="mb-6 mt-2 flex h-14 w-14 items-center justify-center rounded-full border transition-colors hover:bg-[#F3EBFF]"
          style={{ borderColor: "#8A2A9C", color: "#8A2A9C" }}
        >
          <ArrowLeft className="h-6 w-6" />
        </button>

        {/* BANNER */}
        <div className="overflow-hidden rounded-[32px]">
          <Image
            src="/image/cuantixCreators.png"
            alt="Cuantix Creators - Jual tiket eventmu sekarang dan hubungi kami"
            width={0}
            height={0}
            sizes="100vw"
            priority
            className="h-auto w-full"
          />
        </div>

        {/* HUBUNGI KAMI */}
        <section className="mt-8 sm:px-10">
          <div className="mb-8 flex items-center gap-4">
            <GradientIcon type="help" size={36} />
            <h1 className="text-2xl font-bold text-gray-900">Hubungi Kami</h1>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[320px_1fr] lg:gap-16 sm:pl-12">
            {/* DAFTAR KONTAK */}
            <ul className="flex flex-col gap-6">
              {KONTAK.map((k, i) => (
                <li key={`${k.label}-${i}`} className="flex items-center gap-3">
                  <span
                    className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-[4px] border bg-white"
                    style={{ borderColor: PURPLE }}
                  >
                    {k.icon}
                  </span>
                  <a
                    href={k.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-[50px] min-w-0 flex-1 items-center rounded-[4px] border bg-white px-[9px] text-[14px] font-bold transition-colors hover:bg-[#F3EBFF]"
                    style={{ borderColor: PURPLE }}
                  >
                    <span
                      className="truncate"
                      style={
                        k.plain
                          ? { color: "#5B1AA8" }
                          : {
                              backgroundImage: TEXT_GRADIENT,
                              WebkitBackgroundClip: "text",
                              backgroundClip: "text",
                              color: "transparent",
                            }
                      }
                    >
                      {k.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            {/* FORM */}
            <form
              onSubmit={handleKirim}
              className="flex h-fit flex-col gap-6 rounded-[24px] border bg-white p-6 sm:p-12"
              style={{ borderColor: PURPLE }}
            >
              <input
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="Email Anda . . ."
                required
                className={`${fieldClass} h-[50px] placeholder:text-[#C0267E]`}
                style={{ borderColor: PURPLE, color: "#5B1AA8" }}
              />

              <input
                type="email"
                value={EMAIL_TUJUAN}
                readOnly
                aria-label="Email tujuan"
                className={`${fieldClass} h-[50px] cursor-default`}
                style={{ borderColor: PURPLE, color: "#C0267E" }}
              />

              <textarea
                value={pesan}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPesan(e.target.value)}
                placeholder="Ketik Pesan Subjict Anda . . ."
                required
                rows={7}
                className={`${fieldClass} min-h-[198px] resize-y py-5 placeholder:text-[#8A2A9C]`}
                style={{ borderColor: PURPLE, color: "#5B1AA8" }}
              />

              <div className="mt-2 flex items-center justify-end gap-4">
                {status === "sent" && (
                  <p className="text-sm font-semibold text-green-600" role="status">
                    Pesan terkirim. Kami akan membalas lewat email.
                  </p>
                )}
                {status === "error" && (
                  <p className="text-sm font-semibold text-red-600" role="alert">
                    Pesan gagal terkirim. Coba lagi.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="h-[50px] w-full max-w-[177px] rounded-[4px] border bg-white text-[15px] font-bold transition-colors hover:bg-[#F3EBFF] disabled:opacity-60"
                  style={{ borderColor: PURPLE, color: PURPLE }}
                >
                  {status === "sending" ? "Mengirim..." : "Kirim"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}