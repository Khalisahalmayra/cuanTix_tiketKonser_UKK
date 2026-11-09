const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const supabase = require("../config/database");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Nama, email, dan password wajib diisi" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password minimal 6 karakter" });
  }

  const cleanEmail = email.trim().toLowerCase();

  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("email", cleanEmail)
    .maybeSingle();

  if (existing) {
    return res.status(409).json({ message: "Email sudah terdaftar" });
  }

  const password_hash = await bcrypt.hash(password, 10);

  const { data: user, error } = await supabase
    .from("users")
    .insert({ name, email: cleanEmail, password_hash, phone })
    .select("id, name, email, phone, role")
    .single();

  if (error) {
    return res.status(500).json({ message: "Gagal mendaftar", error: error.message });
  }

  res.status(201).json({ message: "Registrasi berhasil", user });
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib diisi" });
  }

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();

  if (error) {
    return res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
  }

  if (!user) {
    return res.status(401).json({ message: "Email atau password salah" });
  }

  const cocok = await bcrypt.compare(password, user.password_hash);
  if (!cocok) {
    return res.status(401).json({ message: "Email atau password salah" });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    message: "Login berhasil",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
});

module.exports = router;