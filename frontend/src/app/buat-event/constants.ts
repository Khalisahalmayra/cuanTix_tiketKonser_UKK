import { Category } from "./types";

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const BRAND_GRADIENT = "linear-gradient(90deg, #5B1AA8 0%, #E91E8C 100%)";

export const FALLBACK_CATEGORIES: Category[] = [
  { id: 1, name: "Rock" },
  { id: 2, name: "Pop" },
  { id: 3, name: "Indie" },
  { id: 4, name: "EDM" },
  { id: 5, name: "Jazz" },
];
