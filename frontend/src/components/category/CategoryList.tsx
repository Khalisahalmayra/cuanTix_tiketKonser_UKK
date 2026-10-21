"use client";

import GradientIcon, { type GradientIconType } from "@/components/icon/GradientIcon";

const SEARCH_BORDER_GRADIENT =
  "linear-gradient(90deg, #7C3AED 0%, #E91E8C 100%)";

const CATEGORIES: { name: string; icon: GradientIconType }[] = [
  { name: "Semua", icon: "listFilter" },
  { name: "Rock", icon: "handMetal" },
  { name: "Pop", icon: "disc" },
  { name: "Indie", icon: "music" },
  { name: "EDM", icon: "radio" },
  { name: "Jazz", icon: "mic" },
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
    <section className="w-full px-5 pt-8 sm:px-8 lg:px-16">
      <div className="scrollbar-hide flex items-center justify-center gap-3 overflow-x-auto pb-2">
        {CATEGORIES.map((category) => {
          const active = activeCategory === category.name;

          return (
            <button
              key={category.name}
              type="button"
              onClick={() => onCategoryChange(category.name)}
              aria-pressed={active}
              className="group flex h-[65px] min-w-[65px] flex-col items-center justify-center gap-1.5 rounded-[10px] border-2 transition-all duration-200 sm:min-w-[66px]"
              style={{
                border: "2px solid transparent",
                backgroundImage: `
                  linear-gradient(
                    ${active ? "#F3EBFF" : "white"},
                    ${active ? "#F3EBFF" : "white"}
                  ),
                  ${SEARCH_BORDER_GRADIENT}
                `,
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
              }}
            >
              <span className="transition-transform duration-200 group-hover:scale-110">
                <GradientIcon type={category.icon} size={24} />
              </span>

              <span
                className={`text-[11px] font-semibold ${
                  active ? "text-[#6D28D9]" : "text-[#A21CAF]"
                }`}
              >
                {category.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}