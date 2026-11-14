import Image from "next/image";
import Link from "next/link";
import GradientIcon, { type GradientIconType } from "@/components/icon/GradientIcon";

const GRADIENT = "linear-gradient(90deg, #7C3AED 0%, #E91E8C 100%)";

const PAYMENT_METHODS = [
  { name: "QRIS", image: "/image/payment/qris.png" },
  { name: "BCA", image: "/image/payment/bca.png" },
  { name: "Mandiri", image: "/image/payment/mandiri.png" },
  { name: "BRI", image: "/image/payment/bri.png" },
  { name: "BNI", image: "/image/payment/bni.png" },
  { name: "BTN", image: "/image/payment/btn.png" },
  { name: "BSI", image: "/image/payment/bsi.png" },
  { name: "Permata", image: "/image/payment/permata.png" },
  { name: "VISA", image: "/image/payment/visa.png" },
  { name: "Mastercard", image: "/image/payment/mastercard.png" },
  { name: "ShopeePay", image: "/image/payment/spay.png" },
  { name: "Gopay", image: "/image/payment/gopay.png" },
  { name: "Indodana", image: "/image/payment/indodana.png" },
  { name: "senangPay", image: "/image/payment/senangpay.png" },
  { name: "Indomaret", image: "/image/payment/indomaret.png" },
  { name: "Alfamart", image: "/image/payment/alfamart.png" },
];

const SOCIALS: { name: string; type: GradientIconType; href: string }[] = [
  { name: "Instagram", type: "instagram", href: "#" },
  { name: "TikTok", type: "tiktok", href: "#" },
  { name: "X", type: "x", href: "#" },
  { name: "Facebook", type: "facebook", href: "#" },
  { name: "YouTube", type: "youtube", href: "#" },
  { name: "LinkedIn", type: "linkedin", href: "#" },
];

const HEADING =
  "bg-gradient-to-r from-[#7C3AED] to-[#E91E8C] bg-clip-text text-sm font-bold text-transparent";
const LINK = "text-[13px] font-medium text-gray-900 transition-colors hover:text-[#E91E8C]";
const BOX_BORDER = "1px solid #C084FC";

export default function Footer() {
  return (
    <footer className="mt-16 w-full bg-white px-4 pb-6 sm:px-8 lg:px-16">
      {/* BORDER GRADIENT */}
      <div
        className="rounded-2xl p-[1.5px]"
        style={{ backgroundImage: GRADIENT }}
      >
        <div className="rounded-[14px] bg-white px-6 py-8 sm:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1.1fr]">
            {/* ===== KOLOM 1: BRAND ===== */}
            <div>
            <Image
              src="/image/logo-cuantix.png"
              alt="Cuantix"
              width={220}
              height={60}
              className="h-12 w-auto object-contain sm:h-14"
            />
              <p className="mt-4 max-w-[220px] text-[13px] leading-relaxed text-gray-900">
                Temukan konser favoritmu, pesan tiket dengan mudah, dan nikmati
                setiap momen bersama Cuantix.
              </p>

              <h4 className={`${HEADING} mt-8`}>Keamanan Dan Privasi</h4>
              <div className="mt-3">
                <GradientIcon type="shieldCheck" size={40} />
              </div>

              <h4 className={`${HEADING} mt-6`}>Temukan Kami:</h4>
              <div className="mt-3 flex items-center gap-2.5">
                <a href="#" className="transition-opacity hover:opacity-85">
                  <Image
                    src="/image/appstore.png"
                    alt="Download on App Store"
                    width={120}
                    height={36}
                    className="h-9 w-auto object-contain"
                  />
                </a>
                <a href="#" className="transition-opacity hover:opacity-85">
                  <Image
                    src="/image/googleplay.png"
                    alt="Get it on Google Play"
                    width={120}
                    height={36}
                    className="h-9 w-auto object-contain"
                  />
                </a>
              </div>
            </div>

            {/* ===== KOLOM 2: TENTANG + SOSMED ===== */}
            <div>
              <h4 className={HEADING}>Tentang Cuantix</h4>
              <ul className="mt-3 space-y-2.5">
                <li><a href="#" className={LINK}>Tentang Kami</a></li>
                <li><a href="#" className={LINK}>Blog</a></li>
              </ul>

              <h4 className={`${HEADING} mt-8`}>Update Kami</h4>
              <div className="mt-3 flex max-w-[260px] flex-wrap gap-2">
                {SOCIALS.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    aria-label={s.name}
                    className="flex h-9 w-9 items-center justify-center rounded-md bg-white transition-transform hover:-translate-y-0.5"
                    style={{ border: BOX_BORDER }}
                  >
                    <GradientIcon type={s.type} size={20} />
                  </a>
                ))}
              </div>
            </div>

            {/* ===== KOLOM 3: BUAT EVENT ===== */}
            <div>
              <h4 className={HEADING}>Buat Event</h4>
              <ul className="mt-3 space-y-2.5">
                <li><a href="#" className={LINK}>Biaya</a></li>
                <li><a href="#" className={LINK}>Kerjasama Dengan Kami</a></li>
                <li><a href="#" className={LINK}>Buku Panduan Kreator</a></li>
              </ul>
            </div>

            {/* ===== KOLOM 4: DUKUNGAN ===== */}
            <div>
              <h4 className={HEADING}>Dukungan</h4>
              <ul className="mt-3 space-y-2.5">
                <li><a href="#" className={LINK}>Pusat Bantuan</a></li>
                <li><a href="#" className={LINK}>Syarat & Ketentuan</a></li>
                <li><a href="#" className={LINK}>Kebijakan Privasi</a></li>
                <li><a href="#" className={LINK}>Kepatuhan Keamanan & Privasi</a></li>
                <li><a href="#" className={LINK}>Kebijakan Cookies</a></li>
              </ul>
            </div>

            {/* ===== KOLOM 5: PEMBAYARAN ===== */}
            <div>
              <h4 className={HEADING}>Pilihan Pembayaran</h4>
              <div className="mt-3 grid max-w-[260px] grid-cols-4 gap-2">
                {PAYMENT_METHODS.map((p) => (
                  <div
                    key={p.name}
                    title={p.name}
                    className="flex h-9 items-center justify-center rounded-md bg-white p-1"
                    style={{ border: BOX_BORDER }}
                  >
                    <Image
                      src={p.image}
                      alt={p.name}
                      width={40}
                      height={20}
                      className="max-h-5 w-auto object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ===== COPYRIGHT ===== */}
          <p className="mt-10 text-center text-xs font-bold text-gray-900">
            © {new Date().getFullYear()} Cuantix Team. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}