"use client";

const formatTimer = (total: number) => {
  const m = Math.floor(total / 60).toString().padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${m}.${s}`;
};

export default function PaymentTimerBar({
  secondsLeft,
}: {
  secondsLeft: number | null;
}) {
  const expired = secondsLeft === 0;

  return (
    <div className="mx-auto max-w-[1450px] px-5 pt-6 lg:px-10">
      <div
        role="timer"
        className={`flex items-center justify-center gap-10 rounded-lg px-6 py-4 text-sm font-bold text-white ${
          expired ? "bg-gray-500" : "bg-gradient-to-r from-purple-800 to-pink-500"
        }`}
      >
        {expired ? (
          <span>Waktu pembayaran habis. Silakan pesan ulang tiketmu.</span>
        ) : (
          <>
            <span>{secondsLeft === null ? "--.--" : formatTimer(secondsLeft)}</span>
            <span>Sisa waktu untuk melakukan pembayaran</span>
          </>
        )}
      </div>
    </div>
  );
}