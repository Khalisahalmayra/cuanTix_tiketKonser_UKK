
/**
 * Helper untuk memanggil backend CuanTix
 * Menggunakan session cookie untuk autentikasi.
 */

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));

    throw new ApiError(
      body?.message ?? body?.error ?? `Permintaan gagal (${res.status})`,
      res.status
    );
  }

  return res.json() as Promise<T>;
}
