import GradientIcon from "@/components/icon/GradientIcon";

export type EventCredit = {
  label: string;
  value: string;
};

type EventDescriptionProps = {
  /** Paragraf deskripsi event */
  description: string[];
  /** Daftar nama artis / pengisi acara */
  lineup: string[];
  /** Info tambahan, mis. Musical Collaboration, Dance Performance, dll */
  credits?: EventCredit[];
};

export default function EventDescription({
  description,
  lineup,
  credits = [],
}: EventDescriptionProps) {
  return (
    <section id="deskripsi" className="mt-8 scroll-mt-24">
      <h2 className="mb-6 flex items-center gap-4 text-xl font-bold">
        <GradientIcon type="info" size={25} />
        Deskripsi
      </h2>

      <div className="space-y-5 text-[15px] leading-[1.65]">
        {/* DESKRIPSI */}
        {description.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}

        {/* PENGISI ACARA */}
        {lineup.length > 0 && (
          <div>
            <h3 className="mb-3 flex items-center gap-2 font-bold">
              <GradientIcon type="mic" size={18} />
              Pengisi Acara
            </h3>

            <ul className="flex flex-wrap gap-2">
              {lineup.map((name) => (
                <li
                  key={name}
                  className="rounded-full border border-purple-300 bg-purple-50 px-4 py-1.5 text-sm font-semibold text-purple-800"
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* INFO TAMBAHAN */}
        {credits.length > 0 && (
          <dl className="space-y-1 text-sm">
            {credits.map((credit) => (
              <div key={credit.label} className="flex flex-wrap gap-x-2">
                <dt className="font-bold">{credit.label}:</dt>
                <dd>{credit.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}