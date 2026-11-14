"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

import LandingNavbar from "@/components/navbar/LandingNavbar";
import Footer from "@/components/footer/Footer";
import { fetchEventDetail, type EventDetail } from "@/data/events";

const GRADIENT = "linear-gradient(90deg, #7C3AED 0%, #E91E8C 100%)";
const rupiah = (n: number) => "Rp " + n.toLocaleString("id-ID");

export default function EventDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qty, setQty] = useState<Record<number, number>>({});

  useEffect(() => {
    fetchEventDetail(params.slug)
      .then(setEvent)
      .catch(() => setError("Event tidak ditemukan."))
      .finally(() => setLoading(false));
  }, [params.slug]);

  const setQuantity = (id: number, value: number, max: number) =>
    setQty((q) => ({ ...q, [id]: Math.max(0, Math.min(value, max, 10)) }));

  const total = event
    ? event.tickets.reduce((s, t) => s + t.price * (qty[t.id] || 0), 0)
    : 0;
  const totalQty = Object.values(qty).reduce((s, n) => s + n, 0);

  const [buying, setBuying] = useState(false);

  const handleBuy = async () => {
    if (totalQty === 0 || !event) return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    const items = Object.entries(qty)
      .filter(([, n]) => n > 0)
      .map(([id, n]) => ({ ticket_type_id: Number(id), quantity: n }));

    try {
      setBuying(true);
      const res = await fetch("http://localhost:4000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ event_id: event.id, items }),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Gagal membuat pesanan");
        return;
      }

      alert(`Pesanan dibuat! Kode: ${data.order_code}`);
    } catch {
      alert("Tidak bisa terhubung ke server.");
    } finally {
      setBuying(false);
    }
  };


  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <LandingNavbar />

      <main className="mx-auto max-w-[1100px] px-5 py-8 sm:px-8">
        {loading ? (
          <p className="text-sm text-gray-500">Memuat...</p>
        ) : error || !event ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.5fr_1fr]">
            {/* KIRI: INFO EVENT */}
            <div>
              <div className="relative aspect-[1.9/1] w-full overflow-hidden rounded-2xl bg-gray-100">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 650px"
                  className="object-cover"
                  priority
                />
              </div>

              <span className="mt-5 inline-block rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                {event.category}
              </span>
              <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">
                {event.title}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Oleh {event.organizer}
              </p>

              <div className="mt-5 space-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-semibold">Tanggal: </span>
                  {new Date(event.date).toLocaleString("id-ID", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                </p>
                <p>
                  <span className="font-semibold">Lokasi: </span>
                  {event.venue ? `${event.venue}, ` : ""}
                  {event.city}
                </p>
              </div>

              <h2 className="mt-6 text-lg font-bold">Deskripsi</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-700">
                {event.description || "Belum ada deskripsi."}
              </p>
            </div>

            {/* KANAN: PILIH TIKET */}
            <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:sticky lg:top-28">
              <h2 className="text-lg font-bold">Pilih Tiket</h2>

              <div className="mt-4 space-y-3">
                {event.tickets.map((t) => (
                  <div
                    key={t.id}
                    className="rounded-xl border border-gray-200 p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold">{t.name}</p>
                        <p className="text-sm font-semibold text-[#7C3AED]">
                          {rupiah(t.price)}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          Sisa {t.available} tiket
                        </p>
                      </div>

                      {t.available === 0 ? (
                        <span className="text-xs font-semibold text-red-500">
                          Habis
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setQuantity(t.id, (qty[t.id] || 0) - 1, t.available)
                            }
                            className="h-8 w-8 rounded-lg border border-gray-300 text-lg"
                          >
                            −
                          </button>
                          <span className="w-5 text-center text-sm font-semibold">
                            {qty[t.id] || 0}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setQuantity(t.id, (qty[t.id] || 0) + 1, t.available)
                            }
                            className="h-8 w-8 rounded-lg border border-gray-300 text-lg"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-sm text-gray-600">Total</span>
                <span className="text-lg font-extrabold">{rupiah(total)}</span>
              </div>

              <button
                type="button"
                onClick={handleBuy}
                disabled={totalQty === 0}
                className="mt-4 w-full rounded-[10px] py-3 text-sm font-bold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                style={{ backgroundImage: GRADIENT }}
              >
                {buying ? "Memproses..." : "Beli Tiket"}
              </button>
              <p className="mt-2 text-center text-[11px] text-gray-400">
                Maksimal 10 tiket per jenis.
              </p>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}