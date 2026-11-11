import type { GradientIconType } from "@/components/icon/GradientIcon";

export type HelpCategory = {
  id: string;
  label: string;
  icon: GradientIconType;
};

export type Faq = {
  id: string;
  category: string;
  question: string;
  answer: string;
};

// TODO: sesuaikan seluruh isi dengan kebijakan resmi Cuantix / ambil dari API

export const HELP_CATEGORIES: HelpCategory[] = [
  { id: "pembelian", label: "Pembelian Tiket", icon: "ticket" },
  { id: "pembayaran", label: "Pembayaran", icon: "creditCard" },
  { id: "eticket", label: "E-Tiket & Masuk Venue", icon: "qrCode" },
  { id: "refund", label: "Refund & Penukaran", icon: "wallet" },
  { id: "akun", label: "Akun & Keamanan", icon: "lock" },
  { id: "buat-event", label: "Buat Event", icon: "megaphone" },
];

export const FAQS: Faq[] = [
  // ---------- Pembelian ----------
  {
    id: "beli-1",
    category: "pembelian",
    question: "Bagaimana cara membeli tiket konser di Cuantix?",
    answer:
      "Cari konser yang kamu mau lewat kolom pencarian, buka halaman detail event, lalu pilih kategori tiket dan klik Beli Tiket. Isi data pemesan, pilih metode pembayaran, dan selesaikan pembayaran sebelum batas waktu yang ditampilkan.",
  },
  {
    id: "beli-2",
    category: "pembelian",
    question: "Berapa maksimal tiket yang bisa dibeli dalam satu transaksi?",
    answer:
      "Batas pembelian ditentukan oleh penyelenggara masing-masing event. Cek bagian Syarat & Ketentuan di halaman detail event untuk batas yang berlaku.",
  },
  {
    id: "beli-3",
    category: "pembelian",
    question: "Apakah harga yang tertera sudah termasuk pajak dan biaya admin?",
    answer:
      "Tergantung event. Pada banyak event, harga tiket belum termasuk pajak hiburan, biaya admin, dan biaya platform pembayaran. Rincian lengkapnya akan tampil di halaman pembayaran sebelum kamu membayar.",
  },
  {
    id: "beli-4",
    category: "pembelian",
    question: "Bagaimana cara melihat tiket yang sudah saya beli?",
    answer:
      "Kalau sudah punya akun, buka menu Akun lalu pilih Pesanan Kamu. Kalau membeli tanpa login, klik tombol Pembelian di bagian atas halaman, lalu masukkan nomor telepon dan nama lengkap yang kamu pakai saat memesan.",
  },

  // ---------- Pembayaran ----------
  {
    id: "bayar-1",
    category: "pembayaran",
    question: "Metode pembayaran apa saja yang tersedia?",
    answer:
      "Cuantix menerima transfer bank (BCA, BRI, Mandiri, BNI, BTN, BSI, Permata), kartu Visa dan Mastercard, QRIS, GoPay, cicilan lewat Indodana, serta pembayaran di gerai Indomaret dan Alfamart. Metode yang muncul bisa berbeda untuk tiap event.",
  },
  {
    id: "bayar-2",
    category: "pembayaran",
    question: "Berapa lama batas waktu pembayaran?",
    answer:
      "Batas waktu ditampilkan di halaman pembayaran setelah kamu membuat pesanan. Jika melewati batas tersebut, pesanan otomatis dibatalkan dan kursi dilepas kembali, jadi kamu perlu memesan ulang.",
  },
  {
    id: "bayar-3",
    category: "pembayaran",
    question: "Saya sudah bayar tetapi tiket belum muncul. Apa yang harus dilakukan?",
    answer:
      "Tunggu beberapa menit karena verifikasi pembayaran kadang butuh waktu. Jika tiket tetap belum muncul, siapkan bukti pembayaran dan kode pesananmu, lalu hubungi tim Cuantix lewat halaman Hubungi Kami.",
  },

  // ---------- E-tiket ----------
  {
    id: "tiket-1",
    category: "eticket",
    question: "Bagaimana cara menggunakan e-tiket saat masuk venue?",
    answer:
      "Tunjukkan QR code e-tiket dari ponselmu kepada petugas di pintu masuk dan siapkan identitas yang sama dengan data pemesanan. Pastikan baterai ponsel cukup dan layar cukup terang agar QR code mudah dipindai.",
  },
  {
    id: "tiket-2",
    category: "eticket",
    question: "Kapan e-tiket bisa saya dapatkan?",
    answer:
      "Waktu penerbitan e-tiket mengikuti ketentuan penyelenggara. Informasi ini tercantum di bagian Syarat & Ketentuan pada halaman detail event.",
  },
  {
    id: "tiket-3",
    category: "eticket",
    question: "Apakah tiket boleh dijual kembali atau dipindahtangankan?",
    answer:
      "Pada umumnya tiket hanya untuk keperluan pribadi dan tidak boleh dijual kembali tanpa izin promotor. Pelanggaran dapat menyebabkan tiket dibatalkan tanpa pengembalian dana. Lihat Syarat & Ketentuan tiap event untuk detailnya.",
  },

  // ---------- Refund ----------
  {
    id: "refund-1",
    category: "refund",
    question: "Apakah tiket bisa di-refund atau ditukar?",
    answer:
      "Pada umumnya semua penjualan bersifat final, tanpa pengembalian dana, pertukaran, atau pengalihan kepemilikan, kecuali penyelenggara membatalkan atau menjadwal ulang event. Ketentuan pastinya tertulis di Syarat & Ketentuan tiap event.",
  },
  {
    id: "refund-2",
    category: "refund",
    question: "Bagaimana jika event dibatalkan atau dijadwal ulang?",
    answer:
      "Informasi resmi akan disampaikan lewat email dan halaman event. Kebijakan pengembalian dana atau penggunaan tiket untuk jadwal baru ditentukan oleh penyelenggara bersama Cuantix.",
  },

  // ---------- Akun ----------
  {
    id: "akun-1",
    category: "akun",
    question: "Bagaimana cara membuat akun?",
    answer:
      "Klik tombol Akun di bagian atas halaman, pilih Buat Akun Anda, lalu isi data yang diminta. Kamu bisa langsung masuk setelah pendaftaran berhasil.",
  },
  {
    id: "akun-2",
    category: "akun",
    question: "Bagaimana cara mengubah password atau data profil?",
    answer:
      "Masuk ke akunmu, buka menu Akun lalu pilih profil. Di halaman Profil Kamu, kamu bisa mengubah informasi akun serta memperbarui password.",
  },
  {
    id: "akun-3",
    category: "akun",
    question: "Apakah data pribadi saya aman?",
    answer:
      "Data yang kamu berikan hanya dipakai untuk memproses pemesanan dan layanan Cuantix. Selengkapnya ada di halaman Kebijakan Privasi dan Kepatuhan Keamanan & Privasi.",
  },

  // ---------- Buat event ----------
  {
    id: "event-1",
    category: "buat-event",
    question: "Bagaimana cara menjual tiket event saya di Cuantix?",
    answer:
      "Klik Buat Event Kamu di bagian atas halaman, lalu hubungi tim Cuantix lewat formulir atau kontak yang tersedia. Tim kami akan membantu proses pendaftaran dan penjualan tiket eventmu.",
  },
  {
    id: "event-2",
    category: "buat-event",
    question: "Berapa biaya untuk menjual tiket di Cuantix?",
    answer:
      "Rincian biaya tersedia di halaman Biaya pada menu Buat Event di footer. Untuk penawaran sesuai kebutuhan eventmu, hubungi tim Cuantix.",
  },
];

export const CONTACT = {
  email: "Cuantix.Service@gmail.com",
  phoneDisplay: "0821 2349 02892",
  whatsappUrl: "https://wa.me/62821234902892",
  // Halaman Hubungi Kami (sesuaikan dengan route-mu)
  contactPage: "/buat-event",
};