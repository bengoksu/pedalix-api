const express = require("express");
const fs = require("fs/promises");
const path = require("path");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const istasyonDogrulama = require("../middleware/istasyonDoğrulama");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const dosyaYolu = path.join(__dirname, "../data/istasyonlar.json");
    const veri = await fs.readFile(dosyaYolu, "utf-8");
    const istasyonlar = JSON.parse(veri);
    res.status(200).json(istasyonlar);
  } catch (error) {
    res.status(500).json({ error: "İstasyonlar verisi alınamadı." });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const dosyaYolu = path.join(__dirname, "../data/istasyonlar.json");
    const veri = await fs.readFile(dosyaYolu, "utf-8");
    const istasyonlar = JSON.parse(veri);
    const istasyon = istasyonlar.find((i) => i.id === id);
    if (!istasyon) {
      return res.status(404).json({ error: "İstasyon bulunamadı." });
    }
    res.status(200).json(istasyon);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "İstasyon verisi alınamadı." });
  }
});
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  istasyonDogrulama,
  async (req, res) => {
    try {
      const ad = req.body.ad;
      const konum = req.body.konum;
      const kapasite = req.body.kapasite;

      const dosyaYolu = path.join(__dirname, "../data/istasyonlar.json");
      const veri = await fs.readFile(dosyaYolu, "utf-8");
      const istasyonlar = JSON.parse(veri);
      const yeniId =
        Math.max(...istasyonlar.map((istasyon) => istasyon.id)) + 1;
      const yeniIstasyon = {
        id: yeniId,
        ad: req.body.ad,
        konum: req.body.konum,
        kapasite: req.body.kapasite,
      };
      istasyonlar.push(yeniIstasyon);
      await fs.writeFile(
        dosyaYolu,
        JSON.stringify(istasyonlar, null, 2),
        "utf-8",
      );
      res
        .status(201)
        .json({
          message: "İstasyon başarıyla eklendi.",
          istasyon: yeniIstasyon,
        });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "İstasyon eklenemedi." });
    }
  },
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  istasyonDogrulama,
  async (req, res) => {
    try {
      const id = req.params.id;
      const dosyaYolu = path.join(__dirname, "../data/istasyonlar.json");
      const veri = await fs.readFile(dosyaYolu, "utf-8");
      const istasyonlar = JSON.parse(veri);
      const istasyon = istasyonlar.find((i) => i.id === Number(id));
      if (!istasyon) {
        return res.status(404).json({ error: "İstasyon bulunamadı." });
      }
      istasyon.ad = req.body.ad;
      istasyon.konum = req.body.konum;
      istasyon.kapasite = req.body.kapasite;

      await fs.writeFile(
        dosyaYolu,
        JSON.stringify(istasyonlar, null, 2),
        "utf-8",
      );
      res
        .status(200)
        .json({ mesaj: "istasyon başarıyla güncellendi.", istasyon: istasyon });
    } catch (error) {
      res.status(500).json({
        mesaj: "İstasyon güncellenemedi.",
      });
    }
  },
);
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const dosyaYolu = path.join(__dirname, "../data/istasyonlar.json");
    const veri = await fs.readFile(dosyaYolu, "utf-8");
    const istasyonlar = JSON.parse(veri);
    const index = istasyonlar.findIndex((i) => i.id === id);

    if (index === -1) {
      return res.status(404).json({ mesaj: "istasyon bulunamadı." });
    }
    istasyonlar.splice(index, 1);

    await fs.writeFile(
      dosyaYolu,
      JSON.stringify(istasyonlar, null, 2),
      "utf-8",
    );
    res.status(200).json({ mesaj: "istasyon silindi." });
  } catch (error) {
    res.status(500).json({ mesaj: "istasyon silinemedi." });
  }
});

module.exports = router;
