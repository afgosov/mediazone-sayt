# Mediazone sayti

Mediazone kontent studiyasi sayti — yangi brendbuk (v1.0, 15.11.2026) asosida. Oddiy statik HTML/CSS/JS: build yoki server kerak emas.

## Sahifalar
| Fayl | Mazmuni |
|---|---|
| `index.html` | Bosh sahifa |
| `studio.html` | 5 ta xona, narxlar, oylik paketlar, fotosessiya, chegirmalar |
| `production.html` | Reels tariflari, alohida montaj, tashqarida syomka |
| `podcast.html` | Podkast tariflari, jonli efir |
| `marketing.html` | Performance marketing |
| `academy.html` | Shogirdlik |
| `aloqa.html` | Bron formasi va narx kalkulyatori |

## Kontaktlarni o'zgartirish
Hammasi bitta faylda: `assets/js/config.js` — telefon, Instagram, Telegram, manzil, xarita havolasi, bron formasi yuboriladigan manzil (`formEndpoint`). Bo'sh qoldirilgan maydon saytda ko'rinmaydi.

## Kompyuterda ochish
```bash
python -m http.server 8787
```
So'ng brauzerda `http://localhost:8787`.

## CI/CD
`.github/workflows/ci-cd.yml`:
- **Har push va pull request** — `scripts/check.py` tekshiradi: har sahifada title, description, viewport; barcha ichki havola, rasm va fayllar mavjud; `#langar`lar to'g'ri; takroriy id yo'q; `config.js` da telefon bor.
- **`main` ga push** — tekshiruv o'tsa, sayt avtomatik GitHub Pages ga chiqadi: https://afgosov.github.io/mediazone-sayt/

Tekshiruvni kompyuterda ishga tushirish:
```bash
python scripts/check.py
```

## Tuzilma
- `assets/css/style.css` — brend ranglari (krem, ko'mir, qum, kul, terrakota) va butun dizayn
- `assets/js/site.js` — sarlavha, menyu, pastki qism, xona chizmalari
- `assets/brand/` — logo SVG fayllari (brendbukdan)
- `assets/fonts/` — Jost va Manrope (woff2)
