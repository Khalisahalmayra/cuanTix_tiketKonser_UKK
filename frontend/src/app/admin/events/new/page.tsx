"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const KATEGORI = [
  { id: 1, name: "Rock" },
  { id: 2, name: "Pop" },
  { id: 3, name: "Indie" },
  { id: 4, name: "EDM" },
  { id: 5, name: "Jazz" },
];

const INPUT =
  "w-full rounded-[10px] border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/30";
const LABEL = "mb-1 block text-xs font-semibold text-gray-700";

type TicketRow = { name: string; price: string; quota: string };

export default function NewEventPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    category_id: "2",
    city: "",
    venue: "",
    start_at: "",
    description: "",
  });
  const [tickets, setTickets] = useState<TicketRow[]>([
    { name: "Regular", price: "", quota: "" },
  ]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const setField =
    (field: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) =>
      setForm((p) => ({ ...p, [field]: e.target.value }));

  const setTicket = (i: number, field: keyof TicketRow, value: string) =>
    setTickets((rows) =>
      rows.map((r, idx) => (idx === i ? { ...r, [field]: value } : r))
    );

  const addTicket = () =>
    setTickets((rows) => [...rows, { name: "", price: "", quota: "" }]);

  const removeTicket = (i: number) =>
    setTickets((rows) => rows.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.city || !form.start_at) {
      setError("Judul, kota, dan tanggal wajib diisi.");
      return;
    }
    const validTickets = tickets.filter((t) => t.name && t.price && t.quota);
    if (validTickets.length === 0) {
      setError("Isi minimal satu jenis tiket lengkap (nama, harga, kuota).");
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:4000/api/admin/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          category_id: Number(form.category_id),
          start_at: new Date(form.start_at).toISOString(),
          tickets: validTickets,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Gagal menyimpan event.");
        return;
      }

      router.push("/admin/events");
    } catch {
      setError("Tidak bisa terhubung ke server.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/events"
        className="text-xs font-semibold text-[#7C3AED] hover:underline"
      >
        ← Kembali
      </Link>
      <h2 className="mt-2 text-2xl font-extrabold text-gray-900">
        Tambah Event
      </h2>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4 rounded-xl bg-white p-6 shadow-sm"
      >
        <div>
          <label className={LABEL}>Judul Event</label>
          <input
            className={INPUT}
            value={form.title}
            onChange={setField("title")}
            placeholder="Contoh: Rock Night Jakarta"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL}>Kategori</label>
            <select
              className={INPUT}
              value={form.category_id}
              onChange={setField("category_id")}
            >
              {KATEGORI.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={LABEL}>Tanggal & Jam</label>
            <input
              type="datetime-local"
              className={INPUT}
              value={form.start_at}
              onChange={setField("start_at")}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL}>Kota</label>
            <input
              className={INPUT}
              value={form.city}
              onChange={setField("city")}
              placeholder="Jakarta"
            />
          </div>
          <div>
            <label className={LABEL}>Venue / Lokasi</label>
            <input
              className={INPUT}
              value={form.venue}
              onChange={setField("venue")}
              placeholder="Istora Senayan"
            />
          </div>
        </div>

        <div>
          <label className={LABEL}>Deskripsi</label>
          <textarea
            rows={3}
            className={INPUT}
            value={form.description}
            onChange={setField("description")}
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-700">
              Jenis Tiket
            </label>
            <button
              type="button"
              onClick={addTicket}
              className="text-xs font-semibold text-[#7C3AED] hover:underline"
            >
              + Tambah jenis tiket
            </button>
          </div>

          <div className="space-y-2">
            {tickets.map((t, i) => (
              <div key={i} className="grid grid-cols-12 gap-2">
                <input
                  className={`${INPUT} col-span-4`}
                  placeholder="Nama (VIP)"
                  value={t.name}
                  onChange={(e) => setTicket(i, "name", e.target.value)}
                />
                <input
                  type="number"
                  min={0}
                  className={`${INPUT} col-span-4`}
                  placeholder="Harga (Rp)"
                  value={t.price}
                  onChange={(e) => setTicket(i, "price", e.target.value)}
                />
                <input
                  type="number"
                  min={1}
                  className={`${INPUT} col-span-3`}
                  placeholder="Kuota"
                  value={t.quota}
                  onChange={(e) => setTicket(i, "quota", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeTicket(i)}
                  disabled={tickets.length === 1}
                  className="col-span-1 text-lg text-red-500 disabled:opacity-30"
                  aria-label="Hapus"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <p className="rounded-[8px] bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-[10px] py-2.5 text-sm font-bold text-white disabled:opacity-60"
          style={{
            backgroundImage: "linear-gradient(90deg, #7C3AED 0%, #E91E8C 100%)",
          }}
        >
          {saving ? "Menyimpan..." : "Simpan Event"}
        </button>
      </form>
    </div>
  );
}