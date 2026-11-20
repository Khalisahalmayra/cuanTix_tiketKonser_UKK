"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  UploadCloud,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ChevronDown,
  Search,
  Sparkles,
  Layers,
  Save,
  Send,
  ArrowLeft,
  X,
  Music,
  Flame,
  Radio,
  Disc,
  Check,
  Loader2,
} from "lucide-react";
import {
  KOTA_LIST,
  POPULAR_CITIES,
  groupByLetter,
  filterCities,
} from "@/data/cities";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const CATEGORIES = [
  { id: 1, name: "Rock", icon: Flame, color: "#EF4444", bg: "#FEF2F2" },
  { id: 2, name: "Pop", icon: Sparkles, color: "#EC4899", bg: "#FDF2F8" },
  { id: 3, name: "Indie", icon: Radio, color: "#8B5CF6", bg: "#F5F3FF" },
  { id: 4, name: "EDM", icon: Disc, color: "#06B6D4", bg: "#ECFEFF" },
  { id: 5, name: "Jazz", icon: Music, color: "#F59E0B", bg: "#FFFBEB" },
];

const TICKET_PRESETS = [
  { name: "VIP", price: 750000, quota: 200, color: "#7C3AED", description: "Akses gate khusus, soundcheck viewing & exclusive merch" },
  { name: "Festival", price: 400000, quota: 500, color: "#EC4899", description: "Area berdiri depan panggung, official wristband" },
  { name: "CAT 1 (Numbered Seated)", price: 600000, quota: 350, color: "#2563EB", description: "Kursi bernomor tier 1 dengan view panggung lurus" },
  { name: "CAT 2 (Seated)", price: 450000, quota: 400, color: "#059669", description: "Kursi bertingkat tier 2, akses fasilitas tribun" },
  { name: "Early Bird", price: 300000, quota: 150, color: "#F59E0B", description: "Tiket promo khusus pembeli pertama kuota terbatas" },
  { name: "Platinum VIP", price: 1250000, quota: 80, color: "#9333EA", description: "Meet & greet pass, VIP lounge access & premium gift" },
  { name: "Tribune Barat", price: 350000, quota: 300, color: "#0D9488", description: "Tribun sisi barat dengan tempat duduk beratap" },
];

const ZONE_COLORS = [
  { label: "Ungu VIP", hex: "#7C3AED" },
  { label: "Pink Magenta", hex: "#EC4899" },
  { label: "Biru CAT 1", hex: "#2563EB" },
  { label: "Hijau Emerald", hex: "#059669" },
  { label: "Kuning Amber", hex: "#F59E0B" },
  { label: "Teal Cyan", hex: "#0D9488" },
  { label: "Indigo Navy", hex: "#4338CA" },
];

export type TicketItem = {
  id?: number | string;
  name: string;
  price: number;
  quota: number;
  sold?: number;
  description: string;
  sale_start: string;
  sale_end: string;
  is_active: boolean;
  color: string;
};

export type SeatingZone = {
  id: string;
  name: string;
  ticketName: string;
  capacity: number;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: "standing" | "seated";
};

type SeatingPreset = "standing_seated" | "all_seated" | "festival_ground";

const toLocalInput = (iso?: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

export default function EditEventPage() {
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
            (t: any, idx: number) => ({
              id: t.id,
              name: t.name,
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
    if (!startAt) return null;
    const start = new Date(startAt);
    if (Number.isNaN(start.getTime())) return null;

    const startFormatted = new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(start);

    if (!endAt) {
      return {
        text: `${startFormatted} WIB`,
        durationText: "Satu sesi",
        isValid: true,
      };
    }

    const end = new Date(endAt);
    if (Number.isNaN(end.getTime())) return null;

    if (end <= start) {
      return {
        text: "Waktu selesai harus setelah waktu mulai",
        durationText: "Waktu tidak valid",
        isValid: false,
      };
    }

    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const diffDays = Math.floor(diffHours / 24);
    const remHours = diffHours % 24;

    let durString = "";
    if (diffDays > 0) {
      durString = `${diffDays} hari ${remHours > 0 ? `${remHours} jam` : ""}`.trim();
    } else if (diffHours > 0) {
      durString = `${diffHours} jam ${diffMins > 0 ? `${diffMins} menit` : ""}`.trim();
    } else {
      durString = `${diffMins} menit`;
    }

    const endFormatted = new Intl.DateTimeFormat("id-ID", {
      day: start.toDateString() === end.toDateString() ? undefined : "numeric",
      month: start.toDateString() === end.toDateString() ? undefined : "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(end);

    return {
      text: `${startFormatted} – ${endFormatted} WIB (Durasi: ${durString})`,
      durationText: durString,
      isValid: true,
    };
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

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

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

  const generateSvgString = () => {
    const zoneElements = zones
      .map(
        (z) => `
      <g id="${z.id}" class="zone-block" cursor="pointer">
        <rect x="${z.x}" y="${z.y}" width="${z.width}" height="${z.height}" rx="12" ry="12" fill="${z.color}" fill-opacity="0.22" stroke="${z.color}" stroke-width="2.5" />
        <text x="${z.x + z.width / 2}" y="${z.y + z.height / 2 - 6}" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#1e1b4b" text-anchor="middle">${z.name}</text>
        <text x="${z.x + z.width / 2}" y="${z.y + z.height / 2 + 14}" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="600" fill="#4b5563" text-anchor="middle">${z.capacity} Kursi/Orang</text>
      </g>`
      )
      .join("\n");

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
      <defs>
        <linearGradient id="stageGlow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#7C3AED" stop-opacity="0.3" />
          <stop offset="100%" stop-color="#E91E8C" stop-opacity="0.0" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="#0F172A" rx="16" />
      <path d="M 220 30 L 260 90 L 540 90 L 580 30 Z" fill="url(#stageGlow)" />
      <rect x="220" y="24" width="360" height="48" rx="8" fill="#1E293B" stroke="#7C3AED" stroke-width="2" />
      <text x="400" y="54" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="800" fill="#F8FAFC" text-anchor="middle" letter-spacing="3">★ PANGGUNG / STAGE ★</text>
      ${zoneElements}
    </svg>`;
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
      const svgString = generateSvgString();
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

  const steps = [
    { id: 1, label: "Informasi Event", anchor: "#informasi" },
    { id: 2, label: "Jadwal & Lokasi", anchor: "#jadwal" },
    { id: 3, label: "Pengaturan Tiket", anchor: "#tiket" },
    { id: 4, label: "Denah Panggung", anchor: "#denah" },
    { id: 5, label: "Review & Simpan", anchor: "#review" },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#7C3AED]" />
        <p className="text-sm font-semibold text-gray-600">
          Memuat data event untuk diedit...
        </p>
      </div>
    );
  }

  const shownBanner = preview || currentBanner;

  return (
    <div className="mx-auto max-w-6xl pb-24">
      {/* ================= HEADER SECTION ================= */}
      <div className="mb-6 flex flex-col gap-4 border-b border-gray-200 pb-5 md:flex-row md:items-center md:justify-between">
        <div>
          <nav className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <Link
              href="/admin/events"
              className="flex items-center gap-1 text-[#7C3AED] hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Kelola Event
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold">Edit Event</span>
          </nav>
          <div className="mt-1 flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight text-gray-900 md:text-3xl">
              Edit Event: {title || "..."}
            </h1>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-extrabold uppercase ${
                currentStatus === "published"
                  ? "bg-emerald-100 text-emerald-800"
                  : currentStatus === "draft"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Status: {currentStatus}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Perbarui rincian konser, kuota tiket, dan konfigurasi denah panggung tanpa kehilangan data.
          </p>
        </div>

        {/* Global Save Actions in Header */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleTriggerSave("draft")}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-50"
          >
            <Save className="h-4 w-4 text-gray-500" />
            Simpan Draft
          </button>

          <button
            type="button"
            onClick={() => handleTriggerSave("publish")}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:opacity-95 disabled:opacity-50"
            style={{
              backgroundImage: "linear-gradient(90deg, #7C3AED 0%, #E91E8C 100%)",
            }}
          >
            <Send className="h-4 w-4" />
            Simpan & Publikasikan
          </button>
        </div>
      </div>

      {/* ================= TOAST / ERROR BANNER ================= */}
      {errorMessage && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 shadow-sm">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <div className="flex-1">
            <p className="font-semibold">Periksa kembali formulir:</p>
            <p className="text-xs text-red-700">{errorMessage}</p>
          </div>
          <button
            onClick={() => setErrorMessage("")}
            className="text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {successToast && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 shadow-sm">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <span className="font-semibold">{successToast}</span>
        </div>
      )}

      {/* ================= STICKY STEP NAVIGATION BAR ================= */}
      <div className="sticky top-2 z-20 mb-8 rounded-2xl border border-gray-200/80 bg-white/95 p-2 shadow-sm backdrop-blur-md">
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-5">
          {steps.map((step) => {
            const isActive = activeStep === step.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  setActiveStep(step.id);
                  const el = document.querySelector(step.anchor);
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold transition ${
                  isActive
                    ? "bg-[#7C3AED] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-extrabold ${
                    isActive ? "bg-white text-[#7C3AED]" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {step.id}
                </span>
                <span className="truncate">{step.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-10">
        {/* ================= SECTION 1: INFORMASI EVENT ================= */}
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
                Ubah poster visual, judul konser, genre musik, dan deskripsi acara.
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
                {shownBanner ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={shownBanner}
                      alt="Banner Event"
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
                      {preview && (
                        <button
                          type="button"
                          onClick={removePoster}
                          className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-red-700"
                        >
                          Batal Ganti
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center p-4 text-center">
                    <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-purple-100 text-[#7C3AED]">
                      <UploadCloud className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-bold text-gray-800">
                      Klik untuk memilih gambar
                    </span>
                    <span className="mt-1 text-[11px] text-gray-500">
                      Maks. 2 MB (JPG, PNG, atau WEBP)
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
                        className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-bold transition ${
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

        {/* ================= SECTION 2: JADWAL & LOKASI ================= */}
        <section
          id="jadwal"
          className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-[#E91E8C]">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">2. Jadwal Konser & Lokasi Venue</h2>
              <p className="text-xs text-gray-500">
                Atur waktu mulai & berakhirnya konser serta titik lokasi tempat pelaksanaan.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-gray-700">
                    Tanggal & Waktu Mulai <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={startAt}
                    onChange={(e) => setStartAt(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-900 outline-none transition focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-gray-700">
                    Tanggal & Waktu Selesai (Opsional)
                  </label>
                  <input
                    type="datetime-local"
                    value={endAt}
                    onChange={(e) => setEndAt(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-900 outline-none transition focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20"
                  />
                </div>
              </div>

              {durationInfo && (
                <div
                  className={`mt-3 flex items-center gap-2 rounded-xl border p-3 text-xs font-semibold ${
                    durationInfo.isValid
                      ? "border-purple-200 bg-purple-50 text-purple-900"
                      : "border-red-200 bg-red-50 text-red-800"
                  }`}
                >
                  <Clock className="h-4 w-4 shrink-0 text-[#7C3AED]" />
                  <span>Jadwal Terhitung: {durationInfo.text}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="relative" ref={cityDropdownRef}>
                <label className="mb-1 block text-xs font-bold text-gray-700">
                  Kota Pelaksanaan <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsCityOpen(!isCityOpen)}
                  className="flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-900 outline-none transition hover:border-gray-400 focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20"
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#7C3AED]" />
                    {city || "Pilih Kota"}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                {isCityOpen && (
                  <div className="absolute left-0 top-full z-30 mt-1 max-h-80 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
                    <div className="p-2.5 border-b border-gray-100 bg-gray-50/50">
                      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-1.5">
                        <Search className="h-3.5 w-3.5 text-gray-400" />
                        <input
                          type="text"
                          value={citySearch}
                          onChange={(e) => setCitySearch(e.target.value)}
                          placeholder="Cari nama kota..."
                          className="w-full text-xs outline-none"
                          autoFocus
                        />
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {POPULAR_CITIES.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => {
                              setCity(c);
                              setIsCityOpen(false);
                            }}
                            className={`rounded-lg px-2 py-0.5 text-[10px] font-bold ${
                              city === c
                                ? "bg-[#7C3AED] text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="max-h-52 overflow-y-auto p-2">
                      {Object.keys(groupedCities).length === 0 ? (
                        <p className="p-4 text-center text-xs text-gray-400">
                          Kota tidak ditemukan
                        </p>
                      ) : (
                        Object.entries(groupedCities).map(([letter, list]) => (
                          <div key={letter} className="mb-2">
                            <span className="px-2 text-[10px] font-extrabold uppercase text-gray-400">
                              {letter}
                            </span>
                            <div className="mt-0.5 space-y-0.5">
                              {list.map((c) => (
                                <button
                                  key={c}
                                  type="button"
                                  onClick={() => {
                                    setCity(c);
                                    setIsCityOpen(false);
                                  }}
                                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                                    city === c
                                      ? "bg-purple-50 font-bold text-[#7C3AED]"
                                      : "text-gray-700 hover:bg-gray-100"
                                  }`}
                                >
                                  <span>{c}</span>
                                  {city === c && (
                                    <Check className="h-3.5 w-3.5 text-[#7C3AED]" />
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">
                  Nama Venue / Gedung <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="Contoh: Stadion Utama Gelora Bung Karno"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-900 outline-none transition focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">
                  Alamat Lengkap Venue
                </label>
                <textarea
                  rows={2}
                  value={venueAddress}
                  onChange={(e) => setVenueAddress(e.target.value)}
                  placeholder="Contoh: Jl. Pintu Satu Senayan, Gelora, Tanah Abang, Jakarta Pusat"
                  className="w-full rounded-xl border border-gray-300 bg-white p-3 text-xs text-gray-800 outline-none transition focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-gray-700">
                  Catatan Akses & Transportasi (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={locationInfo}
                  onChange={(e) => setLocationInfo(e.target.value)}
                  placeholder="Contoh: Gerbang masuk Plaza Barat. Akses shuttle bus tersedia dari Stasiun Palmerah."
                  className="w-full rounded-xl border border-gray-300 bg-white p-3 text-xs text-gray-800 outline-none transition focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 3: PENGATURAN TIKET ================= */}
        <section
          id="tiket"
          className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="mb-6 flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Ticket className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">3. Pengaturan Jenis Tiket</h2>
                <p className="text-xs text-gray-500">
                  Perbarui kategori tiket, harga IDR, kuota penonton, dan periode penjualan.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={addEmptyTicket}
                  className="flex items-center gap-1.5 rounded-xl border border-[#7C3AED] bg-purple-50 px-3.5 py-2 text-xs font-bold text-[#7C3AED] transition hover:bg-purple-100"
                >
                  <Plus className="h-4 w-4" />
                  + Tiket Kustom
                </button>

                <button
                  type="button"
                  onClick={() => setTicketPresetMenuOpen(!ticketPresetMenuOpen)}
                  className="flex items-center gap-1 rounded-xl bg-[#7C3AED] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#6D28D9]"
                >
                  <span>Template Tiket</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>

              {ticketPresetMenuOpen && (
                <div className="absolute right-0 top-full z-20 mt-1 w-64 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl">
                  <p className="px-3 py-1 text-[11px] font-bold uppercase text-gray-400">
                    Pilih Template Kategori
                  </p>
                  <div className="space-y-1">
                    {TICKET_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => addPresetTicket(preset)}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold text-gray-700 transition hover:bg-purple-50 hover:text-[#7C3AED]"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: preset.color }}
                          />
                          <span>{preset.name}</span>
                        </div>
                        <span className="text-[11px] font-bold text-gray-500">
                          {formatRupiah(preset.price)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-gray-100 bg-slate-50 p-3.5">
              <span className="text-[11px] font-bold text-gray-500">Jumlah Jenis Tiket</span>
              <p className="mt-1 text-lg font-black text-gray-900">{tickets.length} Kategori</p>
            </div>
            <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-3.5">
              <span className="text-[11px] font-bold text-purple-700">Total Kuota</span>
              <p className="mt-1 text-lg font-black text-[#7C3AED]">
                {totalQuota.toLocaleString("id-ID")} Tiket
              </p>
            </div>
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3.5">
              <span className="text-[11px] font-bold text-blue-700">Tiket Terjual</span>
              <p className="mt-1 text-lg font-black text-blue-800">
                {totalSold.toLocaleString("id-ID")} Tiket
              </p>
            </div>
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5">
              <span className="text-[11px] font-bold text-emerald-700">
                Estimasi Pendapatan
              </span>
              <p className="mt-1 text-lg font-black text-emerald-800">
                {formatRupiah(totalRevenue)}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {tickets.map((t, idx) => {
              const soldCount = t.sold || 0;
              const hasSold = soldCount > 0;

              return (
                <div
                  key={t.id ?? idx}
                  className="group relative rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:shadow-sm"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: t.color || "#7C3AED" }}
                      />
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        Tiket #{idx + 1}
                      </span>
                      <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-extrabold text-gray-700">
                        {t.name || "Tanpa Nama"}
                      </span>
                      {hasSold && (
                        <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                          {soldCount} Terjual
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-gray-600">
                        <input
                          type="checkbox"
                          checked={t.is_active}
                          onChange={(e) => updateTicket(idx, { is_active: e.target.checked })}
                          className="h-3.5 w-3.5 rounded text-[#7C3AED] focus:ring-[#7C3AED]"
                        />
                        <span>Aktif</span>
                      </label>

                      <button
                        type="button"
                        disabled={tickets.length <= 1 || hasSold}
                        onClick={() => setTicketToDelete(t)}
                        className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                        title={
                          hasSold
                            ? "Tiket yang sudah terjual tidak dapat dihapus."
                            : "Hapus Jenis Tiket"
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
                    <div className="sm:col-span-4">
                      <label className="mb-1 block text-[11px] font-bold text-gray-700">
                        Nama Tiket <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={t.name}
                        onChange={(e) => updateTicket(idx, { name: e.target.value })}
                        placeholder="Contoh: VIP Standing"
                        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-gray-900 outline-none transition focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="mb-1 block text-[11px] font-bold text-gray-700">
                        Harga (IDR) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-xs font-bold text-gray-400">
                          Rp
                        </span>
                        <input
                          type="number"
                          min={0}
                          step={1000}
                          value={t.price}
                          onChange={(e) =>
                            updateTicket(idx, { price: Math.max(0, Number(e.target.value)) })
                          }
                          className="w-full rounded-xl border border-gray-300 bg-white pl-9 pr-3 py-2 text-xs font-bold text-gray-900 outline-none transition focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-4">
                      <div className="flex items-center justify-between">
                        <label className="mb-1 block text-[11px] font-bold text-gray-700">
                          Kuota Tiket <span className="text-red-500">*</span>
                        </label>
                        {hasSold && (
                          <span className="text-[10px] text-gray-500 font-semibold">
                            Min: {soldCount}
                          </span>
                        )}
                      </div>
                      <input
                        type="number"
                        min={hasSold ? soldCount : 1}
                        value={t.quota}
                        onChange={(e) =>
                          updateTicket(idx, {
                            quota: Math.max(hasSold ? soldCount : 1, Number(e.target.value)),
                          })
                        }
                        className={`w-full rounded-xl border bg-white px-3 py-2 text-xs font-bold text-gray-900 outline-none transition focus:ring-1 ${
                          hasSold && t.quota < soldCount
                            ? "border-red-500 focus:border-red-500 focus:ring-red-400"
                            : "border-gray-300 focus:border-[#7C3AED] focus:ring-[#7C3AED]"
                        }`}
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="mb-1 block text-[11px] font-bold text-gray-700">
                        Mulai Penjualan
                      </label>
                      <input
                        type="datetime-local"
                        value={t.sale_start}
                        onChange={(e) => updateTicket(idx, { sale_start: e.target.value })}
                        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-[11px] font-medium text-gray-800 outline-none transition focus:border-[#7C3AED]"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="mb-1 block text-[11px] font-bold text-gray-700">
                        Akhir Penjualan
                      </label>
                      <input
                        type="datetime-local"
                        value={t.sale_end}
                        onChange={(e) => updateTicket(idx, { sale_end: e.target.value })}
                        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-[11px] font-medium text-gray-800 outline-none transition focus:border-[#7C3AED]"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="mb-1 block text-[11px] font-bold text-gray-700">
                        Warna Identifikasi
                      </label>
                      <div className="flex items-center gap-1.5 pt-1">
                        {ZONE_COLORS.map((zc) => (
                          <button
                            key={zc.hex}
                            type="button"
                            onClick={() => updateTicket(idx, { color: zc.hex })}
                            style={{ backgroundColor: zc.hex }}
                            className={`h-5 w-5 rounded-full border-2 transition ${
                              t.color === zc.hex ? "border-gray-900 scale-110" : "border-white"
                            }`}
                            title={zc.label}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="sm:col-span-12">
                      <label className="mb-1 block text-[11px] font-bold text-gray-700">
                        Deskripsi & Keuntungan (Benefit) Tiket
                      </label>
                      <input
                        type="text"
                        value={t.description}
                        onChange={(e) => updateTicket(idx, { description: e.target.value })}
                        placeholder="Contoh: Akses fast-track, free merchandise pack & numbered seating"
                        className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs text-gray-800 outline-none transition focus:border-[#7C3AED] focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= SECTION 4: PENGATURAN DENAH VENUE ================= */}
        <section
          id="denah"
          className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="mb-6 flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">4. Pengaturan Denah Venue (Seating Map)</h2>
                <p className="text-xs text-gray-500">
                  Denah panggung visual berbasis zona interaktif, sinkron dengan kategori tiket.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => applyPresetLayout("standing_seated")}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  layoutPreset === "standing_seated"
                    ? "bg-[#7C3AED] text-white shadow-sm"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                Festival & Tribun
              </button>
              <button
                type="button"
                onClick={() => applyPresetLayout("all_seated")}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  layoutPreset === "all_seated"
                    ? "bg-[#7C3AED] text-white shadow-sm"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                All Seated Arena
              </button>
              <button
                type="button"
                onClick={() => applyPresetLayout("festival_ground")}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  layoutPreset === "festival_ground"
                    ? "bg-[#7C3AED] text-white shadow-sm"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                Festival Ground
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="flex flex-col gap-3 lg:col-span-7">
              <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                <span>Pratinjau Interaktif Denah Panggung</span>
                <span className="text-[11px] font-normal text-gray-500">
                  Klik zona pada denah untuk memilih
                </span>
              </div>

              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-2 shadow-inner">
                {customLayoutImage ? (
                  <div className="relative h-full w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={customLayoutImage}
                      alt="Custom Denah"
                      className="h-full w-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setCustomLayoutImage(null);
                        setCustomImageFile(null);
                      }}
                      className="absolute right-2 top-2 rounded-lg bg-red-600/90 px-2 py-1 text-[10px] font-bold text-white shadow hover:bg-red-700"
                    >
                      Kembali ke SVG Editor
                    </button>
                  </div>
                ) : (
                  <svg
                    viewBox="0 0 800 500"
                    className="h-full w-full select-none"
                  >
                    <defs>
                      <linearGradient id="stageGlowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#E91E8C" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    <path
                      d="M 220 25 L 260 95 L 540 95 L 580 25 Z"
                      fill="url(#stageGlowGradient)"
                    />

                    <rect
                      x="220"
                      y="24"
                      width="360"
                      height="46"
                      rx="8"
                      fill="#1E293B"
                      stroke="#7C3AED"
                      strokeWidth="2"
                    />
                    <text
                      x="400"
                      y="52"
                      fontFamily="sans-serif"
                      fontSize="14"
                      fontWeight="900"
                      fill="#F8FAFC"
                      textAnchor="middle"
                      letterSpacing="3"
                    >
                      ★ PANGGUNG / STAGE ★
                    </text>

                    {zones.map((z) => {
                      const isSelected = selectedZoneId === z.id;
                      return (
                        <g
                          key={z.id}
                          onClick={() => setSelectedZoneId(z.id)}
                          className="cursor-pointer transition-all duration-200"
                        >
                          <rect
                            x={z.x}
                            y={z.y}
                            width={z.width}
                            height={z.height}
                            rx="12"
                            ry="12"
                            fill={z.color}
                            fillOpacity={isSelected ? 0.38 : 0.22}
                            stroke={isSelected ? "#FFFFFF" : z.color}
                            strokeWidth={isSelected ? 3.5 : 2}
                            className="transition-all hover:fill-opacity-40"
                          />
                          <text
                            x={z.x + z.width / 2}
                            y={z.y + z.height / 2 - 6}
                            fontFamily="sans-serif"
                            fontSize="13"
                            fontWeight="800"
                            fill="#F8FAFC"
                            textAnchor="middle"
                          >
                            {z.name}
                          </text>
                          <text
                            x={z.x + z.width / 2}
                            y={z.y + z.height / 2 + 14}
                            fontFamily="sans-serif"
                            fontSize="11"
                            fontWeight="600"
                            fill="#94A3B8"
                            textAnchor="middle"
                          >
                            {z.capacity} Kursi / Kapasitas
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                )}
              </div>

              <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50/60 p-3 text-xs">
                <div>
                  <span className="font-bold text-gray-800">
                    Punya file denah denah resmi sendiri?
                  </span>
                  <p className="text-[11px] text-gray-500">
                    Unggah denah static resmi dari promotor (JPG/PNG/SVG).
                  </p>
                </div>
                <label className="cursor-pointer rounded-xl border border-gray-300 bg-white px-3 py-1.5 font-bold text-gray-700 shadow-sm transition hover:bg-gray-100">
                  Unggah File
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/svg+xml"
                    onChange={handleCustomImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-4 lg:col-span-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700">
                  Daftar Zona Panggung ({zones.length})
                </span>
                <button
                  type="button"
                  onClick={addZone}
                  className="flex items-center gap-1 rounded-xl bg-purple-50 px-2.5 py-1 text-xs font-bold text-[#7C3AED] hover:bg-purple-100"
                >
                  <Plus className="h-3.5 w-3.5" />
                  + Tambah Zona
                </button>
              </div>

              <div className="max-h-96 space-y-2.5 overflow-y-auto pr-1">
                {zones.map((zone) => {
                  const isSelected = selectedZoneId === zone.id;
                  const linkedTicket = tickets.find((t) => t.name === zone.ticketName);
                  const isCapacityMatch =
                    linkedTicket && linkedTicket.quota === zone.capacity;

                  return (
                    <div
                      key={zone.id}
                      onClick={() => setSelectedZoneId(zone.id)}
                      className={`cursor-pointer rounded-xl border p-3.5 transition ${
                        isSelected
                          ? "border-[#7C3AED] bg-purple-50/30 shadow-sm ring-1 ring-[#7C3AED]/30"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: zone.color }}
                          />
                          <span className="text-xs font-bold text-gray-900">
                            {zone.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setZoneToDelete(zone);
                          }}
                          className="text-gray-400 hover:text-red-600"
                          title="Hapus Zona"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {isSelected ? (
                        <div className="mt-3 space-y-2.5 border-t border-purple-100 pt-3">
                          <div>
                            <label className="mb-0.5 block text-[10px] font-bold text-gray-600">
                              Nama Zona
                            </label>
                            <input
                              type="text"
                              value={zone.name}
                              onChange={(e) => updateZone(zone.id, { name: e.target.value })}
                              className="w-full rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs font-semibold text-gray-800 outline-none focus:border-[#7C3AED]"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="mb-0.5 block text-[10px] font-bold text-gray-600">
                                Terhubung ke Tiket
                              </label>
                              <select
                                value={zone.ticketName}
                                onChange={(e) =>
                                  updateZone(zone.id, { ticketName: e.target.value })
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-800 outline-none focus:border-[#7C3AED]"
                              >
                                <option value="">-- Pilih Tiket --</option>
                                {tickets.map((t) => (
                                  <option key={t.id ?? t.name} value={t.name}>
                                    {t.name} (Kuota: {t.quota})
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="mb-0.5 block text-[10px] font-bold text-gray-600">
                                Kapasitas Zona
                              </label>
                              <input
                                type="number"
                                min={1}
                                value={zone.capacity}
                                onChange={(e) =>
                                  updateZone(zone.id, {
                                    capacity: Math.max(1, Number(e.target.value)),
                                  })
                                }
                                className="w-full rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs font-semibold text-gray-800 outline-none focus:border-[#7C3AED]"
                              />
                            </div>
                          </div>

                          {linkedTicket && (
                            <div className="flex items-center gap-1.5 text-[10px]">
                              {isCapacityMatch ? (
                                <span className="flex items-center gap-1 font-bold text-emerald-600">
                                  <Check className="h-3 w-3" />
                                  Kapasitas sesuai kuota tiket ({linkedTicket.quota})
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 font-bold text-amber-600">
                                  <AlertTriangle className="h-3 w-3" />
                                  Selisih: Zona ({zone.capacity}) vs Tiket ({linkedTicket.quota})
                                </span>
                              )}
                            </div>
                          )}

                          <div>
                            <label className="mb-1 block text-[10px] font-bold text-gray-600">
                              Warna Zona Denah
                            </label>
                            <div className="flex items-center gap-1">
                              {ZONE_COLORS.map((zc) => (
                                <button
                                  key={zc.hex}
                                  type="button"
                                  onClick={() => updateZone(zone.id, { color: zc.hex })}
                                  style={{ backgroundColor: zc.hex }}
                                  className={`h-4 w-4 rounded-full border ${
                                    zone.color === zc.hex
                                      ? "border-black scale-125"
                                      : "border-white"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-1 flex items-center justify-between text-[11px] text-gray-500">
                          <span>
                            Tiket: <strong>{zone.ticketName || "Belum dipilih"}</strong>
                          </span>
                          <span>
                            Kapasitas: <strong>{zone.capacity}</strong>
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 5: REVIEW & SIMPAN ================= */}
        <section
          id="review"
          className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-[#7C3AED]">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">5. Ringkasan & Konfirmasi Perubahan</h2>
              <p className="text-xs text-gray-500">
                Tinjau kelengkapan informasi event sebelum menyimpan perubahan.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-8">
              <div className="rounded-2xl border border-gray-200 bg-slate-50/50 p-5">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="relative aspect-[2/1] w-full shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-200 sm:w-48">
                    {shownBanner ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={shownBanner}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400">
                        Poster Event
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-purple-100 px-2.5 py-0.5 text-[10px] font-extrabold text-[#7C3AED]">
                        {CATEGORIES.find((c) => c.id === categoryId)?.name || "Pop"}
                      </span>
                      <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700">
                        {currentStatus === "published" ? "Published" : "Draft"}
                      </span>
                    </div>

                    <h3 className="mt-1.5 text-base font-extrabold text-gray-900">
                      {title || "(Judul Event Belum Diisi)"}
                    </h3>

                    <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-600">
                      <Calendar className="h-3.5 w-3.5 text-[#7C3AED]" />
                      {durationInfo?.text || "Waktu belum diatur"}
                    </p>

                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-600">
                      <MapPin className="h-3.5 w-3.5 text-[#E91E8C]" />
                      {[venue, city].filter(Boolean).join(", ") || "Lokasi belum diatur"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 border-t border-gray-200 pt-4">
                  <h4 className="mb-2 text-xs font-bold text-gray-700">
                    Rincian Kategori Tiket & Potensi Penjualan:
                  </h4>
                  <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 text-[11px] font-bold text-gray-500">
                        <tr>
                          <th className="px-3.5 py-2">Jenis Tiket</th>
                          <th className="px-3.5 py-2">Harga</th>
                          <th className="px-3.5 py-2">Kuota (Terjual)</th>
                          <th className="px-3.5 py-2">Subtotal Potensi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-700">
                        {tickets.map((t, idx) => (
                          <tr key={t.id ?? idx}>
                            <td className="px-3.5 py-2.5 font-bold flex items-center gap-2">
                              <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: t.color }}
                              />
                              {t.name}
                            </td>
                            <td className="px-3.5 py-2.5">{formatRupiah(t.price)}</td>
                            <td className="px-3.5 py-2.5">
                              {t.quota} Tiket{" "}
                              {Boolean(t.sold) && (
                                <span className="font-semibold text-blue-600">
                                  ({t.sold} terjual)
                                </span>
                              )}
                            </td>
                            <td className="px-3.5 py-2.5 font-semibold text-gray-900">
                              {formatRupiah(t.price * t.quota)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 lg:col-span-4">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Daftar Kelayakan Event
                </h4>

                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    {title ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className={title ? "text-gray-800" : "font-bold text-red-600"}>
                      Judul Event terisi
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {startAt ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className={startAt ? "text-gray-800" : "font-bold text-red-600"}>
                      Jadwal Mulai ditentukan
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {venue && city ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className={venue && city ? "text-gray-800" : "font-bold text-red-600"}>
                      Kota & Venue ditentukan
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {tickets.length > 0 ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-gray-800">
                      Minimal 1 jenis tiket ({tickets.length} terdaftar)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {zones.length > 0 ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                    )}
                    <span className="text-gray-800">
                      Denah panggung ({zones.length} zona)
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-2.5">
                  <button
                    type="button"
                    onClick={() => handleTriggerSave("publish")}
                    disabled={saving}
                    className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold text-white shadow-md transition hover:opacity-95 disabled:opacity-50"
                    style={{
                      backgroundImage: "linear-gradient(90deg, #7C3AED 0%, #E91E8C 100%)",
                    }}
                  >
                    <Send className="h-4 w-4" />
                    {saving ? "Menyimpan..." : "Simpan & Publikasikan"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTriggerSave("draft")}
                    disabled={saving}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white py-2.5 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4 text-gray-500" />
                    Simpan Sebagai DRAFT
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ================= CONFIRMATION MODAL (SAVE / PUBLISH) ================= */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-full ${
                  saveAction === "publish"
                    ? "bg-purple-100 text-[#7C3AED]"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {saveAction === "publish" ? (
                  <Send className="h-5 w-5" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {saveAction === "publish"
                    ? "Simpan & Publikasikan Perubahan?"
                    : "Simpan Event Sebagai Draft?"}
                </h3>
                <p className="text-xs text-gray-500">
                  {saveAction === "publish"
                    ? "Perubahan informasi event akan langsung aktif dan diperbarui di CuanTix."
                    : "Event akan disimpan dalam status draft."}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-gray-100 bg-slate-50 p-3 text-xs space-y-1">
              <p>
                <strong>Judul:</strong> {title}
              </p>
              <p>
                <strong>Lokasi:</strong> {venue}, {city}
              </p>
              <p>
                <strong>Total Kuota:</strong> {totalQuota.toLocaleString("id-ID")} tiket
              </p>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="rounded-xl border border-gray-300 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={saving}
                className="rounded-xl px-5 py-2 text-xs font-bold text-white shadow transition hover:opacity-95"
                style={{
                  backgroundImage: "linear-gradient(90deg, #7C3AED 0%, #E91E8C 100%)",
                }}
              >
                {saving ? "Menyimpan..." : "Ya, Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL CONFIRM DELETE TICKET ================= */}
      {ticketToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">Hapus Jenis Tiket?</h3>
            </div>
            <p className="mt-2 text-xs text-gray-600">
              Apakah Anda yakin ingin menghapus kategori tiket{" "}
              <strong>&quot;{ticketToDelete.name}&quot;</strong>? Zona denah yang terhubung
              ke tiket ini akan dilepas.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setTicketToDelete(null)}
                className="rounded-xl border border-gray-300 px-3.5 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteTicket}
                className="rounded-xl bg-red-600 px-4 py-1.5 text-xs font-bold text-white shadow hover:bg-red-700"
              >
                Hapus Tiket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL CONFIRM DELETE ZONE ================= */}
      {zoneToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">Hapus Zona Denah?</h3>
            </div>
            <p className="mt-2 text-xs text-gray-600">
              Apakah Anda yakin ingin menghapus zona <strong>&quot;{zoneToDelete.name}&quot;</strong> dari
              denah panggung?
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setZoneToDelete(null)}
                className="rounded-xl border border-gray-300 px-3.5 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteZone}
                className="rounded-xl bg-red-600 px-4 py-1.5 text-xs font-bold text-white shadow hover:bg-red-700"
              >
                Hapus Zona
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
