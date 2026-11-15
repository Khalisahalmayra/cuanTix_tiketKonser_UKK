"use client";

import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { CameraOff } from "lucide-react";

interface QrScannerProps {
  /** Scanner berhenti membaca saat false (mis. sedang menampilkan hasil). */
  active: boolean;
  onDetect: (rawValue: string) => void;
}

export default function QrScanner({ active, onDetect }: QrScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onDetectRef = useRef(onDetect);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    onDetectRef.current = onDetect;
  }, [onDetect]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let raf = 0;
    let cancelled = false;

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError(
          "Kamera tidak tersedia. Pastikan halaman dibuka lewat HTTPS (atau localhost)."
        );
        return;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        const video = videoRef.current;
        if (!video) return;
        video.srcObject = stream;
        await video.play();
        setReady(true);
        setCameraError(null);
        tick();
      } catch {
        setCameraError(
          "Izin kamera ditolak atau kamera tidak ditemukan. Izinkan akses kamera di browser, atau gunakan input kode manual."
        );
      }
    }

    function tick() {
      raf = requestAnimationFrame(tick);
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) return;

      const w = video.videoWidth;
      const h = video.videoHeight;
      if (!w || !h) return;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, w, h);
      const frame = ctx.getImageData(0, 0, w, h);
      const result = jsQR(frame.data, w, h, { inversionAttempts: "dontInvert" });
      if (result?.data) onDetectRef.current(result.data);
    }

    // Kamera hanya menyala selama scanner aktif.
    if (active) {
      start();
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((t) => t.stop());
      setReady(false);
    };
  }, [active]);

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-[20px] bg-black">
      <video
        ref={videoRef}
        playsInline
        muted
        className="h-full w-full object-cover"
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* bingkai bidik */}
      {active && ready && !cameraError && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative h-[62%] w-[62%]">
            <span className="absolute left-0 top-0 h-8 w-8 rounded-tl-xl border-l-4 border-t-4 border-[#E91E8C]" />
            <span className="absolute right-0 top-0 h-8 w-8 rounded-tr-xl border-r-4 border-t-4 border-[#E91E8C]" />
            <span className="absolute bottom-0 left-0 h-8 w-8 rounded-bl-xl border-b-4 border-l-4 border-[#7C3AED]" />
            <span className="absolute bottom-0 right-0 h-8 w-8 rounded-br-xl border-b-4 border-r-4 border-[#7C3AED]" />
          </div>
        </div>
      )}

      {active && !ready && !cameraError && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-white/80">
          Membuka kamera...
        </div>
      )}

      {!active && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-sm text-white/80">
          Scanner dijeda
        </div>
      )}

      {cameraError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-zinc-900 p-6 text-center text-sm text-white/80">
          <CameraOff className="h-8 w-8" />
          {cameraError}
        </div>
      )}
    </div>
  );
}