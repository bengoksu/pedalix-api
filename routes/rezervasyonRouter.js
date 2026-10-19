const express = require("express");
const router = express.Router();
const rezervasyonController = require("../controllers/rezervasyonController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, rezervasyonController.rezervasyonListele);
router.get("/:id", authMiddleware, rezervasyonController.idIleRezervasyonGetir);
router.post("/", authMiddleware, rezervasyonController.rezervasyonOlustur);
router.patch(
  "/:id/iptal",
  authMiddleware,
  rezervasyonController.rezervasyonIptalEt,
);

module.exports = router;
