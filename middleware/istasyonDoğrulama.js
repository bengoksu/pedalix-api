const ApiHatasi = require("./ApiHatasi");
const istasyonDogrulama = (req, res, next) => {
  const ad = req.body.ad;
  const konum = req.body.konum;
  const kapasite = req.body.kapasite;
  const hatalar = [];
  if (!ad) hatalar.push("İstasyon adı zorunlu");
  if (!konum) hatalar.push("İstasyon konumu zorunlu");
  if (!kapasite || !Number.isInteger(kapasite) || kapasite <= 0)
    hatalar.push("İstasyon kapasitesi zorunlu ve pozitif olmalı");
  if (hatalar.length > 0)
    if (hatalar.length > 0) {
      return next(new ApiHatasi(hatalar.join(" "), 400));
    }
  next();
};
module.exports = istasyonDogrulama;
