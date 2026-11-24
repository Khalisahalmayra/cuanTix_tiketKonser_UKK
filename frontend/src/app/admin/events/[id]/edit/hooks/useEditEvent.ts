"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  KOTA_LIST,
  filterCities,
  groupByLetter,
} from "@/data/cities";
import {
  TicketItem,
  SeatingZone,
  SeatingPreset,
} from "../types";
import {
  API_BASE,
  TICKET_PRESETS,
  ZONE_COLORS,
} from "../constants";
import {
  toLocalInput,
  calculateDuration,
  generateSvgString,
} from "../utils";

export function useEditEvent() {
  const params = useParams();
  const eventId = params?.id as string;
  const router = useRouter();

  // Navigation Steps
  const [activeStep, setActiveStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  // Section A: Form Info
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<number>(2);
  const [description, setDescription] = useState("");
  const [currentBanner, setCurrentBanner] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  // Section B: Jadwal & Lokasi
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [city, setCity] = useState("Jakarta");
  const [venue, setVenue] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [locationInfo, setLocationInfo] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [isCityOpen, setIsCityOpen] = useState(false);
  const cityDropdownRef = useRef<HTMLDivElement>(null);

  // Section C: Pengaturan Tiket
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [ticketPresetMenuOpen, setTicketPresetMenuOpen] = useState(false);

  // Section D: Pengaturan Denah Venue
  const [layoutPreset, setLayoutPreset] = useState<SeatingPreset>("standing_seated");
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [zones, setZones] = useState<SeatingZone[]>([]);
  const [customLayoutImage, setCustomLayoutImage] = useState<string | null>(null);
  const [customImageFile, setCustomImageFile] = useState<File | null>(null);

  // Section E & State
  const [currentStatus, setCurrentStatus] = useState<string>("published");
  const [saving, setSaving] = useState(false);
  const [saveAction, setSaveAction] = useState<"draft" | "publish" | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<TicketItem | null>(null);
  const [zoneToDelete, setZoneToDelete] = useState<SeatingZone | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successToast, setSuccessToast] = useState("");

  const applyPresetLayout = (preset: SeatingPreset) => {
    setLayoutPreset(preset);
    if (preset === "standing_seated") {
      setZones([
        {
          id: "zone-1",
          name: "VIP Front Row",
          ticketName: tickets[0]?.name || "VIP",
          capacity: 250,
          color: "#7C3AED",
          x: 230,
          y: 110,
          width: 340,
          height: 90,
          type: "standing",
        },
        {
          id: "zone-2",
          name: "Festival A (Kiri)",
          ticketName: tickets[1]?.name || "Regular",
          capacity: 400,
          color: "#EC4899",
          x: 120,
          y: 220,
          width: 260,
          height: 120,
          type: "standing",
        },
        {
          id: "zone-3",
          name: "Festival B (Kanan)",
          ticketName: tickets[1]?.name || "Regular",
          capacity: 350,
          color: "#059669",
          x: 420,
          y: 220,
          width: 260,
          height: 120,
          type: "standing",
        },
        {
          id: "zone-4",
          name: "Tribune Belakang",
          ticketName: tickets[2]?.name || "",
          capacity: 300,
          color: "#2563EB",
          x: 120,
          y: 360,
          width: 560,
          height: 70,
          type: "seated",
        },
      ]);
    } else if (preset === "all_seated") {
      setZones([
        {
          id: "zone-1",
          name: "VIP Center Seated",
          ticketName: tickets[0]?.name || "VIP",
          capacity: 200,
          color: "#7C3AED",
          x: 240,
          y: 110,
          width: 320,
          height: 85,
          type: "seated",
        },
        {
          id: "zone-2",
          name: "CAT 1 (Tengah)",
          ticketName: tickets[1]?.name || "Regular",
          capacity: 400,
          color: "#2563EB",
          x: 160,
          y: 215,
          width: 480,
          height: 100,
          type: "seated",
        },
        {
          id: "zone-3",
          name: "CAT 2 (Belakang)",
          ticketName: tickets[2]?.name || "",
          capacity: 400,
          color: "#059669",
          x: 100,
          y: 335,
          width: 600,
          height: 100,
          type: "seated",
        },
      ]);
    } else if (preset === "festival_ground") {
      setZones([
        {
          id: "zone-1",
          name: "VIP Front Ground",
          ticketName: tickets[0]?.name || "VIP",
          capacity: 300,
          color: "#7C3AED",
          x: 180,
          y: 110,
          width: 440,
          height: 140,
          type: "standing",
        },
        {
          id: "zone-2",
          name: "General Festival Ground",
          ticketName: tickets[1]?.name || "Regular",
          capacity: 700,
          color: "#059669",
          x: 130,
          y: 270,
          width: 540,
          height: 170,
          type: "standing",
        },
      ]);
    }
  };

  // Load existing event data on mount
  useEffect(() => {
    if (!eventId) return;
    const token = localStorage.getItem("token");

    async function fetchEvent() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/admin/events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Gagal memuat event.");
        }

        setTitle(data.title || "");
        setCategoryId(Number(data.category_id || 2));
        setDescription(data.description || "");
        setCurrentBanner(data.banner_url || data.poster_url || "");
        setStartAt(toLocalInput(data.start_at));
        setEndAt(toLocalInput(data.end_at));
        setCity(data.city || "Jakarta");
        setVenue(data.venue || "");
        setVenueAddress(data.venue_address || "");
        setLocationInfo(data.location_info || "");
        setCurrentStatus(data.status || "published");

        // Format tickets
        if (Array.isArray(data.ticket_types)) {
          const loadedTickets: TicketItem[] = data.ticket_types.map(
            (
              t: {
                id?: number | string;
                name?: string;
                price?: number | string;
                quota?: number | string;
                sold?: number | string;
                description?: string;
                sale_start?: string | null;
                sale_end?: string | null;
                is_active?: boolean;
              },
              idx: number
            ) => ({
              id: t.id,
              name: t.name || "",
              price: Number(t.price) || 0,
              quota: Number(t.quota) || 0,
              sold: Number(t.sold) || 0,
              description: t.description || "",
              sale_start: toLocalInput(t.sale_start),
              sale_end: toLocalInput(t.sale_end),
              is_active: t.is_active !== undefined ? Boolean(t.is_active) : true,
              color: ZONE_COLORS[idx % ZONE_COLORS.length].hex,
            })
          );
          setTickets(loadedTickets);
        }

        // Format seating layout
        if (data.seating_layout && typeof data.seating_layout === "object") {
          const sl = data.seating_layout;
          if (sl.preset) setLayoutPreset(sl.preset);
          if (Array.isArray(sl.zones) && sl.zones.length > 0) {
            setZones(sl.zones);
            setSelectedZoneId(sl.zones[0].id);
          }
          if (sl.image_url) setCustomLayoutImage(sl.image_url);
        } else {
          // Inisialisasi layout default jika event lama belum punya seating layout
          applyPresetLayout("standing_seated");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setErrorMessage(err.message);
        } else {
          setErrorMessage("Gagal mengambil data event dari server.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  // Close city dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(e.target as Node)
      ) {
        setIsCityOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCities = useMemo(() => {
    return filterCities(KOTA_LIST, citySearch);
  }, [citySearch]);

  const groupedCities = useMemo(() => {
    return groupByLetter(filteredCities);
  }, [filteredCities]);

  // Duration live auto-calculation
  const durationInfo = useMemo(() => {
    return calculateDuration(startAt, endAt);
  }, [startAt, endAt]);

  const totalQuota = useMemo(() => {
    return tickets.reduce((sum, t) => sum + (Number(t.quota) || 0), 0);
  }, [tickets]);

  const totalSold = useMemo(() => {
    return tickets.reduce((sum, t) => sum + (Number(t.sold) || 0), 0);
  }, [tickets]);

  const totalRevenue = useMemo(() => {
    return tickets.reduce(
      (sum, t) => sum + (Number(t.price) || 0) * (Number(t.quota) || 0),
      0
    );
  }, [tickets]);

  const totalZoneCapacity = useMemo(() => {
    return zones.reduce((sum, z) => sum + (Number(z.capacity) || 0), 0);
  }, [zones]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) {
      setErrorMessage("Format gambar poster harus JPG, PNG, atau WEBP.");
      return;
    }
    if (f.size > 2 * 1024 * 1024) {
      setErrorMessage("Ukuran file poster maksimal 2 MB.");
      return;
    }
    setErrorMessage("");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const removePoster = () => {
    setFile(null);
    setPreview("");
  };

  const handleCustomImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!["image/jpeg", "image/png", "image/webp", "image/svg+xml"].includes(f.type)) {
      setErrorMessage("Format file denah harus JPG, PNG, WEBP, atau SVG.");
      return;
    }
    if (f.size > 3 * 1024 * 1024) {
      setErrorMessage("Ukuran denah maksimal 3 MB.");
      return;
    }
    setCustomImageFile(f);
    setCustomLayoutImage(URL.createObjectURL(f));
  };

  const addEmptyTicket = () => {
    const newId = `new-ticket-${Date.now()}`;
    const newTicket: TicketItem = {
      id: newId,
      name: `Kategori ${tickets.length + 1}`,
      price: 300000,
      quota: 100,
      sold: 0,
      description: "Akses tempat duduk standar.",
      sale_start: "",
      sale_end: "",
      is_active: true,
      color: ZONE_COLORS[tickets.length % ZONE_COLORS.length].hex,
    };
    setTickets((prev) => [...prev, newTicket]);
  };

  const addPresetTicket = (preset: (typeof TICKET_PRESETS)[0]) => {
    const newId = `new-ticket-${Date.now()}`;
    const newTicket: TicketItem = {
      id: newId,
      name: preset.name,
      price: preset.price,
      quota: preset.quota,
      sold: 0,
      description: preset.description,
      sale_start: "",
      sale_end: "",
      is_active: true,
      color: preset.color,
    };
    setTickets((prev) => [...prev, newTicket]);
    setTicketPresetMenuOpen(false);
  };

  const updateTicket = (index: number, patch: Partial<TicketItem>) => {
    setTickets((prev) =>
      prev.map((t, idx) => (idx === index ? { ...t, ...patch } : t))
    );
  };

  const confirmDeleteTicket = () => {
    if (!ticketToDelete) return;
    setTickets((prev) => prev.filter((t) => t.id !== ticketToDelete.id));
    setZones((prev) =>
      prev.map((z) =>
        z.ticketName === ticketToDelete.name ? { ...z, ticketName: "" } : z
      )
    );
    setTicketToDelete(null);
  };

  const addZone = () => {
    const newId = `zone-${Date.now()}`;
    const newZone: SeatingZone = {
      id: newId,
      name: `Zona Baru ${zones.length + 1}`,
      ticketName: tickets[0]?.name || "",
      capacity: 100,
      color: ZONE_COLORS[zones.length % ZONE_COLORS.length].hex,
      x: 150 + ((zones.length * 30) % 200),
      y: 200 + ((zones.length * 25) % 150),
      width: 200,
      height: 90,
      type: "standing",
    };
    setZones((prev) => [...prev, newZone]);
    setSelectedZoneId(newId);
  };

  const updateZone = (id: string, patch: Partial<SeatingZone>) => {
    setZones((prev) =>
      prev.map((z) => (z.id === id ? { ...z, ...patch } : z))
    );
  };

  const confirmDeleteZone = () => {
    if (!zoneToDelete) return;
    setZones((prev) => prev.filter((z) => z.id !== zoneToDelete.id));
    if (selectedZoneId === zoneToDelete.id) {
      setSelectedZoneId(null);
    }
    setZoneToDelete(null);
  };

  const validateForm = () => {
    const errors: string[] = [];
    if (!title.trim()) errors.push("Judul event wajib diisi.");
    if (!city.trim()) errors.push("Kota event wajib dipilih.");
    if (!venue.trim()) errors.push("Nama venue / lokasi wajib diisi.");
    if (!startAt) errors.push("Tanggal & waktu mulai wajib diisi.");
    if (endAt && durationInfo && !durationInfo.isValid) {
      errors.push("Waktu selesai harus setelah waktu mulai.");
    }
    const validTickets = tickets.filter(
      (t) => t.name.trim() && Number(t.price) >= 0 && Number(t.quota) > 0
    );
    if (validTickets.length === 0) {
      errors.push("Isi minimal 1 jenis tiket yang valid (nama, harga, kuota > 0).");
    }
    for (const t of tickets) {
      if (t.sold && t.quota < t.sold) {
        errors.push(
          `Kuota tiket "${t.name}" (${t.quota}) tidak boleh di bawah jumlah yang telah terjual (${t.sold}).`
        );
      }
    }
    return errors;
  };

  const handleTriggerSave = (action: "draft" | "publish") => {
    const errs = validateForm();
    if (errs.length > 0) {
      setErrorMessage(errs[0]);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setErrorMessage("");
    setSaveAction(action);
    setShowConfirmModal(true);
  };

  const handleFinalSubmit = async () => {
    setShowConfirmModal(false);
    setSaving(true);
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("Sesi login berakhir. Silakan login kembali sebagai admin.");
        setSaving(false);
        router.push("/auth/login");
        return;
      }

      // 1. Upload Poster Baru jika dipilih
      let bannerUrl = currentBanner;
      if (file) {
        const fd = new FormData();
        fd.append("image", file);
        const upRes = await fetch(`${API_BASE}/api/admin/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
        const upData = await upRes.json();
        if (!upRes.ok) {
          throw new Error(upData.message || "Gagal mengunggah gambar poster");
        }
        bannerUrl = upData.url;
      }

      // 2. Upload Custom Denah Baru jika dipilih
      let denahImageUrl = customLayoutImage;
      if (customImageFile) {
        const fd = new FormData();
        fd.append("image", customImageFile);
        const denahUp = await fetch(`${API_BASE}/api/admin/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
        const denahData = await denahUp.json();
        if (denahUp.ok && denahData.url) {
          denahImageUrl = denahData.url;
        }
      }

      // 3. Prepare Seating Layout Data
      const svgString = generateSvgString(zones);
      const seatingLayoutData = {
        preset: layoutPreset,
        zones: zones.map((z) => ({
          id: z.id,
          name: z.name,
          ticketName: z.ticketName,
          capacity: Number(z.capacity) || 0,
          color: z.color,
          x: z.x,
          y: z.y,
          width: z.width,
          height: z.height,
          type: z.type,
        })),
        total_capacity: totalZoneCapacity,
        svg_string: svgString,
        image_url: denahImageUrl || null,
      };

      // 4. Prepare Tickets Data
      const validTickets = tickets
        .filter((t) => t.name.trim() && Number(t.quota) > 0)
        .map((t) => ({
          id: typeof t.id === "number" ? t.id : undefined,
          name: t.name.trim(),
          price: Number(t.price) || 0,
          quota: Number(t.quota) || 0,
          description: t.description.trim(),
          is_active: t.is_active,
          sale_start: t.sale_start ? new Date(t.sale_start).toISOString() : null,
          sale_end: t.sale_end ? new Date(t.sale_end).toISOString() : null,
        }));

      // 5. Submit Event Update ke Backend (PUT)
      const payload = {
        title: title.trim(),
        category_id: Number(categoryId),
        description: description.trim(),
        banner_url: bannerUrl || "/image/snada-event.png",
        poster_url: bannerUrl || "/image/snada-event.png",
        city: city.trim(),
        venue: venue.trim(),
        venue_address: venueAddress.trim(),
        location_info: locationInfo.trim(),
        start_at: new Date(startAt).toISOString(),
        end_at: endAt ? new Date(endAt).toISOString() : null,
        status: saveAction === "draft" ? "draft" : "published",
        tickets: validTickets,
        seating_layout: seatingLayoutData,
      };

      const res = await fetch(`${API_BASE}/api/admin/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal memperbarui event di database.");
      }

      setSuccessToast(
        saveAction === "draft"
          ? "Perubahan berhasil disimpan sebagai DRAFT!"
          : "Event berhasil DIPERBARUI dan DIPUBLIKASIKAN!"
      );

      setTimeout(() => {
        router.push("/admin/events");
      }, 1200);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Terjadi kesalahan saat menyimpan event.");
      }
    } finally {
      setSaving(false);
    }
  };

  const shownBanner = preview || currentBanner;

  return {
    eventId,
    router,
    loading,
    activeStep,
    setActiveStep,

    // Section A
    title,
    setTitle,
    categoryId,
    setCategoryId,
    description,
    setDescription,
    currentBanner,
    file,
    preview,
    shownBanner,
    handleFileChange,
    removePoster,

    // Section B
    startAt,
    setStartAt,
    endAt,
    setEndAt,
    city,
    setCity,
    venue,
    setVenue,
    venueAddress,
    setVenueAddress,
    locationInfo,
    setLocationInfo,
    citySearch,
    setCitySearch,
    isCityOpen,
    setIsCityOpen,
    cityDropdownRef,
    filteredCities,
    groupedCities,
    durationInfo,

    // Section C
    tickets,
    ticketPresetMenuOpen,
    setTicketPresetMenuOpen,
    addEmptyTicket,
    addPresetTicket,
    updateTicket,
    confirmDeleteTicket,
    ticketToDelete,
    setTicketToDelete,
    totalQuota,
    totalSold,
    totalRevenue,

    // Section D
    layoutPreset,
    selectedZoneId,
    setSelectedZoneId,
    zones,
    customLayoutImage,
    customImageFile,
    applyPresetLayout,
    addZone,
    updateZone,
    confirmDeleteZone,
    zoneToDelete,
    setZoneToDelete,
    handleCustomImageChange,
    setCustomLayoutImage,
    setCustomImageFile,
    totalZoneCapacity,

    // Section E & Actions
    currentStatus,
    saving,
    saveAction,
    showConfirmModal,
    setShowConfirmModal,
    errorMessage,
    setErrorMessage,
    successToast,
    setSuccessToast,
    handleTriggerSave,
    handleFinalSubmit,
  };
}
