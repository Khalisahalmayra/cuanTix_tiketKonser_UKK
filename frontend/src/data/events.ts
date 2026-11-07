export type Event = {
  id: string;
  image: string;
  location: string;
  title: string;
  organizer: string;
  price: string;
  tickets: string;
  soldCount: number;
  createdAt: string;
  date: string;
  category: string;
};

export const EVENTS: Event[] = [
  {
    id: "1",
    image: "/image/snada-event.png",
    location: "Jakarta",
    title: "Senada Indonesia - 2026",
    organizer: "Sucor Sekuritas & OPPAL",
    price: "Rp 75.000 - 1.500.000",
    tickets: "301 Tiket Tersedia",
    soldCount: 1200,
    createdAt: "2026-09-01",
    date: "2026-12-20",
    category: "Pop",
  },
  {
    id: "2",
    image: "/image/snada-event.png",
    location: "Bandung",
    title: "Konser B",
    organizer: "Penyelenggara B",
    price: "Rp 250.000",
    tickets: "120 Tiket Tersedia",
    soldCount: 300,
    createdAt: "2026-11-01",
    date: "2027-01-15",
    category: "Rock",
  },
  {
    id: "3",
    image: "/image/snada-event.png",
    location: "Surabaya",
    title: "Konser C",
    organizer: "Penyelenggara C",
    price: "Rp 450.000",
    tickets: "80 Tiket Tersedia",
    soldCount: 800,
    createdAt: "2026-10-10",
    date: "2027-02-10",
    category: "Pop",
  },
  {
    id: "4",
    image: "/image/snada-event.png",
    location: "Bali",
    title: "Konser D",
    organizer: "Penyelenggara D",
    price: "Rp 500.000",
    tickets: "45 Tiket Tersedia",
    soldCount: 150,
    createdAt: "2026-11-05",
    date: "2027-03-05",
    category: "EDM",
  },
];