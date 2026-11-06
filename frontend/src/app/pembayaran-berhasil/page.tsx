"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import GradientIcon from "@/components/icon/GradientIcon";

const poster = "/image/snada-event.png";

// Harga per kategori (samakan dengan data di halaman checkout)
const prices: Record<string, number> = {
  "DIAMOND SPOT A": 6000000,
  "DIAMOND SPOT B": 6000000,
  VIP: 2500000,
  "PLATINUM A": 1800000,
  "PLATINUM B": 1800000,
  "GOLD A": 1500000,
  "GOLD B": 1500000,
  "SILVER A": 1200000,
  "SILVER B": 1200000,
  "BRONZE A": 1000000,
  "BRONZE B": 1000000,
  FESTIVAL: 750000,
};

// Lebar batang barcode dekoratif (px)
const barcodeBars = [4, 10, 4, 6, 10, 4, 4, 10, 6, 4, 10, 4, 6, 10, 4, 10, 4, 6];

const nextSteps = [
  {
    title: "Simpan ke galeri anda",
    desc: "Unduh PDF atau simpan kode QR ke ponsel Anda. Tangkapan layar (screenshot) dapat diterima.",
  },
  {
    title: "Pastikan data anda sesuai",
    desc: "Pastikan kartu identitas fisik Anda sesuai dengan data pembeli tiket.",
  },
  {
    title: "Arahan acara",
    desc: "Datang sesuai jadwal dan ikuti arahan panitia untuk pengalaman masuk yang nyaman.",
  },
];

const formatPrice = (price: number) => "Rp" + price.toLocaleString("id-ID");

const outlineButton =
  "flex w-full items-center justify-center gap-3 rounded-lg border border-pink-400 px-6 py-3 font-bold text-purple-800 transition hover:bg-pink-50";

function SuksesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const ticketName = searchParams.get("ticket") ?? "DIAMOND SPOT A";
  const qty = Math.max(1, Number(searchParams.get("qty")) || 1);
  const total = (prices[ticketName] ?? 0) * qty;

  const [orderId, setOrderId] = useState("");
  const [paidAt, setPaidAt] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  // Dibaca di client supaya tidak beda antara server dan browser
  useEffect(() => {
    setPaidAt(
      new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
    try {
      setOrderId(sessionStorage.getItem("orderId") ?? "");
    } catch {}
  }, []);

  const handleDownload = () => {
    // TODO: ganti dengan unduhan PDF e-tiket dari backend
    window.print();
  };

  const handleSendEmail = () => {
    // TODO: panggil API kirim e-tiket ke email pembeli
    setEmailSent(true);
  };

  return (
    <main className="min-h-screen bg-white pb-16 text-black">
      <HomeNavbar />

      <div className="mx-auto max-w-[1450px] px-5 pt-6 lg:px-10">
        {/* ================= PEMBAYARAN BERHASIL ================= */}
        <section className="rounded-2xl border border-pink-300 px-6 py-8 text-center">
          <div className="mx-auto flex justify-center">
            <GradientIcon type="checkCircle" size={72} />
          </div>

          <h1 className="mt-4 bg-gradient-to-r from-purple-800 to-pink-500 bg-clip-text text-xl font-bold text-transparent md:text-2xl">
            PEMBAYARAN ANDA BERHASIL
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-purple-800">
            Anda telah selesai melakukan pembayaran pada Tanggal{" "}
            <b>{paidAt || "-"}</b>. Jangan lewatkan acara ini, tiket ini berlaku
            sampai <b>Sabtu, 10 Oktober 2026.</b>
          </p>
          <p className="mt-3 text-sm text-purple-800">
            Saatnya memulai perjalanan menuju pengalaman yang tak terlupakan.
          </p>
        </section>

        <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12">
          {/* ================= KIRI: E-TIKET ================= */}
          <section className="mx-auto w-full max-w-[440px] min-w-0 overflow-hidden rounded-xl border border-pink-300 bg-white shadow-md lg:mx-0">
            <img
              src={poster}
              alt="Poster Snada Indonesia 2026"
              className="aspect-[1.7/1] w-full object-cover"
            />

            <div className="border-b border-pink-300 px-5 py-5">
              <h2 className="font-bold text-purple-800">{ticketName}</h2>
              <p className="mt-2 text-sm">
                Total ({qty} Tiket):{" "}
                <span className="ml-1 text-pink-600">{formatPrice(total)}</span>
              </p>
            </div>

            <div className="border-b border-pink-300 px-5 py-4 text-sm">
              <p>Tanggal yang Dipilih:</p>
              <p className="mt-2 text-purple-800">Sabtu, 10 Oktober 2026</p>
            </div>

            <ul className="space-y-3 px-5 py-4 text-sm text-purple-800">
              <li className="flex items-center gap-3">
                <GradientIcon type="wallet" size={20} />
                Pengembalian dana tidak diperbolehkan.
              </li>
              <li className="flex items-center gap-3">
                <GradientIcon type="ticket" size={20} />
                Konfirmasi Instan
              </li>
              <li className="flex items-center gap-3">
                <GradientIcon type="calendar" size={20} />
                Berlaku pada 10 Oktober 2026
              </li>
            </ul>

            <div className="h-2 bg-gradient-to-r from-purple-800 to-pink-500" />

            <div className="flex items-center justify-between gap-3 px-5 py-4 text-sm">
              <span>Total Pembayaran:</span>
              <span className="font-bold">{formatPrice(total)}</span>
            </div>

            {/* Stub: ID pemesanan + barcode */}
            <div className="relative bg-gradient-to-b from-purple-800 to-pink-500 px-6 pb-6 pt-5 text-center text-white">
              <span
                aria-hidden="true"
                className="absolute -left-3 top-4 h-6 w-6 rounded-full border border-pink-300 bg-white"
              />
              <span
                aria-hidden="true"
                className="absolute -right-3 top-4 h-6 w-6 rounded-full border border-pink-300 bg-white"
              />

              <p className="text-sm font-bold">ID Pemesanan :</p>
              <p className="mt-1 text-sm font-bold tracking-[0.3em]">
                #{orderId || "----------"}
              </p>

              <div
                aria-hidden="true"
                className="mx-auto mt-4 flex h-24 items-stretch justify-center gap-[5px]"
              >
                {barcodeBars.map((w, i) => (
                  <span key={i} className="bg-white" style={{ width: w }} />
                ))}
              </div>
            </div>
          </section>

          {/* ================= KANAN: AKSI ================= */}
          <section className="min-w-0 space-y-8">
            {/* Unduh / kirim */}
            <div className="space-y-4 rounded-xl border border-pink-300 p-6 md:px-10">
              <button type="button" onClick={handleDownload} className={outlineButton}>
                <GradientIcon type="download" size={20} />
                Unduh Menggunakan PDF
              </button>

              <button
                type="button"
                onClick={handleSendEmail}
                disabled={emailSent}
                className={`${outlineButton} disabled:cursor-default disabled:hover:bg-transparent`}
              >
                <GradientIcon type="send" size={20} />
                {emailSent ? "E-tiket Terkirim ke Email Anda" : "Kirim ke Email Anda"}
              </button>
            </div>

            {/* Apa selanjutnya */}
            <div className="rounded-xl border border-pink-300 p-6 md:px-10">
              <h2 className="flex items-center gap-3 font-bold text-purple-800">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-purple-700 to-pink-500">
                  <GradientIcon type="help" size={16} color="#ffffff" />
                </span>
                Apa Selanjutnya?
              </h2>

              <ol className="mt-6 space-y-5">
                {nextSteps.map((step, i) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-purple-700 text-xs font-bold text-purple-800">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-purple-800">{step.title}</p>
                      <p className="mt-1 text-sm leading-snug text-pink-700">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Navigasi */}
            <div className="space-y-4 md:px-10">
              <button type="button" onClick={() => router.push("/home")} className={outlineButton}>
                Kembali ke halaman utama
              </button>
              <button
                type="button"
                // TODO: sesuaikan dengan route riwayat transaksi kamu
                onClick={() => router.push("/cek-pembelian")}
                className={outlineButton}
              >
                Lihat riwayat transaksi anda
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function PembayaranBerhasilPage() {
  return (
    <Suspense fallback={null}>
      <SuksesContent />
    </Suspense>
  );
}