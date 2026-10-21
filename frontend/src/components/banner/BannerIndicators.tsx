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
    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onSelect(index)}
          aria-label={`Banner ${index + 1}`}
          aria-current={activeIndex === index ? "true" : undefined}
          className={`h-2 rounded-full transition-all duration-300 ${
            activeIndex === index ? "bg-white" : "bg-white/50"
          } w-2`}
        />
      ))}
    </div>
  );
}