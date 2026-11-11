"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import GradientIcon from "@/components/icon/GradientIcon";
import AccountSidebar, { type AccountUser } from "@/components/account/AccountSidebar";

const BORDER_GRADIENT = "linear-gradient(90deg,#7C3AED 0%,#E91E8C 100%)";
const TITLE_GRADIENT = "linear-gradient(90deg,#E91E8C 0%,#5B1AA8 100%)";
const BUTTON_PINK = "#EC407A";

const CARD_CLS = "rounded-[10px] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.15)]";
const MAX_LENGTH = 500;

const RATING_LABELS = ["Pilih rating", "Kurang puas", "Biasa saja", "Cukup baik", "Puas", "Luar biasa!"];

const TAGS = [
  "Penyelenggaraan",
  "Lokasi",
  "Tata suara",
  "Keamanan",
  "Antrean masuk",
  "Harga tiket",
];

// TODO: ganti dengan data event asli dari API berdasarkan id pesanan
const DUMMY_EVENT = {
  nama: "Snada Indonesia - 2026",
  lokasi: "Istora Senayan, Jakarta Pusat",
  tanggal: "Sabtu, 10 Oktober 2026",
  poster: "/image/snada-event.png",
  selesaiPada: "2026-10-10T23:59:00+07:00", // waktu acara berakhir
};

// TODO: ganti dengan data ulasan asli dari API (khusus mode edit)
const DUMMY_REVIEW = {
  rating: 4,
  tags: ["Lokasi", "Tata suara"],
  isi: "Acaranya seru dan tata suaranya bagus. Antrean masuk agak panjang.",
};

type ReviewPageProps = {
  /** create = tulis ulasan baru (id = id pesanan), edit = ubah ulasan (id = id ulasan) */
  mode: "create" | "edit";
  id: string;
};

export default function ReviewPage({ mode, id }: ReviewPageProps) {
  const router = useRouter();

  // TODO: ganti dengan data user asli dari session/auth
  const [user] = useState<AccountUser>({
    nama: "Iput Cantik",
    tipe: "Personal",
    foto: "/image/avatar.png",
  });

  const event = DUMMY_EVENT;
  const initial = mode === "edit" ? DUMMY_REVIEW : null;

  const [rating, setRating] = useState<number>(initial?.rating ?? 0);
  const [hover, setHover] = useState<number>(0);
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [isi, setIsi] = useState<string>(initial?.isi ?? "");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [done, setDone] = useState<boolean>(false);

  // Ulasan baru hanya boleh ditulis setelah acara selesai
  const ended = new Date(event.selesaiPada).getTime() <= Date.now();
  const canWrite = mode === "edit" || ended;

  function toggleTag(tag: string) {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError("Pilih rating bintang dulu ya.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      // TODO: panggil API simpan ulasan, kirim { rating, tags, isi }
      //   create -> POST /pesanan/{id}/ulasan
      //   edit   -> PUT  /ulasan/{id}
      console.log(mode, id, { rating, tags, isi: isi.trim() });
      setDone(true);
    } catch {
      setError("Gagal mengirim ulasan. Coba lagi sebentar lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  const shownRating = hover || rating;

  return (
    <div className="min-h-screen bg-[#F2F2F2]" style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}>
      <HomeNavbar />

      <main className="flex flex-col gap-8 px-5 py-8 sm:px-8 lg:flex-row lg:px-16">
        {/* SIDEBAR */}
        <AccountSidebar user={user} active="ulasanSaya" />

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
            {mode === "edit" ? "Edit Ulasan" : "Beri Ulasan"}
          </h1>
          <p className="mt-1 text-[13px] text-gray-700">
            Ceritakan pengalamanmu di {event.nama}
          </p>

          {/* Ringkasan event */}
          <section className={`mt-6 flex gap-4 p-4 ${CARD_CLS}`}>
            <img
              src={event.poster}
              alt={event.nama}
              className="h-[72px] w-[124px] shrink-0 rounded-[8px] object-cover"
            />
            <div className="flex min-w-0 flex-col justify-center gap-1.5">
              <h2 className="text-[14px] font-bold text-gray-900">{event.nama}</h2>
              <p className="flex items-center gap-2 text-[12px] text-gray-700">
                <GradientIcon type="mapPin" size={14} color="#6B7280" />
                {event.lokasi}
              </p>
              <p className="flex items-center gap-2 text-[12px] text-gray-700">
                <GradientIcon type="calendar" size={14} color="#6B7280" />
                {event.tanggal}
              </p>
            </div>
          </section>

          {done ? (
            /* BERHASIL */
            <section className={`mt-6 flex flex-col items-center gap-3 px-6 py-16 text-center ${CARD_CLS}`}>
              <GradientIcon type="checkCircle" size={48} />
              <p className="text-[15px] font-bold text-gray-900">
                {mode === "edit" ? "Ulasanmu berhasil diperbarui" : "Terima kasih atas ulasanmu!"}
              </p>
              <p className="max-w-sm text-[12px] text-gray-600">
                Ulasanmu membantu pengunjung lain dan penyelenggara untuk membuat acara yang lebih baik.
              </p>
              <button
                type="button"
                onClick={() => router.push("/akun/ulasan")}
                className="mt-2 h-[36px] rounded-full px-8 text-[13px] font-semibold text-white shadow-md transition-opacity hover:opacity-90"
                style={{ background: BUTTON_PINK }}
              >
                Lihat Ulasan Saya
              </button>
            </section>
          ) : !canWrite ? (
            /* ACARA BELUM SELESAI */
            <section className={`mt-6 flex flex-col items-center gap-3 px-6 py-16 text-center ${CARD_CLS}`}>
              <GradientIcon type="clock" size={48} />
              <p className="text-[15px] font-bold text-gray-900">
                Ulasan bisa ditulis setelah acara selesai
              </p>
              <p className="max-w-sm text-[12px] text-gray-600">
                Datang dulu ke acaranya, lalu kembali ke sini untuk menceritakan pengalamanmu.
              </p>
              <button
                type="button"
                onClick={() => router.push("/akun/pesanan")}
                className="mt-2 h-[36px] rounded-full px-8 text-[13px] font-semibold text-white shadow-md transition-opacity hover:opacity-90"
                style={{ background: BUTTON_PINK }}
              >
                Kembali ke Pesanan
              </button>
            </section>
          ) : (
            /* FORM */
            <form onSubmit={handleSubmit} className={`mt-6 flex flex-col gap-6 p-5 ${CARD_CLS}`}>
              {/* Rating */}
              <div>
                <h2 className="text-[14px] font-bold text-gray-900">Bagaimana pengalamanmu?</h2>
                <div
                  role="radiogroup"
                  aria-label="Rating"
                  className="mt-3 flex gap-1"
                  onMouseLeave={() => setHover(0)}
                >
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      type="button"
                      role="radio"
                      aria-checked={rating === i}
                      aria-label={`${i} bintang`}
                      onClick={() => setRating(i)}
                      onMouseEnter={() => setHover(i)}
                      className="rounded p-0.5 transition-transform hover:scale-110"
                    >
                      <svg
                        width="36"
                        height="36"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        fill={i <= shownRating ? "#E91E8C" : "#E5E7EB"}
                      >
                        <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z" />
                      </svg>
                    </button>
                  ))}
                </div>
                <p
                  className="mt-1 text-[12px] font-semibold"
                  style={{ color: shownRating > 0 ? "#E91E8C" : "#6B7280" }}
                >
                  {RATING_LABELS[shownRating]}
                </p>
              </div>

              {/* Tag */}
              <div>
                <h2 className="text-[14px] font-bold text-gray-900">
                  Apa yang paling berkesan?{" "}
                  <span className="text-[12px] font-normal text-gray-500">(opsional)</span>
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {TAGS.map((tag) => {
                    const active = tags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        aria-pressed={active}
                        onClick={() => toggleTag(tag)}
                        className="whitespace-nowrap rounded-full px-4 py-1.5 text-[12px] font-semibold transition-colors"
                        style={{
                          color: active ? "#ffffff" : "#6D28D9",
                          border: "1.5px solid transparent",
                          backgroundImage: active
                            ? BORDER_GRADIENT
                            : `linear-gradient(white, white), ${BORDER_GRADIENT}`,
                          backgroundOrigin: "border-box",
                          backgroundClip: active ? "border-box" : "padding-box, border-box",
                        }}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Teks ulasan */}
              <div>
                <label htmlFor="isi-ulasan" className="text-[14px] font-bold text-gray-900">
                  Ceritakan lebih lanjut{" "}
                  <span className="text-[12px] font-normal text-gray-500">(opsional)</span>
                </label>
                <textarea
                  id="isi-ulasan"
                  rows={5}
                  maxLength={MAX_LENGTH}
                  value={isi}
                  onChange={(e) => setIsi(e.target.value)}
                  placeholder="Bagaimana acaranya, lokasinya, dan hal lain yang ingin kamu bagikan?"
                  className="mt-3 w-full resize-none rounded-[10px] border border-gray-200 bg-white px-3.5 py-2.5 text-[13px] text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20"
                />
                <p className="mt-1 text-right text-[11px] text-gray-500">
                  {isi.length}/{MAX_LENGTH}
                </p>
              </div>

              {error && (
                <p role="alert" className="text-[12px] font-medium text-red-600">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="h-[36px] rounded-full bg-white px-8 text-[13px] font-semibold text-[#6D28D9] transition-colors hover:bg-[#F3EBFF]"
                  style={{
                    border: "1.5px solid transparent",
                    backgroundImage: `linear-gradient(white, white), ${BORDER_GRADIENT}`,
                    backgroundOrigin: "border-box",
                    backgroundClip: "padding-box, border-box",
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-[36px] rounded-full px-8 text-[13px] font-semibold text-white shadow-md transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ background: BUTTON_PINK }}
                >
                  {submitting ? "Mengirim…" : mode === "edit" ? "Simpan Perubahan" : "Kirim Ulasan"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}