// Layanan chat. Sekarang memakai penyimpanan lokal (localStorage) + balasan otomatis
// supaya tampilan bisa dicoba tanpa backend.
// TODO: setelah Supabase siap, ganti `chatService` di bawah dengan implementasi
// Supabase Realtime (lihat supabase_chat.sql). Antarmuka `ChatService` tidak perlu diubah,
// jadi ChatWidget tidak ikut berubah.

export type ChatMessage = {
  id: string;
  sender: "user" | "support";
  text: string;
  createdAt: number;
};

export interface ChatService {
  load(): Promise<ChatMessage[]>;
  send(text: string): Promise<ChatMessage>;
  /** Dipanggil setiap ada pesan baru dari tim (support). Mengembalikan fungsi berhenti. */
  subscribe(onMessage: (message: ChatMessage) => void): () => void;
}

const STORAGE_KEY = "cuantix_chat_messages";
const AUTO_REPLY =
  "Terima kasih, pesanmu sudah kami terima. Tim Cuantix akan membalas secepatnya.";

const listeners = new Set<(message: ChatMessage) => void>();

function newId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function read(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ChatMessage[]) : [];
  } catch {
    return [];
  }
}

function write(messages: ChatMessage[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {}
}

export const chatService: ChatService = {
  async load() {
    const existing = read();
    if (existing.length > 0) return existing;

    const welcome: ChatMessage = {
      id: newId(),
      sender: "support",
      text: "Halo! Ada yang bisa kami bantu seputar tiket atau pembayaran?",
      createdAt: Date.now(),
    };
    write([welcome]);
    return [welcome];
  },

  async send(text) {
    const message: ChatMessage = {
      id: newId(),
      sender: "user",
      text,
      createdAt: Date.now(),
    };
    write([...read(), message]);

    // Balasan otomatis sementara (hapus saat sudah memakai backend sungguhan)
    setTimeout(() => {
      const reply: ChatMessage = {
        id: newId(),
        sender: "support",
        text: AUTO_REPLY,
        createdAt: Date.now(),
      };
      write([...read(), reply]);
      listeners.forEach((cb) => cb(reply));
    }, 1200);

    return message;
  },

  subscribe(onMessage) {
    listeners.add(onMessage);
    return () => {
      listeners.delete(onMessage);
    };
  },
};