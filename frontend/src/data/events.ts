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