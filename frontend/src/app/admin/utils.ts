export function formatDateIndonesian(dateString: string | null | undefined): string {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch {
    return "-";
  }
}

export function formatDateTimeIndonesian(dateString: string | null | undefined): string {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return "-";
  }
}

export function formatCurrencyRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export const SUBMISSION_STATUS_CONFIG: Record<
  string,
  { label: string; badgeClass: string; dotClass: string }
> = {
  pending_review: {
    label: "Menunggu Review",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200/80",
    dotClass: "bg-amber-500",
  },
  needs_revision: {
    label: "Perlu Revisi",
    badgeClass: "bg-orange-50 text-orange-700 border-orange-200/80",
    dotClass: "bg-orange-500",
  },
  approved: {
    label: "Disetujui",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    dotClass: "bg-emerald-500",
  },
  rejected: {
    label: "Ditolak",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200/80",
    dotClass: "bg-rose-500",
  },
  draft: {
    label: "Draft",
    badgeClass: "bg-slate-50 text-slate-600 border-slate-200/80",
    dotClass: "bg-slate-400",
  },
};

export const EVENT_STATUS_CONFIG: Record<
  string,
  { label: string; badgeClass: string; dotClass: string }
> = {
  published: {
    label: "Aktif",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    dotClass: "bg-emerald-500",
  },
  draft: {
    label: "Draft",
    badgeClass: "bg-slate-50 text-slate-600 border-slate-200/80",
    dotClass: "bg-slate-400",
  },
  cancelled: {
    label: "Dibatalkan",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200/80",
    dotClass: "bg-rose-500",
  },
  finished: {
    label: "Selesai",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
    dotClass: "bg-indigo-500",
  },
};
