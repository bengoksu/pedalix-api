const fs = require("fs/promises");
const path = require("path");

const istasyonlariListele = async () => {
  const dosyaYolu = path.join(__dirname, "../data/istasyonlar.json");
  const veri = await fs.readFile(dosyaYolu, "utf-8");
  const istasyonlar = JSON.parse(veri);

  return istasyonlar;
};

const idIleIstasyonGetir = async (id) => {
  const dosyaYolu = path.join(__dirname, "../data/istasyonlar.json");
  const veri = await fs.readFile(dosyaYolu, "utf-8");
  const istasyonlar = JSON.parse(veri);

  const istasyon = istasyonlar.find((i) => i.id === id);

  return istasyon;
};
const istasyonEkle = async (ad, konum, kapasite) => {
  const dosyaYolu = path.join(__dirname, "../data/istasyonlar.json");
  const veri = await fs.readFile(dosyaYolu, "utf-8");
  const istasyonlar = JSON.parse(veri);

  const yeniId = Math.max(0, ...istasyonlar.map((i) => i.id)) + 1;

  const yeniIstasyon = {
    id: yeniId,
    ad: ad,
    konum: konum,
    kapasite: kapasite,
  };

  istasyonlar.push(yeniIstasyon);

  await fs.writeFile(dosyaYolu, JSON.stringify(istasyonlar, null, 2), "utf-8");

  return yeniIstasyon;
};
const istasyonGuncelle = async (id, ad, konum, kapasite) => {
  const dosyaYolu = path.join(__dirname, "../data/istasyonlar.json");
  const veri = await fs.readFile(dosyaYolu, "utf-8");
  const istasyonlar = JSON.parse(veri);

  const istasyon = istasyonlar.find((i) => i.id === id);

  if (!istasyon) {
    return null;
  }

  istasyon.ad = ad;
  istasyon.konum = konum;
  istasyon.kapasite = kapasite;

  await fs.writeFile(dosyaYolu, JSON.stringify(istasyonlar, null, 2), "utf-8");

  return istasyon;
};
const istasyonSil = async (id) => {
  const dosyaYolu = path.join(__dirname, "../data/istasyonlar.json");
  const veri = await fs.readFile(dosyaYolu, "utf-8");
  const istasyonlar = JSON.parse(veri);

  const index = istasyonlar.findIndex((i) => i.id === id);

  if (index === -1) {
    return false;
  }

  istasyonlar.splice(index, 1);

  await fs.writeFile(dosyaYolu, JSON.stringify(istasyonlar, null, 2), "utf-8");

  return true;
};
module.exports = {
  istasyonlariListele,
  idIleIstasyonGetir,
  istasyonEkle,
  istasyonGuncelle,
  istasyonSil,
};
