export type Event = {
  id: string;
  slug: string;
  title: string;
  image: string;
  poster: string;
  location: string;
  venue: string;
  organizer: string;
  category: string;
  price: string;
  tickets: string;
  soldCount: number;
  date: string;
  createdAt: string;
};

const API_URL = "http://localhost:4000";

export async function fetchEvents(): Promise<Event[]> {
  const res = await fetch(`${API_URL}/api/events`);
  if (!res.ok) throw new Error("Gagal mengambil event");
  return res.json();
}

export type TicketType = {
  id: number;
  name: string;
  price: number;
  available: number;
};

export type EventDetail = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  image: string;
  poster: string;
  city: string;
  venue: string | null;
  date: string;
  category: string;
  organizer: string;
  tickets: TicketType[];
};

export async function fetchEventDetail(slug: string): Promise<EventDetail> {
  const res = await fetch(`${API_URL}/api/events/${slug}`);
  if (!res.ok) throw new Error("Event tidak ditemukan");
  return res.json();
}