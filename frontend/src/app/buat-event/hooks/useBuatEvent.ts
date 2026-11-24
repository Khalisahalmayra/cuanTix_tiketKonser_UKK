"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  Category,
  TicketTypeInput,
  SubmissionSuccess,
  StepNumber,
  SummaryMetrics,
} from "../types";
import { API_BASE, FALLBACK_CATEGORIES } from "../constants";

export function useBuatEvent() {
  // Multi-step State (1: Info Event, 2: Jadwal & Lokasi, 3: Jenis Tiket, 4: Review)
  const [currentStep, setCurrentStep] = useState<StepNumber>(1);

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
  const [submissionSuccess, setSubmissionSuccess] = useState<SubmissionSuccess | null>(null);

  // Image File Inputs ref
  const posterInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Load Categories on Mount
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

  // Summary Metrics
  const summaryMetrics: SummaryMetrics = useMemo(() => {
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
      setCurrentStep((prev) => (prev - 1) as StepNumber);
    }
  };

  // Step Click Navigation
  const handleStepClick = (targetStep: StepNumber) => {
    if (targetStep < currentStep) {
      setCurrentStep(targetStep);
    } else if (targetStep === currentStep + 1) {
      handleNextStep();
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

  return {
    // Stepper
    currentStep,
    setCurrentStep,
    handleNextStep,
    handlePrevStep,
    handleStepClick,

    // Auth
    token,
    showAuthModal,
    setShowAuthModal,

    // Step 1 State & Setters
    title,
    setTitle,
    categoryId,
    setCategoryId,
    categories,
    selectedCategoryObj,
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

    // Step 2 State & Setters
    startDate,
    setStartDate,
    startTime,
    setStartTime,
    endDate,
    setEndDate,
    endTime,
    setEndTime,
    city,
    setCity,
    venue,
    setVenue,
    venueAddress,
    setVenueAddress,
    locationInfo,
    setLocationInfo,
    seatingPreset,
    setSeatingPreset,
    customSeatingNotes,
    setCustomSeatingNotes,

    // Step 3 State & Setters
    ticketTypes,
    setTicketTypes,
    handleAddTicket,
    handleRemoveTicket,
    handleTicketChange,
    applyTicketPreset,
    summaryMetrics,

    // Submission & Error State
    errors,
    isSubmitting,
    submitError,
    setSubmitError,
    submissionSuccess,
    handleSubmitProposal,
    handleResetForm,
  };
}
