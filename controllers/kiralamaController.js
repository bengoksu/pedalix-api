const ApiHatasi = require("../middleware/ApiHatasi");
const kiralamaService = require("../services/kiralamaService.js");
const kiralamaListele = async (req, res, next) => {
  try {
    const kullaniciId = Number(req.user.id);
    const kiralamalar = await kiralamaService.kiralamaListele(kullaniciId);

    res.status(200).json({ kiralamalar });
  } catch (error) {
    next(error);
  }
};
const idIleKiralamaGetir = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const kullaniciId = Number(req.user.id);
    const kiralama = await kiralamaService.idIleKiralamaGetir(id, kullaniciId);
    if (!kiralama) {
      return next(new ApiHatasi("kiralama bulunamadı", 404));
    }
    res.status(200).json({ kiralama });
  } catch (error) {
    next(error);
  }
};
const kiralamaBaslat = async (req, res, next) => {
  try {
    const kullaniciId = Number(req.user.id);
    const bisikletId = Number(req.body.bisikletId);

    const yeniKiralama = await kiralamaService.kiralamaBaslat(
      kullaniciId,
      bisikletId,
    );
    res.status(201).json({
      mesaj: "Kiralama başarıyla başlatıldı.",
      kiralama: yeniKiralama,
    });
  } catch (error) {
    next(error);
  }
};
const kiralamaIadeEt = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const kullaniciId = Number(req.user.id);
    const istasyonId = Number(req.body.istasyonId);
    const kiralama = await kiralamaService.kiralamaIadeEt(
      id,
      kullaniciId,
      istasyonId,
    );
    if (!kiralama) {
      return next(new ApiHatasi("Kiralama bulunamadı.", 404));
    }
    res.status(200).json({
      mesaj: "Bisiklet başarıyla iade edildi.",
      kiralama,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  kiralamaListele,
  idIleKiralamaGetir,
  kiralamaBaslat,
  kiralamaIadeEt,
};
