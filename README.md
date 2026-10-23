# 🚲 Pedalix API – Bicycle Reservation & Rental System

**Pedalix API**, Node.js ve Express.js kullanılarak geliştirilmiş, bisiklet istasyonlarının, rezervasyonların ve kiralama işlemlerinin yönetilmesini sağlayan bir REST API projesidir.

Proje; kullanıcı kimlik doğrulama, rol bazlı yetkilendirme, istasyon ve bisiklet yönetimi, süreli rezervasyon, kiralama, iade ve otomatik ücret hesaplama süreçlerini kapsamaktadır.

Uygulama, modüler backend mimarisi temel alınarak geliştirilmiş ve API işlemleri Postman üzerinden test edilmiştir.

## 🛠️ Kullanılan Teknolojiler

| Teknoloji | Kullanım Amacı |
|---|---|
| Node.js | Backend geliştirme |
| Express.js | REST API oluşturma |
| JavaScript | Uygulama dili |
| JWT | Kimlik doğrulama |
| bcrypt | Şifrelerin hashlenmesi |
| JSON & File System | Dosya tabanlı veri yönetimi |
| Postman | API testleri |
| Git & GitHub | Versiyon kontrolü |

## ✨ Proje Özellikleri

### 👤 Kullanıcı Yönetimi ve Güvenlik

- Kullanıcı kayıt ve giriş işlemleri
- JWT tabanlı kimlik doğrulama
- bcrypt ile güvenli şifre saklama
- Admin ve normal kullanıcı rolleri
- Profil görüntüleme ve güncelleme
- E-posta adresi tekrarının engellenmesi
- Kullanıcıların yalnızca kendi rezervasyon ve kiralama bilgilerine erişebilmesi
- Yetkisiz işlemlerin middleware üzerinden engellenmesi

### 🚏 İstasyon ve Bisiklet Yönetimi

- İstasyon ekleme, listeleme, güncelleme ve silme
- Bisiklet ekleme, listeleme, güncelleme ve silme
- İstasyon kapasitesi kontrolü
- Bisikletlerin bulunduğu istasyonun takip edilmesi
- Bisiklet durumlarının `musait`, `rezerve` ve `kirada` olarak yönetilmesi
- Kirada veya rezerve edilmiş bisikletlerin silinmesinin engellenmesi

### 📅 Rezervasyon Sistemi

Kullanıcılar müsait bisikletler için **10 dakikalık rezervasyon** oluşturabilir.

- Rezervasyon oluşturma ve iptal etme
- Rezervasyon başlangıç ve bitiş zamanlarının tutulması
- Süresi dolan rezervasyonların `suresi_doldu` olarak güncellenmesi
- Süresi dolan rezervasyonlara ait bisikletlerin yeniden müsait hâle getirilmesi
- Rezervasyonların kiralamaya dönüştürülmesi
- Rezervasyon geçmişinin saklanması

Rezervasyon süresi kontrolü, ilgili API istekleri sırasında gerçekleştirilir.

### 🚴 Kiralama ve İade Sistemi

- Rezervasyonlu veya doğrudan bisiklet kiralama
- Kullanıcı başına tek aktif kiralama kontrolü
- Başka kullanıcıya rezerve edilen bisikletin kiralanmasının engellenmesi
- Kiralama başlangıç ve bitiş zamanlarının kaydedilmesi
- Bisikletin farklı bir istasyona iade edilebilmesi
- Dolu istasyona iadenin engellenmesi
- Aynı kiralamanın ikinci kez iade edilmesinin engellenmesi
- Kiralama geçmişinin ve ücret bilgilerinin saklanması

### 💰 Ücretlendirme Sistemi

Kiralama tamamlandığında süreye göre ücret otomatik hesaplanır.

| Kural | Açıklama |
|---|---|
| İlk kiralama | Günün ilk kiralamasında ilk 15 dakika ücretsiz |
| Ücretlendirme | Sonraki her başlayan 30 dakika için 20 TL |
| Diğer kiralamalar | Aynı gün sonraki kiralamalarda ücretsiz süre uygulanmaz |
| Gün hesabı | Türkiye saat dilimi (Europe/Istanbul) |

Ücret hesaplama sistemde gerçekleştirilir; gerçek ödeme entegrasyonu bulunmamaktadır.

## 🏗️ Proje Mimarisi

Proje, sorumlulukların birbirinden ayrıldığı modüler bir yapıda geliştirilmiştir.

- **Routes:** API endpoint'lerinin tanımlanması
- **Controllers:** HTTP istek ve yanıtlarının yönetimi
- **Services:** İş kurallarının ve veri işlemlerinin gerçekleştirilmesi
- **Middleware:** Kimlik doğrulama, yetkilendirme, veri doğrulama ve hata yönetimi
- **Data:** JSON dosyaları üzerinden veri saklama

```text
pedalix-api/
├── controllers/
├── services/
├── routes/
├── middleware/
├── data/
├── server.js
├── package.json
├── .gitignore
└── README.md
```

## 🔗 API Endpoints

| Method | Endpoint | İşlem |
|---|---|---|
| POST | `/auth/register` | Kullanıcı kaydı |
| POST | `/auth/login` | Kullanıcı girişi |
| GET, PATCH | `/auth/profile` | Profil görüntüleme ve güncelleme |
| GET, POST | `/istasyonlar` | İstasyon listeleme ve ekleme |
| GET, PUT, DELETE | `/istasyonlar/:id` | İstasyon detay, güncelleme ve silme |
| GET, POST | `/bisikletler` | Bisiklet listeleme ve ekleme |
| GET, PUT, DELETE | `/bisikletler/:id` | Bisiklet detay, güncelleme ve silme |
| GET, POST | `/rezervasyonlar` | Rezervasyon listeleme ve oluşturma |
| GET | `/rezervasyonlar/:id` | Rezervasyon detayları |
| PATCH | `/rezervasyonlar/:id/iptal` | Rezervasyon iptali |
| GET, POST | `/kiralamalar` | Kiralama listeleme ve başlatma |
| GET | `/kiralamalar/:id` | Kiralama detayları |
| PATCH | `/kiralamalar/:id/iade` | Bisiklet iadesi |

İstasyon ve bisiklet ekleme, güncelleme ve silme işlemleri Admin yetkisi gerektirir. Rezervasyon, kiralama ve profil işlemlerinde JWT ile kimlik doğrulama kullanılır.

## 🧪 API Testleri

Postman üzerinden aşağıdaki senaryolar test edilmiştir:

- Kullanıcı kayıt, giriş ve profil güncelleme
- JWT ve rol bazlı erişim kontrolleri
- Rezervasyon oluşturma, iptal ve süre dolması
- Aynı kullanıcının birden fazla aktif kiralama başlatmasının engellenmesi
- Başka kullanıcıya ait rezervasyon ve kiralama işlemlerinin engellenmesi
- İstasyon kapasitesi dolduğunda iadenin reddedilmesi
- Tamamlanan kiralamanın tekrar iade edilememesi
- Kiralama ücreti hesaplama
 ### Postman Collection Genel Görünümü
 
 Pedalix API'nin endpoint'leri ve test senaryoları
 Postman Collection içerisinde düzenlenmiştir.
<img width="296" height="701" alt="image" src="https://github.com/user-attachments/assets/b28dd07e-6e13-4d95-97ef-fec08e54c742" />
<img width="392" height="310" alt="image" src="https://github.com/user-attachments/assets/b33b5af5-b56f-4c39-bfe3-92389b781bfa" />
## 📸 Bazı API Ekran Görüntüleri

Projenin temel işlevleri Postman kullanılarak test edilmiştir. Aşağıdaki ekran görüntüleri başarılı API işlemlerini göstermektedir.

### Kullanıcı Girişi

<img width="697" height="447" alt="image" src="https://github.com/user-attachments/assets/cd35ae33-14eb-405c-a541-391dae2e9a0b" />

### Bisiklet Listeleme

<img width="695" height="897" alt="image" src="https://github.com/user-attachments/assets/ebc2a226-f915-4cb5-bb93-f42ec3d8c8c1" />

### Rezervasyon Oluşturma

<img width="687" height="516" alt="image" src="https://github.com/user-attachments/assets/76e8bef9-e907-4f1a-8c78-ae38d081bbf8" />

### Kiralama Başlatma

<img width="687" height="563" alt="image" src="https://github.com/user-attachments/assets/fdbecdc3-f831-4f09-9076-fe39ea1c45fb" />

### Bisiklet İadesi ve Ücret Hesaplama

<img width="686" height="570" alt="image" src="https://github.com/user-attachments/assets/d24dc6d9-b02a-4ddd-8095-372ef5588cf7" />

### 🔐 Bazı Güvenlik ve İş Kuralı Testleri

Pedalix API'de yetkisiz erişimler ve geçersiz kiralama
işlemleri Postman üzerinden test edilmiştir.

#### Kiradaki Bisikletin Yeniden Kiralanmasının Engellenmesi
<img width="517" height="400" alt="image" src="https://github.com/user-attachments/assets/363795a8-76a9-46bb-a0ad-9dfd53ca9990" />

#### Başka Kullanıcının Kiralamasına Müdahalenin Engellenmesi
<img width="516" height="417" alt="image" src="https://github.com/user-attachments/assets/9b60cd31-1a18-4818-9275-d3f78be8fe81" />

#### İstasyon Kapasitesi Kontrolü
<img width="508" height="407" alt="image" src="https://github.com/user-attachments/assets/201e89a6-8775-43a7-8272-882911868e52" />

#### Tekrarlanan İade İşleminin Engellenmesi
<img width="522" height="412" alt="image" src="https://github.com/user-attachments/assets/9b5950d8-0aeb-4325-a231-1a8c218de86f" />

## 🚀 Kurulum ve Çalıştırma

**1. Projeyi klonlayın:**

```bash
git clone https://github.com/bengoksu/pedalix-api.git
cd pedalix-api
```
**2. Gerekli paketleri yükleyin:**

```bash
npm install
```
**3. Proje ana dizininde `.env` dosyası oluşturun:**

```env
JWT_SECRET=your_secure_secret_key
```
**4. Veri dosyalarını hazırlayın:**

`data/` klasöründe aşağıdaki JSON dosyalarının bulunduğundan emin olun:

- `kullanicilar.json`
- `istasyonlar.json`
- `bisikletler.json`
- `rezervasyonlar.json`
- `kiralamalar.json`

Eksik dosyaları başlangıç içeriği `[]` olacak şekilde oluşturabilirsiniz.

**5. Sunucuyu başlatın:**

```bash
node server.js
```

API varsayılan olarak `http://localhost:3000` adresinde çalışır.

## 📌 Proje Notları

Bu proje backend geliştirme ve REST API mimarisini uygulamak amacıyla hazırlanmıştır.

Veriler JSON dosyalarında saklanmaktadır. Eşzamanlı veri işlemleri için veritabanı transaction garantisi bulunmamaktadır. Gerçek ödeme, QR kod ve fiziksel bisiklet kilidi entegrasyonu proje kapsamında yer almamaktadır.

## 👩‍💻 Geliştirici

**Göksu Balaban**  
Computer Engineering Student | Backend & AI Developer

GitHub: [bengoksu](https://github.com/bengoksu)
