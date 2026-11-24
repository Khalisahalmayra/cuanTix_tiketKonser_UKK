"use client";

import Link from "next/link";
import { ArrowRight, CalendarX, Edit3, Music } from "lucide-react";
import { AdminEvent } from "../types";
import { formatDateIndonesian, EVENT_STATUS_CONFIG } from "../utils";

interface RecentEventsCardProps {
  events: AdminEvent[];
}

export function RecentEventsCard({ events }: RecentEventsCardProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200/80 bg-white shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 p-5">
        <h2 className="text-base font-bold text-slate-900">Event Terbaru</h2>
        <Link
          href="/admin/events"
          className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 transition hover:text-purple-700"
        >
          <span>Kelola Event</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Konten */}
      <div className="flex-1 p-5">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <CalendarX className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-700">
              Belum Ada Event Terdaftar
            </p>
            <p className="mt-1 text-xs text-slate-400 max-w-xs">
              Event yang Anda tambahkan atau setujui akan muncul di sini.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {events.map((evt) => {
              const statusCfg =
                EVENT_STATUS_CONFIG[evt.status] || EVENT_STATUS_CONFIG.draft;
              const categoryName = evt.categories?.name || "Event";

              return (
                <div
                  key={evt.id}
                  className="flex flex-col gap-3 py-3.5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Visual Fallback Poster Thumbnail */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-[#E91E8C] text-white shadow-xs">
                      <Music className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {evt.title}
                        </p>
                        <span
                          className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusCfg.badgeClass}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${statusCfg.dotClass}`}
                          />
                          {statusCfg.label}
                        </span>
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-500">
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-1.5 py-0.5 font-medium text-slate-600">
                          {categoryName}
                        </span>
                        {evt.city && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span>{evt.city}</span>
                          </>
                        )}
                        <span className="text-slate-300">•</span>
                        <span>{formatDateIndonesian(evt.start_at)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center pt-2 sm:pt-0">
                    <Link
                      href={`/admin/events/${evt.id}/edit`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300"
                    >
                      <Edit3 className="h-3.5 w-3.5 text-slate-500" />
                      <span>Edit</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
