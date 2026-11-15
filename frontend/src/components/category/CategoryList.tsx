"use client";

import GradientIcon, { type GradientIconType } from "@/components/icon/GradientIcon";

type CategoryItem = {
  name: string;
  icon: GradientIconType;
  accent: string;
  bgSoft: string;
  bgActive: string;
  borderSoft: string;
  borderActive: string;
  textColor: string;
  textActive: string;
};

const CATEGORIES: CategoryItem[] = [
  {
    name: "Semua",
    icon: "listFilter",
    accent: "#7C3AED",
    bgSoft: "#FAF5FF",     // Soft purple tint
    bgActive: "#F3E8FF",   // Active soft purple
    borderSoft: "#E9D5FF",
    borderActive: "#7C3AED",
    textColor: "#4C1D95",
    textActive: "#5B21B6",
  },
  {
    name: "Rock",
    icon: "handMetal",
    accent: "#F97316",
    bgSoft: "#FFF7ED",     // Soft orange tint
    bgActive: "#FFEDD5",   // Active soft orange
    borderSoft: "#FED7AA",
    borderActive: "#F97316",
    textColor: "#9A3412",
    textActive: "#C2410C",
  },
  {
    name: "Pop",
    icon: "disc",
    accent: "#E91E8C",
    bgSoft: "#FDF2F8",     // Soft pink tint
    bgActive: "#FCE7F3",   // Active soft pink
    borderSoft: "#FBCFE8",
    borderActive: "#E91E8C",
    textColor: "#9D174D",
    textActive: "#BE185D",
  },
  {
    name: "Indie",
    icon: "music",
    accent: "#8B5CF6",
    bgSoft: "#F5F3FF",     // Soft violet tint
    bgActive: "#EDE9FE",   // Active soft violet
    borderSoft: "#DDD6FE",
    borderActive: "#8B5CF6",
    textColor: "#5B21B6",
    textActive: "#6D28D9",
  },
  {
    name: "EDM",
    icon: "radio",
    accent: "#3B82F6",
    bgSoft: "#EFF6FF",     // Soft blue tint
    bgActive: "#DBEAFE",   // Active soft blue
    borderSoft: "#BFDBFE",
    borderActive: "#3B82F6",
    textColor: "#1E40AF",
    textActive: "#1D4ED8",
  },
  {
    name: "Jazz",
    icon: "mic",
    accent: "#0D9488",
    bgSoft: "#F0FDFA",     // Soft teal tint
    bgActive: "#CCFBF1",   // Active soft teal
    borderSoft: "#99F6E4",
    borderActive: "#0D9488",
    textColor: "#115E59",
    textActive: "#0F766E",
  },
];

type CategoryListProps = {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
};

export default function CategoryList({
  activeCategory,
  onCategoryChange,
}: CategoryListProps) {
  return (
    <section id="kategori" className="w-full">
      <div className="mx-auto max-w-[1320px] px-5 py-4 sm:px-8 md:px-10 lg:px-14 xl:px-16 sm:py-6">
        <div className="flex items-center justify-start sm:justify-center gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-none pt-1">
          {CATEGORIES.map((category) => {
            const active = activeCategory === category.name;

            return (
              <button
                key={category.name}
                type="button"
                onClick={() => onCategoryChange(category.name)}
                aria-pressed={active}
                className={`group relative flex h-[88px] w-[98px] sm:h-[96px] sm:w-[114px] md:w-[124px] flex-col items-center justify-center gap-2 rounded-2xl transition-all duration-200 shrink-0 cursor-pointer ${
                  active
                    ? "scale-[1.03] shadow-sm"
                    : "hover:-translate-y-1 hover:shadow-md"
                }`}
                style={{
                  backgroundColor: active ? category.bgActive : category.bgSoft,
                  border: active
                    ? `2.5px solid ${category.borderActive}`
                    : `1.5px solid ${category.borderSoft}`,
                }}
              >
                {/* ICON DENGAN WARNA IDENTITAS MASING-MASING */}
                <span className="transition-transform duration-200 group-hover:scale-110">
                  <GradientIcon
                    type={category.icon}
                    size={26}
                    color={category.accent}
                  />
                </span>

                {/* LABEL DENGAN TEKS KONTRAS */}
                <span
                  className={`text-xs sm:text-[13px] tracking-tight transition-colors ${
                    active ? "font-bold" : "font-semibold"
                  }`}
                  style={{
                    color: active ? category.textActive : category.textColor,
                  }}
                >
                  {category.name}
                </span>

                {/* INDIKATOR AKTIF SUBTLE */}
                {active && (
                  <span
                    className="absolute -bottom-1 h-1 w-6 rounded-full"
                    style={{ backgroundColor: category.accent }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
