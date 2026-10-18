const express = require("express");
const fs = require("fs/promises");
const path = require("path");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const istasyonDogrulama = require("../middleware/istasyonDoğrulama");
const ApiHatasi = require("../middleware/ApiHatasi");
const istasyonController = require("../controllers/istasyonController");
const router = express.Router();

router.get("/", istasyonController.istasyonlariListele);
router.get("/:id", istasyonController.idIleIstasyonGetir);

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  istasyonDogrulama,
  istasyonController.istasyonEkle,
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  istasyonDogrulama,
  istasyonController.istasyonGuncelle,
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  istasyonController.istasyonSil,
);

module.exports = router;
