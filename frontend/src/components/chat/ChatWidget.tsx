"use client";

import { useEffect, useRef, useState } from "react";
import GradientIcon from "@/components/icon/GradientIcon";
import { chatService, ChatMessage } from "@/lib/chatService";

// Kirim event ini dari mana saja untuk membuka jendela chat:
// window.dispatchEvent(new Event(OPEN_CHAT_EVENT))
export const OPEN_CHAT_EVENT = "cuantix:open-chat";

const GRADIENT = "linear-gradient(135deg,#5B1AA8 0%,#8A2A9C 55%,#E2408A 100%)";

const QUICK_REPLIES = [
  "Cara membeli tiket",
  "Kendala pembayaran",
  "E-tiket belum masuk",
];

const formatTime = (timestamp: number) =>
  new Date(timestamp).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [unread, setUnread] = useState(0);
  const [sending, setSending] = useState(false);

  const openRef = useRef(open);
  openRef.current = open;
  const bottomRef = useRef<HTMLDivElement>(null);

  // Muat riwayat chat dan dengarkan balasan baru
  useEffect(() => {
    let active = true;

    chatService.load().then((list) => {
      if (active) setMessages(list);
    });

    const unsubscribe = chatService.subscribe((message) => {
      setMessages((prev) => [...prev, message]);
      if (!openRef.current) setUnread((n) => n + 1);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  // Buka dari tempat lain (mis. menu Pusat Bantuan di navbar)
  useEffect(() => {
    const handleOpen = () => {
      setOpen(true);
      setUnread(0);
    };
    window.addEventListener(OPEN_CHAT_EVENT, handleOpen);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, handleOpen);
  }, []);

  // Selalu scroll ke pesan terbaru
  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const toggle = () => {
    setOpen((v) => !v);
    setUnread(0);
  };

  const sendMessage = async (value: string) => {
    const content = value.trim();
    if (!content || sending) return;

    setSending(true);
    setText("");
    try {
      const sent = await chatService.send(content);
      setMessages((prev) => [...prev, sent]);
    } finally {
      setSending(false);
    }
  };

  const showQuickReplies = messages.length <= 1;

  return (
    <div
      className="fixed bottom-5 right-5 z-[60]"
      style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}
    >
      {/* ================= JENDELA CHAT ================= */}
      {open && (
        <div
          role="dialog"
          aria-label="Chat dengan Cuantix"
          className="absolute bottom-[72px] right-0 flex h-[480px] max-h-[calc(100vh-110px)] w-[340px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        >
          {/* Header */}
          <div
            className="flex items-center justify-between gap-3 px-4 py-3 text-white"
            style={{ background: GRADIENT }}
          >
            <div className="min-w-0">
              <p className="text-sm font-bold">Chat Cuantix</p>
              <p className="text-[11px] opacity-90">
                Tim kami siap membantu kamu
              </p>
            </div>
            <button
              onClick={toggle}
              aria-label="Tutup chat"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/20"
            >
              <GradientIcon type="close" size={18} color="#ffffff" />
            </button>
          </div>

          {/* Pesan */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-[#FBF7FF] px-4 py-4">
            {messages.map((m) => {
              const mine = m.sender === "user";
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${mine ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2 text-[13px] leading-snug ${
                      mine
                        ? "rounded-br-sm text-white"
                        : "rounded-bl-sm bg-white text-gray-800 shadow-sm"
                    }`}
                    style={mine ? { background: GRADIENT } : undefined}
                  >
                    {m.text}
                  </div>
                  <span className="mt-1 text-[10px] text-gray-400">
                    {formatTime(m.createdAt)}
                  </span>
                </div>
              );
            })}

            {showQuickReplies && (
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="rounded-full border border-pink-400 bg-white px-3 py-1.5 text-xs font-semibold text-purple-800 transition hover:bg-pink-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-gray-200 bg-white px-3 py-3">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(text);
                }
              }}
              placeholder="Tulis pesan..."
              maxLength={500}
              className="h-10 flex-1 rounded-full border border-pink-300 px-4 text-sm outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
            />
            <button
              onClick={() => sendMessage(text)}
              disabled={!text.trim() || sending}
              aria-label="Kirim pesan"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-opacity disabled:opacity-40"
              style={{ background: GRADIENT }}
            >
              <GradientIcon type="send" size={18} color="#ffffff" />
            </button>
          </div>
        </div>
      )}

      {/* ================= TOMBOL MENGAMBANG ================= */}
      <button
        onClick={toggle}
        aria-label={open ? "Tutup chat" : "Buka chat"}
        aria-expanded={open}
        className="relative flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105"
        style={{ background: GRADIENT }}
      >
        <GradientIcon
          type={open ? "close" : "messageSquare"}
          size={24}
          color="#ffffff"
        />
        {!open && unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-pink-600 shadow">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
    </div>
  );
}