"use client";

import GradientIcon from "@/components/icon/GradientIcon";
import { HELP_CATEGORIES } from "./data";

const BORDER_GRADIENT = "linear-gradient(90deg,#7C3AED 0%,#E91E8C 100%)";

type HelpCategoriesProps = {
  /** id kategori aktif, atau "semua" */
  active: string;
  onChange: (id: string) => void;
};

export default function HelpCategories({ active, onChange }: HelpCategoriesProps) {
  const items = [
    { id: "semua", label: "Semua", icon: "listFilter" as const },
    ...HELP_CATEGORIES,
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
      {items.map((item) => {
        const isActive = active === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            aria-pressed={isActive}
            className="group flex min-h-[96px] flex-col items-center justify-center gap-2 rounded-[12px] px-2 py-3 text-center transition-all duration-200 hover:-translate-y-0.5"
            style={{
              border: "2px solid transparent",
              backgroundImage: `linear-gradient(${isActive ? "#F3EBFF" : "white"}, ${
                isActive ? "#F3EBFF" : "white"
              }), ${BORDER_GRADIENT}`,
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
            }}
          >
            <span className="transition-transform duration-200 group-hover:scale-110">
              <GradientIcon type={item.icon} size={28} />
            </span>
            <span
              className={`text-[12px] font-semibold leading-tight ${
                isActive ? "text-[#6D28D9]" : "text-[#A21CAF]"
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}