import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Event } from "@/data/events";

type EventCardProps = {
  event: Event;
};

export default function EventCard({ event }: EventCardProps) {
  return (
    <Link
      href={`/event/${event.slug}`}
      className="group flex flex-col h-full overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-purple-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
    >
      {/* GAMBAR EVENT */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* CATEGORY BADGE */}
        {event.category && (
          <span className="absolute top-2.5 right-2.5 rounded-full bg-white/90 backdrop-blur-xs px-2.5 py-0.5 text-[11px] font-semibold text-[#7C3AED] shadow-xs">
            {event.category}
          </span>
        )}
      </div>

      {/* INFORMASI EVENT */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          {/* LOKASI */}
          <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
            <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <span className="truncate">Kota {event.location}</span>
          </div>

          {/* JUDUL */}
          <h3 className="mt-1.5 text-sm sm:text-[15px] font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#7C3AED] transition-colors">
            {event.title}
          </h3>

          {/* ORGANIZER */}
          <p className="mt-1 text-xs text-gray-500 truncate">
            Oleh {event.organizer}
          </p>
        </div>

        {/* HARGA DAN TIKET */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-gray-400 font-medium">
              Harga Mulai
            </span>
            <span className="text-xs sm:text-sm font-bold text-gray-900">
              {event.price}
            </span>
          </div>

          <span className="shrink-0 rounded-md bg-purple-50 px-2 py-0.5 text-[11px] font-medium text-[#7C3AED]">
            {event.tickets}
          </span>
        </div>
      </div>
    </Link>
  );
}
