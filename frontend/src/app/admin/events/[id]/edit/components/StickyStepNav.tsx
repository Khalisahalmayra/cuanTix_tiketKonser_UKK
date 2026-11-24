"use client";

import React from "react";
import { STEPS } from "../constants";

interface StickyStepNavProps {
  activeStep: number;
  setActiveStep: (step: number) => void;
}

export function StickyStepNav({
  activeStep,
  setActiveStep,
}: StickyStepNavProps) {
  return (
    <div className="sticky top-2 z-20 mb-8 rounded-2xl border border-gray-200/80 bg-white/95 p-1.5 shadow-md backdrop-blur-md">
      <div className="grid grid-cols-5 gap-1 text-center">
        {STEPS.map((s) => {
          const isActive = activeStep === s.id;
          return (
            <a
              key={s.id}
              href={s.anchor}
              onClick={() => setActiveStep(s.id)}
              className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition ${
                isActive
                  ? "bg-[#7C3AED] text-white shadow-sm"
                  : "text-gray-600 hover:bg-purple-50 hover:text-[#7C3AED]"
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black ${
                  isActive ? "bg-white text-[#7C3AED]" : "bg-gray-100 text-gray-500"
                }`}
              >
                {s.id}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
