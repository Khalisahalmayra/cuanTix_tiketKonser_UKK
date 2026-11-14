type BannerIndicatorsProps = {
  total: number;
  activeIndex: number;
  onSelect: (index: number) => void;
};

export default function BannerIndicators({
  total,
  activeIndex,
  onSelect,
}: BannerIndicatorsProps) {
  return (
    <div className="absolute bottom-3.5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/30 px-3 py-1.5 backdrop-blur-xs">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onSelect(index)}
          aria-label={`Slide ke-${index + 1}`}
          aria-current={activeIndex === index ? "true" : undefined}
          className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
            activeIndex === index
              ? "w-6 bg-white"
              : "w-1.5 bg-white/50 hover:bg-white/80"
          }`}
        />
      ))}
    </div>
  );
}
