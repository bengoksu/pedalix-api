const express = require("express");
const router = express.Router();
const bisikletController = require("../controllers/bisikletController");

router.get("/", bisikletController.bisikletListele);
router.get("/:id", bisikletController.idIleBisikletGetir);
router.post("/", bisikletController.bisikletEkle);
router.put("/:id", bisikletController.bisikletGuncelle);
router.delete("/:id", bisikletController.bisikletSil);
module.exports = router;
