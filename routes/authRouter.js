const express = require("express");
const fs = require("fs/promises");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const kullaniciDoğrula = require("../middleware/kullaniciDoğrulama");
const loginDogrulama = require("../middleware/loginDoğrulama");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", kullaniciDoğrula, async (req, res) => {
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
router.post("/login", loginDogrulama, async (req, res) => {
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
router.get("/profile", authMiddleware, async (req, res, next) => {
  try {
    const kullaniciId = Number(req.user.id);

    const dosyaYolu = path.join(__dirname, "../data/kullanicilar.json");
    const veri = await fs.readFile(dosyaYolu, "utf-8");
    const kullanicilar = JSON.parse(veri);

    const kullanici = kullanicilar.find((k) => k.id === kullaniciId);

    if (!kullanici) {
      return res.status(404).json({
        mesaj: "Kullanıcı bulunamadı.",
      });
    }

    res.status(200).json({
      profil: {
        id: kullanici.id,
        ad: kullanici.ad,
        email: kullanici.email,
        rol: kullanici.rol,
      },
    });
  } catch (error) {
    next(error);
  }
});
router.patch("/profile", authMiddleware, async (req, res, next) => {
  try {
    const kullaniciId = Number(req.user.id);
    const { ad, email } = req.body;

    //  Güncellenecek bilgileri kontrol et
    if (
      typeof ad !== "string" ||
      !ad.trim() ||
      typeof email !== "string" ||
      !email.trim()
    ) {
      return res.status(400).json({
        mesaj: "Geçerli bir ad ve e-posta giriniz.",
      });
    }

    const yeniAd = ad.trim();
    const yeniEmail = email.trim().toLowerCase();

    // Kullanıcıları oku
    const dosyaYolu = path.join(__dirname, "../data/kullanicilar.json");
    const veri = await fs.readFile(dosyaYolu, "utf-8");
    const kullanicilar = JSON.parse(veri);

    //  Giriş yapan kullanıcıyı bul
    const kullanici = kullanicilar.find((k) => k.id === kullaniciId);

    if (!kullanici) {
      return res.status(404).json({
        mesaj: "Kullanıcı bulunamadı.",
      });
    }

    //  E-posta formatını kontrol et
    const emailFormati = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailFormati.test(yeniEmail)) {
      return res.status(400).json({
        mesaj: "Geçerli bir e-posta adresi giriniz.",
      });
    }

    //  E-posta başka kullanıcı tarafından kullanılıyor mu?
    const emailKullaniliyor = kullanicilar.some(
      (k) => k.id !== kullaniciId && k.email.toLowerCase() === yeniEmail,
    );

    if (emailKullaniliyor) {
      return res.status(409).json({
        mesaj: "Bu e-posta zaten kullanılıyor.",
      });
    }

    //  Profili güncelle
    kullanici.ad = yeniAd;
    kullanici.email = yeniEmail;

    //  JSON dosyasına kaydet
    await fs.writeFile(
      dosyaYolu,
      JSON.stringify(kullanicilar, null, 2),
      "utf-8",
    );

    //  Güncellenmiş profili gönder
    res.status(200).json({
      mesaj: "Profil başarıyla güncellendi.",
      profil: {
        id: kullanici.id,
        ad: kullanici.ad,
        email: kullanici.email,
        rol: kullanici.rol,
      },
    });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
