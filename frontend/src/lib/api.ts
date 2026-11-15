/**
 * Helper untuk memanggil backend Cuantix.
 * Token dan data user disimpan oleh halaman login di localStorage
 * (key "token" dan "user"), jadi helper ini membaca dari sana.
 */

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// Bentuk data user bergantung pada respons login dari backend — sesuaikan field-nya
export type StoredUser = {
  id?: number | string;
  name?: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
};

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Contoh pemakaian:
 *   const orders = await api<Order[]>("/api/orders");
 *   await api("/api/orders", { method: "POST", body: JSON.stringify({ ... }) });
 */
export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  // Token kedaluwarsa / tidak valid → paksa login ulang.
  // Hanya jika memang ada token, supaya salah password di halaman login tidak ikut ter-redirect.
  if (res.status === 401 && token && typeof window !== "undefined") {
    clearSession();
    window.location.href = "/auth/login";
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body?.message ?? body?.error ?? `Permintaan gagal (${res.status})`, res.status);
  }

  return res.json() as Promise<T>;
}