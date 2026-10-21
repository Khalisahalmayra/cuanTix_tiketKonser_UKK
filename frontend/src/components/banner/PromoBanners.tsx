
import Image from "next/image";

const PROMO_BANNERS = [
  "/image/promo-gojek.png",
  "/image/promo-bayar-makin-praktis.png",
  "/image/promo-shower-fresh.png",
];

export default function PromoBanners() {
  return (
    <section className="w-full px-5 pb-12 pt-8 sm:px-8 lg:px-16">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {PROMO_BANNERS.map((banner, index) => (
          <div
            key={banner}
            className="group relative aspect-[2.5/1] overflow-hidden rounded-[12px] bg-zinc-100"
          >
            <Image
              src={banner}
              alt={`Promo ${index + 1}`}
              fill
              sizes="(max-width: 767px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
