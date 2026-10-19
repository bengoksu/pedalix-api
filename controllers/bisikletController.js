const ApiHatasi = require("../middleware/ApiHatasi");
const bisikletService = require("../services/bisikletService");

const bisikletListele = async (req, res, next) => {
  try {
    const bisikletler = await bisikletService.bisikletListele();
    res.status(200).json({ bisikletler });
  } catch (error) {
    next(error);
  }
};

const idIleBisikletGetir = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const bisiklet = await bisikletService.idIleBisikletGetir(id);
    if (!bisiklet) {
      return next(new ApiHatasi("bisiklet bulunamadı", 404));
    }
    res.status(200).json(bisiklet);
  } catch (error) {
    next(error);
  }
};
const bisikletEkle = async (req, res, next) => {
  try {
    const istasyonId = Number(req.body.istasyonId);
    const yeniBisiklet = await bisikletService.bisikletEkle(istasyonId);
    res.status(201).json({
      mesaj: "Bisiklet başarıyla eklendi.",
      bisiklet: yeniBisiklet,
    });
  } catch (error) {
    next(error);
  }
};
const bisikletGuncelle = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const istasyonId = Number(req.body.istasyonId);
    const bisiklet = await bisikletService.bisikletGuncelle(id, istasyonId);
    if (!bisiklet) {
      return next(new ApiHatasi("bisiklet bulunamadı", 404));
    }
    res.status(200).json({
      mesaj: "Bisiklet başarıyla güncellendi.",
      bisiklet: bisiklet,
    });
  } catch (error) {
    next(error);
  }
};
const bisikletSil = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const bisiklet = await bisikletService.bisikletSil(id);
    if (!bisiklet) {
      return next(new ApiHatasi("bisiklet bulunamadı", 404));
    }
    res.status(200).json({
      mesaj: "Bisiklet başarıyla silindi.",
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  bisikletListele,
  idIleBisikletGetir,
  bisikletEkle,
  bisikletGuncelle,
  bisikletSil,
};
