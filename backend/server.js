require("dotenv").config();
const express = require("express");
const cors = require("cors");
const supabase = require("./config/database");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// TEST SERVER
app.get("/", (req, res) => {
  res.send("Backend UKK Ticketing berhasil berjalan!");
});

// AUTH (register & login)
app.use("/api/auth", authRoutes);

// KATEGORI
app.get("/api/categories", async (req, res) => {
  const { data, error } = await supabase.from("categories").select("*");

  if (error) {
    return res.status(500).json({
      message: "Gagal mengambil kategori",
      error: error.message,
    });
  }

  res.json(data);
});

app.listen(4000, () => {
  console.log("Server berjalan di http://localhost:4000");
});