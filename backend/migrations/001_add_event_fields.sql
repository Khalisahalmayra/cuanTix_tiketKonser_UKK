-- Migration: 001_add_event_fields.sql
-- Description: Menambahkan field pendukung untuk Event Management lengkap di CuanTix

-- 1. Pastikan kolom end_at, venue_address, location_info, dan seating_layout ada di tabel events
ALTER TABLE events 
  ADD COLUMN IF NOT EXISTS end_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS venue_address TEXT,
  ADD COLUMN IF NOT EXISTS location_info TEXT,
  ADD COLUMN IF NOT EXISTS seating_layout JSONB;

-- 2. Pastikan kolom periode penjualan dan info tambahan ada di tabel ticket_types
ALTER TABLE ticket_types 
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS sale_start TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS sale_end TIMESTAMPTZ;

-- 3. Komentar kolom untuk dokumentasi schema
COMMENT ON COLUMN events.end_at IS 'Waktu selesai pelaksanaan event';
COMMENT ON COLUMN events.venue_address IS 'Alamat lengkap tempat pelaksanaan event';
COMMENT ON COLUMN events.location_info IS 'Informasi akses transportasi, gerbang masuk, atau petunjuk lokasi';
COMMENT ON COLUMN events.seating_layout IS 'Data konfigurasi denah tempat duduk (SVG & zona) dalam format JSON';
COMMENT ON COLUMN ticket_types.description IS 'Deskripsi / benefit jenis tiket (misal: soundcheck access)';
COMMENT ON COLUMN ticket_types.sale_start IS 'Waktu dimulainya penjualan tiket';
COMMENT ON COLUMN ticket_types.sale_end IS 'Waktu berakhirnya penjualan tiket';

