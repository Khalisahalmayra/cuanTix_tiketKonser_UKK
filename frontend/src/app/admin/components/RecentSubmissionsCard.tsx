"use client";

import Link from "next/link";
import { ArrowRight, Inbox, Eye } from "lucide-react";
import { Submission } from "../types";
import { formatDateIndonesian, SUBMISSION_STATUS_CONFIG } from "../utils";

interface RecentSubmissionsCardProps {
  submissions: Submission[];
}

export function RecentSubmissionsCard({
  submissions,
}: RecentSubmissionsCardProps) {
  const pendingCount = submissions.filter(
    (s) => s.status === "pending_review"
  ).length;

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200/80 bg-white shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 p-5">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base font-bold text-slate-900">
            Pengajuan Event Terbaru
          </h2>
          {pendingCount > 0 && (
            <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
              {pendingCount} Menunggu
            </span>
          )}
        </div>
        <Link
          href="/admin/pengajuan-event"
          className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 transition hover:text-purple-700"
        >
          <span>Lihat Semua</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Konten */}
      <div className="flex-1 p-5">
        {submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Inbox className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-700">
              Belum Ada Pengajuan Event
            </p>
            <p className="mt-1 text-xs text-slate-400 max-w-xs">
              Pengajuan event dari customer akan tampil di sini untuk ditinjau.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {submissions.map((sub) => {
              const statusCfg =
                SUBMISSION_STATUS_CONFIG[sub.status] ||
                SUBMISSION_STATUS_CONFIG.draft;

              return (
                <div
                  key={sub.id}
                  className="flex flex-col gap-2 py-3.5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {sub.title}
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

                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span>
                        Oleh:{" "}
                        <strong className="font-medium text-slate-700">
                          {sub.users?.name || "Customer"}
                        </strong>
                      </span>
                      {sub.city && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span>{sub.city}</span>
                        </>
                      )}
                      <span className="text-slate-300">•</span>
                      <span>Diajukan {formatDateIndonesian(sub.created_at)}</span>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center pt-2 sm:pt-0">
                    <Link
                      href={`/admin/pengajuan-event/${sub.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50/50 px-3 py-1.5 text-xs font-semibold text-purple-700 transition hover:bg-purple-100/70 hover:border-purple-300"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Review</span>
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
