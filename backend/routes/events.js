const express = require("express");
const supabase = require("../config/database");

const router = express.Router();

const rupiah = (n) => "Rp " + Number(n).toLocaleString("id-ID");

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

// GET /api/events  -> semua event published
router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("events")
    .select(
      "id, title, slug, banner_url, poster_url, city, venue, start_at, created_at, categories(name), organizers(name), ticket_types(price, quota, sold)"
    )
    .eq("status", "published");

  if (error) {
    return res
      .status(500)
      .json({ message: "Gagal mengambil event", error: error.message });
  }

  const events = data.map((e) => {
    const tipe = e.ticket_types || [];
    const prices = tipe.map((t) => t.price);
    const min = prices.length ? Math.min(...prices) : 0;
    const max = prices.length ? Math.max(...prices) : 0;
    const available = tipe.reduce((s, t) => s + (t.quota - t.sold), 0);
    const soldCount = tipe.reduce((s, t) => s + t.sold, 0);

    return {
      id: String(e.id),
      slug: e.slug,
      title: e.title,
      image: e.banner_url,
      poster: e.poster_url,
      location: e.city,
      venue: e.venue,
      organizer: e.organizers?.name || "",
      category: e.categories?.name || "",
      price: min === max ? rupiah(min) : `${rupiah(min)} - ${rupiah(max)}`,
      tickets: `${available} Tiket Tersedia`,
      soldCount,
      date: e.start_at,
      createdAt: e.created_at,
    };
  });

  res.json(events);
});

// GET /api/events/:slug -> detail satu event + jenis tiket
router.get("/:slug", async (req, res) => {
  const { data, error } = await supabase
    .from("events")
    .select(
      "id, title, slug, description, banner_url, poster_url, city, venue, venue_address, location_info, seating_layout, start_at, end_at, status, categories(name), organizers(name), ticket_types(id, name, price, quota, sold, description, is_active, sale_start, sale_end)"
    )
    .eq("slug", req.params.slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    return res
      .status(500)
      .json({ message: "Gagal mengambil event", error: error.message });
  }
  if (!data) {
    return res.status(404).json({ message: "Event tidak ditemukan" });
  }

  const { description: cleanDesc, metadata } = parseEventDescription(data.description);
  const layout = data.seating_layout || metadata.seating_layout || null;

  let denah = metadata.denah || null;
  if (!denah && layout) {
    if (layout.image_url) {
      denah = layout.image_url;
    } else if (layout.svg_string) {
      denah = `data:image/svg+xml;utf8,${encodeURIComponent(layout.svg_string)}`;
    }
  }

  res.json({
    id: data.id,
    slug: data.slug,
    title: data.title,
    description: cleanDesc,
    image: data.banner_url,
    poster: data.poster_url,
    city: data.city,
    venue: data.venue,
    venue_address: data.venue_address || metadata.venue_address || "",
    location_info: data.location_info || metadata.location_info || "",
    date: data.start_at,
    end_at: data.end_at,
    category: data.categories?.name || "",
    organizer: data.organizers?.name || "",
    denah,
    seating_layout: layout,
    tickets: (data.ticket_types || [])
      .filter((t) => t.is_active !== false)
      .map((t, idx) => {
        const meta = (metadata.tickets_meta || []).find((m) => m.name === t.name) || (metadata.tickets_meta || [])[idx] || {};
        return {
          id: t.id,
          name: t.name,
          price: t.price,
          available: t.quota - t.sold,
          sold: t.sold,
          description: t.description !== null && t.description !== undefined ? t.description : (meta.description || null),
          sale_start: t.sale_start,
          sale_end: t.sale_end,
        };
      }),
  });
});

module.exports = router;