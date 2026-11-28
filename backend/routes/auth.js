
const express = require("express");
const bcrypt = require("bcryptjs");
const supabase = require("../config/database");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Nama, email, dan password wajib diisi",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password minimal 6 karakter",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const { data: existing, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (checkError) {
      return res.status(500).json({
        message: "Gagal memeriksa email",
        error: checkError.message,
      });
    }

    if (existing) {
      return res.status(409).json({
        message: "Email sudah terdaftar",
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const { data: user, error } = await supabase
      .from("users")
      .insert({
        name,
        email: cleanEmail,
        password_hash,
        phone,
      })
      .select("id, name, email, phone, role")
      .single();

    if (error) {
      return res.status(500).json({
        message: "Gagal mendaftar",
        error: error.message,
      });
    }

    res.status(201).json({
      message: "Registrasi berhasil",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email dan password wajib diisi",
      });
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    if (error) {
      return res.status(500).json({
        message: "Terjadi kesalahan",
        error: error.message,
      });
    }

    if (!user) {
      return res.status(401).json({
        message: "Email atau password salah",
      });
    }

    const cocok = await bcrypt.compare(password, user.password_hash);

    if (!cocok) {
      return res.status(401).json({
        message: "Email atau password salah",
      });
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    req.session.regenerate((err) => {
      if (err) {
        return res.status(500).json({
          message: "Gagal membuat session",
        });
      }

      req.session.user = safeUser;

      req.session.save((saveError) => {
        if (saveError) {
          return res.status(500).json({
            message: "Gagal menyimpan session",
          });
        }

        res.json({
          message: "Login berhasil",
          user: safeUser,
        });
      });
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
    });
  }
});

// CEK STATUS LOGIN
router.get("/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({
      message: "Belum login",
    });
  }

  res.json({
    user: req.session.user,
  });
});

// LOGOUT
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        message: "Gagal logout",
      });
    }

    res.clearCookie("connect.sid", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.json({
      message: "Logout berhasil",
    });
  });
});

module.exports = router;
