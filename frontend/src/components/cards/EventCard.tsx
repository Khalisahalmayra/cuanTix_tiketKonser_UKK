import Image from "next/image";
import Link from "next/link";
import type { Event } from "@/data/events";

type EventCardProps = {
  event: Event;
};

export default function EventCard({ event }: EventCardProps) {
  return (
    <Link
      href="/detail-tiket"
      className="group block overflow-hidden rounded-[8px] border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
    >
      {/* GAMBAR EVENT */}
      <div className="relative aspect-[1.9/1] overflow-hidden bg-gray-100">
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>

      {/* INFORMASI EVENT */}
      <div className="px-3 py-2.5">
        <p className="text-[10px] text-gray-500">
          Kota {event.location}
        </p>

        <h3 className="mt-1 text-[12px] font-bold text-gray-900">
          {event.title}
        </h3>

        <p className="mt-1 text-[10px] text-gray-500">
          Oleh {event.organizer}
        </p>

        {/* HARGA DAN TIKET */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <p className="text-[10px] font-medium text-gray-900">
            {event.price}
          </p>

          <p className="whitespace-nowrap text-[8px] text-gray-500">
            {event.tickets}
          </p>
        </div>
      </div>
    </Link>
  );
}