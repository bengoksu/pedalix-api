const adminMiddleware = (req, res, next) => {
  if (req.user.rol !== "admin") {
    return res.status(403).json({ mesaj: "yetkili değilsiniz" });
  }
  next();
};
module.exports = adminMiddleware;
