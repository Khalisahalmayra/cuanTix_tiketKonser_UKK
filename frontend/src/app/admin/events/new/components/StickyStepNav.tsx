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
    <div className="sticky top-2 z-20 mb-8 rounded-2xl border border-gray-200/80 bg-white/95 p-2 shadow-sm backdrop-blur-md">
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-5">
        {STEPS.map((step) => {
          const isActive = activeStep === step.id;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => {
                setActiveStep(step.id);
                const el = document.querySelector(step.anchor);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold transition cursor-pointer ${
                isActive
                  ? "bg-[#7C3AED] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-extrabold ${
                  isActive ? "bg-white text-[#7C3AED]" : "bg-gray-200 text-gray-700"
                }`}
              >
                {step.id}
              </span>
              <span className="truncate">{step.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
