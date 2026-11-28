
 // Middleware untuk memeriksa session login
function verifyToken(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      message: "Belum login, silakan login terlebih dahulu",
    });
  }

  req.user = req.session.user;
  next();
}

// Middleware untuk memeriksa role admin
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Hanya admin yang boleh mengakses ini",
    });
  }

  next();
}

module.exports = { verifyToken, requireAdmin };
