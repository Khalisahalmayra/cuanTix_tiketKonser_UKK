/**
 * Format angka atau string ke format mata uang Rupiah (IDR).
 */
export function formatRupiah(value: number | ""): string {
  if (value === "" || isNaN(Number(value))) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

/**
 * Format tanggal dan waktu ke format lokal bahasa Indonesia dengan zona waktu WIB.
 */
export function formatIndonesianDateTime(dateStr: string, timeStr: string): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(`${dateStr}T${timeStr || "00:00"}`);
    if (isNaN(d.getTime())) return `${dateStr} ${timeStr}`;
    return (
      new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(d) + " WIB"
    );
  } catch {
    return `${dateStr} ${timeStr}`;
  }
}
