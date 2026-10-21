const path = require("path");
const fs = require("fs/promises");
const ApiHatasi = require("../middleware/ApiHatasi");
const kiralamaListele = async (kullaniciId) => {
  const dosyaYolu = path.join(__dirname, "../data/kiralamalar.json");
  const veri = await fs.readFile(dosyaYolu, "utf-8");
  const kiralamalar = JSON.parse(veri);
  const kullanicininKiralamalari = kiralamalar.filter(
    (k) => k.kullaniciId === kullaniciId,
  );
  return kullanicininKiralamalari;
};
const idIleKiralamaGetir = async (id, kullaniciId) => {
  const dosyaYolu = path.join(__dirname, "../data/kiralamalar.json");
  const veri = await fs.readFile(dosyaYolu, "utf-8");
  const kiralamalar = JSON.parse(veri);
  const kiralama = kiralamalar.find(
    (k) => k.id === id && k.kullaniciId === kullaniciId,
  );
  return kiralama;
};
const kiralamaBaslat = async (kullaniciId, bisikletId) => {
  // 1. Bisikleti bul ve kontrol et
  const bisikletDosyaYolu = path.join(__dirname, "../data/bisikletler.json");
  const bisikletVeri = await fs.readFile(bisikletDosyaYolu, "utf-8");
  const bisikletler = JSON.parse(bisikletVeri);

  if (!Number.isInteger(bisikletId) || bisikletId <= 0) {
    throw new ApiHatasi("Geçerli bir bisiklet ID giriniz.", 400);
  }

  const bisiklet = bisikletler.find((b) => b.id === bisikletId);

  if (!bisiklet) {
    throw new ApiHatasi("Bisiklet bulunamadı.", 404);
  }

  if (bisiklet.durum === "kirada") {
    throw new ApiHatasi("Bisiklet zaten kirada.", 400);
  }

  // 2. Kullanıcının aktif kiralaması var mı?
  const kiralamaDosyaYolu = path.join(__dirname, "../data/kiralamalar.json");
  const kiralamaVeri = await fs.readFile(kiralamaDosyaYolu, "utf-8");
  const kiralamalar = JSON.parse(kiralamaVeri);

  const aktifKiralama = kiralamalar.find(
    (k) => k.kullaniciId === kullaniciId && k.durum === "aktif",
  );

  if (aktifKiralama) {
    throw new ApiHatasi("Zaten aktif bir kiralamanız var.", 400);
  }

  // 3. Rezervasyonları oku
  const rezervasyonDosyaYolu = path.join(
    __dirname,
    "../data/rezervasyonlar.json",
  );

  const rezervasyonVeri = await fs.readFile(rezervasyonDosyaYolu, "utf-8");
  const rezervasyonlar = JSON.parse(rezervasyonVeri);

  const simdi = new Date();

  const aktifRezervasyon = rezervasyonlar.find(
    (r) => r.bisikletId === bisikletId && r.durum === "aktif",
  );

  // 4. Bisiklet rezerveyse gerekli kontrolleri yap
  if (bisiklet.durum === "rezerve") {
    if (!aktifRezervasyon) {
      throw new ApiHatasi("Aktif rezervasyon bulunamadı.", 400);
    }

    if (aktifRezervasyon.kullaniciId !== kullaniciId) {
      throw new ApiHatasi("Bisiklet başka kullanıcıya rezerve.", 403);
    }

    if (new Date(aktifRezervasyon.bitisZamani) <= simdi) {
      throw new ApiHatasi("Rezervasyon süresi dolmuş.", 400);
    }
  } else if (bisiklet.durum !== "musait") {
    throw new ApiHatasi("Bisiklet kiralamaya uygun değil.", 400);
  }

  if (bisiklet.istasyonId == null) {
    throw new ApiHatasi("Bisiklet bir istasyonda bulunmuyor.", 400);
  }

  // 5. Yeni kiralamayı oluştur
  const yeniId = Math.max(0, ...kiralamalar.map((k) => k.id)) + 1;

  const yeniKiralama = {
    id: yeniId,
    kullaniciId,
    bisikletId,
    baslangicZamani: simdi.toISOString(),
    bitisZamani: null,
    baslangicIstasyonId: bisiklet.istasyonId,
    bitisIstasyonId: null,
    durum: "aktif",
    ucret: 0,
  };

  // 6. Bisiklet rezervasyonla mı kiralandı?
  const rezervasyonlaKiralandi = bisiklet.durum === "rezerve";

  // 7. Bisikletin durumunu güncelle
  bisiklet.durum = "kirada";
  bisiklet.istasyonId = null;

  // 8. Rezervasyon varsa kullanıldı olarak işaretle
  if (rezervasyonlaKiralandi) {
    aktifRezervasyon.durum = "kullanildi";
  }

  // 9. Yeni kiralamayı listeye ekle
  kiralamalar.push(yeniKiralama);

  // 10. Değişiklikleri dosyalara kaydet
  await fs.writeFile(
    bisikletDosyaYolu,
    JSON.stringify(bisikletler, null, 2),
    "utf-8",
  );

  await fs.writeFile(
    kiralamaDosyaYolu,
    JSON.stringify(kiralamalar, null, 2),
    "utf-8",
  );

  if (rezervasyonlaKiralandi) {
    await fs.writeFile(
      rezervasyonDosyaYolu,
      JSON.stringify(rezervasyonlar, null, 2),
      "utf-8",
    );
  }

  // 11. Oluşturulan kiralamayı Controller'a gönder
  return yeniKiralama;
};
const kiralamaIadeEt = async (id, kullaniciId, istasyonId) => {
  // 1. Kiralamaları oku ve kiralamayı bul
  const kiralamaDosyaYolu = path.join(__dirname, "../data/kiralamalar.json");
  const kiralamaVeri = await fs.readFile(kiralamaDosyaYolu, "utf-8");
  const kiralamalar = JSON.parse(kiralamaVeri);

  const kiralama = kiralamalar.find(
    (k) => k.id === id && k.kullaniciId === kullaniciId,
  );

  if (!kiralama) {
    return null;
  }

  if (kiralama.durum !== "aktif") {
    throw new ApiHatasi("Bu kiralama zaten tamamlanmış.", 400);
  }

  // 2. İade istasyonunu kontrol et
  if (!Number.isInteger(istasyonId) || istasyonId <= 0) {
    throw new ApiHatasi("Geçerli bir istasyon ID giriniz.", 400);
  }

  const istasyonDosyaYolu = path.join(__dirname, "../data/istasyonlar.json");
  const istasyonVeri = await fs.readFile(istasyonDosyaYolu, "utf-8");
  const istasyonlar = JSON.parse(istasyonVeri);

  const istasyon = istasyonlar.find((i) => i.id === istasyonId);

  if (!istasyon) {
    throw new ApiHatasi("İstasyon bulunamadı.", 404);
  }

  // 3. Bisikletleri oku ve kiralanan bisikleti bul
  const bisikletDosyaYolu = path.join(__dirname, "../data/bisikletler.json");
  const bisikletVeri = await fs.readFile(bisikletDosyaYolu, "utf-8");
  const bisikletler = JSON.parse(bisikletVeri);

  const bisiklet = bisikletler.find((b) => b.id === kiralama.bisikletId);

  if (!bisiklet || bisiklet.durum !== "kirada") {
    throw new ApiHatasi(
      "Kiralanan bisiklet bulunamadı veya kirada değil.",
      400,
    );
  }

  // 4. İstasyonda boş yer var mı?
  const istasyondakiBisikletSayisi = bisikletler.filter(
    (b) => b.istasyonId === istasyonId,
  ).length;

  if (istasyondakiBisikletSayisi >= istasyon.kapasite) {
    throw new ApiHatasi("İstasyon kapasitesi dolu.", 400);
  }

  // 5. Kiralama süresini hesapla
  const bitisZamani = new Date();
  const baslangicZamani = new Date(kiralama.baslangicZamani);

  const sureDakika = Math.max(
    1,
    Math.ceil((bitisZamani - baslangicZamani) / (60 * 1000)),
  );

  // 6. Günün ilk kiralaması mı?
  // Gün sınırını Türkiye saatine (Europe/Istanbul) göre belirle
  const turkiyeTarihi = (tarih) =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Istanbul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(tarih);

  const kiralamaGunu = turkiyeTarihi(baslangicZamani);

  const gununIlkKiralamasi = !kiralamalar.some(
    (k) =>
      k.kullaniciId === kullaniciId &&
      k.id !== id &&
      turkiyeTarihi(new Date(k.baslangicZamani)) === kiralamaGunu &&
      new Date(k.baslangicZamani) < baslangicZamani,
  );

  // 7. Ücreti hesapla
  let ucret;

  if (gununIlkKiralamasi) {
    const ucretliDakika = Math.max(0, sureDakika - 15);
    ucret = Math.ceil(ucretliDakika / 30) * 20;
  } else {
    ucret = Math.ceil(sureDakika / 30) * 20;
  }

  // 8. Kiralamayı tamamla
  kiralama.bitisZamani = bitisZamani.toISOString();
  kiralama.bitisIstasyonId = istasyonId;
  kiralama.durum = "tamamlandi";
  kiralama.ucret = ucret;

  // 9. Bisikleti iade istasyonuna yerleştir
  bisiklet.istasyonId = istasyonId;
  bisiklet.durum = "musait";

  // 10. Değişiklikleri kaydet
  await fs.writeFile(
    kiralamaDosyaYolu,
    JSON.stringify(kiralamalar, null, 2),
    "utf-8",
  );

  await fs.writeFile(
    bisikletDosyaYolu,
    JSON.stringify(bisikletler, null, 2),
    "utf-8",
  );

  // 11. Tamamlanan kiralamayı Controller'a gönder
  return kiralama;
};

module.exports = {
  kiralamaListele,
  idIleKiralamaGetir,
  kiralamaBaslat,
  kiralamaIadeEt,
};
