const hataYakalayici = (err, req, res, next) => {
  const durumKodu = err.durumKodu || 500;

  return res.status(durumKodu).json({
    mesaj: err.message || "Sunucu hatası oluştu.",
  });
};

module.exports = hataYakalayici;
