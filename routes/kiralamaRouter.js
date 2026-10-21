const express = require("express");
const router = express.Router();

const kiralamaController = require("../controllers/kiralamaController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, kiralamaController.kiralamaListele);
router.get("/:id", authMiddleware, kiralamaController.idIleKiralamaGetir);
router.post("/", authMiddleware, kiralamaController.kiralamaBaslat);
router.patch("/:id/iade", authMiddleware, kiralamaController.kiralamaIadeEt);

module.exports = router;
