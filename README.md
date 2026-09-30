# Osman Çoban SMMM Web Sitesi

Serbest Muhasebeci Mali Müşavir Osman Çoban için hazırlanmış, yeni mükellef kazanmaya odaklanan web sitesi demosu.

## İçerik

- Osman Çoban SMMM hizmetlerini pazarlayan ana sayfa
- Yeni mükellef başvuru formu
- Hizmet alanları ve çalışma süreci bölümleri
- Mükellef işlemleri alanı
- Ofis içi takip paneli
- Yaklaşan ve geciken aidat takibi
- Müşteri bazlı evrak yükleme ve indirme
- Eksik evrak görev listesi
- Hatırlatma metni taslağı
- GitHub Pages otomatik dağıtım workflow'u

## Demo Bilgileri

- Ofis paneli PIN: `2026`
- Mükellef işlemleri alanında seçim listesindeki demo erişim kodları kullanılabilir.
- Dosya yükleme ve panel değişiklikleri bu demo sürümde tarayıcı `localStorage` alanında tutulur.

## Yerelde Çalıştırma

```bash
npm install
npm run dev
```

## Yayınlama

1. GitHub'da yeni bir repo oluşturun.
2. Bu klasördeki dosyaları repoya gönderin.
3. GitHub repo ayarlarında `Settings > Pages > Source` için `GitHub Actions` seçin.
4. `main` branch'e push yapıldığında `.github/workflows/deploy.yml` otomatik build alıp GitHub Pages'e yayınlar.

## Üretim Notu

GitHub Pages statik yayın yaptığı için gerçek kullanıcı hesapları, güvenli dosya depolama ve ödeme takibi için üretimde Supabase, Firebase, Appwrite veya özel bir backend bağlanmalıdır. Bu demo, pazarlama sayfası ve mükellef/ofis işlem akışını göstermek için hazırlandı.
