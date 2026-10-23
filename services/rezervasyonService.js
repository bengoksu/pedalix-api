const fs = require("fs/promises");
const path = require("path");
const ApiHatasi = require("../middleware/ApiHatasi");

const rezervasyonListele = async (kullaniciId) => {
  await suresiDolanRezervasyonlariKontrolEt();
  const dosyaYolu = path.join(__dirname, "../data/rezervasyonlar.json");
  const veri = await fs.readFile(dosyaYolu, "utf-8");
  const rezervasyonlar = JSON.parse(veri);
  const kullanicininRezervasyonlari = rezervasyonlar.filter(
    (r) => r.kullaniciId === kullaniciId,
  );
  return kullanicininRezervasyonlari;
};
const idIleRezervasyonGetir = async (kullaniciId, id) => {
  await suresiDolanRezervasyonlariKontrolEt();
  const dosyaYolu = path.join(__dirname, "../data/rezervasyonlar.json");
  const veri = await fs.readFile(dosyaYolu, "utf-8");
  const rezervasyonlar = JSON.parse(veri);

  const rezervasyon = rezervasyonlar.find(
    (r) => r.id === id && r.kullaniciId === kullaniciId,
  );

  return rezervasyon;
};

const rezervasyonOlustur = async (kullaniciId, bisikletId) => {
  await suresiDolanRezervasyonlariKontrolEt();
  // 1. Bisikletler dosyasını oku
  const bisikletDosyaYolu = path.join(__dirname, "../data/bisikletler.json");
  const bisikletVeri = await fs.readFile(bisikletDosyaYolu, "utf-8");
  const bisikletler = JSON.parse(bisikletVeri);

  // 2. İstenen bisikleti bul
  const bulunanBisiklet = bisikletler.find((b) => b.id === bisikletId);

  // 3. Bisiklet var mı?
  if (!bulunanBisiklet) {
    throw new ApiHatasi("Bisiklet bulunamadı.", 404);
  }

  // 4. Bisiklet müsait mi?
  if (bulunanBisiklet.durum !== "musait") {
    throw new ApiHatasi("Bisiklet müsait değil.", 400);
  }

  // 5. Rezervasyonlar dosyasını oku
  const dosyaYolu = path.join(__dirname, "../data/rezervasyonlar.json");
  const veri = await fs.readFile(dosyaYolu, "utf-8");
  const rezervasyonlar = JSON.parse(veri);

  // 6. Yeni rezervasyon ID'si oluştur
  const yeniId = Math.max(0, ...rezervasyonlar.map((r) => r.id)) + 1;

  // 7. Başlangıç ve bitiş zamanını hesapla
  const baslangicZamani = new Date();

  const bitisZamani = new Date(baslangicZamani.getTime() + 10 * 60 * 1000);

  // 8. Yeni rezervasyonu oluştur
  const yeniRezervasyon = {
    id: yeniId,
    kullaniciId,
    bisikletId,
    baslangicZamani: baslangicZamani.toISOString(),
    bitisZamani: bitisZamani.toISOString(),
    durum: "aktif",
  };

  // 9. Bisikletin durumunu değiştir
  bulunanBisiklet.durum = "rezerve";

  // 10. Yeni rezervasyonu diziye ekle
  rezervasyonlar.push(yeniRezervasyon);

  // 11. Bisikletler dosyasını kaydet
  await fs.writeFile(
    bisikletDosyaYolu,
    JSON.stringify(bisikletler, null, 2),
    "utf-8",
  );

  // 12. Rezervasyonlar dosyasını kaydet
  await fs.writeFile(
    dosyaYolu,
    JSON.stringify(rezervasyonlar, null, 2),
    "utf-8",
  );

  // 13. Oluşturulan rezervasyonu Controller'a gönder
  return yeniRezervasyon;
};

const rezervasyonIptalEt = async (id, kullaniciId) => {
  await suresiDolanRezervasyonlariKontrolEt();
  const dosyaYolu = path.join(__dirname, "../data/rezervasyonlar.json");
  const veri = await fs.readFile(dosyaYolu, "utf-8");
  const rezervasyonlar = JSON.parse(veri);

  const rezervasyon = rezervasyonlar.find(
    (r) => r.id === id && r.kullaniciId === kullaniciId,
  );
  if (!rezervasyon) {
    return null;
  }
  if (rezervasyon.durum !== "aktif") {
    throw new ApiHatasi("Yalnızca aktif rezervasyonlar iptal edilebilir.", 400);
  }
  rezervasyon.durum = "iptal";
  const bisikletDosyaYolu = path.join(__dirname, "../data/bisikletler.json");
  const bisikletVeri = await fs.readFile(bisikletDosyaYolu, "utf-8");
  const bisikletler = JSON.parse(bisikletVeri);

  const bulunanBisiklet = bisikletler.find(
    (b) => b.id === rezervasyon.bisikletId,
  );

  if (!bulunanBisiklet) {
    throw new ApiHatasi("Bisiklet bulunamadı.", 404);
  }

  bulunanBisiklet.durum = "musait";
  await fs.writeFile(
    dosyaYolu,
    JSON.stringify(rezervasyonlar, null, 2),
    "utf-8",
  );

  await fs.writeFile(
    bisikletDosyaYolu,
    JSON.stringify(bisikletler, null, 2),
    "utf-8",
  );

  return rezervasyon;
};
const suresiDolanRezervasyonlariKontrolEt = async () => {
  // 1. Rezervasyonları oku
  const rezervasyonDosyaYolu = path.join(
    __dirname,
    "../data/rezervasyonlar.json",
  );

  const rezervasyonVeri = await fs.readFile(rezervasyonDosyaYolu, "utf-8");
  const rezervasyonlar = JSON.parse(rezervasyonVeri);

  // 2. Bisikletleri oku
  const bisikletDosyaYolu = path.join(__dirname, "../data/bisikletler.json");

  const bisikletVeri = await fs.readFile(bisikletDosyaYolu, "utf-8");
  const bisikletler = JSON.parse(bisikletVeri);

  // 3. Şu anki zamanı al
  const simdi = new Date();

  let degisiklikVar = false;

  // 4. Süresi dolmuş rezervasyonları kontrol et
  for (const rezervasyon of rezervasyonlar) {
    if (
      rezervasyon.durum === "aktif" &&
      new Date(rezervasyon.bitisZamani) <= simdi
    ) {
      rezervasyon.durum = "suresi_doldu";

      const bisiklet = bisikletler.find((b) => b.id === rezervasyon.bisikletId);

      if (bisiklet && bisiklet.durum === "rezerve") {
        bisiklet.durum = "musait";
      }

      degisiklikVar = true;
    }
  }

  // 5. Değişiklik varsa dosyaları kaydet
  if (degisiklikVar) {
    await fs.writeFile(
      rezervasyonDosyaYolu,
      JSON.stringify(rezervasyonlar, null, 2),
      "utf-8",
    );

    await fs.writeFile(
      bisikletDosyaYolu,
      JSON.stringify(bisikletler, null, 2),
      "utf-8",
    );
  }
};
module.exports = {
  rezervasyonListele,
  idIleRezervasyonGetir,
  rezervasyonOlustur,
  rezervasyonIptalEt,
  suresiDolanRezervasyonlariKontrolEt,
};
