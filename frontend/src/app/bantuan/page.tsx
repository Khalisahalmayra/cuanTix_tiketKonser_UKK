"use client";

import { useMemo, useState } from "react";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import Footer from "@/components/footer/Footer";
import GradientIcon from "@/components/icon/GradientIcon";
import HelpCategories from "@/components/help-center/HelpCategories";
import FaqList from "@/components/help-center/FaqList";
import ContactCta from "@/components/help-center/ContactCta";
import { FAQS, HELP_CATEGORIES } from "@/components/help-center/data";

const HERO_GRADIENT = "linear-gradient(90deg,#5B1AA8 0%,#E91E8C 100%)";

export default function PusatBantuanPage() {
  const [query, setQuery] = useState<string>("");
  const [category, setCategory] = useState<string>("semua");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return FAQS.filter((faq) => {
      const matchCategory = category === "semua" || faq.category === category;
      const matchQuery =
        !q ||
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q);
      return matchCategory && matchQuery;
    });
  }, [query, category]);

  const categoryLabel =
    category === "semua"
      ? "Pertanyaan Populer"
      : HELP_CATEGORIES.find((c) => c.id === category)?.label ?? "Pertanyaan";

  function handleQueryChange(value: string) {
    setQuery(value);
    // Saat mencari, cari di semua kategori
    if (value.trim()) setCategory("semua");
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}>
      <HomeNavbar />

      <main className="w-full px-5 pb-16 sm:px-8 lg:px-16">
        {/* ================= HERO ================= */}
        <section
          className="rounded-[28px] px-6 py-12 text-center text-white shadow-[0_6px_18px_rgba(91,26,168,0.25)] sm:py-16"
          style={{ background: HERO_GRADIENT }}
        >
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white">
            <GradientIcon type="help" size={32} />
          </div>

          <h1 className="text-[26px] font-bold sm:text-[32px]">Pusat Bantuan</h1>
          <p className="mt-1 text-[15px] text-white/90">Ada yang bisa kami bantu?</p>

          <div className="mx-auto mt-6 flex max-w-[560px] items-center gap-3 rounded-full bg-white px-5 py-3 shadow-md">
            <GradientIcon type="search" size={20} />
            <input
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Cari pertanyaan, mis. refund, pembayaran, e-tiket"
              aria-label="Cari bantuan"
              className="flex-1 bg-transparent text-[14px] text-[#6D28D9] outline-none placeholder:text-gray-400"
            />
            {query && (
              <button
                type="button"
                onClick={() => handleQueryChange("")}
                aria-label="Hapus pencarian"
                className="shrink-0"
              >
                <GradientIcon type="close" size={18} color="#9CA3AF" />
              </button>
            )}
          </div>
        </section>

        {/* ================= KATEGORI ================= */}
        <section className="mt-8">
          <HelpCategories active={category} onChange={setCategory} />
        </section>

        {/* ================= FAQ ================= */}
        <section className="mx-auto mt-10 max-w-[900px]">
          <div className="mb-5 flex items-center gap-3">
            <GradientIcon type="info" size={26} />
            <h2 className="text-[20px] font-bold text-gray-900">{categoryLabel}</h2>
            <span className="rounded-full bg-[#F3EBFF] px-3 py-0.5 text-[12px] font-semibold text-[#6D28D9]">
              {filtered.length}
            </span>
          </div>

          {filtered.length > 0 ? (
            // key supaya state buka-tutup ter-reset saat hasil filter berubah
            <FaqList key={`${category}-${query}`} items={filtered} />
          ) : (
            <div className="rounded-[12px] border border-dashed border-purple-300 px-6 py-10 text-center">
              <p className="text-[15px] font-semibold text-gray-900">
                Tidak ada hasil untuk &ldquo;{query}&rdquo;
              </p>
              <p className="mt-1 text-[13px] text-gray-600">
                Coba kata kunci lain, atau hubungi tim kami di bawah.
              </p>
            </div>
          )}
        </section>

        {/* ================= KONTAK ================= */}
        <section className="mx-auto mt-12 max-w-[1100px]">
          <ContactCta />
        </section>
      </main>

      <Footer />
    </div>
  );
}