"use client";

import { useState } from "react";
import GradientIcon from "@/components/icon/GradientIcon";
import type { Faq } from "./data";

const BORDER_GRADIENT = "linear-gradient(90deg,#7C3AED 0%,#E91E8C 100%)";

type FaqListProps = {
  items: Faq[];
};

export default function FaqList({ items }: FaqListProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <ul className="flex flex-col gap-3">
      {items.map((faq) => {
        const isOpen = openId === faq.id;
        const panelId = `faq-panel-${faq.id}`;

        return (
          <li
            key={faq.id}
            className="overflow-hidden rounded-[12px]"
            style={{
              border: "1.5px solid transparent",
              backgroundImage: `linear-gradient(${isOpen ? "#FBF7FF" : "white"}, ${
                isOpen ? "#FBF7FF" : "white"
              }), ${BORDER_GRADIENT}`,
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
            }}
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="text-[15px] font-semibold text-gray-900">{faq.question}</span>
              <span
                className="shrink-0 transition-transform duration-200"
                style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
              >
                <GradientIcon type="chevronDown" size={20} />
              </span>
            </button>

            {isOpen && (
              <div
                id={panelId}
                role="region"
                className="px-5 pb-5 text-[14px] leading-[1.65] text-gray-700"
              >
                {faq.answer}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}