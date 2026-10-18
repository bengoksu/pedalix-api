const loginDogrulama = (req, res, next) => {
  const email = req.body.email;
  const sifre = req.body.sifre;
  const hatalar = [];
  if (!email) {
    hatalar.push("E-posta boş olamaz");
  }
  if (!sifre) {
    hatalar.push("Şifre boş olamaz");
  }
  if (hatalar.length > 0) {
    return res.status(400).json({ hatalar });
  }
  next();
};
module.exports = loginDogrulama;
