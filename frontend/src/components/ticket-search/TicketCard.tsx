
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Undo2,
  Ticket,
  CalendarClock,
} from "lucide-react";

const GRADIENT =
  "linear-gradient(90deg, #7C3AED 0%, #E91E8C 100%)";

const GRADIENT_CSS_TEXT: React.CSSProperties = {
  backgroundImage: GRADIENT,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  WebkitTextFillColor: "transparent",
};

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

type TicketCardProps = {
  ticket: TicketResult;
};

function formatRupiah(value: number): string {
  return `Rp.${value.toLocaleString("id-ID")}`;
}

export default function TicketCard({ ticket }: TicketCardProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() =>
        router.push(`/detail-pembelian-tiket/${ticket.id}`)
      }
      aria-label={`Lihat detail tiket ${ticket.ticketType}`}
      className="group flex flex-col overflow-hidden rounded-[14px] text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{
        border: "1.5px solid transparent",
        backgroundImage: `linear-gradient(white, white), ${GRADIENT}`,
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
      }}
    >
      {/* EVENT IMAGE */}
      <div className="relative aspect-[2/1] w-full overflow-hidden bg-black">
        <Image
          src={ticket.eventImage}
          alt={ticket.ticketType}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex-1 px-4 py-3.5">
        {/* TICKET TYPE */}
        <h3
          className="text-sm font-extrabold sm:text-base"
          style={GRADIENT_CSS_TEXT}
        >
          {ticket.ticketType}
        </h3>

        {/* TOTAL TICKETS */}
        <p className="mt-2 text-xs text-gray-900 sm:text-sm">
          <span className="font-bold">
            Total ({ticket.totalTickets} Tiket):
          </span>{" "}
          <span className="font-bold" style={GRADIENT_CSS_TEXT}>
            {formatRupiah(ticket.pricePerTicket)}
          </span>
        </p>

        {/* SELECTED DATE */}
        <div className="mt-2.5 border-t border-pink-100 pt-2.5">
          <p className="text-xs font-bold text-gray-900 sm:text-sm">
            Tanggal yang Dipilih:
          </p>

          <p
            className="mt-0.5 text-xs font-bold sm:text-sm"
            style={GRADIENT_CSS_TEXT}
          >
            {ticket.selectedDate}
          </p>
        </div>

        {/* TICKET INFORMATION */}
        <div className="mt-2.5 space-y-2 border-t border-pink-100 pt-2.5">
          {/* VENUE */}
          <div className="flex items-center gap-2">
            <MapPin
              className="h-4 w-4 shrink-0"
              style={{
                stroke: "url(#icon-gradient)",
                fill: "url(#icon-gradient)",
              }}
            />

            <span
              className="text-xs font-semibold sm:text-sm"
              style={GRADIENT_CSS_TEXT}
            >
              {ticket.venue}
            </span>
          </div>

          {/* REFUND POLICY */}
          <div className="flex items-center gap-2">
            <Undo2
              className="h-4 w-4 shrink-0"
              style={{ stroke: "url(#icon-gradient)" }}
            />

            <span
              className="text-xs font-semibold sm:text-sm"
              style={GRADIENT_CSS_TEXT}
            >
              {ticket.refundPolicy}
            </span>
          </div>

          {/* CONFIRMATION TYPE */}
          <div className="flex items-center gap-2">
            <Ticket
              className="h-4 w-4 shrink-0"
              style={{ stroke: "url(#icon-gradient)" }}
            />

            <span
              className="text-xs font-semibold sm:text-sm"
              style={GRADIENT_CSS_TEXT}
            >
              {ticket.confirmationType}
            </span>
          </div>

          {/* VALID DATE */}
          <div className="flex items-center gap-2">
            <CalendarClock
              className="h-4 w-4 shrink-0"
              style={{ stroke: "url(#icon-gradient)" }}
            />

            <span
              className="text-xs font-semibold sm:text-sm"
              style={GRADIENT_CSS_TEXT}
            >
              {ticket.validOn}
            </span>
          </div>
        </div>
      </div>

      {/* DIVIDER BAR */}
      <div
        className="h-1.5 w-full"
        style={{ backgroundImage: GRADIENT }}
      />

      {/* TOTAL PAYMENT */}
      <div className="px-4 py-3.5">
        <p className="text-xs text-gray-800 sm:text-sm">
          Total Pembayaran:
        </p>

        <p
          className="mt-0.5 text-base font-extrabold sm:text-lg"
          style={GRADIENT_CSS_TEXT}
        >
          {formatRupiah(ticket.totalPayment)}
        </p>
      </div>
    </button>
  );
}
