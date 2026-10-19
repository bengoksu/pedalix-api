const ApiHatasi = require("../middleware/ApiHatasi");
const rezervasyonService = require("../services/rezervasyonService");
const rezervasyonListele = async (req, res, next) => {
  try {
    const kullaniciId = Number(req.user.id);
    const rezervasyonlar =
      await rezervasyonService.rezervasyonListele(kullaniciId);
    res.status(200).json({ rezervasyonlar });
  } catch (error) {
    next(error);
  }
};
const idIleRezervasyonGetir = async (req, res, next) => {
  try {
    const kullaniciId = Number(req.user.id);
    const id = Number(req.params.id);

    const rezervasyon = await rezervasyonService.idIleRezervasyonGetir(
      kullaniciId,
      id,
    );

    if (!rezervasyon) {
      return next(new ApiHatasi("Rezervasyon bulunamadı.", 404));
    }

    res.status(200).json({ rezervasyon });
  } catch (error) {
    next(error);
  }
};
const rezervasyonOlustur = async (req, res, next) => {
  try {
    const kullaniciId = Number(req.user.id);
    const bisikletId = Number(req.body.bisikletId);
    const yeniRezervasyon = await rezervasyonService.rezervasyonOlustur(
      kullaniciId,
      bisikletId,
    );
    res.status(201).json({
      mesaj: "Rezervasyon başarıyla eklendi.",
      rezervasyon: yeniRezervasyon,
    });
  } catch (error) {
    next(error);
  }
};
const rezervasyonIptalEt = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const kullaniciId = Number(req.user.id);

    const rezervasyon = await rezervasyonService.rezervasyonIptalEt(
      id,
      kullaniciId,
    );
    if (!rezervasyon) {
      return next(new ApiHatasi("rezervasyon bulunamadı", 404));
    }
    res.status(200).json({
      mesaj: "Rezervasyon başarıyla iptal edildi.",
      rezervasyon: rezervasyon,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  rezervasyonListele,
  idIleRezervasyonGetir,
  rezervasyonOlustur,
  rezervasyonIptalEt,
};
