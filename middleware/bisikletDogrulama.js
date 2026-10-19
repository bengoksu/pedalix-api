const ApiHatasi = require("./ApiHatasi");
const bisikletDogrulama = (req, res, next) => {
  const istasyonId = req.body.istasyonId;
  const hatalar = [];
  if (!istasyonId || !Number.isInteger(istasyonId) || istasyonId <= 0) {
    hatalar.push("İstasyon ID zorunlu ve pozitif bir tam sayı olmalı.");
  }
  if (hatalar.length > 0) {
    return next(new ApiHatasi(hatalar.join(" "), 400));
  }

  next();
};
module.exports = bisikletDogrulama;
