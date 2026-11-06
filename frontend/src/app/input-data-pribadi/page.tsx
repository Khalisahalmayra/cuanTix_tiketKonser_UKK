"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import GradientIcon from "@/components/icon/GradientIcon";
import EventBanner from "@/components/banner/EventBanner";
import PaymentTimerBar from "@/components/payment/PaymentTimerBar";
import { usePaymentTimer } from "@/hooks/usePaymentTimer";

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

const formatPrice = (price: number) => "Rp" + price.toLocaleString("id-ID");

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  idNumber: string;
  dd: string;
  mm: string;
  yyyy: string;
  gender: "" | "L" | "P";
  whatsapp: "" | "ya" | "tidak";
  agreeTerms: boolean;
  agreeData: boolean;
};

const initialForm: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  countryCode: "+62",
  phone: "",
  idNumber: "",
  dd: "",
  mm: "",
  yyyy: "",
  gender: "",
  whatsapp: "",
  agreeTerms: false,
  agreeData: false,
};

type Errors = Partial<Record<keyof FormState | "dob", string>>;

const inputClass =
  "h-[52px] w-full rounded-md border border-pink-400 bg-white px-4 text-base outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-200";

const labelClass = "mb-2 block text-base font-bold text-purple-800";

function ErrorText({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-sm text-red-600">{message}</p>;
}

function PembayaranContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const ticketName = searchParams.get("ticket") ?? "DIAMOND SPOT A";
  const qty = Math.max(1, Number(searchParams.get("qty")) || 1);
  const price = prices[ticketName] ?? 0;
  const total = price * qty;

  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Errors>({});

  // ================= COUNTDOWN (lanjutan dari checkout) =================
  const secondsLeft = usePaymentTimer();
  const expired = secondsLeft === 0;

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined, dob: undefined }));
  };

  const onlyDigits = (value: string) => value.replace(/\D/g, "");

  // ================= VALIDASI =================
  const validate = (): Errors => {
    const e: Errors = {};

    if (!form.firstName.trim()) e.firstName = "Nama depan wajib diisi.";
    if (!form.lastName.trim()) e.lastName = "Nama belakang wajib diisi.";

    if (!form.email.trim()) e.email = "Email wajib diisi.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Format email tidak valid.";

    if (!form.phone) e.phone = "Nomor telepon wajib diisi.";
    else if (form.phone.length < 8 || form.phone.length > 13)
      e.phone = "Nomor telepon harus 8-13 digit.";

    if (!form.idNumber.trim()) e.idNumber = "Nomor identitas wajib diisi.";
    else if (form.idNumber.trim().length < 6)
      e.idNumber = "Nomor identitas terlalu pendek.";

    const d = Number(form.dd);
    const m = Number(form.mm);
    const y = Number(form.yyyy);
    const date = new Date(y, m - 1, d);
    const validDate =
      form.dd &&
      form.mm &&
      form.yyyy.length === 4 &&
      date.getFullYear() === y &&
      date.getMonth() === m - 1 &&
      date.getDate() === d &&
      date <= new Date();
    if (!validDate) e.dob = "Tanggal lahir tidak valid.";

    if (!form.gender) e.gender = "Pilih jenis kelamin.";
    if (!form.whatsapp) e.whatsapp = "Pilih salah satu.";
    if (!form.agreeTerms) e.agreeTerms = "Anda harus menyetujui Syarat & Ketentuan.";
    if (!form.agreeData) e.agreeData = "Anda harus menyetujui Kebijakan Pemrosesan Data.";

    return e;
  };

  const handleNext = () => {
    if (expired) return;

    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    // TODO: simpan data pemesan (state global / API)
    router.push(
      `/pembayaran?ticket=${encodeURIComponent(ticketName)}&qty=${qty}`
    );
  };

  return (
    <main className="min-h-screen bg-white text-black">
      {/* ================= NAVBAR ================= */}
      <HomeNavbar />

      {/* ================= BANNER EVENT ================= */}
      <EventBanner
        image="/image/snada-event.png"
        title="Snada Indonesia - 2026"
        location="Istora Senayan, Jakarta Pusat"
        date="Sabtu, 10 October 2026 - 22.00 WIB"
        price="Rp750.000"
        category="Konser Musik Pop"
      />

      {/* ================= TIMER ================= */}
      <PaymentTimerBar secondsLeft={secondsLeft} />

      {/* ================= KONTEN ================= */}
      <div className="mx-auto grid max-w-[1450px] grid-cols-1 items-start gap-8 px-5 py-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-10 lg:px-10">
        {/* ================= FORM ================= */}
        <section className="min-w-0 space-y-6">
          {/* Nama Depan */}
          <div>
            <label htmlFor="firstName" className={labelClass}>
              Nama Depan:
            </label>
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              value={form.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              className={inputClass}
            />
            <ErrorText message={errors.firstName} />
          </div>

          {/* Nama Belakang */}
          <div>
            <label htmlFor="lastName" className={labelClass}>
              Nama Belakang:
            </label>
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              value={form.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              className={inputClass}
            />
            <ErrorText message={errors.lastName} />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className={labelClass}>
              Email:
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className={inputClass}
            />
            <ErrorText message={errors.email} />
          </div>

          {/* Nomor Telepon */}
          <div>
            <label htmlFor="phone" className={labelClass}>
              Nomor Telepon:
            </label>
            <div className="flex gap-2">
              <div className="relative w-[110px] shrink-0">
                {/* Bendera Indonesia */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-5 -translate-y-1/2 overflow-hidden rounded-full border border-gray-200"
                >
                  <span className="block h-1/2 bg-red-600" />
                  <span className="block h-1/2 bg-white" />
                </span>

                <select
                  aria-label="Kode negara"
                  value={form.countryCode}
                  onChange={(e) => update("countryCode", e.target.value)}
                  className="h-[52px] w-full cursor-pointer appearance-none rounded-md border border-pink-400 bg-white pl-11 pr-8 text-base outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                >
                  <option value="+62">+62</option>
                  <option value="+60">+60</option>
                  <option value="+65">+65</option>
                  <option value="+1">+1</option>
                </select>

                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  <GradientIcon type="chevronDown" size={16} color="#4B5563" />
                </span>
              </div>

              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                value={form.phone}
                onChange={(e) => update("phone", onlyDigits(e.target.value))}
                className={inputClass}
              />
            </div>
            <ErrorText message={errors.phone} />
          </div>

          {/* Nomor Identitas */}
          <div>
            <label htmlFor="idNumber" className={labelClass}>
              Nomor Identitas (KTP/SIM/Paspor, dll.) :
            </label>
            <input
              id="idNumber"
              type="text"
              value={form.idNumber}
              onChange={(e) => update("idNumber", e.target.value)}
              className={inputClass}
            />
            <ErrorText message={errors.idNumber} />
          </div>

          {/* Tanggal Lahir */}
          <div>
            <span className={labelClass}>Tanggal Lahir:</span>
            <div className="flex gap-3">
              <input
                aria-label="Tanggal"
                placeholder="dd"
                inputMode="numeric"
                maxLength={2}
                value={form.dd}
                onChange={(e) => update("dd", onlyDigits(e.target.value))}
                className="h-[48px] w-[72px] rounded-md border border-pink-400 text-center outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
              />
              <input
                aria-label="Bulan"
                placeholder="mm"
                inputMode="numeric"
                maxLength={2}
                value={form.mm}
                onChange={(e) => update("mm", onlyDigits(e.target.value))}
                className="h-[48px] w-[96px] rounded-md border border-pink-400 text-center outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
              />
              <input
                aria-label="Tahun"
                placeholder="yyyy"
                inputMode="numeric"
                maxLength={4}
                value={form.yyyy}
                onChange={(e) => update("yyyy", onlyDigits(e.target.value))}
                className="h-[48px] w-[88px] rounded-md border border-pink-400 text-center outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
              />
            </div>
            <ErrorText message={errors.dob} />
          </div>

          {/* Jenis Kelamin */}
          <fieldset>
            <legend className="mb-2 text-base font-bold text-purple-800">
              Jenis Kelamin:
            </legend>
            <div className="space-y-2">
              {[
                { value: "L", label: "Laki Laki" },
                { value: "P", label: "Perempuan" },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-3"
                >
                  <input
                    type="radio"
                    name="gender"
                    value={option.value}
                    checked={form.gender === option.value}
                    onChange={() => update("gender", option.value as "L" | "P")}
                    className="h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-full border border-pink-400 bg-white transition checked:border-[6px] checked:border-pink-500"
                  />
                  {option.label}
                </label>
              ))}
            </div>
            <ErrorText message={errors.gender} />
          </fieldset>

          {/* Notifikasi WhatsApp */}
          <fieldset>
            <legend className="mb-2 text-base font-bold leading-snug text-purple-800">
              Saya setuju untuk menerima pemberitahuan terkait pemesanan tiket ini
              melalui akun WhatsApp saya, jika ada.
            </legend>
            <div className="flex gap-6">
              {[
                { value: "ya", label: "Iya, Setuju" },
                { value: "tidak", label: "Tidak Setuju" },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-3"
                >
                  <input
                    type="radio"
                    name="whatsapp"
                    value={option.value}
                    checked={form.whatsapp === option.value}
                    onChange={() => update("whatsapp", option.value as "ya" | "tidak")}
                    className="h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-full border border-pink-400 bg-white transition checked:border-[6px] checked:border-pink-500"
                  />
                  {option.label}
                </label>
              ))}
            </div>
            <ErrorText message={errors.whatsapp} />
          </fieldset>

          {/* Persetujuan */}
          <div className="space-y-4">
            <div>
              <label className="flex cursor-pointer items-start gap-4">
                <input
                  type="checkbox"
                  checked={form.agreeTerms}
                  onChange={(e) => update("agreeTerms", e.target.checked)}
                  className="mt-1 h-7 w-7 shrink-0 cursor-pointer accent-pink-600"
                />
                <span className="font-bold leading-snug text-purple-800">
                  Dengan mengeklik &ldquo;Selanjutnya&rdquo;, Anda menyetujui Syarat
                  &amp; Ketentuan serta Kebijakan Privasi Cuantix.
                </span>
              </label>
              <ErrorText message={errors.agreeTerms} />
            </div>

            <div>
              <label className="flex cursor-pointer items-start gap-4">
                <input
                  type="checkbox"
                  checked={form.agreeData}
                  onChange={(e) => update("agreeData", e.target.checked)}
                  className="mt-1 h-7 w-7 shrink-0 cursor-pointer accent-pink-600"
                />
                <span className="font-bold leading-snug text-purple-800">
                  Dengan mengeklik &ldquo;Selanjutnya&rdquo;, Anda menyetujui
                  Kebijakan Pemrosesan Data Pribadi Cuantix.
                </span>
              </label>
              <ErrorText message={errors.agreeData} />
            </div>
          </div>

          {/* Tombol */}
          <div className="flex items-center gap-6 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg border border-purple-500 px-8 py-3 font-bold text-purple-800 transition hover:bg-purple-50"
            >
              Sebelumnya
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={expired}
              className="rounded-lg border border-purple-500 px-8 py-3 font-bold text-purple-800 transition hover:bg-purple-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent"
            >
              Selanjutnya
            </button>
          </div>
        </section>

        {/* ================= RINGKASAN PESANAN ================= */}
        <aside className="min-w-0 lg:sticky lg:top-6">
          <div className="overflow-hidden rounded-lg border border-pink-300 bg-white">
            {/* Nama tiket + total */}
            <div className="border-b border-pink-300 px-5 py-5">
              <h2 className="font-bold text-purple-800">{ticketName}</h2>
              <p className="mt-2 text-sm">
                Total ({qty} Tiket):{" "}
                <span className="ml-1 text-pink-600">{formatPrice(total)}</span>
              </p>
            </div>

            {/* Tanggal */}
            <div className="border-b border-pink-300 px-5 py-4 text-sm">
              <p>Tanggal yang Dipilih:</p>
              <p className="mt-2 text-purple-800">Sabtu, 10 Oktober 2026</p>
            </div>

            {/* Info */}
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

            {/* Garis gradasi */}
            <div className="h-2 bg-gradient-to-r from-purple-800 to-pink-500" />

            {/* Total pembayaran */}
            <div className="flex items-center justify-between gap-3 px-5 py-4 text-sm">
              <span>Total Pembayaran:</span>
              <span className="font-bold">{formatPrice(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default function PembayaranPage() {
  // useSearchParams di App Router harus dibungkus Suspense
  return (
    <Suspense fallback={null}>
      <PembayaranContent />
    </Suspense>
  );
}