"use client";

import { useRouter } from "next/navigation";
import GradientIcon from "@/components/icon/GradientIcon";
import { CONTACT } from "./data";

const BORDER_GRADIENT = "linear-gradient(90deg,#7C3AED 0%,#E91E8C 100%)";
const BUTTON_GRADIENT = "linear-gradient(90deg,#E91E8C 0%,#6D28D9 100%)";

export default function ContactCta() {
  const router = useRouter();

  const linkClass =
    "flex items-center gap-3 rounded-[10px] bg-white px-4 py-3 text-[14px] font-semibold text-[#5B1AA8] transition-colors hover:bg-[#F3EBFF]";
  const linkStyle = {
    border: "1.5px solid transparent",
    backgroundImage: `linear-gradient(white, white), ${BORDER_GRADIENT}`,
    backgroundOrigin: "border-box",
    backgroundClip: "padding-box, border-box",
  } as const;

  return (
    <section
      className="rounded-[20px] bg-[#FBF7FF] p-6 sm:p-8"
      style={{ border: "1px solid #E4D3F8" }}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-[460px]">
          <h2 className="text-[20px] font-bold text-gray-900">Masih butuh bantuan?</h2>
          <p className="mt-1 text-[14px] text-gray-700">
            Tidak menemukan jawabanmu? Tim Cuantix siap membantu lewat email,
            WhatsApp, atau formulir Hubungi Kami.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
          <a href={`mailto:${CONTACT.email}`} className={linkClass} style={linkStyle}>
            <GradientIcon type="mail" size={22} />
            {CONTACT.email}
          </a>

          <a
            href={CONTACT.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
            style={linkStyle}
          >
            <GradientIcon type="whatsapp" size={22} />
            {CONTACT.phoneDisplay}
          </a>

          <button
            type="button"
            onClick={() => router.push(CONTACT.contactPage)}
            className="flex items-center justify-center gap-2 rounded-[10px] px-6 py-3 text-[14px] font-semibold text-white shadow-md transition-opacity hover:opacity-90"
            style={{ background: BUTTON_GRADIENT }}
          >
            <GradientIcon type="send" size={18} color="#ffffff" />
            Hubungi Kami
          </button>
        </div>
      </div>
    </section>
  );
}