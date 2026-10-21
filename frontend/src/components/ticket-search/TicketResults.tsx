"use client";

import { Ticket } from "lucide-react";
import TicketCard from "@/components/ticket-search/TicketCard";

export type TicketResult = {
  id: string;
  eventImage: string;
  ticketType: string;
  totalTickets: number;
  pricePerTicket: number;
  selectedDate: string;
  venue: string;
  refundPolicy: string;
  confirmationType: string;
  validOn: string;
  totalPayment: number;
};

const DUMMY_TICKETS: TicketResult[] = [
  {
    id: "1",
    eventImage: "/image/snada-event.png",
    ticketType: "DIAMOND SPOT A",
    totalTickets: 1,
    pricePerTicket: 6000000,
    selectedDate: "Senin, 10 Agustus 2026",
    venue: "Istora Senayan, Jakarta Pusat",
    refundPolicy: "Pengembalian dana tidak diperbolehkan.",
    confirmationType: "Konfirmasi Instan",
    validOn: "Berlaku pada 10 Agustus 2026",
    totalPayment: 6000000,
  },
  {
    id: "2",
    eventImage: "/image/snada-event.png",
    ticketType: "DIAMOND SPOT A",
    totalTickets: 1,
    pricePerTicket: 6000000,
    selectedDate: "Senin, 10 Agustus 2026",
    venue: "Istora Senayan, Jakarta Pusat",
    refundPolicy: "Pengembalian dana tidak diperbolehkan.",
    confirmationType: "Konfirmasi Instan",
    validOn: "Berlaku pada 10 Agustus 2026",
    totalPayment: 6000000,
  },
];

type TicketResultsProps = {
  tickets?: TicketResult[];
};

export default function TicketResults({
  tickets = DUMMY_TICKETS,
}: TicketResultsProps) {
  if (tickets.length === 0) {
    return (
      <div className="mt-16 flex flex-col items-center justify-center text-center">
        <Ticket className="h-12 w-12 text-gray-300" />

        <p className="mt-4 text-sm font-semibold text-gray-700">
          Tidak ada tiket ditemukan
        </p>

        <p className="mt-1 max-w-sm text-xs text-gray-500">
          Periksa kembali No. Telp dan Nama Lengkap yang kamu masukkan,
          lalu coba lagi.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}