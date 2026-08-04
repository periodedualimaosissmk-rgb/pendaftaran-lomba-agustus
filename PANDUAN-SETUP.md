# Panduan Setup — Website Lomba Agustusan
### SMKS Tunas Harapan Pasarkemis

Website ini terdiri dari halaman statis (HTML/CSS/JS) + Google Spreadsheet
sebagai "database". Setiap lomba otomatis punya **sheet (tab) sendiri**,
dibuat otomatis saat ada pendaftar pertama.

## 1. Struktur file

```
index.html                 → halaman utama, daftar 8 lomba
style.css                  → tampilan (dipakai semua halaman)
script.js                  → logika form (dipakai semua halaman lomba)
config.js                  → tempat menaruh URL Google Apps Script
apps-script.gs              → kode backend, ditempel di Google Apps Script

estafet-sarung/index.html
paku-botol/index.html
estafet-cup/index.html
balon-cacing/index.html
estafet-tepung/index.html
spons-air/index.html
ember-air/index.html
tarik-tambang/index.html
```

Setiap lomba punya foldernya sendiri berisi `index.html` masing-masing,
saling terhubung lewat tautan biasa dari halaman utama.

Nama sheet yang akan otomatis dibuat di Spreadsheet:

| Lomba | Nama Sheet |
|---|---|
| Estafet Sarung | `Estafet Sarung` |
| Masukin Paku ke Botol | `Masukin Paku ke Botol` |
| Estafet Cup Gelas | `Estafet Cup Gelas` |
| Estafet Balon Cacing | `Estafet Balon Cacing` |
| Estafet Tepung | `Estafet Tepung` |
| Estafet Spons Air | `Estafet Spons Air` |
| Estafet Ember Air | `Estafet Ember Air` |
| Tarik Tambang | `Tarik Tambang` |

Setiap sheet punya kolom: **Waktu Daftar, Nama Tim/Peserta, Kelas, Anggota,
No. WhatsApp**. Kolom **Kelas** wajib diisi peserta saat mendaftar, dengan
pilihan: X TKR, X MP, X TKJ, XI TKR, XI MP, XI TKJ.

## 2. Buat Google Spreadsheet + Apps Script

1. Buka **sheets.google.com** → buat spreadsheet baru, beri nama misalnya
   "Database Lomba Agustusan SMKS THP".
2. Di menu, klik **Ekstensi (Extensions) → Apps Script**.
3. Hapus kode default di editor, lalu **copy-paste seluruh isi file
   `apps-script.gs`** ke sana.
4. Klik **Simpan** (ikon disket).
5. Klik tombol **Deploy → New deployment (Deployment baru)**.
   - Pilih tipe: **Web app**.
   - Execute as: **Me (Saya)**.
   - Who has access: **Anyone (Siapa saja)** — supaya form di website bisa
     mengirim data tanpa login Google.
6. Klik **Deploy**, lalu **izinkan akses** saat diminta (Authorize access).
7. Setelah selesai, kamu akan dapat **URL Web App**, contoh:
   ```
   https://script.google.com/macros/s/AKfycb...xyz/exec
   ```

## 3. Sambungkan website ke Apps Script

Buka file **`config.js`**, ganti baris:

```js
window.GAS_URL = "PASTE_URL_WEB_APP_ANDA_DI_SINI";
```

menjadi URL yang kamu dapat di langkah sebelumnya, contoh:

```js
window.GAS_URL = "https://script.google.com/macros/s/AKfycb...xyz/exec";
```

Simpan file. Website siap dipakai — setiap kali ada yang klik "Daftar
Sekarang", data langsung masuk ke sheet sesuai nama lombanya.

## 4. Coba jalankan

- Buka `index.html` di browser (bisa langsung dobel-klik, atau upload
  semua file & folder ke hosting seperti Netlify/GitHub Pages/Vercel —
  struktur folder per lomba tetap dipertahankan).
- Klik salah satu lomba, isi kelas, nama tim, nama anggota, lalu klik
  **Daftar Sekarang**.
- Cek Spreadsheet kamu — tab baru dengan nama lomba tersebut akan muncul
  otomatis berisi data pendaftar beserta kelasnya.

## Catatan penting

- Karena keterbatasan CORS di Google Apps Script, pengiriman data
  memakai mode `no-cors`, jadi website tidak bisa membaca respons sukses
  langsung dari server — pesan "Pendaftaran Berhasil" muncul begitu
  request terkirim. **Tetap cek Spreadsheet sesekali** untuk memastikan
  data benar-benar masuk saat pertama kali setup.
- Kalau mau lebih yakin datanya masuk, buka langsung URL Web App di
  browser (harus muncul `{"status":"ok",...}`) sebagai tanda deployment
  aktif.
- Setiap kali kamu **mengedit ulang kode Apps Script**, kamu wajib
  **Deploy → Manage deployments → Edit (ikon pensil) → New version**
  supaya perubahan berlaku di URL yang sama.
- Kotak input nama anggota untuk lomba beranggotakan 5 orang sudah
  tersedia langsung di halaman (statis, bukan dibuat lewat JavaScript),
  jadi langsung tampak begitu halaman dibuka.
