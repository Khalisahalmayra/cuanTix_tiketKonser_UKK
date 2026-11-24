"use client";

/* eslint-disable @next/next/no-img-element */

import React from "react";
import { UploadCloud, ImageIcon, AlertCircle, X } from "lucide-react";
import { Category } from "../types";

type Step1EventInfoProps = {
  title: string;
  setTitle: (value: string) => void;
  categoryId: number | "";
  setCategoryId: (value: number | "") => void;
  categories: Category[];
  description: string;
  setDescription: (value: string) => void;
  posterUrl: string;
  setPosterUrl: (value: string) => void;
  bannerUrl: string;
  setBannerUrl: (value: string) => void;
  posterPreview: string;
  setPosterPreview: (value: string) => void;
  bannerPreview: string;
  setBannerPreview: (value: string) => void;
  posterInputRef: React.RefObject<HTMLInputElement | null>;
  bannerInputRef: React.RefObject<HTMLInputElement | null>;
  handlePosterFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBannerFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Record<string, string>;
};

export function Step1EventInfo({
  title,
  setTitle,
  categoryId,
  setCategoryId,
  categories,
  description,
  setDescription,
  posterUrl,
  setPosterUrl,
  bannerUrl,
  setBannerUrl,
  posterPreview,
  setPosterPreview,
  bannerPreview,
  setBannerPreview,
  posterInputRef,
  bannerInputRef,
  handlePosterFileChange,
  handleBannerFileChange,
  errors,
}: Step1EventInfoProps) {
  return (
    <div className="space-y-8">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
          Langkah 1: Informasi Dasar Event
        </h2>
        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          Beri identitas acara Anda agar calon pembeli dan tim kurasi dapat mengenalnya dengan baik.
        </p>
      </div>

      {/* NAMA EVENT */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
          Nama Event <span className="text-[#E91E8C]">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Contoh: Senada Indonesia Festival 2026"
          className={`w-full rounded-xl border px-4 py-3.5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-[#5B1AA8]/20 ${
            errors.title ? "border-red-500 bg-red-50/20" : "border-gray-200 focus:border-[#5B1AA8]"
          }`}
        />
        {errors.title && (
          <p className="mt-1.5 text-xs font-semibold text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" /> {errors.title}
          </p>
        )}
      </div>

      {/* KATEGORI EVENT */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
          Kategori Musik / Event <span className="text-[#E91E8C]">*</span>
        </label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : "")}
          className={`w-full rounded-xl border bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition-all focus:ring-2 focus:ring-[#5B1AA8]/20 ${
            errors.category_id ? "border-red-500 bg-red-50/20" : "border-gray-200 focus:border-[#5B1AA8]"
          }`}
        >
          <option value="">-- Pilih Kategori --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.category_id && (
          <p className="mt-1.5 text-xs font-semibold text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" /> {errors.category_id}
          </p>
        )}
      </div>

      {/* DESKRIPSI EVENT */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
          Deskripsi Lengkap Acara <span className="text-[#E91E8C]">*</span>
        </label>
        <textarea
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Jelaskan konsep acara, musisi/bintang tamu yang tampil, pengalaman menarik yang ditawarkan, aturan dress code, dan informasi penonton lainnya..."
          className={`w-full rounded-xl border px-4 py-3.5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-[#5B1AA8]/20 ${
            errors.description ? "border-red-500 bg-red-50/20" : "border-gray-200 focus:border-[#5B1AA8]"
          }`}
        />
        {errors.description && (
          <p className="mt-1.5 text-xs font-semibold text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" /> {errors.description}
          </p>
        )}
      </div>

      {/* MEDIA: POSTER & BANNER */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* POSTER EVENT */}
        <div className="rounded-2xl border border-gray-200/90 p-5 bg-[#FAF8FE]/50">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
              <ImageIcon className="h-4 w-4 text-[#5B1AA8]" />
              Poster Event (Potret)
            </label>
            <span className="text-[11px] text-gray-400">Rasio 3:4 atau 4:5</span>
          </div>

          {/* Area Upload & Pratinjau */}
          <input
            type="file"
            ref={posterInputRef}
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePosterFileChange}
            className="hidden"
          />

          {posterPreview || posterUrl ? (
            <div className="relative mb-3 aspect-[3/4] w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100 flex items-center justify-center">
              <img
                src={posterPreview || posterUrl}
                alt="Pratinjau Poster"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setPosterPreview("");
                  setPosterUrl("");
                  if (posterInputRef.current) posterInputRef.current.value = "";
                }}
                className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black"
                title="Hapus poster"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => posterInputRef.current?.click()}
              className="mb-3 flex aspect-[3/4] w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-purple-200 bg-white p-4 text-center transition-colors hover:border-[#5B1AA8] hover:bg-purple-50/50"
            >
              <UploadCloud className="h-8 w-8 text-[#5B1AA8] mb-2" />
              <p className="text-xs font-bold text-gray-700">Pilih File Poster</p>
              <p className="mt-1 text-[11px] text-gray-400">JPG, PNG, atau WEBP (Maks 5MB)</p>
            </div>
          )}

          {/* Field URL Tambahan */}
          <div className="mt-2">
            <label className="block text-[11px] font-semibold text-gray-500 mb-1">
              Atau Masukkan URL Poster Langsung:
            </label>
            <input
              type="url"
              value={posterUrl}
              onChange={(e) => {
                setPosterUrl(e.target.value);
                if (e.target.value.trim() && !posterPreview) {
                  setPosterPreview(e.target.value.trim());
                }
              }}
              placeholder="https://example.com/poster.jpg"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 outline-none focus:border-[#5B1AA8]"
            />
          </div>
          {errors.poster && (
            <p className="mt-1.5 text-xs text-red-600">{errors.poster}</p>
          )}
        </div>

        {/* BANNER EVENT */}
        <div className="rounded-2xl border border-gray-200/90 p-5 bg-[#FAF8FE]/50">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
              <ImageIcon className="h-4 w-4 text-[#E91E8C]" />
              Banner Event (Lanskap)
            </label>
            <span className="text-[11px] text-gray-400">Rasio 16:9</span>
          </div>

          <input
            type="file"
            ref={bannerInputRef}
            accept="image/jpeg,image/png,image/webp"
            onChange={handleBannerFileChange}
            className="hidden"
          />

          {bannerPreview || bannerUrl ? (
            <div className="relative mb-3 aspect-[16/9] w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100 flex items-center justify-center">
              <img
                src={bannerPreview || bannerUrl}
                alt="Pratinjau Banner"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setBannerPreview("");
                  setBannerUrl("");
                  if (bannerInputRef.current) bannerInputRef.current.value = "";
                }}
                className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black"
                title="Hapus banner"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => bannerInputRef.current?.click()}
              className="mb-3 flex aspect-[16/9] w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-pink-200 bg-white p-4 text-center transition-colors hover:border-[#E91E8C] hover:bg-pink-50/50"
            >
              <UploadCloud className="h-8 w-8 text-[#E91E8C] mb-2" />
              <p className="text-xs font-bold text-gray-700">Pilih File Banner</p>
              <p className="mt-1 text-[11px] text-gray-400">JPG, PNG, atau WEBP (Maks 5MB)</p>
            </div>
          )}

          {/* Field URL Tambahan */}
          <div className="mt-2">
            <label className="block text-[11px] font-semibold text-gray-500 mb-1">
              Atau Masukkan URL Banner Langsung:
            </label>
            <input
              type="url"
              value={bannerUrl}
              onChange={(e) => {
                setBannerUrl(e.target.value);
                if (e.target.value.trim() && !bannerPreview) {
                  setBannerPreview(e.target.value.trim());
                }
              }}
              placeholder="https://example.com/banner.jpg"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 outline-none focus:border-[#E91E8C]"
            />
          </div>
          {errors.banner && (
            <p className="mt-1.5 text-xs text-red-600">{errors.banner}</p>
          )}
        </div>
      </div>
    </div>
  );
}
