const express = require("express");
const supabase = require("../config/database");

const router = express.Router();

const rupiah = (n) => "Rp " + Number(n).toLocaleString("id-ID");

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

module.exports = router;