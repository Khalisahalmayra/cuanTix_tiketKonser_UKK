const express = require("express");
const supabase = require("../config/database");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.use(verifyToken);

const makeCode = () =>
  "CTX-" + Date.now().toString(36).toUpperCase() +
  Math.random().toString(36).slice(2, 5).toUpperCase();

// POST /api/orders -> buat pesanan
// body: { event_id, items: [{ ticket_type_id, quantity }] }
router.post("/", async (req, res) => {
  const { event_id, items } = req.body;

  if (!event_id || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Data pesanan tidak lengkap" });
  }

  // ambil jenis tiket dari database (harga dipercaya dari server, bukan dari browser)
  const ids = items.map((i) => i.ticket_type_id);
  const { data: types, error: tErr } = await supabase
    .from("ticket_types")
    .select("id, event_id, price, quota, sold")
    .in("id", ids);

  if (tErr || !types || types.length !== ids.length) {
    return res.status(400).json({ message: "Jenis tiket tidak valid" });
  }

  let total = 0;
  const rows = [];

  for (const item of items) {
    const t = types.find((x) => x.id === item.ticket_type_id);
    const qty = Number(item.quantity);

    if (!t || t.event_id !== Number(event_id)) {
      return res.status(400).json({ message: "Tiket tidak sesuai event" });
    }
    if (!Number.isInteger(qty) || qty < 1 || qty > 10) {
      return res.status(400).json({ message: "Jumlah tiket tidak valid (1-10)" });
    }
    if (t.quota - t.sold < qty) {
      return res.status(409).json({ message: "Tiket tidak cukup" });
    }

    total += t.price * qty;
    rows.push({ ticket_type_id: t.id, quantity: qty, unit_price: t.price });
  }

  const { data: order, error: oErr } = await supabase
    .from("orders")
    .insert({
      order_code: makeCode(),
      user_id: req.user.id,
      event_id,
      total_amount: total,
      status: "pending",
      expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    })
    .select("id, order_code, total_amount, status, expires_at")
    .single();

  if (oErr) {
    return res.status(500).json({ message: "Gagal membuat pesanan", error: oErr.message });
  }

  const { error: iErr } = await supabase
    .from("order_items")
    .insert(rows.map((r) => ({ ...r, order_id: order.id })));

  if (iErr) {
    return res.status(500).json({ message: "Gagal menyimpan item", error: iErr.message });
  }

  res.status(201).json(order);
});

// GET /api/orders/:code -> detail pesanan milik sendiri
router.get("/:code", async (req, res) => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, order_code, total_amount, status, expires_at, created_at, events(title, city, venue, start_at), order_items(quantity, unit_price, ticket_types(name))"
    )
    .eq("order_code", req.params.code)
    .eq("user_id", req.user.id)
    .maybeSingle();

  if (error) {
    return res.status(500).json({ message: "Gagal mengambil pesanan", error: error.message });
  }
  if (!data) {
    return res.status(404).json({ message: "Pesanan tidak ditemukan" });
  }
  res.json(data);
});

module.exports = router;