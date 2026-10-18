const kullaniciDoğrulama = (req, res, next) => {
  const ad = req.body.ad;
  const email = req.body.email;
  const sifre = req.body.sifre;
  const hatalar = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!ad) {
    hatalar.push("Kullanıcı adı boş olamaz.");
  }
  if (!email) {
    hatalar.push("Eposta alanı boş olamaz");
  } else if (!emailRegex.test(email)) {
    hatalar.push("Geçersiz eposta adresi.");
  }

  if (!sifre || sifre.length < 8) {
    hatalar.push("Kullanıcı şifresi boş olamaz.En az 8 karakter");
  }
  if (hatalar.length) {
    return res.status(400).json({ hatalar });
  }
  next();
};
module.exports = kullaniciDoğrulama;
