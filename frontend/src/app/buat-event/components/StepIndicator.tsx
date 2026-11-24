"use client";

import React from "react";
import { Check } from "lucide-react";
import { GradientIconType } from "@/components/icon/GradientIcon";
import { StepNumber } from "../types";
import { BRAND_GRADIENT } from "../constants";

type StepIndicatorProps = {
  currentStep: StepNumber;
  onStepClick: (step: StepNumber) => void;
};

const STEPS_CONFIG = [
  {
    num: 1 as StepNumber,
    title: "Informasi Event",
    desc: "Nama, Kategori, Media",
    icon: "megaphone" as GradientIconType,
  },
  {
    num: 2 as StepNumber,
    title: "Jadwal & Lokasi",
    desc: "Waktu, Kota, Venue",
    icon: "calendar" as GradientIconType,
  },
  {
    num: 3 as StepNumber,
    title: "Jenis Tiket",
    desc: "Kategori & Kuota",
    icon: "ticket" as GradientIconType,
  },
  {
    num: 4 as StepNumber,
    title: "Review Pengajuan",
    desc: "Konfirmasi & Kirim",
    icon: "checkCircle" as GradientIconType,
  },
];

export function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs sm:p-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {STEPS_CONFIG.map((step) => {
          const isActive = currentStep === step.num;
          const isCompleted = currentStep > step.num;

          return (
            <button
              key={step.num}
              type="button"
              onClick={() => onStepClick(step.num)}
              className={`flex items-center gap-3 rounded-xl p-3 text-left transition-all ${
                isActive
                  ? "bg-[#FAF5FF] border border-[#5B1AA8]/40 shadow-xs"
                  : isCompleted
                  ? "hover:bg-gray-50 border border-transparent cursor-pointer"
                  : "opacity-60 border border-transparent cursor-default"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-transform ${
                  isCompleted
                    ? "bg-emerald-500 text-white"
                    : isActive
                    ? "text-white shadow-sm"
                    : "bg-gray-100 text-gray-500"
                }`}
                style={isActive ? { background: BRAND_GRADIENT } : undefined}
              >
                {isCompleted ? <Check className="h-5 w-5 stroke-[2.5]" /> : step.num}
              </div>

              <div className="min-w-0">
                <p
                  className={`text-xs font-bold truncate ${
                    isActive ? "text-[#5B1AA8]" : "text-gray-800"
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-[11px] text-gray-400 truncate hidden sm:block">
                  {step.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
