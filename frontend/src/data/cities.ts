export const KOTA_LIST: string[] = [
  "Jakarta",
  "Surabaya",
  "Bandung",
  "Medan",
  "Semarang",
  "Makassar",
  "Palembang",
  "Tangerang",
  "Depok",
  "Bekasi",
  "Bogor",
  "Yogyakarta",
  "Malang",
  "Denpasar",
  "Batam",
  "Pekanbaru",
  "Bandar Lampung",
  "Padang",
  "Banjarmasin",
  "Samarinda",
  "Balikpapan",
  "Pontianak",
  "Manado",
  "Jayapura",
];

export const POPULAR_CITIES: string[] = [
  "Jakarta",
  "Bandung",
  "Surabaya",
  "Yogyakarta",
  "Denpasar",
  "Medan",
];

export type GroupedKota = Record<string, string[]>;

export function groupByLetter(list: string[]): GroupedKota {
  const sorted = [...list].sort((a, b) => a.localeCompare(b));
  const groups: GroupedKota = {};
  for (const kota of sorted) {
    const letter = kota[0].toUpperCase();
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(kota);
  }
  return groups;
}

export function filterCities(list: string[], query: string): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter((city) => city.toLowerCase().includes(q));
}

