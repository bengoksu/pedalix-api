const express = require("express");
const router = express.Router();
const bisikletController = require("../controllers/bisikletController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const bisikletDogrulama = require("../middleware/bisikletDogrulama");

router.get("/", bisikletController.bisikletListele);
router.get("/:id", bisikletController.idIleBisikletGetir);
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  bisikletDogrulama,
  bisikletController.bisikletEkle,
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  bisikletDogrulama,
  bisikletController.bisikletGuncelle,
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  bisikletController.bisikletSil,
);
module.exports = router;
