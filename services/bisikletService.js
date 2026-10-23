const fs = require("fs/promises");
const path = require("path");
const istasyonService = require("./istasyonService");
const rezervasyonService = require("./rezervasyonService");
const ApiHatasi = require("../middleware/ApiHatasi");

const bisikletListele = async () => {
  await rezervasyonService.suresiDolanRezervasyonlariKontrolEt();
  const dosyaYolu = path.join(__dirname, "../data/bisikletler.json");
  const veri = await fs.readFile(dosyaYolu, "utf-8");
  const bisikletler = JSON.parse(veri);

  return bisikletler;
};

const idIleBisikletGetir = async (id) => {
  const dosyaYolu = path.join(__dirname, "../data/bisikletler.json");
  const veri = await fs.readFile(dosyaYolu, "utf-8");
  const bisikletler = JSON.parse(veri);
  const bisiklet = bisikletler.find((b) => b.id === id);

  return bisiklet;
};

const bisikletEkle = async (istasyonId) => {
  // 1. İstasyon gerçekten var mı kontrol et
  const istasyon = await istasyonService.idIleIstasyonGetir(istasyonId);

  if (!istasyon) {
    return null;
  }

  // 2. Bisikletleri JSON dosyasından oku
  const dosyaYolu = path.join(__dirname, "../data/bisikletler.json");
  const veri = await fs.readFile(dosyaYolu, "utf-8");
  const bisikletler = JSON.parse(veri);

  const mevcutBisikletSayisi = bisikletler.filter(
    (b) => b.istasyonId === istasyonId,
  ).length;

  if (mevcutBisikletSayisi >= istasyon.kapasite) {
    throw new ApiHatasi("İstasyon kapasitesi dolu.", 400);
  }
  // 3. Yeni ID oluştur
  const yeniId = Math.max(0, ...bisikletler.map((b) => b.id)) + 1;

  // 4. Yeni bisikleti oluştur
  const yeniBisiklet = {
    id: yeniId,
    istasyonId: istasyonId,
    durum: "musait",
  };

  // 5. Bisikleti diziye ekle
  bisikletler.push(yeniBisiklet);

  // 6. JSON dosyasına kaydet
  await fs.writeFile(dosyaYolu, JSON.stringify(bisikletler, null, 2), "utf-8");

  // 7. Yeni bisikleti Controller'a gönder
  return yeniBisiklet;
};
const bisikletGuncelle = async (id, istasyonId) => {
  const dosyaYolu = path.join(__dirname, "../data/bisikletler.json");
  const veri = await fs.readFile(dosyaYolu, "utf-8");
  const bisikletler = JSON.parse(veri);
  const bisiklet = bisikletler.find((b) => b.id === id);
  if (!bisiklet) {
    return null;
  }
  // Yeni istasyon gerçekten var mı?
  const istasyon = await istasyonService.idIleIstasyonGetir(istasyonId);
  if (!istasyon) {
    throw new ApiHatasi("İstasyon bulunamadı.", 404);
  }
  const mevcutBisikletSayisi = bisikletler.filter(
    (b) => b.istasyonId === istasyonId && b.id !== id,
  ).length;

  if (mevcutBisikletSayisi >= istasyon.kapasite) {
    throw new ApiHatasi("İstasyon kapasitesi dolu.", 400);
  }
  if (bisiklet.durum === "kirada") {
    throw new ApiHatasi("Kiradaki bisiklet taşınamaz.", 400);
  }
  bisiklet.istasyonId = istasyonId;

  await fs.writeFile(dosyaYolu, JSON.stringify(bisikletler, null, 2), "utf-8");

  return bisiklet;
};
const bisikletSil = async (id) => {
  const dosyaYolu = path.join(__dirname, "../data/bisikletler.json");
  const veri = await fs.readFile(dosyaYolu, "utf-8");
  const bisikletler = JSON.parse(veri);
  const index = bisikletler.findIndex((b) => b.id === id);
  if (index === -1) {
    return false;
  }
  const bisiklet = bisikletler[index];

  if (bisiklet.durum === "kirada" || bisiklet.durum === "rezerve") {
    throw new ApiHatasi("Kiradaki veya rezerve bisiklet silinemez.", 400);
  }
  bisikletler.splice(index, 1);
  await fs.writeFile(dosyaYolu, JSON.stringify(bisikletler, null, 2), "utf-8");
  return true;
};
module.exports = {
  bisikletListele,
  idIleBisikletGetir,
  bisikletEkle,
  bisikletGuncelle,
  bisikletSil,
};
