import Image from "next/image";

import GradientIcon, { type GradientIconType } from "@/components/icon/GradientIcon";

const GRADIENT =
  "linear-gradient(90deg, #7C3AED 0%, #E91E8C 100%)";

const PAYMENT_METHODS = [
  { name: "BRI", image: "/image/payment/bri.png" },
  { name: "BCA", image: "/image/payment/bca.png" },
  { name: "Mandiri", image: "/image/payment/mandiri.png" },
  { name: "BRI", image: "/image/payment/bri.png" },
  { name: "BNI", image: "/image/payment/bni.png" },
  { name: "BTN", image: "/image/payment/btn.png" },
  { name: "BSI", image: "/image/payment/bsi.png" },
  { name: "Permata", image: "/image/payment/permata.png" },
  { name: "VISA", image: "/image/payment/visa.png" },
  { name: "Mastercard", image: "/image/payment/mastercard.png" },
  { name: "QRIS", image: "/image/payment/qris.png" },
  { name: "Gopay", image: "/image/payment/gopay.png" },
  { name: "Indodana", image: "/image/payment/indodana.png" },
  { name: "senangPay", image: "/image/payment/senangpay.png" },
  { name: "indomaret", image: "/image/payment/indomaret.png" },
  { name: "Alfamart", image: "/image/payment/alfamart.png" },
];

const SOCIALS: { name: string; type: GradientIconType }[] = [
  { name: "Instagram", type: "instagram" },
  { name: "TikTok", type: "tiktok" },
  { name: "X", type: "x" },
  { name: "Facebook", type: "facebook" },
  { name: "YouTube", type: "youtube" },
  { name: "LinkedIn", type: "linkedin" },
];

export default function Footer() {
  return (
    <footer
      className="mx-4 mb-4 mt-10 rounded-[10px] bg-white px-8 pt-8 pb-4 sm:mx-6 lg:mx-14"
      style={{
        border: "1.5px solid transparent",
        backgroundImage: `
          linear-gradient(white, white),
          ${GRADIENT}
        `,
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
      }}
    >
      {/* ================= TOP CONTENT ================= */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr_1fr_1.1fr]">

        {/* ================= BRAND ================= */}
        <div>
          <Image
            src="/image/logo-cuantix.png"
            alt="Cuantix"
            width={155}
            height={50}
            className="h-auto w-[150px] object-contain"
          />

          <p className="mt-5 max-w-[230px] text-[16px] leading-[1.45] text-gray-900">
            Temukan konser favoritmu,
            <br />
            pesan tiket dengan mudah,
            <br />
            dan nikmati setiap momen
            <br />
            bersama Cuantix.
          </p>

          {/* ================= KEAMANAN ================= */}
          <div className="mt-10">
            <h3 className="text-[16px] font-bold">
              <span
                style={{
                  background: GRADIENT,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Keamanan Dan Privasi
              </span>
            </h3>

            <div className="mt-5 flex justify-center">
              <GradientIcon type="shieldCheck" size={48} />
            </div>
          </div>

          {/* ================= APP DOWNLOAD ================= */}
          <div className="mt-10">
            <h3 className="text-[16px] font-bold">
              <span
                style={{
                  background: GRADIENT,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Temukan Kami:
              </span>
            </h3>

            <div className="mt-5 flex gap-2">
              <Image
                src="/image/appstore.png"
                alt="Download on App Store"
                width={165}
                height={50}
                className="h-[46px] w-auto object-contain"
              />

              <Image
                src="/image/googleplay.png"
                alt="Get it on Google Play"
                width={165}
                height={50}
                className="h-[46px] w-auto object-contain"
              />
            </div>
          </div>
        </div>

        {/* ================= TENTANG ================= */}
        <div>
          <h3
            className="text-[16px] font-bold"
            style={{
              background: GRADIENT,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Tentang Cuantix
          </h3>

          <div className="mt-3 space-y-3 text-[15px] text-gray-900">
            <a
              href="#"
              className="block transition-colors hover:text-[#E91E8C]"
            >
              Tentang Kami
            </a>

            <a
              href="#"
              className="block transition-colors hover:text-[#E91E8C]"
            >
              Blog
            </a>
          </div>

          {/* ================= SOCIAL ================= */}
          <div className="mt-10">
            <h3
              className="text-[16px] font-bold"
              style={{
                background: GRADIENT,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Update Kami
            </h3>

            <div className="mt-4 flex flex-wrap gap-3">
              {SOCIALS.map((social) => {
                return (
                  <a
                    key={social.name}
                    href="#"
                    aria-label={social.name}
                    className="flex h-11 w-11 items-center justify-center rounded-[5px] border-2 border-transparent bg-white transition-all duration-200 hover:bg-[#F3EBFF] hover:-translate-y-0.5"
                    style={{
                      backgroundImage: `
                        linear-gradient(white, white),
                        ${GRADIENT}
                      `,
                      backgroundOrigin: "border-box",
                      backgroundClip: "padding-box, border-box",
                    }}
                  >
                    <GradientIcon type={social.type} size={24} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================= BUAT EVENT ================= */}
        <div>
          <h3
            className="text-[16px] font-bold"
            style={{
              background: GRADIENT,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Buat Event
          </h3>

          <div className="mt-3 space-y-3 text-[15px] text-gray-900">
            <a
              href="#"
              className="block transition-colors hover:text-[#E91E8C]"
            >
              Biaya
            </a>

            <a
              href="#"
              className="block transition-colors hover:text-[#E91E8C]"
            >
              Kerjasama Dengan
              <br />
              Kami
            </a>

            <a
              href="#"
              className="block transition-colors hover:text-[#E91E8C]"
            >
              Buku Panduan Kreator
            </a>
          </div>
        </div>

        {/* ================= DUKUNGAN ================= */}
        <div>
          <h3
            className="text-[16px] font-bold"
            style={{
              background: GRADIENT,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Dukungan
          </h3>

          <div className="mt-3 space-y-3 text-[15px] text-gray-900">
            <a
              href="#"
              className="block transition-colors hover:text-[#E91E8C]"
            >
              Pusat Bantuan
            </a>

            <a
              href="#"
              className="block transition-colors hover:text-[#E91E8C]"
            >
              Syarat & Ketentuan
            </a>

            <a
              href="#"
              className="block transition-colors hover:text-[#E91E8C]"
            >
              Kebijakan Privasi
            </a>

            <a
              href="#"
              className="block transition-colors hover:text-[#E91E8C]"
            >
              Kepatuhan Keamanan
              <br />
              & Privasi
            </a>

            <a
              href="#"
              className="block transition-colors hover:text-[#E91E8C]"
            >
              Kebijakan Cookies
            </a>
          </div>
        </div>

        {/* ================= PAYMENT ================= */}
        <div>
          <h3
            className="text-[16px] font-bold"
            style={{
              background: GRADIENT,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Pilihan Pembayaran
          </h3>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {PAYMENT_METHODS.map((payment, index) => (
              <div
                key={`${payment.name}-${index}`}
                className="flex h-[44px] items-center justify-center rounded-[4px] border-2 border-transparent bg-white p-1 transition-all duration-200 hover:bg-[#F3EBFF]"
                style={{
                  backgroundImage: `
                    linear-gradient(white, white),
                    ${GRADIENT}
                  `,
                  backgroundOrigin: "border-box",
                  backgroundClip: "padding-box, border-box",
                }}
              >
                <Image
                  src={payment.image}
                  alt={payment.name}
                  width={45}
                  height={28}
                  className="max-h-[28px] w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= COPYRIGHT ================= */}
      <div className="mt-12 flex justify-center pt-2">
        <p className="text-[15px] font-semibold text-gray-900">
          © Cuantix Team. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}