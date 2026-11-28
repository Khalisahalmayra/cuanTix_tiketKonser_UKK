
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");

const supabase = require("./config/database");
const SupabaseSessionStore = require("./stores/supabaseSessionStore");

const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const adminRoutes = require("./routes/admin");
const orderRoutes = require("./routes/orders");
const eventSubmissionRoutes = require("./routes/event-submissions");

const app = express();

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET belum diatur di file .env");
}

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    store: new SupabaseSessionStore(),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    },
  })
);

// TEST SERVER
app.get("/", (req, res) => {
  res.send("Backend UKK Ticketing berhasil berjalan!");
});

// AUTH
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/event-submissions", eventSubmissionRoutes);

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
