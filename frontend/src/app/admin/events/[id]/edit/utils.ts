import { SeatingZone, DurationInfo } from "./types";

export const toLocalInput = (iso?: string | null): string => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

export const formatRupiah = (val: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(val);
};

export const calculateDuration = (
  startAt: string,
  endAt: string
): DurationInfo | null => {
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
};

export const generateSvgString = (zones: SeatingZone[]): string => {
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
