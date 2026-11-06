"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import GradientIcon, { GradientIconType } from "@/components/icon/GradientIcon";
import EventBanner from "@/components/banner/EventBanner";
import PaymentTimerBar from "@/components/payment/PaymentTimerBar";
import { clearPaymentTimer, usePaymentTimer } from "@/hooks/usePaymentTimer";

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

type Method = "bank" | "kartu" | "ewallet";

const methods: { id: Method; label: string; icon: GradientIconType }[] = [
  { id: "bank", label: "Transfer Bank", icon: "landmark" },
  { id: "kartu", label: "Kartu Kredit", icon: "creditCard" },
  { id: "ewallet", label: "E Wallet", icon: "qrCode" },
];

const ewallets = ["GoPay", "OVO", "DANA", "ShopeePay"];

// Lebar batang barcode dekoratif (px)
const barcodeBars = [4, 10, 4, 6, 10, 4, 4, 10, 6, 4, 10, 4, 6, 10, 4, 10, 4, 6];

const formatPrice = (price: number) => "Rp" + price.toLocaleString("id-ID");

const inputClass =
  "h-[46px] w-full rounded-md border border-pink-400 bg-white px-4 text-sm outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-200";

function CopyField({
  value,
  copyValue,
  copied,
  onCopy,
}: {
  value: string;
  copyValue: string;
  copied: boolean;
  onCopy: (text: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-pink-400 px-4 py-3 text-sm">
      <span className="font-medium">{value}</span>
      <button
        type="button"
        onClick={() => onCopy(copyValue)}
        className="flex items-center gap-1.5 text-xs font-bold text-purple-800 transition hover:text-pink-600"
      >
        <GradientIcon type="copy" size={15} />
        {copied ? "Tersalin" : "copy"}
      </button>
    </div>
  );
}

function PembayaranContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const ticketName = searchParams.get("ticket") ?? "DIAMOND SPOT A";
  const qty = Math.max(1, Number(searchParams.get("qty")) || 1);
  const total = (prices[ticketName] ?? 0) * qty;

  // Timer lanjutan dari halaman input data pribadi
  const secondsLeft = usePaymentTimer();
  const expired = secondsLeft === 0;

  const [method, setMethod] = useState<Method>("bank");
  const [ewallet, setEwallet] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [orderId, setOrderId] = useState("");

  // ID pemesanan dibuat sekali lalu disimpan, supaya tidak berubah saat refresh
  // TODO: ganti dengan ID dan nomor VA asli dari backend
  useEffect(() => {
    try {
      let id = sessionStorage.getItem("orderId");
      if (!id) {
        id =
          "BYEW" +
          Math.random().toString(36).slice(2, 8).toUpperCase().padEnd(6, "0");
        sessionStorage.setItem("orderId", id);
      }
      setOrderId(id);
    } catch {
      setOrderId("BYEW10255Q");
    }
  }, []);

  const virtualAccount = "8940 1122 3456 7890";

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(null), 1500);
    } catch {}
  };

  const handleFinish = () => {
    if (expired) return;
    // TODO: konfirmasi pembayaran ke backend, lalu sesuaikan route tujuan
    clearPaymentTimer();
    router.push(
    `/pembayaran-berhasil?ticket=${encodeURIComponent(ticketName)}&qty=${qty}`
    );
  };

  return (
    <main className="min-h-screen bg-white text-black">
      <HomeNavbar />

      <EventBanner
        image="/image/snada-event.png"
        title="Snada Indonesia - 2026"
        location="Istora Senayan, Jakarta Pusat"
        date="Sabtu, 10 October 2026 - 22.00 WIB"
        price="Rp750.000"
        category="Konser Musik Pop"
      />

      <PaymentTimerBar secondsLeft={secondsLeft} />

      <div className="mx-auto grid max-w-[1450px] grid-cols-1 items-start gap-8 px-5 py-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-10 lg:px-10">
        {/* ================= KIRI: METODE PEMBAYARAN ================= */}
        <section className="min-w-0 space-y-6">
          {/* Selesaikan pembayaran */}
          <div>
            <h2 className="flex items-center gap-3 font-bold text-purple-800">
              <GradientIcon type="wallet" size={24} />
              Selesaikan Pembayaran
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-purple-800">
              Tiket Anda telah dikunci. Selesaikan pembayaran dalam batas waktu
              yang ditentukan untuk mengamankan tempat Anda di area lantai.
            </p>
          </div>

          {/* Pilih metode */}
          <div>
            <h2 className="flex items-center gap-3 font-bold text-purple-800">
              <GradientIcon type="creditCard" size={24} />
              Pilih Metode Pembayaran
            </h2>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {methods.map((m) => {
                const active = method === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id)}
                    aria-pressed={active}
                    className={`flex h-[72px] flex-col items-center justify-center gap-1.5 rounded-lg border text-xs font-bold text-purple-800 transition md:text-sm ${
                      active
                        ? "border-purple-600 bg-purple-50 shadow-[0_3px_8px_-2px_rgba(124,58,237,0.4)]"
                        : "border-pink-400 hover:bg-pink-50"
                    }`}
                  >
                    <GradientIcon type={m.icon} size={22} />
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detail metode */}
          <div className="rounded-xl border border-pink-300 p-5">
            {method === "bank" && (
              <>
                <p className="mb-5 flex items-center gap-3 text-sm font-bold text-purple-800">
                  <span className="rounded bg-gradient-to-r from-purple-700 to-pink-500 px-2 py-0.5 text-xs text-white">
                    Cuantix
                  </span>
                  Virtual Account
                </p>

                <p className="mb-2 text-sm font-medium">Nomor Akun:</p>
                <CopyField
                  value={virtualAccount}
                  copyValue={virtualAccount.replace(/\s/g, "")}
                  copied={copied === virtualAccount.replace(/\s/g, "")}
                  onCopy={handleCopy}
                />

                <p className="mb-2 mt-4 text-sm font-medium">Total:</p>
                <CopyField
                  value={formatPrice(total)}
                  copyValue={String(total)}
                  copied={copied === String(total)}
                  onCopy={handleCopy}
                />

                <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-purple-800">
                  <span className="mt-0.5">
                    <GradientIcon type="info" size={15} />
                  </span>
                  Pastikan Anda mentransfer jumlah yang tepat. Tiket Anda akan
                  diterbitkan secara otomatis dalam waktu 15 menit setelah
                  konfirmasi pembayaran.
                </p>
              </>
            )}

            {method === "kartu" && (
              <div className="space-y-4">
                <p className="text-sm font-bold text-purple-800">Kartu Kredit / Debit</p>
                <div>
                  <label htmlFor="cardNumber" className="mb-1 block text-sm font-medium">
                    Nomor Kartu
                  </label>
                  <input
                    id="cardNumber"
                    inputMode="numeric"
                    maxLength={19}
                    placeholder="0000 0000 0000 0000"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="cardName" className="mb-1 block text-sm font-medium">
                    Nama di Kartu
                  </label>
                  <input id="cardName" className={inputClass} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="cardExp" className="mb-1 block text-sm font-medium">
                      Berlaku Hingga
                    </label>
                    <input id="cardExp" placeholder="MM/YY" maxLength={5} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="cardCvv" className="mb-1 block text-sm font-medium">
                      CVV
                    </label>
                    <input id="cardCvv" inputMode="numeric" maxLength={4} className={inputClass} />
                  </div>
                </div>
              </div>
            )}

            {method === "ewallet" && (
              <div>
                <p className="mb-4 text-sm font-bold text-purple-800">Pilih E Wallet</p>
                <div className="grid grid-cols-2 gap-3">
                  {ewallets.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setEwallet(name)}
                      aria-pressed={ewallet === name}
                      className={`rounded-lg border py-3 text-sm font-bold text-purple-800 transition ${
                        ewallet === name
                          ? "border-purple-600 bg-purple-50"
                          : "border-pink-400 hover:bg-pink-50"
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* QR cepat */}
          <div className="flex items-center gap-4 rounded-xl border border-pink-300 p-4">
            <div className="flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-xl border border-purple-400">
              {/* TODO: ganti dengan QR asli (mis. library qrcode.react) */}
              <GradientIcon type="qrCode" size={64} color="#000000" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold text-purple-800">
                Gunakan QR Cepat untuk Membayar
              </p>
              <p className="mt-1 text-xs leading-relaxed text-purple-800">
                Buka dompet digital atau aplikasi perbankan pilihan Anda untuk
                memindai dan menyelesaikan transaksi secara instan.
              </p>
              <div className="mt-2 flex gap-2">
                {methods.map((m) => (
                  <span
                    key={m.id}
                    className="flex h-7 w-7 items-center justify-center rounded border border-pink-400"
                  >
                    <GradientIcon type={m.icon} size={16} />
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Tombol */}
          <div className="flex items-center gap-6 pt-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg border border-purple-500 px-8 py-3 font-bold text-purple-800 transition hover:bg-purple-50"
            >
              Sebelumnya
            </button>
            <button
              type="button"
              onClick={handleFinish}
              disabled={expired}
              className="rounded-lg border border-purple-500 px-10 py-3 font-bold text-purple-800 transition hover:bg-purple-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent"
            >
              Selesai
            </button>
          </div>
        </section>

        {/* ================= KANAN: RINGKASAN + ID PEMESANAN ================= */}
        <aside className="min-w-0 lg:sticky lg:top-6">
          <div className="overflow-hidden rounded-lg border border-pink-300 bg-white">
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

            {/* Stub tiket: ID pemesanan + barcode */}
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
          </div>
        </aside>
      </div>
    </main>
  );
}

export default function PembayaranPage() {
  return (
    <Suspense fallback={null}>
      <PembayaranContent />
    </Suspense>
  );
}