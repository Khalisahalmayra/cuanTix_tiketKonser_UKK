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

function safeIso(d) {
  if (!d) return null;
  const parsed = new Date(d);
  return isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function parseEventDescription(rawDescription) {
  if (!rawDescription) {
    return { description: "", metadata: {} };
  }
  const match = rawDescription.match(/<!--CUANTIX_DATA:([\s\S]*?)-->/);
  if (!match) {
    return { description: rawDescription.trim(), metadata: {} };
  }
  try {
    const metadata = JSON.parse(match[1]);
    const cleanDesc = rawDescription.replace(match[0], "").trim();
    return { description: cleanDesc, metadata };
  } catch (e) {
    return { description: rawDescription.trim(), metadata: {} };
  }
}

function buildEventDescription(description, metadata) {
  const clean = (description || "").trim();
  if (!metadata || Object.keys(metadata).length === 0) {
    return clean;
  }
  return `${clean}\n\n<!--CUANTIX_DATA:${JSON.stringify(metadata)}-->`;
}

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
    title,
    category_id,
    description,
    banner_url,
    poster_url,
    city,
    venue,
    venue_address,
    location_info,
    start_at,
    end_at,
    status,
    tickets,
    seating_layout,
  } = req.body;

  if (!title || !city || !start_at) {
    return res.status(400).json({ message: "Judul, kota, dan tanggal mulai wajib diisi" });
  }
  if (!Array.isArray(tickets) || tickets.length === 0) {
    return res.status(400).json({ message: "Minimal satu jenis tiket harus diisi" });
  }

  // Cari organizer milik admin ini, atau fallback ke organizer pertama
  let orgId = null;
  const { data: org } = await supabase
    .from("organizers")
    .select("id")
    .eq("user_id", req.user.id)
    .maybeSingle();

  if (org) {
    orgId = org.id;
  } else {
    const { data: firstOrg } = await supabase
      .from("organizers")
      .select("id")
      .order("id", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (firstOrg) {
      orgId = firstOrg.id;
    } else {
      const { data: newOrg } = await supabase
        .from("organizers")
        .insert({ name: "CuanTix Official", user_id: req.user.id })
        .select("id")
        .single();
      orgId = newOrg?.id;
    }
  }

  if (!orgId) {
    return res.status(400).json({ message: "Gagal mengaitkan organizer untuk event ini" });
  }

  const slug = slugify(title) + "-" + Date.now().toString().slice(-5);

  // Pastikan deskripsi bersih dari envelope metadata
  const { description: cleanDescription } = parseEventDescription(description);
  const finalDescription = cleanDescription || description || null;
  const finalImage = banner_url || poster_url || "/image/snada-event.png";

  const { data: event, error } = await supabase
    .from("events")
    .insert({
      organizer_id: orgId,
      category_id: category_id ? Number(category_id) : null,
      title,
      slug,
      description: finalDescription,
      banner_url: finalImage,
      poster_url: poster_url || finalImage,
      city,
      venue: venue || null,
      venue_address: venue_address || null,
      location_info: location_info || null,
      seating_layout: seating_layout || null,
      start_at: safeIso(start_at),
      end_at: safeIso(end_at),
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
    price: Number(t.price) || 0,
    quota: Number(t.quota) || 0,
    description: t.description || null,
    is_active: t.is_active !== undefined ? Boolean(t.is_active) : true,
    sale_start: safeIso(t.sale_start),
    sale_end: safeIso(t.sale_end),
  }));

  const { error: tErr } = await supabase.from("ticket_types").insert(rows);
  if (tErr) {
    // Rollback event row untuk mencegah event yatim tanpa tiket
    await supabase.from("events").delete().eq("id", event.id);
    return res.status(500).json({ message: "Event dibuat, tiket gagal", error: tErr.message });
  }

  res.status(201).json({ message: "Event berhasil ditambahkan", id: event.id, slug });
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
      "id, title, category_id, description, banner_url, poster_url, city, venue, venue_address, location_info, seating_layout, start_at, end_at, status, ticket_types(id, name, price, quota, sold, description, is_active, sale_start, sale_end)"
    )
    .eq("id", req.params.id)
    .maybeSingle();

  if (error) {
    return res.status(500).json({ message: "Gagal mengambil event", error: error.message });
  }
  if (!data) {
    return res.status(404).json({ message: "Event tidak ditemukan" });
  }

  // Fallback kompatibilitas jika event lama menyimpan metadata di description
  const { description: cleanDesc, metadata } = parseEventDescription(data.description);
  const ticketsMeta = metadata.tickets_meta || [];

  const formattedTickets = (data.ticket_types || []).map((t, idx) => {
    const meta = ticketsMeta.find((m) => m.name === t.name) || ticketsMeta[idx] || {};
    return {
      ...t,
      description:
        t.description !== null && t.description !== undefined
          ? t.description
          : (meta.description || ""),
      is_active:
        t.is_active !== null && t.is_active !== undefined
          ? Boolean(t.is_active)
          : (meta.is_active !== undefined ? Boolean(meta.is_active) : true),
      sale_start: t.sale_start || null,
      sale_end: t.sale_end || null,
    };
  });

  res.json({
    ...data,
    description: cleanDesc,
    venue_address: data.venue_address || metadata.venue_address || "",
    location_info: data.location_info || metadata.location_info || "",
    seating_layout: data.seating_layout || metadata.seating_layout || null,
    ticket_types: formattedTickets,
  });
});

// PUT /api/admin/events/:id -> ubah event dan jenis tiketnya
router.put("/events/:id", async (req, res) => {
  const {
    title,
    category_id,
    description,
    banner_url,
    poster_url,
    city,
    venue,
    venue_address,
    location_info,
    start_at,
    end_at,
    status,
    tickets,
    seating_layout,
  } = req.body;

  if (title !== undefined && !title) {
    return res.status(400).json({ message: "Judul tidak boleh kosong" });
  }
  if (city !== undefined && !city) {
    return res.status(400).json({ message: "Kota tidak boleh kosong" });
  }
  if (start_at !== undefined && !start_at) {
    return res.status(400).json({ message: "Tanggal mulai tidak boleh kosong" });
  }

  // Hanya perbarui field yang dikirimkan (jangan menimpa field yang tidak dikirim menjadi NULL)
  const changes = {};
  if (title !== undefined) changes.title = title;
  if (category_id !== undefined) changes.category_id = category_id ? Number(category_id) : null;
  if (description !== undefined) {
    const { description: cleanDesc } = parseEventDescription(description);
    changes.description = cleanDesc || description || null;
  }
  if (city !== undefined) changes.city = city;
  if (venue !== undefined) changes.venue = venue || null;
  if (venue_address !== undefined) changes.venue_address = venue_address || null;
  if (location_info !== undefined) changes.location_info = location_info || null;
  if (seating_layout !== undefined) changes.seating_layout = seating_layout || null;
  if (start_at !== undefined) changes.start_at = safeIso(start_at);
  if (end_at !== undefined) changes.end_at = safeIso(end_at);
  if (status !== undefined) changes.status = status;
  if (banner_url !== undefined) {
    changes.banner_url = banner_url;
    if (poster_url === undefined) changes.poster_url = banner_url;
  }
  if (poster_url !== undefined) changes.poster_url = poster_url;

  if (Object.keys(changes).length > 0) {
    const { error } = await supabase
      .from("events")
      .update(changes)
      .eq("id", req.params.id);

    if (error) {
      return res.status(500).json({ message: "Gagal mengubah event", error: error.message });
    }
  }

  // Update dan insert tiket jika tickets dikirimkan
  if (Array.isArray(tickets)) {
    for (const t of tickets) {
      const price = Number(t.price) || 0;
      const quota = Number(t.quota) || 0;
      const sale_start = safeIso(t.sale_start);
      const sale_end = safeIso(t.sale_end);
      const ticketDesc = t.description !== undefined ? (t.description || null) : undefined;
      const isActive = t.is_active !== undefined ? Boolean(t.is_active) : undefined;

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

        const ticketChanges = {
          name: t.name,
          price,
          quota,
          sale_start,
          sale_end,
        };
        if (ticketDesc !== undefined) ticketChanges.description = ticketDesc;
        if (isActive !== undefined) ticketChanges.is_active = isActive;

        await supabase
          .from("ticket_types")
          .update(ticketChanges)
          .eq("id", t.id)
          .eq("event_id", req.params.id);
      } else if (t.name && price >= 0 && quota > 0) {
        await supabase
          .from("ticket_types")
          .insert({
            event_id: Number(req.params.id),
            name: t.name,
            price,
            quota,
            description: ticketDesc !== undefined ? ticketDesc : null,
            is_active: isActive !== undefined ? isActive : true,
            sale_start,
            sale_end,
          });
      }
    }
  }

  res.json({ message: "Event berhasil diubah" });
});


module.exports = router;
