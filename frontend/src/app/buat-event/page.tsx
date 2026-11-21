"use client";

/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  UploadCloud,
  ImageIcon,
  Plus,
  Trash2,
  AlertCircle,
  Info,
  ChevronRight,
  Send,
  Check,
  X,
  Layers,
} from "lucide-react";
import HomeNavbar from "@/components/navbar/HomeNavbar";
import GradientIcon, { GradientIconType } from "@/components/icon/GradientIcon";
import { KOTA_LIST } from "@/data/cities";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const BRAND_GRADIENT = "linear-gradient(90deg, #5B1AA8 0%, #E91E8C 100%)";

export type Category = {
  id: number;
  name: string;
  slug?: string;
};

export type TicketTypeInput = {
  id: string;
  name: string;
  price: number | "";
  quota: number | "";
  sale_start: string;
  sale_end: string;
  description: string;
};

// Default fallback categories jika API sedang offline
const FALLBACK_CATEGORIES: Category[] = [
  { id: 1, name: "Rock" },
  { id: 2, name: "Pop" },
  { id: 3, name: "Indie" },
  { id: 4, name: "EDM" },
  { id: 5, name: "Jazz" },
];

export default function BuatEventPage() {
  const router = useRouter();

  // Multi-step State (1: Info Event, 2: Jadwal & Lokasi, 3: Jenis Tiket, 4: Review)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Authentication State
  const [token] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  });
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Categories State
  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);

  // STEP 1: Informasi Event
  const [title, setTitle] = useState<string>("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [description, setDescription] = useState<string>("");
  const [posterUrl, setPosterUrl] = useState<string>("");
  const [bannerUrl, setBannerUrl] = useState<string>("");
  const [posterPreview, setPosterPreview] = useState<string>("");
  const [bannerPreview, setBannerPreview] = useState<string>("");

  // STEP 2: Detail Lokasi & Jadwal
  const [startDate, setStartDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("19:00");
  const [endDate, setEndDate] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("23:00");
  const [city, setCity] = useState<string>("Jakarta");
  const [venue, setVenue] = useState<string>("");
  const [venueAddress, setVenueAddress] = useState<string>("");
  const [locationInfo, setLocationInfo] = useState<string>("");
  const [seatingPreset, setSeatingPreset] = useState<string>("festival_standing");
  const [customSeatingNotes, setCustomSeatingNotes] = useState<string>("");

  // STEP 3: Jenis Tiket
  const [ticketTypes, setTicketTypes] = useState<TicketTypeInput[]>([
    {
      id: "ticket-1",
      name: "Festival",
      price: 150000,
      quota: 100,
      sale_start: "",
      sale_end: "",
      description: "Akses area standing utama",
    },
  ]);

  // Validation & Submission States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    id: number;
    title: string;
    status: string;
  } | null>(null);

  // Image File Inputs ref
  const posterInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Load Auth State & Categories on Mount
  useEffect(() => {
    let isMounted = true;
    async function loadCategories() {
      try {
        const res = await fetch(`${API_BASE}/api/categories`);
        if (res.ok && isMounted) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setCategories(data);
          }
        }
      } catch {
        // Fallback categories already set
      }
    }

    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  // Format IDR Helper
  const formatRupiah = (value: number | ""): string => {
    if (value === "" || isNaN(Number(value))) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(value));
  };

  // Format Date in Indonesian
  const formatIndonesianDateTime = (dateStr: string, timeStr: string): string => {
    if (!dateStr) return "-";
    try {
      const d = new Date(`${dateStr}T${timeStr || "00:00"}`);
      if (isNaN(d.getTime())) return `${dateStr} ${timeStr}`;
      return new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(d) + " WIB";
    } catch {
      return `${dateStr} ${timeStr}`;
    }
  };

  // Summary Metrics
  const summaryMetrics = useMemo(() => {
    const totalQuota = ticketTypes.reduce(
      (acc, t) => acc + (typeof t.quota === "number" ? t.quota : 0),
      0
    );
    const potentialRevenue = ticketTypes.reduce(
      (acc, t) =>
        acc +
        (typeof t.price === "number" && typeof t.quota === "number"
          ? t.price * t.quota
          : 0),
      0
    );
    return { totalQuota, potentialRevenue };
  }, [ticketTypes]);

  // Handle Poster File Upload (Local Preview & Format/Size Validation)
  const handlePosterFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        poster: "Format poster harus berupa JPG, PNG, atau WEBP",
      }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        poster: "Ukuran file poster maksimal 5 MB",
      }));
      return;
    }

    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.poster;
      return copy;
    });

    const previewUrl = URL.createObjectURL(file);
    setPosterPreview(previewUrl);
  };

  // Handle Banner File Upload
  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        banner: "Format banner harus berupa JPG, PNG, atau WEBP",
      }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        banner: "Ukuran file banner maksimal 5 MB",
      }));
      return;
    }

    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.banner;
      return copy;
    });

    const previewUrl = URL.createObjectURL(file);
    setBannerPreview(previewUrl);
  };

  // Step 1 Validation
  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) {
      newErrors.title = "Nama event wajib diisi.";
    }
    if (!categoryId) {
      newErrors.category_id = "Pilih salah satu kategori event.";
    }
    if (!description.trim()) {
      newErrors.description = "Deskripsi event wajib diisi.";
    } else if (description.trim().length < 20) {
      newErrors.description = "Deskripsi event minimal 20 karakter agar jelas bagi calon penonton.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!startDate) {
      newErrors.start_date = "Tanggal mulai event wajib diisi.";
    }
    if (!startTime) {
      newErrors.start_time = "Waktu mulai event wajib diisi.";
    }
    if (!city.trim()) {
      newErrors.city = "Kota penyelenggaraan wajib dipilih.";
    }
    if (!venue.trim()) {
      newErrors.venue = "Nama venue / lokasi acara wajib diisi.";
    }

    if (startDate && endDate) {
      const startDateTime = new Date(`${startDate}T${startTime || "00:00"}`);
      const endDateTime = new Date(`${endDate}T${endTime || "23:59"}`);
      if (endDateTime.getTime() < startDateTime.getTime()) {
        newErrors.end_date = "Tanggal selesai tidak boleh lebih awal dari tanggal mulai.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 3 Validation
  const validateStep3 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!ticketTypes || ticketTypes.length === 0) {
      newErrors.tickets = "Minimal satu jenis tiket harus tersedia.";
      setErrors(newErrors);
      return false;
    }

    ticketTypes.forEach((ticket, idx) => {
      if (!ticket.name.trim()) {
        newErrors[`ticket_name_${idx}`] = "Nama jenis tiket wajib diisi.";
      }
      if (ticket.price === "" || Number(ticket.price) < 0) {
        newErrors[`ticket_price_${idx}`] = "Harga tiket tidak boleh kosong atau negatif.";
      } else if (!Number.isInteger(Number(ticket.price))) {
        newErrors[`ticket_price_${idx}`] = "Harga harus berupa bilangan bulat.";
      }

      if (ticket.quota === "" || Number(ticket.quota) <= 0) {
        newErrors[`ticket_quota_${idx}`] = "Kuota tiket harus lebih dari 0.";
      } else if (!Number.isInteger(Number(ticket.quota))) {
        newErrors[`ticket_quota_${idx}`] = "Kuota harus berupa bilangan bulat.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Stepper Next Navigation with Validation
  const handleNextStep = () => {
    setSubmitError(null);
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    } else if (currentStep === 3) {
      if (validateStep3()) setCurrentStep(4);
    }
  };

  // Stepper Prev Navigation
  const handlePrevStep = () => {
    setSubmitError(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
    }
  };

  // Ticket Operations
  const handleAddTicket = () => {
    const newId = `ticket-${Date.now()}`;
    setTicketTypes((prev) => [
      ...prev,
      {
        id: newId,
        name: "",
        price: 100000,
        quota: 100,
        sale_start: "",
        sale_end: "",
        description: "",
      },
    ]);
  };

  const handleRemoveTicket = (indexToRemove: number) => {
    if (ticketTypes.length <= 1) return;
    setTicketTypes((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleTicketChange = (
    index: number,
    field: keyof TicketTypeInput,
    value: string | number
  ) => {
    setTicketTypes((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });

    // Clear specific field error
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[`ticket_${field}_${index}`];
      return copy;
    });
  };

  // Handle Preset Ticket Insertion
  const applyTicketPreset = (presetName: string, defaultPrice: number, defaultQuota: number) => {
    setTicketTypes((prev) => [
      ...prev,
      {
        id: `ticket-preset-${Date.now()}`,
        name: presetName,
        price: defaultPrice,
        quota: defaultQuota,
        sale_start: "",
        sale_end: "",
        description: `Kategori tiket ${presetName}`,
      },
    ]);
  };

  // Final Submission Handler
  const handleSubmitProposal = async () => {
    setSubmitError(null);

    // 1. Validasi Autentikasi
    const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    if (!activeToken) {
      setShowAuthModal(true);
      return;
    }

    // 2. Validasi Seluruh Step
    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }
    if (!validateStep2()) {
      setCurrentStep(2);
      return;
    }
    if (!validateStep3()) {
      setCurrentStep(3);
      return;
    }

    // 3. Format Tanggal ISO Timestamptz
    const startIso = new Date(`${startDate}T${startTime}:00`).toISOString();
    const endIso = endDate ? new Date(`${endDate}T${endTime || "23:59"}:00`).toISOString() : null;

    // 4. Siapkan Seating Layout (Bentuk Deskriptif Sederhana / Null)
    const seatingPayload =
      seatingPreset !== "none" || customSeatingNotes.trim()
        ? {
            preset: seatingPreset,
            notes: customSeatingNotes.trim() || null,
          }
        : null;

    // 5. Susun Payload Sesuai Struktur Backend
    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      poster_url: posterUrl.trim() || null,
      banner_url: bannerUrl.trim() || null,
      category_id: categoryId ? Number(categoryId) : null,
      city: city.trim(),
      venue: venue.trim(),
      venue_address: venueAddress.trim() || null,
      location_info: locationInfo.trim() || null,
      start_at: startIso,
      end_at: endIso,
      seating_layout: seatingPayload,
      ticket_types: ticketTypes.map((t) => ({
        name: t.name.trim(),
        price: Number(t.price),
        quota: Number(t.quota),
        sale_start: t.sale_start ? new Date(t.sale_start).toISOString() : null,
        sale_end: t.sale_end ? new Date(t.sale_end).toISOString() : null,
        description: t.description.trim() || null,
      })),
    };

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/api/event-submissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.status === 201) {
        setSubmissionSuccess({
          id: result.data?.id || 1,
          title: title.trim(),
          status: result.data?.status || "pending_review",
        });
      } else if (response.status === 401) {
        setShowAuthModal(true);
        setSubmitError("Sesi login Anda telah berakhir. Silakan login kembali.");
      } else if (response.status === 403) {
        setSubmitError(
          result.message ||
            "Hanya customer terdaftar yang dapat mengajukan event melalui halaman ini."
        );
      } else if (response.status === 400) {
        setSubmitError(result.message || "Data pengajuan belum lengkap atau tidak valid.");
      } else {
        setSubmitError(
          result.message || "Terjadi kendala pada server. Silakan coba kembali."
        );
      }
    } catch {
      setSubmitError(
        "Gagal terhubung ke server backend CuanTix (http://localhost:4000). Pastikan backend aktif."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset Form for New Submission
  const handleResetForm = () => {
    setTitle("");
    setCategoryId("");
    setDescription("");
    setPosterUrl("");
    setBannerUrl("");
    setPosterPreview("");
    setBannerPreview("");
    setStartDate("");
    setStartTime("19:00");
    setEndDate("");
    setEndTime("23:00");
    setCity("Jakarta");
    setVenue("");
    setVenueAddress("");
    setLocationInfo("");
    setSeatingPreset("festival_standing");
    setCustomSeatingNotes("");
    setTicketTypes([
      {
        id: "ticket-1",
        name: "Festival",
        price: 150000,
        quota: 100,
        sale_start: "",
        sale_end: "",
        description: "Akses area standing utama",
      },
    ]);
    setSubmissionSuccess(null);
    setCurrentStep(1);
    setErrors({});
  };

  const selectedCategoryObj = categories.find((c) => c.id === categoryId);

  return (
    <div
      className="min-h-screen bg-[#FDFBFD]"
      style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
    >
      {/* 1. NAVBAR */}
      <HomeNavbar />

      <main className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6 lg:px-8">
        {/* HEADER ATAS DENGAN TOMBOL KEMBALI */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Kembali ke halaman sebelumnya"
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-xs transition-colors hover:border-[#5B1AA8] hover:bg-[#F3EBFF] hover:text-[#5B1AA8] sm:text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </button>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
                Ajukan Event Kamu
              </h1>
              <p className="mt-1.5 max-w-2xl text-sm text-gray-600 sm:text-base">
                Wujudkan event impianmu bersama CuanTix. Lengkapi informasi event untuk memulai proses pengajuan.
              </p>
            </div>

            {/* BADGE INFORMASI PROSES KURASI */}
            <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-purple-100 bg-[#FAF5FF] p-3 text-xs text-[#5B1AA8] sm:mt-0 sm:max-w-xs">
              <GradientIcon type="shieldCheck" size={24} />
              <span>
                Setiap pengajuan akan diverifikasi oleh tim kurasi CuanTix sebelum dipublikasikan.
              </span>
            </div>
          </div>
        </div>

        {/* JIKA SUKSES MENGAJUKAN: TAMPILKAN KONFIRMASI FEEDBACK SUKSES */}
        {submissionSuccess ? (
          <div className="mx-auto max-w-2xl rounded-3xl border border-purple-100 bg-white p-8 text-center shadow-lg sm:p-12">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-[#5B1AA8] to-[#E91E8C] text-white shadow-md">
              <Check className="h-10 w-10 stroke-[3]" />
            </div>

            <span className="inline-block rounded-full bg-amber-50 px-3.5 py-1 text-xs font-bold text-amber-700 border border-amber-200">
              Status: Menunggu Review Tim CuanTix
            </span>

            <h2 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
              Pengajuan Berhasil Dikirim!
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
              Terima kasih telah mempercayakan event kamu kepada CuanTix. Proposal event{" "}
              <strong className="text-gray-900 font-semibold">&ldquo;{submissionSuccess.title}&rdquo;</strong>{" "}
              telah masuk ke antrean kurasi dengan nomor registrasi{" "}
              <span className="font-mono font-bold text-[#5B1AA8]">#{submissionSuccess.id}</span>.
            </p>

            <div className="my-6 rounded-2xl bg-[#F8F5FC] p-5 text-left text-xs sm:text-sm text-gray-700">
              <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Info className="h-4 w-4 text-[#5B1AA8]" />
                Langkah Selanjutnya:
              </h4>
              <ul className="list-inside list-disc space-y-1.5 text-gray-600">
                <li>Tim kurasi CuanTix akan memeriksa kelengkapan detail event dalam 1-3 hari kerja.</li>
                <li>Pemberitahuan persetujuan atau catatan revisi akan dikirim ke email akun Anda.</li>
                <li>Setelah disetujui, event akan otomatis aktif dan tiket siap dibeli calon penonton.</li>
              </ul>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="rounded-full px-6 py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-95"
                style={{ background: BRAND_GRADIENT }}
              >
                Kembali ke Beranda
              </button>
              <button
                type="button"
                onClick={handleResetForm}
                className="rounded-full border border-purple-200 bg-white px-6 py-3 text-sm font-bold text-[#5B1AA8] transition-colors hover:bg-purple-50"
              >
                Ajukan Event Lainnya
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* 2. PROGRESS INDICATOR (STEPPER MULTI-STEP) */}
            <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs sm:p-6">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                {[
                  {
                    num: 1,
                    title: "Informasi Event",
                    desc: "Nama, Kategori, Media",
                    icon: "megaphone" as GradientIconType,
                  },
                  {
                    num: 2,
                    title: "Jadwal & Lokasi",
                    desc: "Waktu, Kota, Venue",
                    icon: "calendar" as GradientIconType,
                  },
                  {
                    num: 3,
                    title: "Jenis Tiket",
                    desc: "Kategori & Kuota",
                    icon: "ticket" as GradientIconType,
                  },
                  {
                    num: 4,
                    title: "Review Pengajuan",
                    desc: "Konfirmasi & Kirim",
                    icon: "checkCircle" as GradientIconType,
                  },
                ].map((step) => {
                  const isActive = currentStep === step.num;
                  const isCompleted = currentStep > step.num;

                  return (
                    <button
                      key={step.num}
                      type="button"
                      onClick={() => {
                        if (step.num < currentStep) {
                          setCurrentStep(step.num as 1 | 2 | 3 | 4);
                        } else if (step.num === currentStep + 1) {
                          handleNextStep();
                        }
                      }}
                      className={`flex items-center gap-3 rounded-xl p-3 text-left transition-all ${
                        isActive
                          ? "bg-[#FAF5FF] border border-[#5B1AA8]/40 shadow-xs"
                          : isCompleted
                          ? "hover:bg-gray-50 border border-transparent cursor-pointer"
                          : "opacity-60 border border-transparent cursor-default"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-transform ${
                          isCompleted
                            ? "bg-emerald-500 text-white"
                            : isActive
                            ? "text-white shadow-sm"
                            : "bg-gray-100 text-gray-500"
                        }`}
                        style={isActive ? { background: BRAND_GRADIENT } : undefined}
                      >
                        {isCompleted ? <Check className="h-5 w-5 stroke-[2.5]" /> : step.num}
                      </div>

                      <div className="min-w-0">
                        <p
                          className={`text-xs font-bold truncate ${
                            isActive ? "text-[#5B1AA8]" : "text-gray-800"
                          }`}
                        >
                          {step.title}
                        </p>
                        <p className="text-[11px] text-gray-400 truncate hidden sm:block">
                          {step.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ERROR ALERT TOP */}
            {submitError && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold">Gagal Mengirim Pengajuan</p>
                  <p className="mt-0.5 text-xs text-red-600">{submitError}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmitError(null)}
                  className="text-red-400 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* FORM CONTAINER */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xs sm:p-10">
              {/* ============================================================== */}
              {/* STEP 1: INFORMASI EVENT                                        */}
              {/* ============================================================== */}
              {currentStep === 1 && (
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
              )}

              {/* ============================================================== */}
              {/* STEP 2: DETAIL JADWAL & LOKASI                                 */}
              {/* ============================================================== */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                      Langkah 2: Detail Jadwal & Lokasi Acara
                    </h2>
                    <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                      Tentukan waktu pelaksanaan dan tempat diselenggarakannya event Anda secara akurat.
                    </p>
                  </div>

                  {/* WAKTU MULAI & SELESAI */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* WAKTU MULAI */}
                    <div className="rounded-2xl border border-gray-200/90 p-5 bg-[#FAF8FE]/40">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-1.5 mb-4">
                        <GradientIcon type="calendar" size={18} />
                        Mulai Acara <span className="text-[#E91E8C]">*</span>
                      </h3>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                            Tanggal Mulai
                          </label>
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#5B1AA8]/20 ${
                              errors.start_date ? "border-red-500" : "border-gray-200 focus:border-[#5B1AA8]"
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                            Jam Mulai (WIB)
                          </label>
                          <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#5B1AA8]"
                          />
                        </div>
                      </div>
                      {errors.start_date && (
                        <p className="mt-2 text-xs font-semibold text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3.5 w-3.5" /> {errors.start_date}
                        </p>
                      )}
                    </div>

                    {/* WAKTU SELESAI */}
                    <div className="rounded-2xl border border-gray-200/90 p-5 bg-[#FAF8FE]/40">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800 flex items-center gap-1.5 mb-4">
                        <GradientIcon type="clock" size={18} />
                        Selesai Acara (Opsional)
                      </h3>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                            Tanggal Selesai
                          </label>
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className={`w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#E91E8C]/20 ${
                              errors.end_date ? "border-red-500" : "border-gray-200 focus:border-[#E91E8C]"
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                            Jam Selesai (WIB)
                          </label>
                          <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#E91E8C]"
                          />
                        </div>
                      </div>
                      {errors.end_date && (
                        <p className="mt-2 text-xs font-semibold text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3.5 w-3.5" /> {errors.end_date}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* KOTA & VENUE */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* KOTA PENYELENGGARAAN */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-1">
                        <GradientIcon type="mapPin" size={15} />
                        Kota Penyelenggaraan <span className="text-[#E91E8C]">*</span>
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none focus:border-[#5B1AA8] focus:ring-2 focus:ring-[#5B1AA8]/20"
                      >
                        {KOTA_LIST.map((cityName) => (
                          <option key={cityName} value={cityName}>
                            {cityName}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* NAMA VENUE */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                        Nama Gedung / Venue <span className="text-[#E91E8C]">*</span>
                      </label>
                      <input
                        type="text"
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                        placeholder="Contoh: Istora Senayan, M Bloc Space, ICE BSD"
                        className={`w-full rounded-xl border px-4 py-3.5 text-sm text-gray-900 outline-none transition-all focus:ring-2 focus:ring-[#5B1AA8]/20 ${
                          errors.venue ? "border-red-500 bg-red-50/20" : "border-gray-200 focus:border-[#5B1AA8]"
                        }`}
                      />
                      {errors.venue && (
                        <p className="mt-1.5 text-xs font-semibold text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-3.5 w-3.5" /> {errors.venue}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* ALAMAT LENGKAP VENUE */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Alamat Lengkap Venue
                    </label>
                    <input
                      type="text"
                      value={venueAddress}
                      onChange={(e) => setVenueAddress(e.target.value)}
                      placeholder="Contoh: Jl. Pintu Satu Senayan, Gelora, Kecamatan Tanah Abang, Kota Jakarta Pusat"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#5B1AA8] focus:ring-2 focus:ring-[#5B1AA8]/20"
                    />
                  </div>

                  {/* INFORMASI AKSES LOKASI */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Informasi Tambahan Akses / Lokasi
                    </label>
                    <input
                      type="text"
                      value={locationInfo}
                      onChange={(e) => setLocationInfo(e.target.value)}
                      placeholder="Contoh: Akses via MRT Istora Mandiri (Pintu 5), Tersedia kantong parkir motor & mobil di Parkir Timur"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#5B1AA8] focus:ring-2 focus:ring-[#5B1AA8]/20"
                    />
                  </div>

                  {/* SEATING LAYOUT / DENAH TEMPAT DUDUK (SEDERHANA & OPSIONAL) */}
                  <div className="rounded-2xl border border-purple-100 bg-[#FAF8FE] p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Layers className="h-5 w-5 text-[#5B1AA8]" />
                      <h4 className="text-sm font-bold text-gray-900">
                        Denah & Pengaturan Tempat Duduk (Opsional)
                      </h4>
                    </div>
                    <p className="text-xs text-gray-500 mb-4">
                      Pilih tipe pengaturan area penonton agar calon pembeli mengetahui format panggung Anda.
                    </p>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {[
                        {
                          id: "festival_standing",
                          label: "Standing / Festival Ground",
                          desc: "Penonton berdiri bebas di area panggung",
                        },
                        {
                          id: "all_seated",
                          label: "All Seated / Kursi Bernomor",
                          desc: "Penonton duduk di kursi / tribun tertata",
                        },
                        {
                          id: "hybrid_mix",
                          label: "Kombinasi (VIP Seated & Festival)",
                          desc: "Area VIP duduk dan Festival berdiri",
                        },
                      ].map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setSeatingPreset(preset.id)}
                          className={`rounded-xl border p-3.5 text-left transition-all ${
                            seatingPreset === preset.id
                              ? "border-[#5B1AA8] bg-white shadow-xs ring-2 ring-[#5B1AA8]/15"
                              : "border-gray-200 bg-white hover:border-purple-200"
                          }`}
                        >
                          <p
                            className={`text-xs font-bold ${
                              seatingPreset === preset.id ? "text-[#5B1AA8]" : "text-gray-800"
                            }`}
                          >
                            {preset.label}
                          </p>
                          <p className="mt-1 text-[11px] text-gray-500">{preset.desc}</p>
                        </button>
                      ))}
                    </div>

                    <div className="mt-4">
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                        Catatan Denah Tambahan (Opsional)
                      </label>
                      <input
                        type="text"
                        value={customSeatingNotes}
                        onChange={(e) => setCustomSeatingNotes(e.target.value)}
                        placeholder="Contoh: Baris A-D khusus VIP, pintu gate masuk dibuka 2 jam sebelum acara"
                        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 outline-none focus:border-[#5B1AA8]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* STEP 3: JENIS TIKET                                            */}
              {/* ============================================================== */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                        Langkah 3: Pengaturan Kategori Tiket
                      </h2>
                      <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                        Buat satu atau lebih jenis tiket. Tentukan harga yang wajar dan kuota yang realistis.
                      </p>
                    </div>

                    {/* LIVE METRICS BAR */}
                    <div className="flex items-center gap-4 rounded-xl border border-purple-100 bg-[#FAF5FF] px-4 py-2 text-xs">
                      <div>
                        <span className="text-gray-500 block text-[10px]">Total Kuota:</span>
                        <span className="font-extrabold text-[#5B1AA8]">
                          {summaryMetrics.totalQuota.toLocaleString("id-ID")} Tiket
                        </span>
                      </div>
                      <div className="h-6 w-px bg-purple-200" />
                      <div>
                        <span className="text-gray-500 block text-[10px]">Potensi Omset:</span>
                        <span className="font-extrabold text-[#E91E8C]">
                          {formatRupiah(summaryMetrics.potentialRevenue)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {errors.tickets && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                      {errors.tickets}
                    </div>
                  )}

                  {/* PRESET TIKET CEPAT */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500 mr-1">Template Cepat:</span>
                    <button
                      type="button"
                      onClick={() => applyTicketPreset("VIP", 350000, 50)}
                      className="rounded-full border border-purple-200 bg-white px-3 py-1 text-xs font-medium text-[#5B1AA8] hover:bg-purple-50 transition-colors"
                    >
                      + Tambah VIP (Rp350.000)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyTicketPreset("Early Bird", 100000, 150)}
                      className="rounded-full border border-purple-200 bg-white px-3 py-1 text-xs font-medium text-[#5B1AA8] hover:bg-purple-50 transition-colors"
                    >
                      + Tambah Early Bird (Rp100.000)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyTicketPreset("VVIP", 750000, 30)}
                      className="rounded-full border border-pink-200 bg-white px-3 py-1 text-xs font-medium text-[#E91E8C] hover:bg-pink-50 transition-colors"
                    >
                      + Tambah VVIP (Rp750.000)
                    </button>
                  </div>

                  {/* DAFTAR JENIS TIKET */}
                  <div className="space-y-4">
                    {ticketTypes.map((ticket, index) => {
                      const nameErr = errors[`ticket_name_${index}`];
                      const priceErr = errors[`ticket_price_${index}`];
                      const quotaErr = errors[`ticket_quota_${index}`];

                      return (
                        <div
                          key={ticket.id || index}
                          className="rounded-2xl border border-gray-200/90 bg-[#FAF9FD]/60 p-5 transition-all hover:border-purple-200"
                        >
                          <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-200/80">
                            <span className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-gray-700">
                              <GradientIcon type="ticket" size={18} />
                              Kategori Tiket #{index + 1}
                            </span>

                            {ticketTypes.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveTicket(index)}
                                className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Hapus
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            {/* NAMA TIKET */}
                            <div>
                              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                                Nama Tiket <span className="text-[#E91E8C]">*</span>
                              </label>
                              <input
                                type="text"
                                value={ticket.name}
                                onChange={(e) => handleTicketChange(index, "name", e.target.value)}
                                placeholder="Contoh: Regular / VIP / CAT 1"
                                className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#5B1AA8]/20 ${
                                  nameErr ? "border-red-500 bg-red-50/20" : "border-gray-200 focus:border-[#5B1AA8]"
                                }`}
                              />
                              {nameErr && (
                                <p className="mt-1 text-[11px] text-red-600">{nameErr}</p>
                              )}
                            </div>

                            {/* HARGA TIKET */}
                            <div>
                              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                                Harga Satuan (Rp) <span className="text-[#E91E8C]">*</span>
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-400">
                                  Rp
                                </span>
                                <input
                                  type="number"
                                  min={0}
                                  value={ticket.price}
                                  onChange={(e) =>
                                    handleTicketChange(
                                      index,
                                      "price",
                                      e.target.value === "" ? "" : Number(e.target.value)
                                    )
                                  }
                                  placeholder="0"
                                  className={`w-full rounded-xl border bg-white pl-9 pr-3.5 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#5B1AA8]/20 ${
                                    priceErr ? "border-red-500 bg-red-50/20" : "border-gray-200 focus:border-[#5B1AA8]"
                                  }`}
                                />
                              </div>
                              <span className="mt-1 block text-[11px] text-gray-400">
                                Terbaca: {formatRupiah(ticket.price)}
                              </span>
                              {priceErr && (
                                <p className="mt-1 text-[11px] text-red-600">{priceErr}</p>
                              )}
                            </div>

                            {/* KUOTA TIKET */}
                            <div>
                              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                                Kuota Tiket <span className="text-[#E91E8C]">*</span>
                              </label>
                              <input
                                type="number"
                                min={1}
                                value={ticket.quota}
                                onChange={(e) =>
                                  handleTicketChange(
                                    index,
                                    "quota",
                                    e.target.value === "" ? "" : Number(e.target.value)
                                  )
                                }
                                placeholder="Jumlah lembar"
                                className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#5B1AA8]/20 ${
                                  quotaErr ? "border-red-500 bg-red-50/20" : "border-gray-200 focus:border-[#5B1AA8]"
                                }`}
                              />
                              {quotaErr && (
                                <p className="mt-1 text-[11px] text-red-600">{quotaErr}</p>
                              )}
                            </div>
                          </div>

                          {/* DESKRIPSI & PERIODE PENJUALAN */}
                          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <div className="sm:col-span-2">
                              <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                                Fasilitas / Keterangan Tiket (Opsional)
                              </label>
                              <input
                                type="text"
                                value={ticket.description}
                                onChange={(e) => handleTicketChange(index, "description", e.target.value)}
                                placeholder="Contoh: Bebas antre, sudah termasuk wristband dan merchandise pack"
                                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 outline-none focus:border-[#5B1AA8]"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                                Batas Akhir Jual (Opsional)
                              </label>
                              <input
                                type="date"
                                value={ticket.sale_end}
                                onChange={(e) => handleTicketChange(index, "sale_end", e.target.value)}
                                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-gray-800 outline-none focus:border-[#5B1AA8]"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* TOMBOL TAMBAH TIKET */}
                  <button
                    type="button"
                    onClick={handleAddTicket}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-purple-200 bg-white p-4 text-xs font-bold text-[#5B1AA8] transition-colors hover:border-[#5B1AA8] hover:bg-purple-50 sm:text-sm"
                  >
                    <Plus className="h-4 w-4" />
                    Tambah Jenis Tiket Lainnya
                  </button>
                </div>
              )}

              {/* ============================================================== */}
              {/* STEP 4: REVIEW PENGAJUAN                                       */}
              {/* ============================================================== */}
              {currentStep === 4 && (
                <div className="space-y-8">
                  <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                      Langkah 4: Tinjau Rangkuman Pengajuan
                    </h2>
                    <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                      Pastikan seluruh detail acara sudah lengkap dan akurat sebelum dikirim ke tim kurasi CuanTix.
                    </p>
                  </div>

                  {/* KARTU PREVIEW UTAMA */}
                  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
                    {/* BANNER PREVIEW */}
                    <div className="relative aspect-[16/6] w-full bg-gradient-to-r from-purple-900 via-indigo-900 to-pink-900 flex items-center justify-center overflow-hidden">
                      {bannerPreview || bannerUrl ? (
                        <img
                          src={bannerPreview || bannerUrl}
                          alt="Banner Event"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-white/80 p-4 text-center">
                          <GradientIcon type="megaphone" size={32} />
                          <p className="text-xs sm:text-sm font-semibold">Banner Resmi CuanTix</p>
                        </div>
                      )}

                      {/* BADGE KATEGORI */}
                      {selectedCategoryObj && (
                        <span className="absolute top-4 left-4 rounded-full bg-black/60 backdrop-blur-xs px-3.5 py-1 text-xs font-bold text-white shadow-sm border border-white/20">
                          {selectedCategoryObj.name}
                        </span>
                      )}
                    </div>

                    <div className="p-6 sm:p-8">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-[140px_1fr]">
                        {/* POSTER THUMBNAIL */}
                        <div className="aspect-[3/4] w-full max-w-[140px] overflow-hidden rounded-xl border border-gray-200 bg-gray-100 shadow-xs shrink-0 mx-auto md:mx-0">
                          {posterPreview || posterUrl ? (
                            <img
                              src={posterPreview || posterUrl}
                              alt="Poster Event"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center p-2 text-center text-gray-400">
                              <ImageIcon className="h-6 w-6 mb-1 text-gray-300" />
                              <span className="text-[10px]">Tanpa Poster</span>
                            </div>
                          )}
                        </div>

                        {/* DESKRIPSI & INFO UTAMA */}
                        <div className="min-w-0">
                          <h3 className="text-xl font-extrabold text-gray-900 sm:text-2xl">
                            {title || "Nama Event Belum Diisi"}
                          </h3>

                          <p className="mt-3 text-xs leading-relaxed text-gray-600 sm:text-sm whitespace-pre-line">
                            {description || "Deskripsi event belum diisi."}
                          </p>

                          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs text-gray-700 border-t border-gray-100 pt-4">
                            <div className="flex items-start gap-2.5">
                              <span className="mt-0.5 shrink-0">
                                <GradientIcon type="calendar" size={18} />
                              </span>
                              <div>
                                <strong className="block text-gray-900">Jadwal Acara:</strong>
                                <span>{formatIndonesianDateTime(startDate, startTime)}</span>
                                {endDate && (
                                  <span className="block text-gray-500">
                                    s/d {formatIndonesianDateTime(endDate, endTime)}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                              <span className="mt-0.5 shrink-0">
                                <GradientIcon type="mapPin" size={18} />
                              </span>
                              <div>
                                <strong className="block text-gray-900">Lokasi Venue:</strong>
                                <span>{venue || "Venue belum ditentukan"}, {city}</span>
                                {venueAddress && (
                                  <span className="block text-[11px] text-gray-500 mt-0.5">
                                    {venueAddress}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* TABEL RINGKASAN TIKET */}
                  <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white">
                    <div className="bg-[#FAF8FE] px-5 py-3.5 border-b border-gray-200 flex items-center justify-between">
                      <h4 className="text-xs font-extrabold uppercase tracking-wide text-gray-800 flex items-center gap-2">
                        <GradientIcon type="ticket" size={18} />
                        Daftar Kategori Tiket ({ticketTypes.length} Jenis)
                      </h4>
                      <span className="text-xs font-bold text-[#5B1AA8]">
                        Total Kuota: {summaryMetrics.totalQuota} Tiket
                      </span>
                    </div>

                    <div className="divide-y divide-gray-100">
                      {ticketTypes.map((t, i) => (
                        <div
                          key={t.id || i}
                          className="flex flex-col gap-2 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-gray-900 text-sm">{t.name}</span>
                            {t.description && (
                              <p className="text-[11px] text-gray-500 mt-0.5">{t.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-6">
                            <span className="text-gray-600 font-medium">
                              Kuota: <strong className="text-gray-900">{t.quota}</strong>
                            </span>
                            <span className="font-extrabold text-[#5B1AA8] text-sm">
                              {formatRupiah(t.price)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* PERNYATAAN KURASI & KEAMANAN */}
                  <div className="rounded-2xl border border-purple-100 bg-[#FAF5FF] p-4 text-xs text-gray-700 flex items-start gap-3">
                    <span className="mt-0.5 shrink-0">
                      <GradientIcon type="shieldCheck" size={20} />
                    </span>
                    <div>
                      <strong className="block text-[#5B1AA8] font-bold">
                        Persetujuan Syarat & Ketentuan Kurasi
                      </strong>
                      <p className="mt-1 leading-relaxed text-gray-600">
                        Dengan menekan tombol kirim di bawah, Anda menyetujui bahwa informasi yang diberikan adalah benar.
                        Pengajuan Anda akan ditinjau oleh tim CuanTix untuk memastikan standar keamanan dan kualitas acara.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* NAVIGASI STEP (TOMBOL KEMBALI & LANJUT / KIRIM) */}
              <div className="mt-10 flex items-center justify-between border-t border-gray-100 pt-6">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={isSubmitting}
                    className="rounded-full border border-gray-300 bg-white px-6 py-2.5 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 sm:text-sm"
                  >
                    Kembali
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex items-center gap-2 rounded-full px-7 py-3 text-xs font-bold text-white shadow-md transition-opacity hover:opacity-95 active:scale-95 sm:text-sm"
                    style={{ background: BRAND_GRADIENT }}
                  >
                    Lanjutkan
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitProposal}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 rounded-full px-8 py-3 text-xs font-bold text-white shadow-md transition-opacity hover:opacity-95 active:scale-95 disabled:opacity-60 sm:text-sm"
                    style={{ background: BRAND_GRADIENT }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Mengirim Pengajuan...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Kirim Pengajuan Event
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL PERINGATAN LOGIN DIPERLUKAN */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-[#5B1AA8]">
              <GradientIcon type="lock" size={28} />
            </div>

            <h3 className="text-center text-lg font-bold text-gray-900 sm:text-xl">
              Login Akun Customer Diperlukan
            </h3>

            <p className="mt-2 text-center text-xs leading-relaxed text-gray-600 sm:text-sm">
              Untuk mengajukan proposal event di CuanTix, Anda harus masuk ke akun customer terlebih dahulu agar kami dapat mengaitkan tiket dan pengajuan ke profil Anda.
            </p>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="w-full rounded-full border border-gray-200 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 sm:text-sm"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAuthModal(false);
                  router.push("/auth/login");
                }}
                className="w-full rounded-full py-2.5 text-xs font-bold text-white shadow-md hover:opacity-95 sm:text-sm"
                style={{ background: BRAND_GRADIENT }}
              >
                Login Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
