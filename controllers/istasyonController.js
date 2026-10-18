const istasyonService = require("../services/istasyonService");
const ApiHatasi = require("../middleware/ApiHatasi");
const istasyonlariListele = async (req, res, next) => {
  try {
    const istasyonlar = await istasyonService.istasyonlariListele();
    res.status(200).json(istasyonlar);
  } catch (error) {
    next(error);
  }
};
const idIleIstasyonGetir = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const istasyon = await istasyonService.idIleIstasyonGetir(id);
    if (!istasyon) {
      return next(new ApiHatasi("İstasyon bulunamadı.", 404));
    }
    res.status(200).json(istasyon);
  } catch (error) {
    next(error);
  }
};
const istasyonEkle = async (req, res, next) => {
  try {
    const ad = req.body.ad;
    const konum = req.body.konum;
    const kapasite = req.body.kapasite;
    const yeniIstasyon = await istasyonService.istasyonEkle(
      ad,
      konum,
      kapasite,
    );
    res.status(201).json({
      mesaj: "İstasyon başarıyla eklendi.",
      istasyon: yeniIstasyon,
    });
  } catch (error) {
    next(error);
  }
};
const istasyonGuncelle = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const ad = req.body.ad;
    const konum = req.body.konum;
    const kapasite = req.body.kapasite;
    const istasyon = await istasyonService.istasyonGuncelle(
      id,
      ad,
      konum,
      kapasite,
    );
    if (!istasyon) {
      return next(new ApiHatasi("İstasyon bulunamadı.", 404));
    }
    res.status(200).json({
      mesaj: "İstasyon başarıyla güncellendi.",
      istasyon: istasyon,
    });
  } catch (error) {
    next(error);
  }
};
const istasyonSil = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const istasyon = await istasyonService.istasyonSil(id);
    if (!istasyon) {
      return next(new ApiHatasi("İstasyon bulunamadı.", 404));
    }
    res.status(200).json({
      mesaj: "İstasyon başarıyla silindi.",
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  istasyonlariListele,
  idIleIstasyonGetir,
  istasyonEkle,
  istasyonGuncelle,
  istasyonSil,
};
