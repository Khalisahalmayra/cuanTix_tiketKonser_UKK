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

  const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype);
    if (!ok) return cb(new Error("Format gambar harus JPG, PNG, atau WEBP"));
    cb(null, true);
  },
});

// POST /api/admin/upload -> upload gambar ke Supabase Storage
router.post("/upload", (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        message:
          err.code === "LIMIT_FILE_SIZE"
            ? "Ukuran gambar maksimal 2 MB"
            : err.message,
      });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Pilih gambar dulu" });
    }

    const ext = req.file.originalname.split(".").pop().toLowerCase();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await supabase.storage
      .from("event-images")
      .upload(path, req.file.buffer, { contentType: req.file.mimetype });

    if (error) {
      return res.status(500).json({ message: "Gagal upload gambar", error: error.message });
    }

    const { data } = supabase.storage.from("event-images").getPublicUrl(path);
    res.json({ url: data.publicUrl });
  });
});

// GET /api/admin/events/:id -> data satu event untuk form edit
router.get("/events/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("events")
    .select(
      "id, title, category_id, description, banner_url, city, venue, start_at, status, ticket_types(id, name, price, quota, sold)"
    )
    .eq("id", req.params.id)
    .maybeSingle();

  if (error) {
    return res.status(500).json({ message: "Gagal mengambil event", error: error.message });
  }
  if (!data) {
    return res.status(404).json({ message: "Event tidak ditemukan" });
  }
  res.json(data);
});

// PUT /api/admin/events/:id -> ubah event dan jenis tiketnya
router.put("/events/:id", async (req, res) => {
  const {
    title, category_id, description, banner_url,
    city, venue, start_at, tickets,
  } = req.body;

  if (!title || !city || !start_at) {
    return res.status(400).json({ message: "Judul, kota, dan tanggal wajib diisi" });
  }

  const changes = {
    title,
    category_id: category_id || null,
    description: description || null,
    city,
    venue: venue || null,
    start_at,
  };
  if (banner_url) {
    changes.banner_url = banner_url;
    changes.poster_url = banner_url;
  }

  const { error } = await supabase
    .from("events")
    .update(changes)
    .eq("id", req.params.id);

  if (error) {
    return res.status(500).json({ message: "Gagal mengubah event", error: error.message });
  }

  for (const t of tickets || []) {
    const price = Number(t.price);
    const quota = Number(t.quota);

    if (t.id) {
      const { data: cur } = await supabase
        .from("ticket_types")
        .select("sold")
        .eq("id", t.id)
        .eq("event_id", req.params.id)
        .maybeSingle();

      if (cur && quota < cur.sold) {
        return res.status(400).json({
          message: `Kuota "${t.name}" tidak boleh di bawah jumlah terjual (${cur.sold})`,
        });
      }
      await supabase
        .from("ticket_types")
        .update({ name: t.name, price, quota })
        .eq("id", t.id)
        .eq("event_id", req.params.id);
    } else if (t.name && price >= 0 && quota > 0) {
      await supabase
        .from("ticket_types")
        .insert({ event_id: Number(req.params.id), name: t.name, price, quota });
    }
  }

  res.json({ message: "Event berhasil diubah" });
});


module.exports = router;
