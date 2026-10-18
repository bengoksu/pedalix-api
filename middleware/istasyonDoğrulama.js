const istasyonDogrulama = (req, res, next) => {
  const ad = req.body.ad;
  const konum = req.body.konum;
  const kapasite = req.body.kapasite;
  const hatalar = [];
  if (!ad) hatalar.push("İstasyon adı zorunlu");
  if (!konum) hatalar.push("İstasyon konumu zorunlu");
  if (!kapasite || kapasite <= 0)
    hatalar.push("İstasyon kapasitesi zorunlu ve pozitif olmalı");
  if (hatalar.length > 0) return res.status(400).json({ hatalar });
  next();
};
module.exports = istasyonDogrulama;
