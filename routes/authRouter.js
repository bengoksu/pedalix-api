const express = require("express");
const fs = require("fs/promises");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const ad = req.body.ad;
    const email = req.body.email;
    const sifre = req.body.sifre;

    const dosyaYolu = path.join(__dirname, "../data/kullanicilar.json");
    const veri = await fs.readFile(dosyaYolu, "utf-8");
    const kullanicilar = JSON.parse(veri);
    const mevcutKullanici = kullanicilar.find(
      (kullanici) => kullanici.email === email,
    );
    if (mevcutKullanici)
      return res.status(409).json({ mesaj: "Bu e-posta zaten kayıtlı." });
    const yeniId =
      Math.max(0, ...kullanicilar.map((kullanici) => kullanici.id)) + 1;
    const yeniKullanici = {
      id: yeniId,
      ad: ad,
      email: email,
      sifreHash: await bcrypt.hash(sifre, 10),
      rol: "user",
    };
    kullanicilar.push(yeniKullanici);
    await fs.writeFile(
      dosyaYolu,
      JSON.stringify(kullanicilar, null, 2),
      "utf-8",
    );
    res.status(201).json({
      mesaj: "Kullanıcı başarıyla kaydedildi.",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ mesaj: "Kullanıcı kaydı sırasında hata oluştu." });
  }
});
router.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const sifre = req.body.sifre;
    const dosyaYolu = path.join(__dirname, "../data/kullanicilar.json");
    const veri = await fs.readFile(dosyaYolu, "utf-8");
    const kullanicilar = JSON.parse(veri);
    const kullanici = kullanicilar.find((k) => k.email === email);
    if (!kullanici)
      return res.status(401).json({ mesaj: "E-posta veya şifre hatalı." });
    const sifreDogruMu = await bcrypt.compare(sifre, kullanici.sifreHash);
    if (!sifreDogruMu)
      return res.status(401).json({ mesaj: "E-posta veya şifre hatalı." });
    const token = jwt.sign(
      {
        id: kullanici.id,
        rol: kullanici.rol,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    res.status(200).json({
      mesaj: "Giriş başarılı.",
      token,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ mesaj: "Kullanıcı girişi sırasında hata oluştu." });
  }
});

module.exports = router;
