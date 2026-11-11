const express = require("express");
const supabase = require("../config/database");
const { verifyToken, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// Semua route di file ini wajib login sebagai admin
router.use(verifyToken, requireAdmin);

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// GET /api/admin/events -> semua event (termasuk draft)
router.get("/events", async (req, res) => {
  const { data, error } = await supabase
    .from("events")
    .select("id, title, city, start_at, status, categories(name), ticket_types(price, quota, sold)")
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ message: "Gagal mengambil event", error: error.message });
  }
  res.json(data);
});

// POST /api/admin/events -> tambah event + jenis tiket
router.post("/events", async (req, res) => {
  const {
    title, category_id, description, banner_url,
    city, venue, start_at, status, tickets,
  } = req.body;

  if (!title || !city || !start_at) {
    return res.status(400).json({ message: "Judul, kota, dan tanggal wajib diisi" });
  }
  if (!Array.isArray(tickets) || tickets.length === 0) {
    return res.status(400).json({ message: "Minimal satu jenis tiket" });
  }

  // organizer milik admin ini
  const { data: org } = await supabase
    .from("organizers")
    .select("id")
    .eq("user_id", req.user.id)
    .maybeSingle();

  if (!org) {
    return res.status(400).json({ message: "Akun admin belum punya organizer" });
  }

  const slug = slugify(title) + "-" + Date.now().toString().slice(-5);

  const { data: event, error } = await supabase
    .from("events")
    .insert({
      organizer_id: org.id,
      category_id: category_id || null,
      title,
      slug,
      description: description || null,
      banner_url: banner_url || "/image/snada-event.png",
      poster_url: banner_url || "/image/snada-event.png",
      city,
      venue: venue || null,
      start_at,
      status: status || "published",
    })
    .select("id")
    .single();

  if (error) {
    return res.status(500).json({ message: "Gagal menambah event", error: error.message });
  }

  const rows = tickets.map((t) => ({
    event_id: event.id,
    name: t.name,
    price: Number(t.price),
    quota: Number(t.quota),
  }));

  const { error: tErr } = await supabase.from("ticket_types").insert(rows);
  if (tErr) {
    return res.status(500).json({ message: "Event dibuat, tiket gagal", error: tErr.message });
  }

  res.status(201).json({ message: "Event berhasil ditambahkan", id: event.id });
});

// PATCH /api/admin/events/:id/status -> ubah status event
router.patch("/events/:id/status", async (req, res) => {
    const { status } = req.body;
    const allowed = ["draft", "published", "cancelled", "finished"];
  
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Status tidak valid" });
    }
  
    const { error } = await supabase
      .from("events")
      .update({ status })
      .eq("id", req.params.id);
  
    if (error) {
      return res.status(500).json({ message: "Gagal mengubah status", error: error.message });
    }
    res.json({ message: "Status berhasil diubah" });
  });
  
  // DELETE /api/admin/events/:id -> hapus event
  router.delete("/events/:id", async (req, res) => {
    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", req.params.id);
  
    if (error) {
      return res.status(409).json({
        message: "Event tidak bisa dihapus (kemungkinan sudah ada pesanan). Ubah statusnya jadi cancelled saja.",
        error: error.message,
      });
    }
    res.json({ message: "Event berhasil dihapus" });
  });

module.exports = router;