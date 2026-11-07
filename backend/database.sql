CREATE DATABASE ukk_ticketing;
USE ukk_ticketing;

DESCRIBE users;

DESCRIBE artis;

DESCRIBE event;

DESCRIBE kategori_tiket;

DESCRIBE pesanan;

DESCRIBE detail_pesanan;

DESCRIBE tiket;
SHOW TABLES;

-- TABEL USERS (admin, petugas, pelanggan)
-- ================================
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  no_hp VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','petugas','pelanggan') NOT NULL,
  nama_loket VARCHAR(50),          -- hanya diisi kalau role = petugas
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
-- ================================
-- TABEL ARTIS
-- ================================
CREATE TABLE artis (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  genre VARCHAR(50),
  deskripsi TEXT,
  foto_url VARCHAR(255)            -- link foto dari Supabase Storage
);
 
-- ================================
-- TABEL EVENT / KONSER
-- Hanya admin yang bisa input event
-- ================================
CREATE TABLE event (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_event VARCHAR(150) NOT NULL,
  artis_id INT,
  genre VARCHAR(50),
  penyelenggara VARCHAR(150),
  deskripsi TEXT,
  lokasi VARCHAR(150) NOT NULL,
  tanggal_event DATETIME NOT NULL,
  poster_url VARCHAR(255),         -- link poster dari Supabase Storage
  status ENUM('presale','aktif','ditutup') DEFAULT 'presale',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (artis_id) REFERENCES artis(id)
);
 
-- ================================
-- TABEL KATEGORI TIKET
-- ================================
CREATE TABLE kategori_tiket (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  nama_kategori VARCHAR(50) NOT NULL,
  harga DECIMAL(12,2) NOT NULL,
  kuota INT NOT NULL,
  terjual INT DEFAULT 0,
  FOREIGN KEY (event_id) REFERENCES event(id)
);
 
-- ================================
-- TABEL PESANAN
-- channel membedakan online (pelanggan) vs offline (petugas)
-- ================================
CREATE TABLE pesanan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kode_pesanan VARCHAR(30) NOT NULL UNIQUE,
  channel ENUM('online','offline') NOT NULL,
  user_id INT,                     -- diisi kalau online (pelanggan)
  petugas_id INT,                  -- diisi kalau offline (petugas)
  nama_pembeli VARCHAR(100) NOT NULL,
  no_hp_pembeli VARCHAR(20),
  total_harga DECIMAL(12,2) NOT NULL,
  status ENUM('menunggu_verifikasi','lunas','ditolak') NOT NULL,
  bukti_bayar_url VARCHAR(255),    -- hanya untuk pesanan online
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (petugas_id) REFERENCES users(id)
);
 
-- ================================
-- TABEL DETAIL PESANAN
-- Rincian kategori tiket & jumlah dalam satu pesanan
-- ================================
CREATE TABLE detail_pesanan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pesanan_id INT NOT NULL,
  kategori_tiket_id INT NOT NULL,
  jumlah INT NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL,
  FOREIGN KEY (pesanan_id) REFERENCES pesanan(id),
  FOREIGN KEY (kategori_tiket_id) REFERENCES kategori_tiket(id)
);
 
-- ================================
-- TABEL TIKET
-- Satu baris = satu lembar tiket dengan kode QR
-- ================================
CREATE TABLE tiket (
  id INT AUTO_INCREMENT PRIMARY KEY,
  detail_pesanan_id INT NOT NULL,
  kode_qr VARCHAR(100) NOT NULL UNIQUE,
  status ENUM('belum_dipakai','sudah_dipakai') DEFAULT 'belum_dipakai',
  waktu_checkin DATETIME,
  FOREIGN KEY (detail_pesanan_id) REFERENCES detail_pesanan(id)
);
 
 
-- ================================
-- DATA CONTOH
-- ================================
 
INSERT INTO users (nama, email, no_hp, password, role, nama_loket) VALUES
('Admin Tiketku', 'admin@tiketku.com', '081200000001', 'hash_password', 'admin', NULL),
('Yoga Pratama', 'yoga@tiketku.com', '081200000002', 'hash_password', 'petugas', 'Loket 2'),
('Dinda Ramadhani', 'dinda@gmail.com', '081234500001', 'hash_password', 'pelanggan', NULL);
 
INSERT INTO artis (nama, genre, deskripsi) VALUES
('Bernasty Larasati', 'Folk/Indie', 'Musisi folk dengan lirik reflektif'),
('Reguna', 'Pop Indonesia', 'Penyanyi pop dengan lagu tentang kehidupan kota');
 
INSERT INTO event (nama_event, artis_id, genre, penyelenggara, lokasi, tanggal_event, status) VALUES
('Senja Berpendar', 1, 'Folk/Indie', 'Rumah Karsa Event', 'Istora Senayan, Jakarta', '2026-09-12 19:00:00', 'aktif'),
('Reguna Live: Kota Malam', 2, 'Pop Indonesia', 'Panggung Nusantara', 'GBK Basketball Hall, Jakarta', '2026-09-28 19:30:00', 'aktif');
 
INSERT INTO kategori_tiket (event_id, nama_kategori, harga, kuota, terjual) VALUES
(1, 'VIP', 500000, 200, 184),
(1, 'Reguler', 250000, 500, 212),
(2, 'Reguler', 300000, 900, 410);
 
INSERT INTO pesanan (kode_pesanan, channel, user_id, petugas_id, nama_pembeli, no_hp_pembeli, total_harga, status) VALUES
('TKT-08231', 'online', 3, NULL, 'Dinda Ramadhani', '081234500001', 1000000, 'menunggu_verifikasi'),
('TKT-08230', 'offline', NULL, 2, 'Pembeli Loket 2', NULL, 1200000, 'lunas');
 
INSERT INTO detail_pesanan (pesanan_id, kategori_tiket_id, jumlah, subtotal) VALUES
(1, 1, 2, 1000000),
(2, 3, 4, 1200000);


SHOW DATABASES;

SELECT user, host, plugin
FROM mysql.user
WHERE user = 'admin';


SELECT user, host, plugin
FROM mysql.user;


SELECT USER(), CURRENT_USER();

SELECT user, host, plugin
FROM mysql.user
WHERE user = 'root';

CREATE USER 'ukk_user'@'127.0.0.1' IDENTIFIED BY 'ukk12345';

GRANT ALL PRIVILEGES ON ukk_ticketing.* TO 'ukk_user'@'127.0.0.1';

FLUSH PRIVILEGES;