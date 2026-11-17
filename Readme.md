# Marketplace Katering - Frontend

Frontend aplikasi **Marketplace Katering** yang dibangun menggunakan
Vue.js dan berkomunikasi dengan backend REST API Laravel melalui JSON.

Aplikasi ini menjadi antarmuka bagi dua jenis pengguna utama:

-   **Customer** --- mencari merchant katering, melihat kategori dan
    menu, membuat pesanan, serta mengakses invoice.
-   **Merchant** --- mengelola kategori dan menu katering, melihat
    pesanan yang masuk, memperbarui status pesanan, serta mengakses
    invoice.

> Repository ini khusus untuk frontend. Logika bisnis, autentikasi,
> validasi utama, kalkulasi harga, penyimpanan pesanan, dan pembuatan
> invoice tetap ditangani oleh backend `marketplace-katering-api`.

------------------------------------------------------------------------

## 1. Tujuan Project

Membangun frontend marketplace katering yang:

-   Memiliki pengalaman penggunaan yang sederhana dan responsif.
-   Menyediakan tampilan berbeda sesuai role customer dan merchant.
-   Menggunakan backend Laravel sebagai sumber data utama.
-   Mengelola autentikasi menggunakan access token dan refresh token
    dari backend.
-   Menampilkan katalog merchant, kategori, dan menu.
-   Mendukung proses checkout dan pemantauan pesanan.
-   Menyediakan akses invoice bagi customer dan merchant yang terkait
    dengan pesanan.

## 2. Rekomendasi Teknologi

Stack berikut menjadi baseline pengembangan frontend. Versi package akan
ditentukan dan dikunci saat proses instalasi.

  Teknologi           Kegunaan
  ------------------- ----------------------------------------------
  Vue 3               Framework antarmuka berbasis Composition API
  Vite                Development server dan build tool
  TypeScript          Type safety dan maintainability
  Vue Router          Routing halaman dan proteksi route
  Pinia               State management
  Axios               Komunikasi HTTP dengan backend
  Tailwind CSS        Styling dan responsive UI
  ESLint + Prettier   Konsistensi dan kualitas kode

Pemilihan library tambahan seperti UI component library, form
validation, atau date utility dapat ditentukan ketika kebutuhan UI mulai
diimplementasikan.

## 3. Modul dan Fitur

### 3.1. Authentication

-   Register customer.
-   Login customer dan merchant.
-   Logout.
-   Refresh access token.
-   Menyimpan status autentikasi pada state aplikasi.
-   Melindungi halaman berdasarkan autentikasi dan role.
-   Menangani token kedaluwarsa atau sesi yang tidak aktif.

### 3.2. Customer

-   Melihat daftar merchant/katering.
-   Mencari katering berdasarkan kata kunci atau lokasi.
-   Melihat kategori dan daftar menu.
-   Melihat detail menu.
-   Memilih menu dan jumlah pesanan.
-   Mengisi tanggal pengiriman dan alamat pengiriman.
-   Membuat pesanan.
-   Melihat daftar dan detail pesanan.
-   Membatalkan pesanan selama status masih `pending` sesuai aturan
    backend.
-   Melihat daftar dan detail invoice.

### 3.3. Merchant

-   Melihat ringkasan atau dashboard merchant.
-   Mengelola kategori milik merchant.
-   Menambah, mengubah, dan menghapus kategori.
-   Mengelola menu milik merchant.
-   Mengunggah foto menu.
-   Mengubah ketersediaan menu.
-   Melihat daftar pesanan yang masuk.
-   Melihat detail pesanan.
-   Memperbarui status pesanan sesuai alur backend.
-   Melihat daftar dan detail invoice.

### 3.4. Invoice

-   Menampilkan invoice yang dibuat otomatis oleh backend setelah
    pesanan berhasil dibuat.
-   Customer hanya dapat mengakses invoice dari pesanan miliknya.
-   Merchant hanya dapat mengakses invoice dari pesanan yang ditujukan
    kepadanya.
-   Menampilkan nomor invoice, tanggal invoice, item, subtotal, total,
    dan status invoice.
-   Fitur unduh atau cetak PDF dapat ditambahkan setelah endpoint PDF
    tersedia di backend.

## 4. Integrasi Backend API

Frontend menggunakan backend API dengan base URL yang dapat
dikonfigurasi melalui environment variable.

Contoh base URL lokal:

``` env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

Endpoint utama yang menjadi acuan integrasi:

  Modul        Method      Endpoint                Keterangan
  ------------ ----------- ----------------------- ----------------------------
  Auth         POST        `/auth/register`        Registrasi customer
  Auth         POST        `/auth/login`           Login
  Auth         POST        `/auth/refresh`         Refresh token
  Auth         POST        `/auth/logout`          Logout
  Categories   GET         `/categories`           Daftar kategori
  Categories   GET         `/categories/{id}`      Detail kategori
  Categories   GET         `/categories/my`        Kategori milik merchant
  Categories   POST        `/categories`           Membuat kategori
  Categories   PATCH       `/categories/{id}`      Mengubah kategori
  Categories   DELETE      `/categories/{id}`      Menghapus kategori
  Menus        GET         `/menus`                Daftar menu
  Menus        GET         `/menus/{id}`           Detail menu
  Menus        POST        `/menus`                Membuat menu
  Menus        PATCH/PUT   `/menus/{id}`           Mengubah menu
  Menus        DELETE      `/menus/{id}`           Menghapus menu
  Orders       GET         `/orders`               Daftar pesanan sesuai user
  Orders       GET         `/orders/{id}`          Detail pesanan
  Orders       POST        `/orders`               Membuat pesanan
  Orders       PATCH       `/orders/{id}/cancel`   Membatalkan pesanan
  Orders       PATCH       `/orders/{id}/status`   Memperbarui status pesanan
  Invoices     GET         `/invoices`             Daftar invoice sesuai user
  Invoices     GET         `/invoices/{id}`        Detail invoice

**Catatan integrasi:**

-   Semua endpoint di atas menggunakan prefix `/api/v1`.
-   Endpoint yang membutuhkan autentikasi harus mengirim
    `Authorization: Bearer <access_token>`.
-   Gunakan `Accept: application/json`.
-   Untuk upload foto menu, gunakan `multipart/form-data` dan biarkan
    browser/Axios menetapkan boundary `Content-Type`.
-   Bentuk response dan nama field harus mengikuti implementasi aktual
    backend. Dokumentasi ini menjadi daftar endpoint awal, bukan
    pengganti kontrak API final.
-   Endpoint pencarian merchant berdasarkan lokasi masih perlu
    diselaraskan dengan implementasi backend sebelum halaman pencarian
    dibuat.

## 5. Gambaran Struktur Folder

Struktur berikut merupakan rancangan awal agar kode mudah dikembangkan
per modul.

``` text
marketplace-katering-frontend/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   └── ui/
│   ├── composables/
│   ├── layouts/
│   │   ├── AuthLayout.vue
│   │   ├── CustomerLayout.vue
│   │   └── MerchantLayout.vue
│   ├── modules/
│   │   ├── auth/
│   │   ├── customer/
│   │   ├── merchant/
│   │   ├── categories/
│   │   ├── menus/
│   │   ├── orders/
│   │   └── invoices/
│   ├── router/
│   ├── services/
│   │   ├── api.ts
│   │   └── modules/
│   ├── stores/
│   ├── types/
│   ├── utils/
│   ├── App.vue
│   └── main.ts
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

Struktur dapat disesuaikan selama implementasi. Komponen yang dapat
digunakan ulang ditempatkan di `components`, sedangkan halaman dan
logika spesifik fitur dikelompokkan dalam `modules`.

## 6. Authentication dan Session

Backend menggunakan JWT dengan access token dan refresh token. Frontend
bertanggung jawab mengirim token dan menangani respons autentikasi,
sedangkan validasi sesi tetap dilakukan oleh backend.

Rancangan perilaku frontend:

1.  Customer atau merchant login melalui API.
2.  Frontend menerima token dari respons backend.
3.  Access token dikirim pada request yang membutuhkan autentikasi.
4.  Ketika access token kedaluwarsa, frontend mencoba refresh sesuai
    kontrak endpoint backend.
5.  Jika refresh gagal atau sesi tidak aktif, frontend mengakhiri sesi
    lokal dan mengarahkan pengguna ke halaman login.
6.  Logout memanggil endpoint backend dan membersihkan state
    autentikasi.

**Keamanan token:** strategi penyimpanan token harus diputuskan sebelum
implementasi. Hindari menyimpan refresh token di `localStorage` jika
tersedia pendekatan cookie `HttpOnly` yang didukung backend. Jangan
pernah memasukkan secret atau kredensial server ke dalam frontend.

## 7. Role dan Hak Akses

  Fitur                               Customer         Merchant
  ---------------------------- ---------------------- ----------
  Melihat katalog menu                   Ya               Ya
  Membuat pesanan                        Ya             Tidak
  Melihat pesanan sendiri                Ya               Ya
  Membatalkan pesanan           Sesuai aturan status    Tidak
  Mengelola kategori                   Tidak              Ya
  Mengelola menu                       Tidak              Ya
  Memperbarui status pesanan           Tidak              Ya
  Melihat invoice terkait                Ya               Ya

Frontend menggunakan role untuk mengatur navigasi dan tampilan.
**Otorisasi yang sebenarnya tetap wajib dilakukan backend melalui
middleware dan policy.** Menyembunyikan tombol atau halaman di frontend
bukan pengamanan akses API.

## 8. Environment Configuration

Buat file `.env` berdasarkan `.env.example`.

Contoh:

``` env
VITE_APP_NAME="Marketplace Katering"
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

Jangan menyimpan password database, JWT secret, Redis credentials, atau
konfigurasi privat backend pada environment frontend yang menggunakan
prefix `VITE_`, karena nilainya dapat terekspos ke browser.

## 9. Instalasi dan Development

Instruksi berikut merupakan alur umum untuk project Vue 3 + Vite.
Perintah final akan disesuaikan dengan package manager dan konfigurasi
yang dipilih saat inisialisasi project.

``` bash
# Clone repository
git clone <frontend-repository-url>

# Masuk ke folder project
cd marketplace-katering-frontend

# Install dependencies
npm install

# Siapkan environment
cp .env.example .env

# Jalankan development server
npm run dev
```

Build untuk production:

``` bash
npm run build
```

Preview hasil build:

``` bash
npm run preview
```

## 10. Konvensi Pengembangan

-   Gunakan Vue 3 Composition API dengan `<script setup>`.
-   Gunakan TypeScript untuk tipe data API, props, dan state.
-   Pisahkan pemanggilan API dari komponen tampilan.
-   Gunakan Pinia untuk state global seperti autentikasi dan keranjang
    jika diperlukan.
-   Gunakan Vue Router untuk navigasi dan route guard.
-   Buat komponen reusable untuk elemen UI yang digunakan berulang.
-   Terapkan validasi input di frontend untuk pengalaman pengguna,
    tetapi tetap ikuti validasi backend.
-   Tangani loading, empty state, validation error, unauthorized,
    forbidden, dan server error.
-   Gunakan pagination sesuai metadata yang dikirim backend.
-   Jangan menghitung ulang harga final pesanan di frontend sebagai
    sumber kebenaran. Backend tetap menentukan harga dan total
    transaksi.

## 11. Rencana Tahapan Pengembangan

  -----------------------------------------------------------------------
  Tahap                               Fokus
  ----------------------------------- -----------------------------------
  1                                   Inisialisasi Vue, Vite, TypeScript,
                                      styling, dan struktur project

  2                                   Konfigurasi API client,
                                      autentikasi, Pinia, dan route guard

  3                                   Layout, navigasi, dan halaman
                                      dashboard berdasarkan role

  4                                   Katalog merchant, kategori, dan
                                      menu

  5                                   Keranjang dan checkout customer

  6                                   Pengelolaan pesanan customer dan
                                      merchant

  7                                   Invoice customer dan merchant

  8                                   Validasi alur end-to-end,
                                      responsive UI, dan production build
  -----------------------------------------------------------------------

## 12. Backend Repository

Frontend ini terhubung dengan repository backend:

**`marketplace-katering-api`**

Pastikan backend berjalan dan `VITE_API_BASE_URL` mengarah ke alamat API
yang benar sebelum menguji integrasi.

------------------------------------------------------------------------

## License

Tentukan lisensi repository sebelum project dipublikasikan atau
digunakan oleh pihak lain.
