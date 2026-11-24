/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { Sparkles, UploadCloud } from "lucide-react";
import { CATEGORIES } from "../constants";

interface SectionInformasiProps {
  title: string;
  setTitle: (value: string) => void;
  categoryId: number;
  setCategoryId: (value: number) => void;
  description: string;
  setDescription: (value: string) => void;
  preview: string;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removePoster: () => void;
}

export function SectionInformasi({
  title,
  setTitle,
  categoryId,
  setCategoryId,
  description,
  setDescription,
  preview,
  handleFileChange,
  removePoster,
}: SectionInformasiProps) {
  return (
    <section
      id="informasi"
      className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-[#7C3AED]">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">1. Informasi Utama Event</h2>
          <p className="text-xs text-gray-500">
            Unggah poster visual, tentukan judul konser, genre musik, dan deskripsi acara.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Visual Poster 2:1 Landscape Uploader */}
        <div className="lg:col-span-5">
          <label className="mb-2 block text-xs font-bold text-gray-700">
            Banner / Poster Event (Rasio 2:1 Disarankan)
          </label>

          <div className="group relative flex aspect-[2/1] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-slate-50 transition hover:border-[#7C3AED] hover:bg-purple-50/20">
            {preview ? (
              <>
                <img
                  src={preview}
                  alt="Pratinjau Banner"
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition group-hover:opacity-100">
                  <label className="cursor-pointer rounded-lg bg-white/90 px-3 py-1.5 text-xs font-bold text-gray-900 shadow hover:bg-white">
                    Ganti Gambar
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={removePoster}
                    className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-red-700 cursor-pointer"
                  >
                    Hapus
                  </button>
                </div>
              </>
            ) : (
              <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center p-4 text-center">
                <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-purple-100 text-[#7C3AED]">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold text-gray-800">
                  Klik atau seret gambar ke sini
                </span>
                <span className="mt-1 text-[11px] text-gray-500">
                  Maks. 2 MB (JPG, PNG, atau WEBP)
                </span>
                <span className="mt-2 inline-block rounded-full bg-purple-50 px-2.5 py-0.5 text-[10px] font-bold text-[#7C3AED]">
                  Format Landscape 2:1
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Inputs: Judul, Kategori & Deskripsi */}
        <div className="space-y-4 lg:col-span-7">
          <div>
            <div className="flex items-center justify-between">
              <label className="mb-1 block text-xs font-bold text-gray-700">
                Judul Event <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-gray-400">
                {title.length}/100 karakter
              </span>
            </div>
            <input
              type="text"
              maxLength={100}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Soundrenaline Festival Jakarta 2026"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 outline-none transition focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20"
            />
          </div>

          {/* Kategori Event Badges */}
          <div>
            <label className="mb-2 block text-xs font-bold text-gray-700">
              Genre Musik / Kategori <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {CATEGORIES.map((cat) => {
                const isSelected = categoryId === cat.id;
                const IconComp = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryId(cat.id)}
                    className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-bold transition cursor-pointer ${
                      isSelected
                        ? "border-[#7C3AED] bg-purple-50 text-[#7C3AED] shadow-sm ring-2 ring-[#7C3AED]/30"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <IconComp
                      className="h-4 w-4"
                      style={{ color: isSelected ? "#7C3AED" : cat.color }}
                    />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Deskripsi Event */}
          <div>
            <label className="mb-1 block text-xs font-bold text-gray-700">
              Deskripsi Lengkap Event
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tuliskan gambaran acara, daftar guest star musisi, peraturan penonton, rundown atau pengalaman spesial yang ditawarkan..."
              className="w-full rounded-xl border border-gray-300 bg-white p-3 text-xs text-gray-800 outline-none transition focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
